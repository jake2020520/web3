// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract BytesAndString {
    //初始化方式 new
    string name =  "BytesAndString";//new string(5);
    bytes name1 = "BytesAndString1";//new bytes(5);

    function testStringAndBytes()public view returns(string memory){
        //初始化方式 new  为什么用new？struct初始化为什么不用new？
        string memory data = "xyz";//new string(5);
        bytes memory data1 = "abc";//new bytes(5);
        

        //不同location的memory拷贝
        data = name;
        data1 = name1;

        //   类型转换
        data1 = bytes(data);
        data = string(data1);
        //下标访问
        //       bytes1 b = data[0];
        //       data[0] = 0x88;

        bytes1 b = data1[0];
        data1[0] = 0x88;

        //能够push pop吗？
        //name1.push(0x00);
        //data1.push(0x00);
        
        return data;
    }
    //高级话题：bytes与byte1[]的区别...
}