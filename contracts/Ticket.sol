// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;


import "./Event.sol";

contract Ticket {
    
    address private owner= msg.sender;
    uint256 private balance=owner.balance;
    address public eventAddress;
    string private name;
    string private surname;
    
    
    constructor(address _eventAddress) public {
        eventAddress = _eventAddress;
    }
    
    function get_balance() public view returns (uint256){
        return balance;
    }
    
    function buy_ticket(uint eventid, address payable indirizzo, string memory nome, string memory cognome) public returns(string memory){
        Event ev= Event(eventAddress);
         return ev.buy_ticket(eventid, indirizzo, nome, cognome);
    }
    
 
    
    
    
}