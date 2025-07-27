// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract AssemblyBasic {
    //solidity
    function addSolidity(uint256 x, uint256 y) public pure returns (uint256) {
        return x + y;
    }

    function loopNormal(uint256 n) public pure returns (uint256 rst) {
        for (uint256 i = 0; i < n; i++) {
            rst += i;
        }
    }
    //assembly
    function addAssembly(uint256 x, uint256 y) public pure returns (uint256) {
        assembly {
            let result := add(x, y)
            let fm := mload(0x40)
            mstore(fm, result)
            return(fm, 32)
        }
    }

    function loopAssembly(uint256 n) public pure returns (uint256 rst) {
        assembly {
            for {
                let i := 0
            } lt(i, n) {
                i := add(i, 1)
            } {
                rst := add(i, rst)
            }

            mstore(0x0, rst)
            return(0x0, 32)
        }
    }

    function read1()
        external
        pure
        returns (
            uint256 a,
            uint256 b,
            uint256 c
        )
    {
        uint256[3] memory arr;
        arr[0] = 111;
        arr[1] = 222;
        arr[2] = 333;
        assembly {
            a := mload(add(arr, 0))
            b := mload(add(arr, 32))
            c := mload(add(arr, 64))
        }
    }

    function read2()
        external
        pure
        returns (
            uint256 a,
            uint256 b,
            uint256 c
        )
    {
        uint256[] memory arr = new uint256[](3);
        arr[0] = 444;
        arr[1] = 555;
        arr[2] = 666;
        assembly {
            a := mload(add(arr, 0))
            b := mload(add(arr, 32))
            c := mload(add(arr, 64))
        }
    }

    function testDynamicArray() external pure returns (uint256 i) {
        uint256[] memory myarray = new uint256[](5);
        assembly {
            i := mload(add(myarray, 32))
        }
    }

    function bytesToBytes32Array(bytes memory data)
        public
        pure
        returns (bytes32[] memory)
    {
        // Find 32 bytes segments nb
        uint256 dataNb = data.length / 32;
        // Create an array of dataNb elements
        bytes32[] memory dataList = new bytes32[](dataNb);
        // Start array index at 0
        uint256 index = 0;
        // Loop all 32 bytes segments
        for (uint256 i = 32; i <= data.length; i = i + 32) {
            bytes32 temp;
            // Get 32 bytes from data
            assembly {
                temp := mload(add(data, i))
            }
            // Add extracted 32 bytes to list
            dataList[index] = temp;
            index++;
        }
        // Return data list
        return (dataList);
    }

    function isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }
}
