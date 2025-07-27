// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract ExternalDemo {
    address public caller;

    function first() public {
        this.three();
    }
    function second() public {
        caller = msg.sender;
    }
    // external 内部调用 需要用this，改变了 msg指向，指向了自己
    function three() external {
        caller = msg.sender;
    }
}
//0xf8e81D47203A594245E36C48e151709F0C19fBe8
//0xf8e81D47203A594245E36C48e151709F0C19fBe8
