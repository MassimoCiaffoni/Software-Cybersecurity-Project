// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;


import "./Event.sol";

contract Ticket {
    
    address private owner= msg.sender;
    uint256 private balance=owner.balance;
    Event e= new Event(event_address);
    
    function get_balance() public view returns (uint256){
        return balance;
    }
 
    
    
    
}