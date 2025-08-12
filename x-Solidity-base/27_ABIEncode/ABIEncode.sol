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
    // 使用abi.encodePacked进行编码，适用于需要更紧凑的字节表示的情况
    // 注意：abi.encodePacked可能会导致碰撞，因此在处理动态类型时要小心
    // 例如：abi.encodePacked("a", "b") 和 abi.encodePacked("ab") 会产生相同的结果
    // 但在处理静态类型时，使用abi.encodePacked是安全的
    // 例如：abi.encodePacked(uint256, address, string, uint[2]) 不会产生碰撞
    function encodePacked() public view returns(bytes memory result) {
        result = abi.encodePacked(x, addr, name, array);
    }

    function encodeWithSignature() public view returns(bytes memory result) {
        result = abi.encodeWithSignature("foo(uint256,address,string,uint256[2])", x, addr, name, array);
    }
     // 使用函数选择器进行编码
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
contract A11 {
    function getBFunctionBytes4() external pure returns (bytes4) {
        // 返回函数选择器 0xf36b7e20
        return bytes4(keccak256("bFunction(uint256,string)"));
    }
    // num 100 message hello
    // 0x00000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000
    function getParamsBytes(uint256 _num,string calldata _message) public pure returns(bytes memory){
        return abi.encode(_num,_message);
    }
  
    // 或者直接用这个方法 这个等价于 前两个函数的返回值。 函数和如参数的编码
    function encodeWithSignature() public view returns(bytes memory result) {
    // 0xf36b7e2000000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000
        result = abi.encodeWithSignature("bFunction(uint256,string)", 100, "hello");
    }

      // _b B11的合约地址
    // data 上两个函数返回拼接的
    // 0xf36b7e2000000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000
    // 执行完毕次函数，就改变了 B11里面的成员变量了
    function callBFunction(address _b,bytes memory _data) public returns(bool){
        // 调用B合约的函数
        (bool success, bytes memory result) = _b.call(_data);
        require(success, "Call failed");
        return success;
    }
}
contract B11 {
    uint256 public num;
    string public message;
    event Log(uint256 num, string message);
    
    function bFunction(uint256 _num, string calldata _message) public returns (uint256, string memory) {
        // 触发事件
        emit Log(_num, _message);
        num=_num;
        message=_message;
        return (num, message);
    }
    
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}