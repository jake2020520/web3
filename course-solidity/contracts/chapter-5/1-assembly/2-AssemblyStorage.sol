// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Storage {
    uint256 number;

    function store(uint256 num) public {
        assembly {
            sstore(number.slot, num)
        }
        //   number = num;
    }

    function read() public view returns (uint256) {
        assembly {
            let rst := sload(number.slot)
            mstore(0, rst)
            return(0, 32)
        }
        //   number = num;
    }

    function readData() external view {
        assembly {
            let rst := sload(number.slot)
            let free_pointer := mload(0x40)

            mstore(free_pointer, rst)
            return(free_pointer, 32)
        }
        //   number = num;
    }

}
