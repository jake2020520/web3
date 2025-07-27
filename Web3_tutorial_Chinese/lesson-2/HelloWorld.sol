// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract HelloWorld {
    // SPDX-License-Identifier: GPL-3.0
    // 定软件许可证类型的标识符  用于明确声明智能合约代码的许可证类型
    // pragma solidity >=0.8.2 <0.9.0;
    // 声明 solidity 版本号
    //     函数修饰符:
    //   public 任何人都可以调用这个函数，包括合约内部和外部。
    //   private 只有合约内部的函数可以调用这个函数，外部的合约或用户无法调用
    //   internal 只有合约内部和继承自该合约的子合约可以调用这个函数，外部的合约或用户无法调用
    //   external 只能从合约外部调用，不能从合约内部直接调用。但是可以通过 `this` 关键字在合约内部调用
    string strVar = "Hello World";
    struct Info {
        string phrase;
        uint256 id;
        address addr;
    }
    Info[] infos;
    mapping(uint256 id => Info info) infoMapping;
    //   其他函数修饰符:
    //  view 声明该函数不会修改合约的状态（即不能修改状态变量） 例 retutn name;
    //  pure 声明该函数既不读取也不修改合约的状态（即不能访问状态变量）  例 retutn 1+2;
    //  payable   声明该函数可以接收代币
    function sayHello(uint256 _id) public view returns (string memory) {
        if (infoMapping[_id].addr == address(0x0)) {
            return addinfo(strVar);
        } else {
            return addinfo(infoMapping[_id].phrase);
        }
    }

    function setHelloWorld(string memory newString, uint256 _id) public {
        Info memory info = Info(newString, _id, msg.sender);
        infoMapping[_id] = info;
    }

    function addinfo(
        string memory helloWorldStr
    ) internal pure returns (string memory) {
        return string.concat(helloWorldStr, "from Frank's contract");
    }

    uint[] public arr = [1, 2, 3, 4, 5];
    // 1、删掉指定数组的项目 改变了顺序
    // 执行remove(1)操作后，arr的值为[1,5,3,4]，执行getLength()值为4
    // 这种方法的缺点是我们删除中间一个元素后，数组的顺序会有变化，
    // 如果我们数组本身顺序是有意义的(如按照时间排序的)，
    // 那最终也会导致我们智能合约逻辑有问题
    function remove1(uint index) public returns (uint[] memory) {
        require(index < arr.length, "index not found");
        arr[index] = arr[arr.length - 1];
        arr.pop();
        return arr;
    }
    function getLength() public view returns (uint) {
        return arr.length;
    }
    // 2、删掉指定数组的项目  花费的gas费较高
    // 通过把目标元素后面所有元素向前移动一位，
    // 再删除最后一个元素来实现删除目标元素。
    function remove2(uint index) public returns (uint[] memory) {
        require(index < arr.length, "index not found");
        for (uint i = index; i < arr.length - 1; i++) {
            arr[i] = arr[i + 1];
        }
        arr.pop();
        return arr;
    }

    // 3、指定位置新增元素
    function add(uint index, uint value) public returns (uint[] memory) {
        require(index < arr.length, "index not found");
        arr.push();
        for (uint i = arr.length - 1; i > index; i--) {
            arr[i] = arr[i - 1];
        }
        // arr[index] = value;
        return arr;
    }
}
