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
    uint public x = 5;
    constructor(){

    }

}

contract B is A {
 
    constructor(){
        x += 10;
    }
}

contract C is A {

    constructor(){
        x *= 10;
    }
}

contract D is C, B{

}
