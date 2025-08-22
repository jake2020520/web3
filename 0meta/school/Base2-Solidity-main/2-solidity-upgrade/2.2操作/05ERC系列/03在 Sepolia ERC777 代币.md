# 在 Sepolia 测试网上部署 ERC777 代币

## 1. 准备工作

### 1.1 安装 MetaMask
- 安装 [MetaMask](https://metamask.io/) 浏览器扩展。
- 创建或导入一个钱包。

### 1.2 获取 Sepolia 测试网 ETH
- 打开 MetaMask，切换到 Sepolia 测试网。
- 从 [Sepolia Faucet](https://sepoliafaucet.com/) 获取测试网 ETH。

### 1.3 打开 Remix IDE
- 访问 [Remix IDE](https://remix.ethereum.org/)。

---

## 2. 编写 ERC777 代币合约

### 2.1 创建新文件
- 在 Remix IDE 的 `File Explorers` 中，点击 `Create New File`，命名为 `MyERC777.sol`。

### 2.2 编写合约代码
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

contract MyERC777 is ERC777 {
    constructor(
        uint256 initialSupply,
        address[] memory defaultOperators
    ) ERC777("MyERC777", "M777", defaultOperators) {
        _mint(msg.sender, initialSupply, "", "");
    }
}
```

### 2.3 编译合约
- 在 `Solidity Compiler` 选项卡中，选择 `0.8.0` 或更高版本的编译器。
- 点击 `Compile MyERC777.sol`。

---

## 3. 部署合约到 Sepolia 测试网

### 3.1 配置 MetaMask
- 确保 MetaMask 已连接到 Sepolia 测试网。
- 确保账户中有足够的 Sepolia ETH。

### 3.2 部署合约
- 在 `Deploy & Run Transactions` 选项卡中，选择 `Injected Provider - MetaMask` 作为环境。
- 在 `Contract` 下拉菜单中选择 `MyERC777`。
- 在 `Deploy` 按钮旁边的输入框中，输入初始供应量（例如 `1000000`）和默认操作员地址数组（例如 `[]`）。
- 点击 `Deploy`，MetaMask 会弹出确认交易窗口，点击 `Confirm`。

### 3.3 获取合约地址
- 部署成功后，在 `Deployed Contracts` 部分可以看到合约地址。

---

## 4. 与 ERC777 代币交互

### 4.1 添加代币到 MetaMask
- 打开 MetaMask，点击 `Add Token`。
- 选择 `Custom Token`，输入合约地址。
- 点击 `Next`，然后 `Add Tokens`。

### 4.2 查看代币余额
- 在 MetaMask 中，切换到 Sepolia 测试网。
- 你应该能看到 `MyERC777 (M777)` 的余额。

### 4.3 转账代币
- 在 Remix IDE 的 `Deployed Contracts` 部分，展开 `MyERC777` 合约。
- 在 `send` 函数中，输入接收地址、转账金额、数据（例如 `""`）和操作员数据（例如 `""`）。
- 点击 `transact`，MetaMask 会弹出确认交易窗口，点击 `Confirm`。

---

## 5. 总结

- 使用 Remix IDE 和 MetaMask 可以方便地在 Sepolia 测试网上部署和交互 ERC777 代币。
- 通过 MetaMask 可以管理代币余额和进行转账操作。

