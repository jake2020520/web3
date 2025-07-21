// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract ValueTypes {
    // 布尔值
    bool public _bool = true;
    // 布尔运算
    bool public _bool1 = !_bool; //取非
    bool public _bool2 = _bool && _bool1; //与
    bool public _bool3 = _bool || _bool1; //或
    bool public _bool4 = _bool == _bool1; //相等
    bool public _bool5 = _bool != _bool1; //不相等

    // 整数
    int public _int = -1;
    uint public _uint = 1;
    int public _int1 = 1 * 2 ** 255 - 1; // 不减1，就会有益处的风险
    uint256 public _number = 20220330;
    // 整数运算
    uint256 public _number1 = _number + 1; // +，-，*，/
    uint256 public _number2 = 2 ** 2; // 指数
    uint256 public _number3 = 7 % 2; // 取余数
    bool public _numberbool = _number2 > _number3; // 比大小

    // 地址
    address public _address = 0x7A58c0Be72BE218B41C608b7Fe7C5bB630736C71;
    address payable public _address1 = payable(_address); // payable address，可以转账、查余额
    // 地址类型的成员
    uint256 public balance = _address1.balance; // balance of address

    // 固定长度的字节数组
    // _byte32 是一个长度为 32 字节的定长字节数组，内容是字符串 "MiniSolidity"，后面自动补零。
    // _byte32[0] 表示取出第 0 个字节（即第一个字节），类型为 bytes1。
    // 这里 _byte32[0] 的值就是 "M" 的 ASCII 码（16 进制为 0x4d）。
    bytes32 public _byte32 = "MiniSolidity"; // bytes32: 0x4d696e69536f6c69646974790000000000000000000000000000000000000000
    bytes1 public _byte = _byte32[0]; // bytes1: 0x4d
    // _byte32[1] 就是 "MiniSolidity" 字符串的第二个字符 'i' 的 ASCII 码（16 进制为 0x69）。
    bytes1 public _byte1 = _byte32[1]; // bytes1: 0x69
    // _byte32[2] 就是 "MiniSolidity" 字符串的第三个字符 'n' 的 ASCII 码（16 进制为 0x6e）。
    bytes1 public _byte2 = _byte32[2]; // bytes1: 0x6e

    // Enum
    // 将uint 0， 1， 2表示为Buy, Hold, Sell
    enum ActionSet {
        Buy,
        Hold,
        Sell
    }
    // 创建enum变量 action
    ActionSet action = ActionSet.Buy;

    // enum可以和uint显式的转换
    function enumToUint() external view returns (uint) {
        return uint(action);
    }

    // 向左边位移2位 eg: 255移动2位 得到252
    // 255 二进制 1111 11111
    //   移动二位 1111 1100   
    function leftShift(uint8 x, uint8 y)public  pure returns(uint8){
        return x << y;
    }

    function rightshift(int x, uint y) public pure returns (int z){
        z = x >> y; 
    } 
    // 按位与 只要有1个0就是0
    // 0000 1100 => 12
    // 0000 0101 => 5
    // 0000 0100 => 4
    function and(uint8 x, uint8 y)public  pure returns(uint8){
        return x & y;
    }
    // 按位或 只要有1个0就是0
    // 0000 1100 => 12
    // 0000 0101 => 5
    // 0000 1101 => 13
    function or(uint8 x, uint8 y)public  pure returns(uint8){
        return x | y;
    }
    // 异或  上下不同1，相同 用的少
    // 0000 1100 => 12
    // 0000 0101 => 5
    // 0000 1001 => 9
    function xor(uint8 x, uint8 y)public  pure returns(uint8){
        return x | y;
    }
}
