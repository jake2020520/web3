// SPDX-License-Identifier: MIT
// WTF Solidity by 0xAA

pragma solidity ^0.8.21;

import "./IERC20.sol";

contract ERC20 is IERC20 {

    mapping(address => uint256) public override balanceOf;

    mapping(address => mapping(address => uint256)) public override allowance;

    uint256 public override totalSupply;   // 代币总供给

    string public name;   // 名称
    string public symbol;  // 符号
    
    uint8 public decimals = 18; // 小数位数

    // @dev 在合约部署的时候实现合约名称和符号
    constructor(string memory name_, string memory symbol_){
        name = name_;
        symbol = symbol_;
    }

    // @dev 实现`transfer`函数，代币转账逻辑
    function transfer(address recipient, uint amount) public override returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    // @dev 实现 `approve` 函数, 代币授权逻辑
    // `approve` 函数允许一个地址授权另一个地址可以使用自己的代币
    // 用者账户给`spender`账户授权 `amount`数量代币
    // `allowance` 映射记录了每个地址对每个授权地址
    // 的授权额度
    function approve(address spender, uint amount) public override returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    // @dev 实现`transferFrom`函数，代币授权转账逻辑
    // `transferFrom` 函数允许授权的地址从一个地址转账到另一个地址
    // 需要先调用 `approve` 函数授权
    // `allowance` 映射记录了每个地址对每个授权地址
    // 的授权额度
    // `transferFrom` 函数会减少授权额度
    // 并且转移代币
    // 注意：在调用 `transferFrom` 函数之前，必须先调用 `approve` 函数
    // 来授权转账额度
    // `transferFrom` 函数的调用者必须是授权地址
    // `sender` 是被授权的地址，`recipient` 是接收地址，
    // `amount` 是转账金额
    // `allowance[sender][msg.sender]` 是授权地址对被授权地址
    // 的授权额度
    // `balanceOf[sender]` 是被授权地址的余额
    // `balanceOf[recipient]` 是接收地址的余额
    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) public override returns (bool) {
        allowance[sender][msg.sender] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    // @dev 铸造代币，从 `0` 地址转账给 调用者地址
    function mint(uint amount) external {
        balanceOf[msg.sender] += amount;
        totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
    }

    // @dev 销毁代币，从 调用者地址 转账给  `0` 地址
    function burn(uint amount) external {
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }

}
