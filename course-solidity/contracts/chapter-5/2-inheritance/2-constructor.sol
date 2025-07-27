// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

abstract contract Base {
    
    constructor(string storage  _name) {}

}

contract ContractA is Base {
    string name;

    constructor() Base(name) {}

}
