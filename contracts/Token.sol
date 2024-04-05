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
    
    //owner address => spender address 
    mapping(address => mapping(address => uint256) ) public allowance;
    // Transfer Event per the ERC20 standard
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value
    );

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    constructor(string memory _name, 
                string memory _symbol, 
                uint256 _totalSupply){
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply * (10**decimals);
        balanceOf[msg.sender] = totalSupply; 
    }

    //Transfering funds. Returns a boolean.
    function transfer(address _to, uint256 _value) 
    public 
    returns (bool success){
        // Require that sender has enough tokens to spend
        require(balanceOf[msg.sender] >= _value);
        require(_to != address(0));
        // Deduct tokens from spender
        balanceOf[msg.sender] -= _value;  
        // Credit tokens to reciever
        balanceOf[_to] += _value;

        // Emit event 
        emit Transfer(msg.sender, _to, _value);
        
        return true;  
    }


    function approve(address _spender, uint256 _value) 
    public returns (bool success){
        // To.be.reverted function must require this
        require(_spender != address(0));
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }



}

