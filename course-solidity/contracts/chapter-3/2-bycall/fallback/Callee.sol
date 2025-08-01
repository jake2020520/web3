// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract Callee {
    uint public x;
    function setX(uint _x) public returns (uint) {
        x = _x;
        return x;
    }
    // 备胎函数，外面调用此合约，找不到方法时，执行此处
    fallback() external {
        x = 100000000;
    }
}
