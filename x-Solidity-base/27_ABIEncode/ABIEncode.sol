// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract ABIEncode{
    uint x = 10;
    address addr = 0x7A58c0Be72BE218B41C608b7Fe7C5bB630736C71;
    string name = "0xAA";
    uint[2] array = [5, 6]; 

    function encode() public view returns(bytes memory result) {
        result = abi.encode(x, addr, name, array);
    }

    function encodePacked() public view returns(bytes memory result) {
        result = abi.encodePacked(x, addr, name, array);
    }

    function encodeWithSignature() public view returns(bytes memory result) {
        result = abi.encodeWithSignature("foo(uint256,address,string,uint256[2])", x, addr, name, array);
    }

    function encodeWithSelector() public view returns(bytes memory result) {
        result = abi.encodeWithSelector(bytes4(keccak256("foo(uint256,address,string,uint256[2])")), x, addr, name, array);
    }
    function decode(bytes memory data) public pure returns(uint dx, address daddr, string memory dname, uint[2] memory darray) {
        (dx, daddr, dname, darray) = abi.decode(data, (uint, address, string, uint[2]));
    }
    // 获取消息发送者和发送的以太币数量
    // msg.sender 是发送交易的地址，msg.value 是发送的以太币数量
    function getMessageDetails() public payable returns (address,uint){
        return (msg.sender, msg.value);
    }
    // 编码 Zood  18
    function encodeData(string memory text, uint256 number) public pure returns (bytes memory,bytes memory){
        return (
            //0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000001200000000000000000000000000000000000000000000000000000000000000045a6f6f6400000000000000000000000000000000000000000000000000000000
            abi.encode(text,number),
            //0x5a6f6f640000000000000000000000000000000000000000000000000000000000000012
            abi.encodePacked(text,number)
        );
    }
    // 解码
    function decodeData(bytes memory encodeData) public pure returns (string memory text,uint256 number){
        return abi.decode(encodeData,(string, uint256));
    }
    // 获取当前函数的签名 当前函数调用的函数选择器（function selector）
    // msg.sig 是 msg.data 的前4字节（msg.data[0:4]）
    function getSelector() public pure returns (bytes4){
        return msg.sig;
    }
    // 计算函数选择器
    // 函数选择器就是通过函数名和参数进行签名处理(Keccak–Sha3)来标识函数，可以用于不同合约之间的函数调用
    // 入参 传入 getSelector() 函数签名
    function computeSelector(string memory func)public  pure returns (bytes4){
        return bytes4(keccak256(bytes(func)));
    }
    //--执行同下---
    // 0xa9059cbb0000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc40000000000000000000000000000000000000000000000000000000000000064
    function transfer (address addr, uint256 amount)public pure returns (bytes memory){
        return msg.data;
    }
    // 0xa9059cbb0000000000000000000000005b38da6a701c568545dcfcb03fcb875f56beddc40000000000000000000000000000000000000000000000000000000000000064
    function encodeFunctionCall()public pure returns (bytes memory){
        return abi.encodeWithSignature("transfer(address,uint256)",0x5B38Da6a701c568545dCfcB03FcB875f56beddC4,100);
    }
    // - this 关键字调用合约自身的函数时，会触发新的交易，因此会消耗额外的 gas。
    // this.balance 获取的是合约的 ETH 余额，而 msg.sender.balance 可以用于获取调用者的余额。
    function getContractBalance() public view returns (uint,uint) {
        return (address(this).balance,msg.sender.balance);
    }
}
