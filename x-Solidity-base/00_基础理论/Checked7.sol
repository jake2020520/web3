// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6; 
 
/// @dev 测试0.8.0以前版本，溢出为截断模式
// 0.8.0之前版本为“wrapping”（截断）模式，即在发生溢出的情况下会进行“截断”，
// 不会触发失败异常，从而得靠引入额外的检查库来解决这个问题（如OpenZeppelin中的SafeMath库）
contract TestOverflow {  
    /// @dev 不检查溢出（wrapping模式）
    // 截断模式，虽然255+5溢出了，但输出了溢出结果4。
    function overflow() external pure returns (uint8) {
        uint8 a = 255;
        uint8 b = 5;
        return (a + b);
    }
}