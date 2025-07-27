// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract BalanceManager {
    mapping(address => uint256) public balanceOf;

    string public name = "MYDOLLAR";
    string public symbol = "$";
    uint8 public decimals = 4;

    constructor(uint totalBalance) {
        //msg.sender;
        balanceOf[msg.sender] = totalBalance;
    }

    function transfer(address to, uint256 amount) public {
        //msg.sender
        address from = msg.sender;
        uint256 fb = balanceOf[from];
        uint256 tb = balanceOf[to];

        require(amount <= fb, "from account do not have enough money!");

        fb -= amount;
        tb += amount;
        balanceOf[from] = fb;
        balanceOf[to] = tb;
    }
}
//0x739B40Cb103f5F186e638088D6FBE4294696b43d
//0x918528E7ef8889f2CeE4Da1C28948A40d3e91E87

//0x739B40Cb103f5F186e638088D6FBE4294696b43d
//0x994a492F6F6850887C6950Fa38507551bc1DEa2E
