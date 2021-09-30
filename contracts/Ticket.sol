// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;


import "./Event.sol";

contract Ticket {
    
    
    struct TicketData{
        uint TicketId;
        bool validated;
    }
    
    TicketData[] private tickets;
    
    function buy_ticket(uint eventid) public payable {
        require(events[].stato=="Non concluso", "L'evento è già concluso")
        require(events[eventid].remaining_tickets > 0, "Nessun biglietto disponibile");
    }
}