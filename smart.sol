// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0; 

contract bank {
// mapping to store the balance of each address
    mapping(address => uint) public balance;
// event to log deposit
    event deposit(address indexed account, uint amount);
// event to log withdrawals
    event withdrawal(address indexed account, uint amount);
// event to log transfer
    event transfer(address indexed from, address indexed to, uint amount);
// function to add funds
    function Deposit() public payable {
        require(msg.value > 0, "Deposit should be greater than 0");
        balance[msg.sender] += msg.value;
        emit deposit(msg.sender, msg.value);
    }
// function to withdraw funds
    function Withdrawal(uint _amount) public{
        require(_amount > 0, "Withdrawal must be grater than 0");
        require(balance[msg.sender] >= _amount, "Insufficient balance");

        uint  initialbalance = balance[msg.sender];
        balance[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
        assert(balance[msg.sender] == initialbalance - _amount);

        emit withdrawal(msg.sender, _amount);
    }
// function to transfer funds
    function Transfer(address _to, uint _amount) public{
        require(_to != address(0), "Invalid Address");
        require(_amount > 0, "Transfer amount must be greater than 0");
        require(balance[msg.sender] >= _amount, "Insufficient balance");

        balance[msg.sender] -= _amount;
        balance[_to] += _amount;
        // condition for no overflow
        assert(balance[_to] >= _amount);

        emit transfer(msg.sender, _to, _amount);
    }
// function to demonstrate revert
    function Refund() pure public{
        revert("Refund is not supported.");
    }
}
