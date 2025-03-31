const { task } = require("hardhat/config");

task("deploy-crow", "deploy and verify crow conract").setAction(
  async (taskArgs, hre) => {
    // create factory
    const crowFactory = await ethers.getContractFactory("CrowFunding");
    console.log("contract deploying");
    // deploy contract from factory
    const crow = await crowFactory.deploy(300);
    await crow.waitForDeployment();
    console.log(
      `contract has been deployed successfully, contract address is ${crow.target}`
    );

    // verify crow
    if (
      hre.network.config.chainId == 11155111 &&
      process.env.ETHERSCAN_API_KEY
    ) {
      console.log("Waiting for 5 confirmations");
      await crow.deploymentTransaction().wait(5);
      await verifyCrow(crow.target, [300]);
    } else {
      console.log("verification skipped..");
    }
  }
);

async function verifyCrow(crowAddr, args) {
  await hre.run("verify:verify", {
    address: crowAddr,
    constructorArguments: args,
  });
}

module.exports = {};
