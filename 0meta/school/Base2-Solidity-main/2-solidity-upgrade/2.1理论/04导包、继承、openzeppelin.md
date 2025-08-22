

## 1. `import` 导包方式

在 Solidity 中，`import` 用于引入其他合约或库文件，以便在当前合约中使用它们的功能。`import` 语句可以用于引入本地文件或远程文件。

### 语法
```solidity
// 引入本地文件
import "./MyContract.sol";

// 引入远程文件
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

// 引入整个目录
import "./utils/*";

// 引入并重命名
import { MyContract as MC } from "./MyContract.sol";
```

### 示例
```solidity
// 引入 OpenZeppelin 的 ERC20 合约
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {}
}
```

---

## 2. 继承

Solidity 支持合约之间的继承，允许一个合约继承另一个合约的功能。继承可以复用代码，并且可以通过 `override` 关键字来重写父合约的函数。

### 语法
```solidity
contract Parent {
    function foo() public virtual returns (string memory) {
        return "Parent";
    }
}

contract Child is Parent {
    function foo() public virtual override returns (string memory) {
        return "Child";
    }
}
```

### 示例
```solidity
// 父合约
contract Ownable {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
}

// 子合约
contract MyContract is Ownable {
    function changeOwner(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}
```

---

## 3. OpenZeppelin

OpenZeppelin 是一个广泛使用的 Solidity 库，提供了许多经过审计的智能合约模板，如 ERC20、ERC721、Ownable 等。使用 OpenZeppelin 可以大大减少开发时间并提高合约的安全性。

### 安装 OpenZeppelin

后面学习 hardhat 会用到
```bash
npm install @openzeppelin/contracts
```

### 使用 OpenZeppelin 的 ERC20 合约
```solidity
// 引入 OpenZeppelin 的 ERC20 合约
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}
```

### 使用 OpenZeppelin 的 Ownable 合约
```solidity
// 引入 OpenZeppelin 的 Ownable 合约
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyContract is Ownable {
    function specialFunction() public onlyOwner {
        // 只有合约所有者可以调用此函数
    }
}
```

---

## 4. 综合示例

```solidity
// 引入 OpenZeppelin 的 ERC20 和 Ownable 合约
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

---

## 5. 总结

- `import` 用于引入其他合约或库文件，支持本地和远程文件。
- 继承允许一个合约复用另一个合约的功能，并可以通过 `override` 重写函数。
- OpenZeppelin 提供了许多经过审计的智能合约模板，可以大大提高开发效率和安全性。
