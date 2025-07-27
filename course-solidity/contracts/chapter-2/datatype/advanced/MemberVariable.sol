// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


/**
 * @title Owner
 * @dev Set & change owner
 */
contract MemberVariable {

    int256[]  data1;
    int256[]  data2;

    Person p1;
    Person p2;

    struct Person{
        string name;
        uint age;
    }
    

   
    function getData1()public view returns(int256[] memory){
        return data1;
    }
    function getData2()public view returns(int256[] memory){
        return data2;
    }

    function insertData1(int256 d)public{
        p1 = p2;
        return data1.push(d);
    }
      function insertData2(int256 d)public{
        return data2.push(d);
    }
  //1. 成员变量都是存放在storage 2. storage存储位置的变量之间赋值的时候是引用拷贝
    function setData2ToData1()public {
        data1 = data2;
    }
//成员变量本质上就是存储槽，storage layout 
    function setData2ToData1ByStorageLocal()public {

        int256[] storage dataref = data2;
        data1  = dataref;//引用赋值
        
    }
    function calldataTest(string calldata name)public returns(string calldata){
        string calldata temp = name;
        name = temp;
        /* calldata不能成为值拷贝目标
        string memory temp1 = name;
        name = temp1;
        */
        uint v1 = 10;
        uint v2 = 9;
        v1 = v2;
        string storage desc;

        data1 = data2;//值拷贝

        int256[] storage temp1 = data1;
    //    data1 = temp1;

        temp1 = data2; 


        return temp;
    }
    /*数据类型：
    1.值类型 引用类型:
    2. location : calldata stoage memory 
    3. 成员变量：引用消失，指向固定、特有的数据块
    4. mapping storage
    5. calldata 只读 calldata的数据块不能被值拷贝


    算法
    solidity语言中引用类型变量之间进行赋值操作的时候，实际发生的到底是引用拷贝，还是值拷贝？

    x = a
    
    判定算法：
    1. 如果x是成员变量，别的就都不用看了，一定是值拷贝 否则
    2. 如果x和a的location相同，引用拷贝，否则
    3. 值拷贝


    值拷贝，还是引用拷贝？

    检查算法
    1.如果是引用拷贝，结束
    2.如果是值拷贝，考察两件事：
        a。x如果是calldata 出错
        b。如果这个数据类型是跟mapping有，值拷贝？出错，否则
        c. z执行值拷贝

    检查


    */


  
}
