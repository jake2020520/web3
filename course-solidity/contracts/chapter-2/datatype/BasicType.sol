// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract BasicType {
    function testInt() public pure returns (uint) {
        uint256 i8 = 259887;
        uint256 max = type(uint256).max;
        //SafeMath
        uint8 x = 8;
        uint16 y = 9;
        // 强制转换
        x = uint8(y);

        return max;
    }
    enum OrderState {
        layorder,
        
        
    }
    function enumTest() public view returns (OrderState) {
        OrderState state = OrderState.payment;
        return state;
    }
}
