
pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

/**
 * @title Owner
 * @dev Set & change owner
 */
contract LocalStorageVariable {
    string public name;
    function memeoryString() public pure returns(string memory){
        string memory rst;
    }
   function storageString() public view returns(string memory){
        string storage rst = name;//如果不复制呢？
        return rst;
    }
    
}