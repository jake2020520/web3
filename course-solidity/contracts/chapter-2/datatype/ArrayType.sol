// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract ArrayType {
    uint8[3] data;
    uint8[] ddata;

    function testStaticArray() public returns (uint8[3] memory) {
        data[0] = 25;
        return data;
    }

    function testReadDynamicStorageArray()
        public
        view
        returns (uint8[] memory)
    {
        return ddata;
    }

    function testWriteDynamicStorageArray() public {
        ddata.push(12);
        ddata.pop();
        ddata.push(90);
    }

    function testMemoryDynamicArra(uint8 size)
        public
        pure
        returns (uint8[] memory)
    {
        uint8[] memory mdata = new uint8[](size);
    }

}
