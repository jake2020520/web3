// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7; 
 
/// @dev 示例合约：uint8最大值为255，255加上一个大于0的整数会溢出，加上unchecked不会检查是否溢出
contract TestUncheck {  
    /// @dev 检查溢出（checked模式）检查模式，由于数据溢出，发生异常回退。
    function withoutUnchecked() external pure returns (uint8) {
        uint8 a = 255;
        uint8 b = 5;
        return (a + b);
    }
 
    /// @dev 不检查溢出（unchecked模式或称为截断模式）
    // 截断模式，虽然255+5溢出了，但输出了溢出结果4。
    function withUnchecked() external pure returns (uint8) { 
        uint8 a = 255;
        uint8 b = 5;
        // 不检查溢出，输出溢出结果
        unchecked { 
            return (a + b);
        }
    }
}