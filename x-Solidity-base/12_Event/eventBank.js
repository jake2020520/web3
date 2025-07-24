const { ethers } = require("ethers");

// ✅ 替换为你的 provider，例如 Infura、Alchemy、或本地节点
const provider = new ethers.providers.JsonRpcProvider("https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID");

// ✅ 替换为部署好的合约地址
const contractAddress = "0xYourContractAddress";

// ✅ 替换为合约 ABI 中的 events 部分
const abi = [
  "event Deposit(address indexed sender, uint256 amount)"
];

// 创建合约实例
const contract = new ethers.Contract(contractAddress, abi, provider);

// 监听事件
contract.on("Deposit", (sender, amount, event) => {
  console.log("📥 Deposit Event Detected:");
  console.log("Sender:", sender);
  console.log("Amount (wei):", amount.toString());
  console.log("Tx Hash:", event.transactionHash);
});
