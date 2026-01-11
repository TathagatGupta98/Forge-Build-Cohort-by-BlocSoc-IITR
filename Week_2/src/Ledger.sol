// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract Ledger {

    mapping (address => uint256) private balances;

    event NewDeposit(address user, uint256 amount);

    function deposit(uint256 depositAmount) public payable{

        address userAddress = msg.sender;

        (bool success, ) = userAddress.call{value: depositAmount}("");
        require(success, "Transfer failed.");

        balances[userAddress] += depositAmount;

        emit NewDeposit(userAddress, depositAmount);
    }

    function withdraw() public {
        
        address userAddress = msg.sender;
        require(balances[userAddress] > 0, "Insufficient balance to withdraw.");

        (bool success, ) = userAddress.call{value: balances[userAddress]}("");
        require(success, "Transfer failed.");
    }

    function getBalance() external view returns (uint256) {
        address user = msg.sender;
        return balances[user];
    }
}