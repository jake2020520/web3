// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract AbiDecode {
    struct MyStruct {
        string name;
        uint[2] nums;
    }
    // 编码
    function encode(
        uint x,
        address addr,
        uint[] calldata arr,
        MyStruct calldata myStruct
    ) external pure returns (bytes memory) {
        return abi.encode(x, addr, arr, myStruct);
    }
    // 解码
    function decode(
        bytes calldata data
    )
        external
        pure
        returns (
            uint x,
            address addr,
            uint[] memory arr,
            MyStruct memory myStruct
        )
    {
        // (uint x, address addr, uint[] memory arr, MyStruct myStruct) = ...
        (x, addr, arr, myStruct) = abi.decode(
            data,
            (uint, address, uint[], MyStruct)
        );
    }
}
