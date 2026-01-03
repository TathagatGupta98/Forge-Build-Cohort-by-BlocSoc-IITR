// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SimpleStorage {

    uint256 userNumber;

    function set(uint256 _value) public {
        userNumber = _value;
    }

    function get() public view returns (uint256){
        return userNumber;
    }
}