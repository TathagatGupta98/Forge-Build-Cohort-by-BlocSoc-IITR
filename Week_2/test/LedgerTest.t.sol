// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {Ledger} from "../src/Ledger.sol";

contract LedgerTest is Test {
    Ledger public ledger;
    address public User = makeAddr("user");

    event NewDeposit(address user, uint256 amount);

    function setUp() public {
        ledger = new Ledger();
    }

    function testDeposit(uint256 depositAmount) public {
        uint256 oldBalance = ledger.getBalance();

        vm.startPrank(User);
        vm.deal(User, 10 ether);

        vm.expectEmit(false, false, false, true);
        emit NewDeposit(User, depositAmount);

        ledger.deposit(depositAmount);

        assertEq(ledger.getBalance(), oldBalance + depositAmount);
        vm.stopPrank();
    }
}