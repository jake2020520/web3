exports.deployConract = require("./deploy-crow"); // 部署合约 npx hardhat deploy-crow --network sepolia
exports.interactContract = require("./interact-crow"); // 交互合约 npx hardhat interact-crow --network sepolia --addr 0x7a1d4c2f3b5e8c6f9e4d5b5e5f5f5f5f5f5f5f5f(上一个task部署成功的合约地址)
