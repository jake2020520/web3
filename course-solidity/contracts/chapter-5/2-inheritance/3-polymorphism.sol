// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

abstract contract Base{
   
    function foo() external view  virtual;
    
}

contract ContractA is Base {
   

    function foo() public  pure override {


    }
}
