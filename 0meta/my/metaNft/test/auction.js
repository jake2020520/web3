const { ethers, deployments } = require("hardhat");
const { expect } = require("chai");

describe("Test auction", async function () {
  it("Should be ok", async function () {
    await main();
  });
});

async function main() {
  const [signer, buyer] = await ethers.getSigners();
  await deployments.fixture(["deployNftAuction"]);

  const nftAuctionProxy = await deployments.get("NftAuctionProxy");
  const nftAuction = await ethers.getContractAt(
    "NftAuction",
    nftAuctionProxy.address
  );

  // 1. 部署 ERC721 合约
  const TestERC721 = await ethers.getContractFactory("TestERC721");
  const testERC721 = await TestERC721.deploy();
  await testERC721.waitForDeployment();
  const testERC721Address = await testERC721.getAddress();
  console.log("testERC721Address::", testERC721Address);

  // mint 10个 NFT
  for (let i = 0; i < 10; i++) {
    await testERC721.mint(signer.address, i + 1); // 每个用户mint 10个 NFT
  }

  // 授权拍卖合约
  await testERC721
    .connect(signer)
    .setApprovalForAll(nftAuctionProxy.address, true);
  //

  const tokenId = 1;

  // 创建拍卖
  await nftAuction.createAuction(
    10,
    ethers.parseEther("0.01"),
    testERC721Address,
    tokenId
  );

  const auction = await nftAuction.auctions(0);

  console.log("创建拍卖成功：：", auction);

  //

  // 3. 购买者参与拍卖
  // await testERC721.connect(buyer).approve(nftAuctionProxy.address, tokenId);
  // ETH参与竞价
  await nftAuction
    .connect(buyer)
    .placeBid(0, { value: ethers.parseEther("0.01") });
  /// 等待5秒
  await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
  // 结束拍卖
  await nftAuction.connect(signer).endAuction(0);
  // 读取拍卖结果
  const auctionResult = await nftAuction.auctions(0);
  console.log("ETH参与竞价后读取拍卖成功：：", auctionResult);

  expect(auctionResult.highestBidder).to.equal(buyer.address);
  expect(auctionResult.highestBid).to.equal(ethers.parseEther("0.01"));

  // 验证 NFT 所有权
  const owner = await testERC721.ownerOf(tokenId);
  console.log("owner::", owner);
  expect(owner).to.equal(buyer.address);
}

main();
