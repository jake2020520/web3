const { ethers, deployments } = require("hardhat");
const { expect } = require("chai");

describe("Test auction", async function () {
  it("Should be ok", async function () {
    await main();
  });
});

async function main() {
  const [signer, buyer] = await ethers.getSigners();
  console.log("signer, buyer:", signer.address, buyer.address);

  await deployments.fixture(["deployErc20"]);

  const ERC20Con = await deployments.get("ERC20");
  const erc20Index = await ethers.getContractAt("ERC20", ERC20Con.address);
  console.log("erc20 address: ", erc20Index.target);
  const erc20 = await ethers.getContractAt("ERC20", erc20Index.target);

  await erc20.mint(10000);
  const balance = await erc20.balanceOf(signer.address);
  console.log("erc20 balanceOf: ", balance);
  const name = await erc20Index.name();
  expect(name).to.equal("WTF Token");
  const symbol = await erc20Index.symbol();
  expect(symbol).to.equal("WTF");
  const totalSupply = await erc20Index.totalSupply();
  console.log("erc20 balanceOf: ", totalSupply);
  await erc20.transfer(buyer.address, 11);
  expect(await erc20.balanceOf(buyer.address)).to.equal(11);

  const bankCon = await ethers.getContractFactory("Bank");
  const bank = await bankCon.deploy(erc20Index.target);
  await bank.waitForDeployment();
  const bankAddress = await bank.getAddress();
  console.log("bankAddress::", bankAddress);

  await erc20.approve(bankAddress, 1000);
  const allowance = await erc20.allowance(signer.address, bankAddress);
  console.log("allowance::", allowance);
  // 授权拍卖合约
  const address = await bank.connect(signer).erc20();
  console.log("address::", address);
  expect(address).to.equal(erc20Index.target);

  await bank.deposit(100);
  expect(await erc20.balanceOf(bankAddress)).to.equal(100);
  //

  // console.log(`Bank   deployed： ${bank.target}`);
}

main();
