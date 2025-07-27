// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Base {
    string private name;
    event MyEvent();
    modifier myMod(){
      _;
    }


 //   function foo() private {}
}

contract ContractA is Base {
    string private name;

 

    function foo1() private {
   
    }
}
