// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract Ledger {

    mapping (address => uint256) private balances;

    event NewDeposit(address user, uint256 amount);
    event Withdrawal(address user, uint256 amount);

    function deposit() public payable {
        address userAddress = msg.sender;
        uint256 depositAmount = msg.value;
        
        require(depositAmount > 0, "Deposit amount must be greater than zero.");

        balances[userAddress] += depositAmount;

        emit NewDeposit(userAddress, depositAmount);
    }

    function withdraw() public {
        address userAddress = msg.sender;
        uint256 amountToWithdraw = balances[userAddress];

        require(amountToWithdraw > 0, "Insufficient balance to withdraw.");

        balances[userAddress] = 0; 

        (bool success, ) = userAddress.call{value: amountToWithdraw}("");
        require(success, "Transfer failed.");
        
        emit Withdrawal(userAddress, amountToWithdraw);
    }

    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }
}