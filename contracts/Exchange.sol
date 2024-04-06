// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Token.sol";
contract Exchange{
    
    address public feeAccount; //Account that receives the fees
    uint256 public feePercent; 
    // User address => (token address => how many tokens they deposited)
    mapping(address => mapping(address => uint256)) public tokens;
    
    // Orders mapping
    // id -> order struct
    mapping(uint256 => _Order) public orders; 
    uint256 public orderCount;  

    event Deposit(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );
    event Withdraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );
    event Order(
        uint256 id,         
        address user,       
        address tokenGet,   
        uint256 amountGet,  
        address tokenGive,  
        uint256 amountGive, 
        uint256 timestamp 
    );
    // A way to model the order
    struct _Order{
        // Attributes of an order
        uint256 id;         // Unique identifier for order
        address user;       // User who made order 
        address tokenGet;   // Address of token they receive
        uint256 amountGet;  // Amount they receive
        address tokenGive;  // Address of token they give
        uint256 amountGive; // Amount they give
        uint256 timestamp;  // When order was created 

    }

    constructor(address _feeAccount, uint256 _feePercent){
        feeAccount = _feeAccount;
        feePercent = _feePercent;

    }
    // -------------------------------
    // DEPOSIT & WITHDRAW TOKEN

    // Deposit Tokens
    function depositToken(address _token, uint256 _amount) public{
        // Transfer tokens to exchange
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        // Update user balance
        tokens[_token][msg.sender] += _amount;
        // Emit an event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);

    }

    // Withdraw tokens
    function withdrawToken(address _token, uint256 _amount) public {
        // Ensure user has enough tokens to withdraw
        require(tokens[_token][msg.sender] >= _amount);

        // Transfer tokens to user 
        Token(_token).transfer(msg.sender, _amount); 
        
        // Update user balance
        tokens[_token][msg.sender] -= _amount;
        
        // Emit event
        emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);

    }


    // Check Balances
    function balanceOf(address _token, address _user) 
    public view returns(uint256){
        return tokens[_token][_user];
    }


    // ------------------------------
    // MAKE & CANCEL ORDERS

 
    function makeOrder(
        address _tokenGet, 
        uint256 _amountGet, 
        address _tokenGive, 
        uint256 _amountGive) 
        public{
    
    // Prevent orders if person giving order has less than the amount given
    require(balanceOf(_tokenGive, msg.sender) >= _amountGive);

    orderCount += 1; 

    // CREATE ORDER
    orders[orderCount] = _Order(
        orderCount,  // id 
        msg.sender, // User
        _tokenGet,  // tokenGet
        _amountGet, // amountGet
        _tokenGive, // tokenGive
        _amountGive, // AmountGive
        block.timestamp  //timestamp in Epoch. aka it measures in seconds
        );

    // Emit event
    emit Order(
        orderCount, 
        msg.sender, 
        _tokenGet, 
        _amountGet, 
        _tokenGive,
        _amountGive, 
        block.timestamp);
    }


}