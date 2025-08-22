# 在 Sepolia 测试网上发布图文并茂的 NFT

## 1. 准备工作

### 1.1 安装 MetaMask
- 安装 [MetaMask](https://metamask.io/) 浏览器扩展。
- 创建或导入一个钱包。

### 1.2 获取 Sepolia 测试网 ETH
- 打开 MetaMask，切换到 Sepolia 测试网。
- 从 [Sepolia Faucet](https://sepoliafaucet.com/) 获取测试网 ETH。

### 1.3 准备图片和元数据
- 准备一张图片（例如 `my-nft-image.png`）。
- 准备一个 JSON 文件作为元数据（例如 `my-nft-metadata.json`）。

```json
{
  "name": "My NFT",
  "description": "This is a sample NFT with an image.",
  "image": "https://example.com/path/to/my-nft-image.png"
}
```

### 1.4 上传图片和元数据
- 使用 [IPFS](https://ipfs.tech/) 或其他服务上传图片和元数据文件，并获取它们的 URL。

---

## 2. 编写 NFT 合约

### 2.1 打开 Remix IDE
- 访问 [Remix IDE](https://remix.ethereum.org/)。

### 2.2 创建新文件
- 在 Remix IDE 的 `File Explorers` 中，点击 `Create New File`，命名为 `MyNFT.sol`。

### 2.3 编写合约代码
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("MyNFT", "MNFT") {}

    function mintNFT(address recipient, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
```

### 2.4 编译合约
- 在 `Solidity Compiler` 选项卡中，选择 `0.8.0` 或更高版本的编译器。
- 点击 `Compile MyNFT.sol`。

---

## 3. 部署合约到 Sepolia 测试网

### 3.1 配置 MetaMask
- 确保 MetaMask 已连接到 Sepolia 测试网。
- 确保账户中有足够的 Sepolia ETH。

### 3.2 部署合约
- 在 `Deploy & Run Transactions` 选项卡中，选择 `Injected Provider - MetaMask` 作为环境。
- 在 `Contract` 下拉菜单中选择 `MyNFT`。
- 点击 `Deploy`，MetaMask 会弹出确认交易窗口，点击 `Confirm`。

### 3.3 获取合约地址
- 部署成功后，在 `Deployed Contracts` 部分可以看到合约地址。

---

## 4. 铸造 NFT

### 4.1 获取元数据 URL
- 确保你已经上传了元数据文件，并获取了它的 URL（例如 `https://ipfs.io/ipfs/Qm.../my-nft-metadata.json`）。

### 4.2 铸造 NFT
- 在 Remix IDE 的 `Deployed Contracts` 部分，展开 `MyNFT` 合约。
- 在 `mintNFT` 函数中，输入接收地址和元数据 URL。
- 点击 `transact`，MetaMask 会弹出确认交易窗口，点击 `Confirm`。

---

## 5. 查看 NFT

### 5.1 添加 NFT 到 MetaMask
- 打开 MetaMask，点击 `Add NFT`。
- 输入合约地址和 Token ID（例如 `1`）。
- 点击 `Add`。

### 5.2 查看 NFT
- 在 MetaMask 中，切换到 Sepolia 测试网。
- 你应该能看到 `MyNFT` 的图片和元数据。

---

## 6. 总结

- 使用 Remix IDE 和 MetaMask 可以方便地在 Sepolia 测试网上发布和交互 NFT。
- 通过 IPFS 上传图片和元数据文件，并在合约中引用它们的 URL。
- 使用 MetaMask 可以查看和管理 NFT。

