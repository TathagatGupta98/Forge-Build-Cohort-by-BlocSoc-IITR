// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {SimpleStorage} from "./SimpleStorage.sol";
import {console} from "../../lib/openzeppelin-contracts/lib/forge-std/src/console.sol";
import {Test} from "../../lib/openzeppelin-contracts/lib/forge-std/src/Test.sol";

contract SimpleStorageTest is Test {
    SimpleStorage public simpleStorage;
    address public User = makeAddr("user");

    function setUp() public {
        simpleStorage = new SimpleStorage();
    }

    function testSet() public {
        vm.startPrank(User);
        vm.deal(User, 100 ether);

        simpleStorage.set(42);
        assertEq(simpleStorage.get(), 42);

        vm.stopPrank();
    }

    function testInitialValueIsZero() public {
        assertEq(simpleStorage.get(), 0);
    }
}
