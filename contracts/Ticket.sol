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

    event TicketBought(uint indexed eventid, uint indexed ticketid, address indexed customer, string name, string surname );
    event TicketValidated(uint indexed ticketid, address indexed validator);
    
    
    constructor(address _eventAddress) {
        eventAddress = _eventAddress;
        owner=msg.sender;
    }

    
    function get_address() public view returns(address){
        return owner;
    }

    
    function buy_ticket(uint eventid, string memory nome, string memory cognome) public returns(uint){
        Event ev= Event(eventAddress);
        bool control=ev.check_ticket(eventid);
        require(control==true, "Biglietti finiti o evento concluso");
        address customer=msg.sender;
        uint biglietto=ev.buy_ticket( customer,eventid, nome, cognome);
        emit TicketBought(eventid, biglietto,customer, nome, cognome);  
        return biglietto;
    }

    function validate_ticket(uint ticketid) public only_owner returns(bool) {
        Event ev= Event(eventAddress);
        bool flag= ev.validate_ticket(ticketid, msg.sender);
        emit TicketValidated(ticketid, msg.sender);
        return flag;
    }


    
 
    
    
    
}