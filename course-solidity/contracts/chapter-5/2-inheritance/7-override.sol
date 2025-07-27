// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/* Inheritance tree
   A
 /  \
B   C
 \ /
  D
*/

contract A {

    function foo() public virtual {
   
    }
}

contract B is A {
 
}

contract C is A {

}

contract D is B, C {
  
    function foo() public  override(A) {
  
    }
}
