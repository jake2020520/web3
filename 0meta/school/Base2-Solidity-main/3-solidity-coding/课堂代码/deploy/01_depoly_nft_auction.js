const { deployments, upgrades, ethers } = require("hardhat");

const fs = require("fs");
const path = require("path");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { save } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("部署用户地址：", deployer);
  const NftAuction = await ethers.getContractFactory("NftAuction");

  // 通过代理合约部署
  const nftAuctionProxy = await upgrades.deployProxy(NftAuction, [], {
    initializer: "initialize",
  })
  
  await nftAuctionProxy.waitForDeployment();

  const proxyAddress = await nftAuctionProxy.getAddress()
  console.log("代理合约地址：", proxyAddress);
  const implAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress)
  console.log("实现合约地址：", implAddress);
  
  const storePath = path.resolve(__dirname, "./.cache/proxyNftAuction.json");

  
  fs.writeFileSync(
    storePath,
    JSON.stringify({
      proxyAddress,
      implAddress,
      abi: NftAuction.interface.format("json"),
    })
  );

  await save("NftAuctionProxy", {
    abi: NftAuction.interface.format("json"),
    address: proxyAddress,
    // args: [],
    // log: true,
  })
//   await deploy("MyContract", {
//     from: deployer,
//     args: ["Hello"],
//     log: true,
//   });
};


module.exports.tags = ["depolyNftAuction"];
