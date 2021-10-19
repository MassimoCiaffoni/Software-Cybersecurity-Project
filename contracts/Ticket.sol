// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;


import "./Event.sol";

contract Ticket {
    
    address private owner;
    uint256 private balance=owner.balance;
    address public eventAddress;
    string private name;
    string private surname;
    
    
    constructor(address _eventAddress) {
        eventAddress = _eventAddress;
        owner=msg.sender;
    }
    
    function get_balance() public view returns (uint256){
        return balance;
    }
    
    function get_address() public view returns(address){
        return owner;
    }
    
    function buy_ticket(uint eventid, string memory nome, string memory cognome) public returns(string memory, bool){
        Event ev= Event(eventAddress);
        return ev.buy_ticket(eventid, payable(owner), nome, cognome);
    }
    
 
    
    
    
}