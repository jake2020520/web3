/*
 * @Author: xudesong jake2020520@gmail.com
 * @Date: 2025-08-23 04:40:38
 * @LastEditors: xudesong jake2020520@gmail.com
 * @LastEditTime: 2025-08-23 05:37:21
 * @FilePath: /my/metaNft/hardhat.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("@openzeppelin/hardhat-upgrades");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  namedAccounts: {
    deployer: 0,
    user1: 1,
    user2: 2,
  },
};
