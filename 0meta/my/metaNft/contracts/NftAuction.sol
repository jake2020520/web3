/*
 * @Author: xudesong jake2020520@gmail.com
 * @Date: 2025-08-23 04:48:40
 * @LastEditors: xudesong jake2020520@gmail.com
 * @LastEditTime: 2025-08-24 22:09:37
 * @FilePath: /web3/0meta/my/metaNft/contracts/NftAuction.sol
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";

import "hardhat/console.sol";

contract NftAuction is Initializable, UUPSUpgradeable, ERC721HolderUpgradeable {
    // 结构体
    struct Auction {
        // 卖家
        address seller;
        // 拍卖持续时间
        uint256 duration;
        // 起始价格
        uint256 startPrice;
        // 开始时间
        uint256 startTime;
        // 是否结束
        bool ended;
        // 最高出价者
        address highestBidder;
        // 最高价格
        uint256 highestBid;
        // NFT合约地址
        address nftContract;
        // NFT ID
        uint256 tokenId;
        // 参与竞价的资产类型 0x 地址表示eth，其他地址表示erc20
        // 0x0000000000000000000000000000000000000000 表示eth
        address tokenAddress;
    }

    // 状态变量
    mapping(uint256 => Auction) public auctions;
    // 下一个拍卖ID
    uint256 public nextAuctionId;
    // 管理员地址
    address public admin;

    function initialize() public initializer {
        __ERC721Holder_init();
        admin = msg.sender;
    }

    // 创建拍卖
    function createAuction(
        uint256 _duration,
        uint256 _startPrice,
        address _nftAddress,
        uint256 _tokenId
    ) public {
        // 只有管理员可以创建拍卖
        require(msg.sender == admin, "Only admin can create auctions");
        // 检查参数
        require(_duration >= 10, "Duration must be greater than 10s");
        require(_startPrice > 0, "Start price must be greater than 0");

        // 转移NFT到合约
        // IERC721(_nftAddress).approve(address(this), _tokenId);
        IERC721(_nftAddress).safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId
        );

        auctions[nextAuctionId] = Auction({
            seller: msg.sender,
            duration: _duration,
            startPrice: _startPrice,
            ended: false,
            highestBidder: address(0),
            highestBid: 0,
            startTime: block.timestamp,
            nftContract: _nftAddress,
            tokenId: _tokenId,
            tokenAddress: address(0)
        });

        nextAuctionId++;
    }

    // 买家参与买单
    // TODO: ERC20 也能参加
    function placeBid(
        uint256 _auctionID // uint256 amount, // address _tokenAddress
    ) external payable {
        // 统一的价值尺度

        // ETH 是 ？ 美金
        // 1个 USDC 是 ？ 美金

        Auction storage auction = auctions[_auctionID];
        // 判断当前拍卖是否结束
        require(
            !auction.ended &&
                auction.startTime + auction.duration > block.timestamp,
            "Auction has ended"
        );
        // 判断出价是否大于当前最高出价
        require(
            msg.value > auction.highestBid && msg.value >= auction.startPrice,
            "Bid must be higher than the current highest bid"
        );

        // 退还前最高价
        if (auction.highestBidder == address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }

        // auction.tokenAddress = _tokenAddress;
        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;
    }

    // 结束拍卖
    function endAuction(uint256 _auctionID) external {
        Auction storage auction = auctions[_auctionID];

        console.log(
            "endAuction",
            auction.startTime,
            auction.duration,
            block.timestamp
        );
        // 判断当前拍卖是否结束
        require(
            !auction.ended &&
                (auction.startTime + auction.duration) <= block.timestamp,
            "Auction has not ended"
        );
        // 转移NFT到最高出价者
        IERC721(auction.nftContract).safeTransferFrom(
            address(this),
            auction.highestBidder,
            auction.tokenId
        );
        // 转移剩余的资金到卖家
        // payable(address(this)).transfer(address(this).balance);
        auction.ended = true;
    }

    function _authorizeUpgrade(address) internal view override {
        // 只有管理员可以升级合约
        require(msg.sender == admin, "Only admin can upgrade");
    }

    fallback() external payable {}

    receive() external payable {}
}
