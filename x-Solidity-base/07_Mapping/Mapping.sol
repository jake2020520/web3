// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;
contract Mapping {
    mapping(uint => address) public idToAddress; // id映射到地址
    mapping(address => address) public swapPair; // 币对的映射，地址到地址
    mapping (address => mapping (string => uint) ) public userBalances; // 用户地址到币种到余额的映射
    
    // 规则1. _KeyType不能是自定义的 下面这个例子会报错
    // 我们定义一个结构体 Struct
    // struct Student{
    //    uint256 id;
    //    uint256 score; 
    //}
    // mapping(Struct => uint) public testVar;

    function writeMap (uint _Key, address _Value) public{
        idToAddress[_Key] = _Value;
    }
    function setUserBalance(address _user, string memory _token, uint _balance) public {
        userBalances[_user][_token] = _balance;
    }
    function getUserBalance(address _user, string memory _token) public view returns (uint) {
        return userBalances[_user][_token];
    }
    function deleteUserBalance(address _user, string memory _token) public {
        delete userBalances[_user][_token]; // 删除用户的某个币种余额
    }

}
