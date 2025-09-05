//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    uint256 listingPrice = 0.025 ether;
    address payable owner;

    mapping(uint256 => MarketItem) private idToMarketItem;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    event MarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    constructor() ERC721("Metaverse Tokens", "METT") {
        owner = payable(msg.sender);
    }

    /**
     * @dev 更新NFT上架费用（仅合约所有者可调用）
     * @param _listingPrice 新的上架费用（以wei为单位）
     * @notice 调用者必须支付与当前上架费用相等的ETH
     */
    function updateListingPrice(uint _listingPrice) public payable {
        require(
            owner == msg.sender,
            "Only marketplace owner can update listing price."
        );
        listingPrice = _listingPrice;
    }

    /**
     * @dev 获取当前NFT上架费用
     * @return 当前上架费用（wei单位）
     */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    /**
     * @dev 铸造新NFT并上架到市场
     * @param tokenURI NFT元数据链接
     * @param price 上架价格（wei单位）
     * @return 新铸造的NFT tokenID
     * @notice 调用者需支付等于当前上架费用的ETH
     */
    function createToken(
        string memory tokenURI,
        uint256 price
    ) public payable returns (uint) {
        //
        // 使用Counters库安全地递增token计数器
        // 这会原子性地增加计数并返回新值，确保每个token ID的唯一性
        _tokenIds.increment();

        // 获取最新生成的token ID
        // current()方法返回递增后的当前值，作为新NFT的唯一标识符
        uint256 newTokenId = _tokenIds.current();

        // 铸造NFT给调用者
        _mint(msg.sender, newTokenId);
        // 设置NFT元数据
        _setTokenURI(newTokenId, tokenURI);
        // 将NFT上架到市场
        createMarketItem(newTokenId, price);
        return newTokenId;
    }

    /**
     * @dev 创建市场物品（内部私有函数）
     * @param tokenId NFT的唯一标识符
     * @param price 上架价格（wei单位）
     * @notice 需要满足：
     * - 价格必须大于0
     * - 调用者支付的ETH必须等于当前上架费用
     */
    function createMarketItem(uint256 tokenId, uint256 price) private {
        // 验证上架价格有效性
        require(price > 0, "Price must be at least 1 wei");

        // 验证支付金额匹配当前上架费用
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        // 在映射中创建新的市场物品记录
        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender), // NFT原始所有者
            payable(address(this)), // 当前托管合约地址
            price, // 上架价格
            false // 初始未售出状态
        );

        // 将NFT从所有者转移到市场合约进行托管
        _transfer(msg.sender, address(this), tokenId);

        // 触发市场物品创建事件
        emit MarketItemCreated(
            tokenId,
            msg.sender, // 卖家地址
            address(this), // 市场合约地址
            price, // 上架价格
            false // 初始未售出状态
        );
    }

    /* allows someone to resell a token they have purchased */
    /**
     * @dev 允许NFT当前所有者重新上架token
     * @param tokenId 要重新上架的NFT ID
     * @param price 新的上架价格（wei单位）
     * @notice 需要满足：
     * - 调用者必须是当前NFT所有者
     * - 支付金额必须等于当前上架费用
     */
    function resellToken(uint256 tokenId, uint256 price) public payable {
        // 验证调用者所有权
        require(
            idToMarketItem[tokenId].owner == msg.sender,
            "Only item owner can perform this operation"
        );

        // 验证上架费用支付
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        // 重置市场状态
        idToMarketItem[tokenId].sold = false; // 标记为未售出
        idToMarketItem[tokenId].price = price; // 更新价格
        idToMarketItem[tokenId].seller = payable(msg.sender); // 设置新卖家
        idToMarketItem[tokenId].owner = payable(address(this)); // NFT转回市场托管

        _itemsSold.decrement(); // 减少已售计数

        // 将NFT从所有者转回市场合约
        _transfer(msg.sender, address(this), tokenId);
    }

    /**
     * @dev 执行NFT购买交易
     * @param tokenId 要购买的NFT ID
     * @notice 需要满足：
     * - 支付金额必须等于标价
     * - 执行后会将：
     *   - listingPrice转给合约所有者作为手续费
     *   - 剩余金额转给原卖家
     */
    function createMarketSale(uint256 tokenId) public payable {
        uint price = idToMarketItem[tokenId].price;
        // 验证支付金额
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );
        // 保存原始卖家地址用于转账
        address payable originalSeller = idToMarketItem[tokenId].seller;
        // 更新所有权信息
        idToMarketItem[tokenId].owner = payable(msg.sender); // 新所有者
        idToMarketItem[tokenId].sold = true; // 标记为已售
        idToMarketItem[tokenId].seller = payable(address(0)); // 清空卖家地址
        _itemsSold.increment(); // 增加已售计数
        // 执行NFT转移
        _transfer(address(this), msg.sender, tokenId);

        // 资金分配
        payable(owner).transfer(listingPrice); // 平台手续费
        // 向原始卖家转账（使用保存的地址）
        originalSeller.transfer(msg.value); // 卖家收益
    }

    /**
     * @dev 获取所有未售出的市场物品
     * @return MarketItem数组，包含所有当前在售的NFT
     * @notice 只返回owner为合约地址的物品（即未售出状态）
     */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        // 获取总token数量
        uint itemCount = _tokenIds.current();

        // 计算未售出物品数量（总数量 - 已售数量）
        uint unsoldItemCount = _tokenIds.current() - _itemsSold.current();

        // 当前填充数组的索引
        uint currentIndex = 0;

        // 创建指定大小的数组
        MarketItem[] memory items = new MarketItem[](unsoldItemCount);

        // 遍历所有可能的token ID
        for (uint i = 0; i < itemCount; i++) {
            // 检查该ID对应的物品是否由合约托管（未售出状态）
            if (idToMarketItem[i + 1].owner == address(this)) {
                uint currentId = i + 1;
                // 获取存储引用以提高效率
                MarketItem storage currentItem = idToMarketItem[currentId];
                // 将符合条件的物品添加到结果数组
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /**
     * @dev 获取调用者拥有的所有NFT
     * @return MarketItem数组，包含调用者拥有的NFT
     * @notice 匹配owner字段为调用者地址的物品
     */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        // 获取总物品数量
        uint totalItemCount = _tokenIds.current();

        // 统计调用者拥有的物品数量
        uint itemCount = 0;
        uint currentIndex = 0;

        // 第一次遍历：计算调用者拥有的物品总数
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        // 创建指定大小的数组
        MarketItem[] memory items = new MarketItem[](itemCount);

        // 第二次遍历：填充调用者拥有的物品
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint currentId = i + 1;
                // 获取存储引用以提高效率
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /**
     * @dev 获取调用者发布的所有物品
     * @return MarketItem数组，包含调用者发布的NFT
     * @notice 匹配seller字段为调用者地址的物品
     */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
        // 获取总物品数量
        uint totalItemCount = _tokenIds.current();

        // 统计调用者发布的物品数量
        uint itemCount = 0;
        uint currentIndex = 0;

        // 第一次遍历：计算调用者发布的物品总数
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        // 创建指定大小的数组
        MarketItem[] memory items = new MarketItem[](itemCount);

        // 第二次遍历：填充调用者发布的物品
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint currentId = i + 1;
                // 获取存储引用以提高效率
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
