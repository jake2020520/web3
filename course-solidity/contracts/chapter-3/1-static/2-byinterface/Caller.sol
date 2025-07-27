// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
 interface ICallee {
    function setX(uint _x) external;
    function setY(uint _x) external;
}

contract Caller{
    address calleeAddress;
    constructor(address _calleeAddress){
        calleeAddress = _calleeAddress;
    }
    function setCalleeX(uint _x)public{
        ICallee callee = ICallee(calleeAddress);
        callee.setY(_x);

    }

}
//0xd9145CCE52D386f254917e481eB44e9943F39138