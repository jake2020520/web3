// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


contract ErrorHandle {
    function testRevert()public  {
        revert("ggg");
    }
    function testAssert()public  {
        assert(1==2);
    }
    function testPanic(uint x,uint y)public  {
        uint z = x/y;
    }
    function testPanic1()public  {
        uint z = type(uint256).max;
        z++;
    }
}