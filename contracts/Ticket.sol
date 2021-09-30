// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;


import "./Event.sol";

contract Ticket {
    
    
    struct TicketData{
        uint TicketId;
        bool validated;
    }
    
    TicketData[] private tickets;
    
    function buy_ticket(uint event_id) public payable {
        EventData evento=get_event(event_id);
        require(evento.state=="Annullato" , "L'evento è stato Annullato");
        require(evento.state=="Concluso" , "L'evento è già concluso");
        require(evento.remaining_tickets > 0, "Nessun biglietto disponibile");
    }
}