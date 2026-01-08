// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract Ledger {

    mapping (address => uint256) private balances;

    event NewDeposit(address user, uint256 amount);

    function deposit(uint256 depositAmount) external  {
        address userAddress = msg.sender;
        balances[userAddress] += depositAmount;
        emit NewDeposit(userAddress, depositAmount);
    }

    function getBalance() external view returns (uint256) {
        address user = msg.sender;
        return balances[user];
    }
}