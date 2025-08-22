### Solidity 存储布局的冲突

#### 前言
在区块链智能合约开发领域，Solidity 作为以太坊智能合约的主要编程语言，其数据存储方法和代理合约的使用是关键技术点。深入理解 Solidity 的存储布局以及代理合约的潜在问题，对于开发安全、稳定且可升级的智能合约至关重要。本文将深入剖析以太坊虚拟机（EVM）的存储模型，探讨不同版本智能合约之间存储布局可能产生的冲突，并提供相应的最佳实践和解决方案。

#### 一、Delegatecall 和 Solidity 存储布局的冲突

#### 1. EVM 存储模型与 Solidity 应用
在以太坊的世界里，智能合约的存储以一种独特的方式呈现，它是一个从 `uint256` 到 `uint256` 的映射。其中，`uint256` 值的宽度为 32 字节，在以太坊的语境中，这个固定大小的值被称作“槽位”。这种存储模型类似于虚拟随机存取存储器，但又有显著区别：其地址宽度达到 256 位，不同于标准计算机的 32 位或 64 位；每个值的大小是 32 字节，而非 1 字节。

这种 256 位宽的地址设计为 Solidity 带来了一个巧妙的技巧：任何 256 位的哈希都可以作为地址使用。这一特性在后续的合约开发中具有重要意义，不过其有效性的深入探讨不在本文范围之内。

在标准计算机程序执行时，为了避免不同变量和数据结构相互“冲突”、损坏彼此的数据，通常会借助内存分配器来管理 RAM。分配器具备一系列 API，如 `malloc`、`free`、`new`、`delete` 等函数，并且会以“紧凑”的方式存储数据，减少地址空间的浪费。然而，Solidity 并没有这样的存储分配器，它采用了不同的方式来处理存储任务。

智能合约的值从槽位 0 开始依次存储在槽位中。基本的固定大小值类型会占用一个槽位，而且在某些情况下，它们可以被打包到同一个槽位中，并在需要时动态解包。对于数组的存储，Solidity 会将数组元素的计数记录到下一个槽位（即“头槽”），而数组元素本身则位于通过对数组头槽编号进行 `keccak256` 哈希计算得到的地址上。这与 C++ 和 Java 中动态数组的存储机制类似，数组数据结构存于独立的内存位置，由主结构进行引用。不同的是，Solidity 不会保留指向该位置的指针，因为在以太坊存储中，我们可以直接在任何位置写入数据，无需进行内存分配，且默认初始化为零值。

以下是一个简单的示例代码：
```Solidity
uint256 foo;
uint256 bar;
uint256[] items;

function allocate() public {
    require(0 == items.length);

    items.length = 2;
    items[0] = 12;
    items[1] = 42;
}
```
调用 `allocate()` 函数后，存储状态如下：
![__4](https://github.com/user-attachments/assets/133a4230-a36b-4686-a46e-ef48dc1fd00f)

我们可以通过执行以下 JavaScript 代码来检查数组元素的地址：
```bash
web3.sha3('0x00000000000000000000000000000000000000000000000000000000000000002', {encoding: 'hex'})
```

映射的存储机制与数组类似，不同之处在于每个值单独存放，且哈希计算会涉及相应的键。虽然可能会出现数据冲突，但这种冲突就像 256 字节哈希冲突一样，通常会被忽略。在合约继承方面，状态变量的顺序由从最基础合约开始的 C3 线性化顺序确定，这在当前情况下并没有增加额外的复杂性。

上述规则构成了“存储中的状态变量布局”（以下简称“存储布局”），详细信息可在 [这里](https://solidity.readthedocs.io/en/v0.5.4/miscellaneous.html#layout-of-state-variables-in-storage) 查看。由于修改这些规则会破坏向后兼容性，因此未来不太可能出现影响智能合约和库的相关更改。

#### 2. 代理合约存储布局冲突问题
在使用代理智能合约时，我们需要关注存储布局可能引发的问题。每个特定的代码版本都会将数据记录在代理的存储中，并且拥有自己的变量和存储布局。后续版本同样有其独立的存储布局，并且需要能够处理基于前一个存储布局形成的数据。这只是问题的一部分，还需要注意的是，代理代码本身也有存储布局，并且与当前获得控制权的智能合约版本并行运行。因此，代理代码的存储布局和当前智能合约版本的存储布局不能相互干扰，即不能为不同的数据使用相同的槽位。

为了解决这个问题，有两种常见的方法：
- **方法一**：不使用常规的 Solidity 存储布局机制来存储代理数据，而是利用 EVM 的 `sstore` 和 `sload` 指令，在伪随机数字槽位中读写数据。例如，通过 `keccak256(my.proxy.version)` 这样的哈希函数返回的槽位来存储数据，从而避免冲突。
- **方法二**：使用相同的存储布局，并结合高级的数据争议解决方法，具体可参考 [github](https://github.com/poanetwork/poa-bridge-contracts/blob/master/contracts/upgradeability/EternalStorage.sol) 中的示例。

#### 3. 实际案例分析
让我们通过一个实际案例来深入理解存储布局冲突的影响。我们对 [AkropolisToken 仓库](https://github.com/akropolisio/AkropolisToken/tree/3ad8eaa6f2849dceb125c8c614d5d61e90d465a2/contracts) 的 commit 3ad8eaa6f2849dceb125c8c614d5d61e90d465a2 进行了代币销售合约的安全审计。

在这个案例中，[TokenProxy](https://github.com/akropolisio/AkropolisToken/blob/3ad8eaa6f2849dceb125c8c614d5d61e90d465a2/contracts/token/TokenProxy.sol#L13) 和当前的 AkropolisToken 版本都有各自的状态变量（AkropolisToken 的状态变量位于 [basic contracts](https://github.com/akropolisio/AkropolisToken/blob/3ad8eaa6f2849dceb125c8c614d5d61e90d465a2/contracts/token/AkropolisToken.sol#L14)）。我们原本预计会出现冲突，但快速测试却推翻了这个猜想。例如，在调用 `pause` 函数后更改暂停标志（该标志存在于 AkropolisToken 中从 `Pausable` 继承而来），TokenProxy 的状态变量并未发生改变。TokenProxy 函数的调用也能正常执行，调用 TokenProxy 合约的 getter 函数是在按代币地址定义之后进行的。由于代理没有 `pause` 函数，所以它会通过调用基本 `UpgradeabilityProxy` 合约的默认函数来执行，而这个默认函数又会在包含 `pause` 函数的 AkropolisToken 中执行 `delegatecall`。

为了弄清楚为什么没有发生冲突，我们需要详细绘制 TokenProxy 和 AkropolisToken 的槽位图。这需要遵循上述的状态变量位置规则，找出基本合约的正确顺序，并考虑多个状态变量打包到一个槽位的可能性。我们可以在 [Remix](http://remix.ethereum.org/) 中测试结果，通过发送记录的交易、调试并跟踪存储变化来进行验证。

测试结果如下：
![__5](https://github.com/user-attachments/assets/3afeb720-a8ce-4f96-92bb-64f86c1f05ea)


从图中可以看到槽位 3 和 4 的情况。在 TokenProxy 合约中，槽位 3 用于存储 `pendingOwner` 变量，由于 `pendingOwner` 属于地址类型，仅占 20 字节宽，并未占用整个槽位。因此，布尔标志 `paused` 和 `locked` 可以被打包到该槽位，这就解释了 `paused` 和 `name` 标志之间没有冲突的原因。同时，槽位 4 作为白名单映射中的头槽未被使用，所以 `name` 和 `whitelist` 之间也没有冲突。

然而，这两个合约并非完全避免了冲突，我们在槽位 5 发现了问题。为了验证这一点，我们编写了以下测试代码：
[https://gist.github.com/Eenae/8e9affde78e2e15dfd6e75174eb2880a](https://gist.github.com/Eenae/8e9affde78e2e15dfd6e75174eb2880a)

测试在第 42 行失败，`decimals` 的值不再等于 18，尽管根据 TokenProxy 合约代码，这个值应该是不可更改的。

针对这个问题，最简单的解决方案是禁用槽位 5，这一操作在 [这个 commit](https://github.com/akropolisio/AkropolisToken/commit/79565a351c74d7fc668ef96927a68876521e37df#diff-0948e2549d2df649c826386a1effd1e1L19) 中已经实现。

#### 二、结论
在使用 `delegatecall` 等低级指令时，深入理解 Solidity 存储布局是必不可少的。本文回顾了 Solidity 存储布局的相关知识，通过实际案例展示了可能出现的问题，并提供了相应的解决方案。希望开发者们在编写智能合约时，能够充分考虑存储布局的影响，确保合约的安全性和稳定性。

#### 三、关于作者
[MixBytes](https://mixbytes.io/) 是一个专注于区块链审计和安全研究的专家团队，致力于为 EVM 兼容和基于 Substrate 的项目提供全面的智能合约审计和技术咨询服务。欢迎加入他们的 [X](https://twitter.com/MixBytes)，一同探索最新的行业趋势和见解。 
