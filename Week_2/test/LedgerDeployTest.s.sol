// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Test} from "forge-std/Test.sol";
import {LedgerDeploy} from "../script/LedgerDeploy.s.sol";

contract LedgerDeployTest is Test {
    LedgerDeploy public ledgerDeploy;

    function setUp() public {
        ledgerDeploy = new LedgerDeploy();
    }

    function testScriptRuns() public {
        ledgerDeploy.run();
    }

}
