// import ethers.js
// create main function
// execute main function

const { ethers } = require("hardhat");

async function main() {
  // create factory 创建合约工厂
  const fundMeFactory = await ethers.getContractFactory("FundMe");
  console.log("contract deploying");
  // deploy contract from factory 部署，但不知是否成功
  const fundMe = await fundMeFactory.deploy(300);
  await fundMe.waitForDeployment(); // 待成功
  console.log(
    `contract has been deployed successfully, contract address is ${fundMe.target}`
  );
}
main()
  .then()
  .catch((error) => {
    console.error(error);
    process.exit(0);
  });
