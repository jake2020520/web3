// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./ERC20.sol";

contract Bank {
    // 实现一个存款 erc20 代币的智能合约，实现存款和取款功能
    address public erc20;

    // 存款和取款功能
    constructor(address erc20Address) {
        erc20 = erc20Address;
    }

    function deposit(uint256 amount) public payable {
        ERC20(erc20).transferFrom(msg.sender, address(this), amount);
    }

    function withdraw(uint amount) public {
        ERC20(erc20).transfer(msg.sender, amount);
    }
}
