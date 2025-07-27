// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract ZombieFactory {

     // 这里建立事件
    event NewZombie(uint zombieId, string name, uint dna);


    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;

    struct Zombie {
        string name;
        uint dna;
    }

    Zombie[] public zombies;

    mapping (uint => address) public zombieToOwner;
    mapping (address => uint) ownerZombieCount;

    function _createZombie(string memory _name, uint _dna) public {
        zombies.push(Zombie(_name, _dna));
        uint id = zombies.length;
        zombieToOwner[id] = msg.sender;
        ownerZombieCount[msg.sender]++;
        emit NewZombie(id, _name, _dna);
    }

    function _generateRandomDna(string memory _str) public view returns (uint) {
        // 使用 keccak256 哈希函数生成随机数
        // 这里使用 abi.encode(_str) 来确保字符串被正确编码
        // 这将生成一个唯一的哈希值，基于传入的字符串
        // 例如，如果传入的字符串是 "zombie"，则生成的哈希
        // 可能是 0x5a6f6f640000000000000000000000000000000000000000000000000000012
        // 这将确保每个字符串生成的 DNA 都是唯一的
        // 例如，如果传入的字符串是 "zombie"，则生成的哈希
        // 可能是 0x    5a6f6f640000000000000000000000000000000000000000000000000012
        // 这将确保每个字符串生成的 DNA 都是唯一的
        // 例如，如果
        uint rand = uint(keccak256( abi.encode(_str)));
        // 计算随机数模数，确保生成的DNA在指定范围内
        // 例如，如果 dnaDigits 是 16，则 dnaModulus 是 10^16
        // 这将确保生成的 DNA 数字不会超过 16 位数
        // 这样可以避免生成过大的 DNA 数字，保持其在合理范围内
        // 例如，生成的 DNA 数字可以是 1234567890123456
        // 这样可以确保生成的 DNA 数字在 0 到 9999999999999999 之间
        // 这对于后续的 DNA 处理和比较是非常有用的
        // 例如，生成的 DNA 数字可以是 1234567890123456
        // 这样可以确保生成的 DNA 数字在 0 到 9999999999999999999 之间
        // 这对于后续的 DNA 处理和比较 is very useful
        // 例如，生成的 DNA 数字可以是 1234567890123456
        return rand % dnaModulus;
    }

      // 创建随机僵尸
    // 这个函数允许用户创建一个随机僵尸
    // 它接受一个字符串作为僵尸的名称，并生成一个随机 DNA
    // 通过调用 _generateRandomDna 函数来生成 DNA
    // 然后调用 _createZombie 函数来创建僵尸
    // 这个函数确保每个用户只能创建一个僵尸
    // 通过检查 ownerZombieCount[msg.sender] 是否为 0 来实现
    // 如果用户已经创建了一个僵尸，则会抛出异常
      function createRandomZombie(string memory _name) public {
        require(ownerZombieCount[msg.sender] == 0);
        uint randDna = _generateRandomDna(_name);
        _createZombie(_name, randDna);
    }

}
