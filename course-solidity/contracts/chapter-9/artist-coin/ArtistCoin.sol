// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./dividend/DividendPayingTokenInterface.sol";
import "./dividend/DividendPayingTokenOptionalInterface.sol";

contract ArtistCoin is
    ERC20,
    Ownable,
    ReentrancyGuard,
    DividendPayingTokenInterface,
    DividendPayingTokenOptionalInterface
{
    uint256 public constant MAX_SUPPLY = 100 ether;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    // With `magnitude`, we can properly distribute dividends even if the amount of received ether is small.
    // For more discussion about choosing the value of `magnitude`,
    uint256 internal constant magnitude = 2**128;

    uint256 internal magnifiedDividendPerShare;

    uint256 public ownerWithdrawable;

    /// @notice If locked is true, users are not allowed to withdraw funds
    bool public locked;

    // About dividendCorrection:
    // If the token balance of a `_user` is never changed, the dividend of `_user` can be computed with:
    //   `dividendOf(_user) = dividendPerShare * balanceOf(_user)`.
    // When `balanceOf(_user)` is changed (via minting/burning/transferring tokens),
    //   `dividendOf(_user)` should not be changed,
    //   but the computed value of `dividendPerShare * balanceOf(_user)` is changed.
    // To keep the `dividendOf(_user)` unchanged, we add a correction term:
    //   `dividendOf(_user) = dividendPerShare * balanceOf(_user) + dividendCorrectionOf(_user)`,
    //   where `dividendCorrectionOf(_user)` is updated whenever `balanceOf(_user)` is changed:
    //   `dividendCorrectionOf(_user) = dividendPerShare * (old balanceOf(_user)) - (new balanceOf(_user))`.
    // So now `dividendOf(_user)` returns the same value before and after `balanceOf(_user)` is changed.
    mapping(address => int256) internal magnifiedDividendCorrections;
    mapping(address => uint256) internal withdrawnDividends;
    modifier mintable(uint256 amount) {
        require(
            amount + totalSupply() <= MAX_SUPPLY,
            "amount surpasses max supply"
        );
        _;
    }
    modifier isUnlocked() {
        require(!locked, "contract is currently locked");
        _;
    }

    /// @dev Distributes dividends whenever ether is paid to this contract.
    receive() external payable {
        distributeDividends();
    }

    function mint(address to_)
        public
        payable
        mintable(msg.value)
    {
        ownerWithdrawable += msg.value;
        _mint(to_, msg.value);
    }
    function collect()
    public
    onlyOwner
    nonReentrant
    {
        require(ownerWithdrawable > 0);
        uint _with = ownerWithdrawable;
        ownerWithdrawable = 0;
        payable(msg.sender).transfer(_with);
    }

    function toggleLock() external onlyOwner {
        locked = !locked;
    }

    /// @notice Distributes ether to token holders as dividends.
    /// @dev It reverts if the total supply of tokens is 0.
    /// It emits the `DividendsDistributed` event if the amount of received ether is greater than 0.
    /// About undistributed ether:
    ///   In each distribution, there is a small amount of ether not distributed,
    ///     the magnified amount of which is
    ///     `(msg.value * magnitude) % totalSupply()`.
    ///   With a well-chosen `magnitude`, the amount of undistributed ether
    ///     (de-magnified) in a distribution can be less than 1 wei.
    ///   We can actually keep track of the undistributed ether in a distribution
    ///     and try to distribute it in the next distribution,
    ///     but keeping track of such data on-chain costs much more than
    ///     the saved ether, so we don't do that.
    function distributeDividends() public payable {
        require(totalSupply() > 0);

        if (msg.value > 0) {
            magnifiedDividendPerShare +=
                (msg.value * magnitude) /
                totalSupply();
            emit DividendsDistributed(msg.sender, msg.value);
        }
    }

    /// @notice Withdraws the ether distributed to the sender.
    /// @dev It emits a `DividendWithdrawn` event if the amount of withdrawn ether is greater than 0.
    function withdrawDividend() public nonReentrant isUnlocked {
        uint256 _withdrawableDividend = withdrawableDividendOf(msg.sender);
        if (_withdrawableDividend > 0) {
            withdrawnDividends[msg.sender] += _withdrawableDividend;
            emit DividendWithdrawn(msg.sender, _withdrawableDividend);
            (payable(msg.sender)).transfer(_withdrawableDividend);
        }
    }

    /// @notice View the amount of dividend in wei that an address can withdraw.
    /// @param _owner The address of a token holder.
    /// @return The amount of dividend in wei that `_owner` can withdraw.
    function dividendOf(address _owner) public view returns (uint256) {
        return withdrawableDividendOf(_owner);
    }

    /// @notice View the amount of dividend in wei that an address can withdraw.
    /// @param _owner The address of a token holder.
    /// @return The amount of dividend in wei that `_owner` can withdraw.
    function withdrawableDividendOf(address _owner)
        public
        view
        returns (uint256)
    {
        return accumulativeDividendOf(_owner) - (withdrawnDividends[_owner]);
    }

    /// @notice View the amount of dividend in wei that an address has withdrawn.
    /// @param _owner The address of a token holder.
    /// @return The amount of dividend in wei that `_owner` has withdrawn.
    function withdrawnDividendOf(address _owner) public view returns (uint256) {
        return withdrawnDividends[_owner];
    }

    /// @notice View the amount of dividend in wei that an address has earned in total.
    /// @dev accumulativeDividendOf(_owner) = withdrawableDividendOf(_owner) + withdrawnDividendOf(_owner)
    /// = (magnifiedDividendPerShare * balanceOf(_owner) + magnifiedDividendCorrections[_owner]) / magnitude
    /// @param _owner The address of a token holder.
    /// @return The amount of dividend in wei that `_owner` has earned in total.
    function accumulativeDividendOf(address _owner)
        public
        view
        returns (uint256)
    {
        int256 x = int256(magnifiedDividendPerShare * balanceOf(_owner));

        x += magnifiedDividendCorrections[_owner];
        return uint256(x) / magnitude;
    }

    /// @dev Internal function that transfer tokens from one address to another.
    /// Update magnifiedDividendCorrections to keep dividends unchanged.
    /// @param from The address to transfer from.
    /// @param to The address to transfer to.
    /// @param value The amount to be transferred.
    function _transfer(
        address from,
        address to,
        uint256 value
    ) internal override {
        super._transfer(from, to, value);

        int256 _magCorrection = int256(magnifiedDividendPerShare * (value));

        magnifiedDividendCorrections[from] += _magCorrection;
        magnifiedDividendCorrections[to] -= _magCorrection;
    }

    /// @dev Internal function that mints tokens to an account.
    /// Update magnifiedDividendCorrections to keep dividends unchanged.
    /// @param account The account that will receive the created tokens.
    /// @param value The amount that will be created.
    function _mint(address account, uint256 value) internal override {
        super._mint(account, value);

        magnifiedDividendCorrections[account] -= int256(
            magnifiedDividendPerShare * value
        );
    }

    /// @dev Internal function that burns an amount of the token of a given account.
    /// Update magnifiedDividendCorrections to keep dividends unchanged.
    /// @param account The account whose tokens will be burnt.
    /// @param value The amount that will be burnt.
    function _burn(address account, uint256 value) internal override {
        super._burn(account, value);

        magnifiedDividendCorrections[account] += int256(
            magnifiedDividendPerShare * value
        );
    }
}
