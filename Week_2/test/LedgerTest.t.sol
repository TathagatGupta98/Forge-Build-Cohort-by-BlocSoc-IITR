// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test, console} from "forge-std/Test.sol";
import {Ledger} from "../src/Ledger.sol";

contract LedgerTest is Test {
    Ledger public ledger;
    address public user = makeAddr("user");

    event NewDeposit(address user, uint256 amount);
    event Withdrawal(address user, uint256 amount);

    function setUp() public {
        ledger = new Ledger();
    }

    function test_Deposit(uint256 depositAmount) public {
       
        vm.assume(depositAmount > 0);
        vm.assume(depositAmount < address(this).balance); 

        vm.deal(user, depositAmount);

        vm.startPrank(user);

        vm.expectEmit(false, false, false, true);
        emit NewDeposit(user, depositAmount);

        ledger.deposit{value: depositAmount}();

        assertEq(ledger.getBalance(), depositAmount, "Balance inside ledger should match deposit");
        
        vm.stopPrank();
    }

    function test_RevertWhen_DepositZero() public {
        vm.startPrank(user);

        vm.expectRevert("Deposit amount must be greater than zero.");
        ledger.deposit{value: 0}();
        
        vm.stopPrank();
    }

    function test_Withdraw(uint256 amount) public {
        vm.assume(amount > 0);
        vm.deal(user, amount);

        vm.startPrank(user);
        ledger.deposit{value: amount}();

        assertEq(ledger.getBalance(), amount);

        vm.expectEmit(false, false, false, true);
        emit Withdrawal(user, amount);

        ledger.withdraw();

        assertEq(ledger.getBalance(), 0, "Ledger balance should be zero after withdraw");
        assertEq(user.balance, amount, "User wallet should have received the ETH back");
        
        vm.stopPrank();
    }

    function test_RevertWhen_WithdrawZeroBalance() public {
        vm.startPrank(user);

        vm.expectRevert("Insufficient balance to withdraw.");
        ledger.withdraw();
        
        vm.stopPrank();
    }

    function test_GetBalanceReturnsCorrectUser() public {
        address user2 = makeAddr("user2");

        vm.deal(user, 1 ether);
        vm.prank(user);
        ledger.deposit{value: 1 ether}();

        vm.deal(user2, 5 ether);
        vm.prank(user2);
        ledger.deposit{value: 5 ether}();

        vm.prank(user);
        assertEq(ledger.getBalance(), 1 ether);

        vm.prank(user2);
        assertEq(ledger.getBalance(), 5 ether);
    }
}