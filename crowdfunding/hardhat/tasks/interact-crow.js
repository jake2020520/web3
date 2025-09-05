const { task } = require("hardhat/config");

task("interact-crow", "interact with crow contract")
  .addParam("addr", "crow contract address") // add address param 部署的合约地址
  .setAction(async (taskArgs, hre) => {
    const crowFactory = await ethers.getContractFactory("CrowFunding");
    const crow = crowFactory.attach(taskArgs.addr); // attach contract address

    // init 2 accounts
    const [firstAccount, secondAccount] = await ethers.getSigners();

    // fund contract with first account
    // 第一个账号给合约转账0.0021 ether
    // 合约收到0.0021 ether
    const fundTx = await crow.fund({ value: ethers.parseEther("0.0021") });
    await fundTx.wait();

    // check balance of contract
    const balanceOfContract = await ethers.provider.getBalance(crow.target);
    console.log(`Balance of the contract is ${balanceOfContract}`);

    // fund contract with second account
    const fundTxWithSecondAccount = await crow
      .connect(secondAccount)
      .fund({ value: ethers.parseEther("0.0022") });
    await fundTxWithSecondAccount.wait();

    // check balance of contract
    const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(
      crow.target
    );
    console.log(
      `Balance of the contract is ${balanceOfContractAfterSecondFund}`
    );

    // check mapping
    const firstAccountbalanceIncrow = await crow.fundersToAmount(
      firstAccount.address
    );
    const secondAccountbalanceIncrow = await crow.fundersToAmount(
      secondAccount.address
    );
    console.log(
      `Balance of first account ${firstAccount.address} is ${firstAccountbalanceIncrow}`
    );
    console.log(
      `Balance of second account ${secondAccount.address} is ${secondAccountbalanceIncrow}`
    );
  });

module.exports = {};
