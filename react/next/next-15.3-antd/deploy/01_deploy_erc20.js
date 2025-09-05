/*
 * @Author: xudesong jake2020520@gmail.com
 * @Date: 2025-08-23 05:00:46
 * @LastEditors: xudesong jake2020520@gmail.com
 * @LastEditTime: 2025-08-23 05:41:43
 * @FilePath: /my/metaNft/deploy/01_deploy_nft_auction.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { deployments, upgrades, ethers } = require("hardhat");

const fs = require("fs");
const path = require("path");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { save } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("部署用户地址：", deployer);
  const erc20Con = await ethers.getContractFactory("ERC20");
  const erc20 = await erc20Con.deploy("WTF Token", "WTF");
  await erc20.waitForDeployment();
  console.log(`erc20 deployed： ${erc20.target}`);

  const storePath = path.resolve(__dirname, "./.cache/erc20.json");

  fs.writeFileSync(
    storePath,
    JSON.stringify({
      erc20Address: erc20.target,
      abi: erc20.interface.format("json"),
    })
  );

  await save("ERC20", {
    abi: erc20.interface.format("json"),
    address: erc20.target,
    // args: [],
    // log: true,
  });
  //   await deploy("MyContract", {
  //     from: deployer,
  //     args: ["Hello"],
  //     log: true,
  //   });
};

module.exports.tags = ["deployErc20"];
