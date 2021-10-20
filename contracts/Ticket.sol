// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;


import "./Event.sol";

contract Ticket {
    
    address private owner;
    uint balance=owner.balance;
    address public eventAddress;
    string private name;
    string private surname;

    modifier only_event_contract() {
        require(msg.sender == eventAddress, "Errore");
        _;
    }
    
    
    constructor(address _eventAddress) {
        eventAddress = _eventAddress;
        owner=msg.sender;
    }

    
    function get_address() public view returns(address){
        return owner;
    }

    
    function buy_ticket(uint eventid, string memory nome, string memory cognome) public returns(string memory, bool, address){
        Event ev= Event(eventAddress);
        bool control=ev.check_ticket(eventid);
        if(!control)
            return ("Biglietti non disponibili o evento concluso",false, msg.sender);
        return ev.buy_ticket(eventid, nome, cognome, msg.sender);     
    }

    function validate_ticket(uint ticketid) public returns(string memory) {
        Event ev= Event(eventAddress);
        return ev.validate_ticket(ticketid, msg.sender);
    }


    
 
    
    
    
}