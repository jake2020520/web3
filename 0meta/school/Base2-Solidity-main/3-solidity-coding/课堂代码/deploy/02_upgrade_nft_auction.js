const { ethers, upgrades } = require("hardhat")
const fs = require("fs")
const path = require("path")

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { save } = deployments
  const { deployer } = await getNamedAccounts()
  console.log("部署用户地址：", deployer)

  // 读取 .cache/proxyNftAuction.json文件
  const storePath = path.resolve(__dirname, "./.cache/proxyNftAuction.json");
  const storeData = fs.readFileSync(storePath, "utf-8");
  const { proxyAddress, implAddress, abi } = JSON.parse(storeData);

  // 升级版的业务合约
  const NftAuctionV2 = await ethers.getContractFactory("NftAuctionV2")

  // 升级代理合约
  const nftAuctionProxyV2 = await upgrades.upgradeProxy(proxyAddress, NftAuctionV2, { call: "admin" })
  await nftAuctionProxyV2.waitForDeployment()
  const proxyAddressV2 = await nftAuctionProxyV2.getAddress()

//   // 保存代理合约地址
//   fs.writeFileSync(
//     storePath,
//     JSON.stringify({
//       proxyAddress: proxyAddressV2,
//       implAddress,
//       abi,
//     })
//   );

  await save("NftAuctionProxyV2", {
    abi,
    address: proxyAddressV2,
  })
}


module.exports.tags = ["upgradeNftAuction"]