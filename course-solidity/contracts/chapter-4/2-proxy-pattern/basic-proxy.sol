// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract LogicV1{
    address public placeholder;
    uint256 public count;

    function inc() external {
        count += 1;
    }
 
    
}
contract LogicV2{
    address public placeholder;
    uint256 public count;

    function inc() external {
        count += 2;
    }
 
    
}
interface LogicInterce{
    function inc() external;
}

contract Proxy {
    address public logic;
    uint256 public count;
    constructor(address _logic){
        logic = _logic;
    }

    fallback() external {
        (bool ok, bytes memory res) = logic.delegatecall(msg.data);
        require(ok, "delegatecall failed");
    }
    function upgradeTo(address newVersion)external{
        logic = newVersion;
    }


}
