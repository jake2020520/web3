// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
interface MyI{
    function readData()external view returns(uint);
}
contract AssemblyReturn {
    uint public x = 10;
    function readData()external{
        
        assembly{
            let _x := sload(x.slot)
            mstore(0, _x)
            return(0, 32)
        }
    }
}