pragma solidity >=0.7.0 <0.9.0;

contract NumberStorage {

    mapping(address => uint) public balance;

    // 转账操作记录事件定义
    event transfer_record(address from, address to,uint before_from_balance, uint before_to_balance, uint amount, uint from_balance, uint to_balance);

    constructor(uint deploy_amount) {
        balance[msg.sender] = deploy_amount;
    }

    // 转账操作
    function transfer(address to, uint amount) public {
        // 获取当前外部账号地址
        address from = msg.sender;
        // 获取当前账号余额
        uint current_amount = balance[msg.sender];
        // 当前账号当前转账计算
        uint before_from_balance = current_amount;
        uint from_balance = current_amount - amount;
        // 判断当前账号余额是否支持此次转账金额
        if (from_balance < 0.00000)
            revert("ammount sounr");
        // 获取收款地址当前余额
        uint before_to_balance = balance[to];
        // 计算收款账号金额
        uint to_balance = before_to_balance + amount;
        // 设置账号余额
        balance[msg.sender] = from_balance;
        balance[to] = to_balance;
        // 记录转账记录
        emit transfer_record(from, to, before_from_balance, before_to_balance, amount, from_balance, to_balance);
    }
}