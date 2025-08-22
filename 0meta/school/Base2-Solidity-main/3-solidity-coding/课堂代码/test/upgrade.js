const { ethers, deployments, upgrades } = require("hardhat");
const { expect } = require("chai");

describe("Test upgrade", async function () {
  it("Should be able to deploy", async function () {
    const [signer, buyer] = await ethers.getSigners()

    // 1. 部署业务合约
    await deployments.fixture(["depolyNftAuction"]);

    const nftAuctionProxy = await deployments.get("NftAuctionProxy");
    console.log(nftAuctionProxy)


    // 1. 部署 ERC721 合约
    const TestERC721 = await ethers.getContractFactory("TestERC721");
    const testERC721 = await TestERC721.deploy();
    await testERC721.waitForDeployment();
    const testERC721Address = await testERC721.getAddress();
    console.log("testERC721Address::", testERC721Address);

    // mint 10个 NFT
    for (let i = 0; i < 10; i++) {
        await testERC721.mint(signer.address, i + 1);
    }

    const tokenId = 1;    

    // 给代理合约授权
    await testERC721.connect(signer).setApprovalForAll(nftAuctionProxy.address, true);

    // 2. 调用 createAuction 方法创建拍卖
    const nftAuction = await ethers.getContractAt(
      "NftAuction",
      nftAuctionProxy.address
    );

    await nftAuction.createAuction(
      100 * 1000,
      ethers.parseEther("0.01"),
      testERC721Address,
      1
    );

    const auction = await nftAuction.auctions(0);
    console.log("创建拍卖成功：：", auction);

    const implAddress1 = await upgrades.erc1967.getImplementationAddress(
      nftAuctionProxy.address
    );
    // 3. 升级合约
    await deployments.fixture(["upgradeNftAuction"]);

    const implAddress2 = await upgrades.erc1967.getImplementationAddress(
      nftAuctionProxy.address
    );
    // 4. 读取合约的 auction[0]
    const auction2 = await nftAuction.auctions(0);
    console.log("升级后读取拍卖成功：：", auction2);

    console.log("implAddress1::", implAddress1, "\nimplAddress2::", implAddress2);
    
    const nftAuctionV2 = await ethers.getContractAt(
        "NftAuctionV2",
        nftAuctionProxy.address
      );
    const hello = await nftAuctionV2.testHello()
    console.log("hello::", hello);
    
    // console.log("创建拍卖成功：：", await nftAuction.auctions(0));
    expect(auction2.startTime).to.equal(auction.startTime);
    // expect(implAddress1).to.not(implAddress2);
  });
});
