// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;
contract ArrayTypes {
    // 固定长度 Array
    uint[8] array1;
    bytes1[5] array2;
    address[100] array3;

    // 可变长度 Array
    uint[] array4;
    bytes1[] array5;
    address[] array6;
    bytes array7;

    // 初始化可变长度 Array
    uint[] array8 = new uint[](5);
    bytes array9 = new bytes(9);
    //  给可变长度数组赋值 内部函数
    // 内存数组在初始化时必须明确长度（如new uint[](3)）
    function initArray() external pure returns (uint[] memory) {
        uint[] memory x = new uint[](3);
        x[0] = 1;
        x[1] = 3;
        x[2] = 4;
        return (x);
    }
    // 成员变量数组的赋值
    // push方法仅适用于‌存储数组‌（storage）
    function arrayPush() public returns (uint[] memory) {
        uint[2] memory a = [uint(1), 2];
        array4 = a;
        array4.push(3);
        return array4;
    }
}

pragma solidity ^0.8.21;
contract StructTypes {
    // 结构体 Struct
    struct Student {
        uint256 id;
        uint256 score;
    }
    Student student; // 初始一个student结构体
    //  给结构体赋值
    // 方法1:在函数中创建一个storage的struct引用
    function initStudent1() external {
        Student storage _student = student; // assign a copy of student
        _student.id = 11;
        _student.score = 100;
    }

    // 方法2:直接引用状态变量的struct
    function initStudent2() external {
        student.id = 1;
        student.score = 80;
    }

    // 方法3:构造函数式
    function initStudent3() external {
        student = Student(3, 90);
    }

    // 方法4:key value
    function initStudent4() external {
        student = Student({id: 4, score: 60});
    }
}

pragma solidity ^0.8.21;
contract EnumTypes {
    // 将uint 0， 1， 2表示为Buy, Hold, Sell
    enum ActionSet {
        Buy,
        Hold,
        Sell
    }
    // 创建enum变量 action
    ActionSet action = ActionSet.Buy;

    // enum可以和uint显式的转换
    function enumToUint() external view returns (uint) {
        return uint(action);
    }
}
