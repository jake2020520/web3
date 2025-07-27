// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract ContractStructure {
    uint256 public balance;
    // 相当于打印日志 记录重要信息
    event BalanceAdded(uint256 oldValue, uint256 incre);

    constructor(uint256 _bal) {
        balance = _bal;
    }

    modifier IncrementRange(uint256 _incre) {
        //修饰器是对函数的输入输出条件进行约束的
        require(_incre > 100, "too small!");

        _; //执行被修饰函数的逻辑
    }

    function balance1() internal view returns (uint256) {
        return balance;
    }

    function addBalance(uint256 _incre) external IncrementRange(_incre) {
        uint256 old = balance;
        balance += _incre;
        emit BalanceAdded(old, _incre);
    }
}
//0xd9145CCE52D386f254917e481eB44e9943F39138
