// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
contract Callee {
    uint public x;
    function setX(uint _x)public{
        x = _x;
    }
}
contract Caller{
    address calleeAddress;
    constructor(address _calleeAddress){
        calleeAddress = _calleeAddress;
    }
    function setCalleeX(uint _x)public{
        Callee callee = Callee(calleeAddress);
        callee.setX(_x);

    }

}
//0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B