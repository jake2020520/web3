// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

/**
 * @title Owner
 * @dev Set & change owner
 */
contract LocalStorageVariable {
    int256[]  data1;
    int256[]  data2;

   
    function getData1()public view returns(int256[] memory){
        return data1;
    }
    function getData2()public view returns(int256[] memory){
        return data2;
    }

    function insertData1(int256 d)public{
        return data1.push(d);
    }
      function insertData2(int256 d)public{
        return data2.push(d);
    }
    
    function setData1ToData2()public{
        data1 = data2;
    }
    function testSecondRule(int256[] calldata pd )public  returns(int256[] memory){
        int256[] memory td;
        td = data1;
        data1 = pd;
    //    pd = data1;

              int256[] calldata cdt = pd;
        return td;
    }






    function testMemoryRef() public pure{
        
        uint8[3] memory data1 = [1,2,3];
        uint8[3] memory data2 = data1;

    }
    function testStorageRef() public view returns (int256[] memory){
        
        int256[] storage data1 = data1;
        int256[] storage data2 = data2;
        data2 = data1;
        return data2;

    }
   
}
