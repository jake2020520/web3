// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/* Inheritance tree
   A
 /  \
B   C
 \ /
  D E
*/

contract A {
    // This is called an event. You can emit events from your function
    // and they are logged into the transaction log.
    // In our case, this will be useful for tracing function calls.
    event Log(string message);

   
    function bar() public virtual {
        emit Log("A.bar called");
    }
}

contract B is A {
 
    function bar() public virtual override {
        emit Log("B.bar called");
        super.bar();
    }
}

contract C is A {

    function bar() public virtual override {
        emit Log("C.bar called");
        super.bar();
    }
}

contract D is B, C {
  
    function bar() public override(B, C) {
        super.bar();
    }
}

contract E is  C, B {
  
    function bar() public override(B, C) {
        super.bar();
    }
}
