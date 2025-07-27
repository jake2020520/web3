
pragma solidity >=0.7.0 <0.9.0;

library TransferOperation {
   
    function transfer(
     	address from, 
        address to, 
        uint amount, 
        mapping (address => uint) storage balanceOf
    ) public {
        
        uint current = balanceOf[from];
        if(current <= amount)
            revert("not enough balance!");
        uint toc = balanceOf[to];
        
        current -= amount;
        toc += amount; 
        balanceOf[from] = current;
        balanceOf[to] = toc;

    }
}

contract BalanceManager{
    mapping (address => uint)  balanceOf;
    function transfer(address to, uint amount) external{
        TransferOperation.transfer(msg.sender, to, amount, balanceOf);
    }

}