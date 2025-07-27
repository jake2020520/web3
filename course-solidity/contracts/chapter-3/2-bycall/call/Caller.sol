// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract Caller{
    address calleeAddress;
    uint public xx;
    constructor(address _calleeAddress){
        calleeAddress = _calleeAddress;
    }
    function setCalleeX(uint _x)public{
        bytes memory cd = abi.encodeWithSignature("setX(uint256)", _x);
        (bool suc, bytes memory rst) = calleeAddress.call(cd);
        if(!suc){
            revert("call failed");
        }
        (uint x) = abi.decode(rst, (uint));
        xx = x;

    }

}
