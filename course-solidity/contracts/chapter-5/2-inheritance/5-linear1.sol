// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;



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
  
    function bar() public virtual override(B, C) {
        emit Log("D.bar called");
        super.bar();
    }
}

contract E is A {
  
    function bar() public virtual override(A) {
         emit Log("E.bar called");
        super.bar();
    }
}
contract F is A, E {
  
    function bar() public virtual override(A, E) {
         emit Log("F.bar called");
        super.bar();
    }
}
contract G is D, F {
  
    function bar() public override(D, F) {
         emit Log("G.bar called");
        super.bar();
    }
}