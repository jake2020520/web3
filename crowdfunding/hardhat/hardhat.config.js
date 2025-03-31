require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
// npx hardhat help 就能看到可以执行的任务
require("./tasks");
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // defaultNetwork: "hardhat", //默认的网络
  solidity: "0.8.24",
  networks: {
    sepolia: {
      // https://sepolia.infura.io/v3/ 这个网址可以注册一个免费的账号，获取一个免费的API密钥
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY, PRIVATE_KEY_1], // 另外一个 // "",
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: {
      // https://etherscan.io/apidashboard
      sepolia: ETHERSCAN_API_KEY,
    },
  },
};
