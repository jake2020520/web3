// import { ethers } from "hardhat";
const { ethers } = require("hardhat");
async function main() {
  const erc20Con = await ethers.getContractFactory("ERC20");
  const erc20 = await erc20Con.deploy("WTF Token", "WTF");
  await erc20.waitForDeployment();
  console.log(`Bank   deployed to ${erc20.target}`);

  const bankCon = await ethers.getContractFactory("Bank");
  const bank = await bankCon.deploy(erc20.target);
  await bank.waitForDeployment();

  console.log(`Bank   deployed to ${bank.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
