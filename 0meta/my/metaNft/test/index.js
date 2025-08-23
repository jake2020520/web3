/*
 * @Author: xudesong jake2020520@gmail.com
 * @Date: 2025-08-23 04:59:21
 * @LastEditors: xudesong jake2020520@gmail.com
 * @LastEditTime: 2025-08-23 05:52:44
 * @FilePath: /my/metaNft/test/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { ethers, deployments } = require("hardhat");
const { expect } = require("chai");

describe("Test auction", async function () {
  it("Should be ok", async function () {
    await main();
  });
});

async function main() {
  // 1. 部署 NftAuction 合约
  // const [signer, buyer] = await ethers.getSigners();
  // await deployments.fixture(["deployNftAuction"]);
  // const nftAuctionProxy = await deployments.get("NftAuctionProxy");
  // const nftAuction = await ethers.getContractAt(
  //   "NftAuction",
  //   nftAuctionProxy.address
  // );
  // await nftAuction.createAuction(
  //   10,
  //   ethers.parseEther("0.01"),
  //   ethers.ZeroAddress,
  //   0
  // );
  // const auction = await nftAuction.auctions(0);
  // console.log("创建拍卖成功：：", auction);
  // const implAddress1 = await upgrades.erc1967.getImplementationAddress(
  //   nftAuctionProxy.address
  // );
  // console.log("implAddress1::", implAddress1);
  // // 升级代理合约
  // const implAddress2 = deployments.fixturree(["upgradeNftAuction"]);
  // console.log("implAddress2::", implAddress2);
  // const nftAuctionV2 = await ethers.getContractAt(
  //   "NftAuctionV2",
  //   nftAuctionProxy.address
  // );
  // const hello = await nftAuctionV2.testHello();
  // console.log("hello::", hello);
}

main();
