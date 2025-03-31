// import ethers.js
// create main function
// execute main function

const { ethers } = require("hardhat");
// headhart 内置 Hardhat Network 以太坊测试网络
// 通过 ethers.js 部署合约
async function main() {
  // create factory 合约工厂
  const CrowFundingFactory = await ethers.getContractFactory("CrowFunding");
  console.log("contract deploying");
  // deploy contract from factory 合约工厂部署合约  入参
  const CrowFunding = await CrowFundingFactory.deploy(300);
  // wait for contract to be deployed 等待合约部署完成
  await CrowFunding.waitForDeployment();
  console.log(
    `contract has been deployed successfully, contract address is ${CrowFunding.target}`
  );
  // verify fundme

  if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for 5 confirmations");
    // wait for 5 blocks 确认交易
    await CrowFunding.deploymentTransaction().wait(5);
    await verifyFundMe(CrowFunding.target, [300]);
  } else {
    console.log("verification skipped..");
  }
}
// create verify function
async function verifyFundMe(addr, args) {
  await hre.run("verify:verify", {
    address: addr,
    constructorArguments: args,
  });
}
main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(0);
  });
