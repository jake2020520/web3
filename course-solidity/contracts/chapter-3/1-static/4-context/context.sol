// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;


contract Callee {
    uint public x;
    address public caller;
    address public eoaaddress;
    function setX(uint _x)public{
        
        caller = msg.sender;
        eoaaddress = tx.origin;
        x = _x;
    }
}
contract Caller{
     
    address public caller;
    address public eoaaddress;
    address calleeAddress;
    constructor(address _calleeAddress){
        calleeAddress = _calleeAddress;
    }
    function setCalleeX(uint _x)public{
         caller = msg.sender;
          eoaaddress = tx.origin;
        Callee callee = Callee(calleeAddress);
        callee.setX(_x);

    }

}
//0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
//0x5B38Da6a701c568545dCfcB03FcB875f56beddC4

// 0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8
// 0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8