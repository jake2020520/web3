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
     // url: https://eth-sepolia.g.alchemy.com/v2/UZRalCB9dp11aUo5xHwbu5_l4T_JMV8e 
      url: SEPOLIA_RPC_URL,// 第三方服务商 alchemy 或者 infura,注册，获取这个 alchemy里面配置apps 配置一个
      // url: "https://eth-sepolia.g.alchemy.com/v2/UZRalCB9dp11aUo5xHwbu5_l4T_JMV8e",// 第三方服务商 alchemy 或者 infura,注册，获取这个 alchemy里面配置apps 配置一个
      accounts: [PRIVATE_KEY, PRIVATE_KEY_1], // 另外一个 // "",
         // 0xeD37A1D475C7A5F02bbF1d68655e045C2cF49ccB
      // 0x8AFaD2a6C94D6D928322EC3A0309236D384b4ed5
      // accounts: ["2c2918b3265a0e45ddf78bdb7f738e2e8b24837d46b2f2502afbb951e163651a","98ee01c499c01d8453fed7d3496075d088b49496999990263013478388afbe36"], 
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: {
      // https://etherscan.io/apidashboard
      // sepolia: "8WXQAM6IZSQB5S6657IQTSI8X4Y1BQSTWP"
      sepolia: ETHERSCAN_API_KEY,
    },
  },
};
