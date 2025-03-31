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
  // verify CrowFunding

  if (hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for 5 confirmations");
    // wait for 5 blocks 确认交易
    await CrowFunding.deploymentTransaction().wait(5);
    await verifyCrowFunding(CrowFunding.target, [300]);
  } else {
    console.log("verification skipped..");
  }
  // init 2 accounts
  const [firstAccount, secondAccount] = await ethers.getSigners();

  // fund contract with first account 第一个账户资助合约
  const fundTx = await CrowFunding.fund({ value: ethers.parseEther("0.0021") });
  await fundTx.wait();

  // check balance of contract 账号余额
  const balanceOfContract = await ethers.provider.getBalance(
    CrowFunding.target
  );
  console.log(`Balance of the contract is ${balanceOfContract}`);

  // fund contract with second account 第二个账户资助合约
  const fundTxWithSecondAccount = await CrowFunding.connect(secondAccount).fund(
    { value: ethers.parseEther("0.0022") }
  );
  await fundTxWithSecondAccount.wait();

  // check balance of contract 账号余额
  const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(
    CrowFunding.target
  );
  console.log(`Balance of the contract is ${balanceOfContractAfterSecondFund}`);

  // check mapping
  const firstAccountbalanceInCrowFunding = await CrowFunding.fundersToAmount(
    firstAccount.address
  );
  const secondAccountbalanceInCrowFunding = await CrowFunding.fundersToAmount(
    secondAccount.address
  );
  console.log(
    `Balance of first account ${firstAccount.address} is ${firstAccountbalanceInCrowFunding}`
  );
  console.log(
    `Balance of second account ${secondAccount.address} is ${secondAccountbalanceInCrowFunding}`
  );
}
// create verify function
async function verifyCrowFunding(addr, args) {
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
