// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 * @custom:dev-run-script ./scripts/deploy_with_ethers.ts
 */
//0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8
//0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B
contract Storage {
    uint256 number;
    string message = "hello world";

    function getMessege() public view returns (string memory) {
        return message;
    }

    function setMessage(string memory msg) public {
        message = msg;
    }

    /**
     * @dev Store value in variable
     * @param num value to store
     */
    function store(uint256 num) public {
        number = num;
    }

    /**
     * @dev Return value
     * @return value of 'number'
     */
    function retrieve() public view returns (uint256) {
        return number;
    }
}
