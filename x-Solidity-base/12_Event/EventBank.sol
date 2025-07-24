// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EventBank{
    // 这条语句会把一条日志写入链上，前端可以用 Web3.js 或 Ethers.js 来监听这个事件。
    // 定义一个事件，记录存款操作
    event Deposit(address indexed account, uint256 amount);

    // 定义一个事件，记录取款操作
    event Withdrawal(address indexed account, uint256 amount);

    // 定义一个映射，记录每个账户的余额
    mapping(address => uint256) private balances;

    // 存款函数
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // 取款函数
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }

    // 查询余额函数
    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
}