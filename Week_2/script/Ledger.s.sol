// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script} from "forge-std/Script.sol";
import {Ledger} from "../src/Ledger.sol";

contract LedgerDeploy is Script{
    function run() external {
        vm.startBroadcast();
        new Ledger();
        vm.stopBroadcast();
    }
} 