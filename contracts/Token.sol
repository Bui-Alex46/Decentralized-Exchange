// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token{
    
    string public name;
    string public symbol = "ALT"; 
    uint256 public decimals = 18;   // Decimals
    //How many coins in existence
    // Converting it to Wei
    uint256 public totalSupply;   // 1,000,000 x 10^18;
    
    // Track balances
    mapping(address => uint256) public balanceOf;   //datatype -> value
    // Send Tokens

    constructor(string memory _name, 
                string memory _symbol, 
                uint256 _totalSupply){
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimals);
        balanceOf[msg.sender] = totalSupply; 
    }
}

