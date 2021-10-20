// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;


import "./Event.sol";

contract Ticket {
    
    address private owner;
    uint balance=owner.balance;
    address public eventAddress;
    string private name;
    string private surname;

    modifier only_owner() {
        require(msg.sender == owner, "Errore");
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
        //require(msg.sender==0xca3Ede26eCCfBF9C34f33f90F2205B5f31b5b47C, "Prova");
        address customer=msg.sender;
        
        return ev.buy_ticket( customer,eventid, nome, cognome);     
    }

    function validate_ticket(uint ticketid) public only_owner returns(string memory,address) {
        Event ev= Event(eventAddress);
        return ev.validate_ticket(ticketid, msg.sender);
    }


    
 
    
    
    
}