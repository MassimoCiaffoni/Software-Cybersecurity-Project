// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;



contract Event {
    
    address private owner=msg.sender;
    
    address private reseller=0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    
    address private payment_system;
    
    
    struct EventData{ //event data structure
    
        uint id;
    
        string title;
        
        string luogo;
        
        string date;
        
        uint seats;
        
        uint remaining_tickets;
        
        uint256 price;
        
        string state;
        
        address owner;
    } 
    
    
    
    struct TicketData{ //ticket data structure
        
        string name;
        
        string surname;
        
        uint ticketid;
        
        uint eventid;
        
        bool sell;
        
        bool validate;
    }
    
    
    
    EventData[] private events; //all events
    TicketData[] private tickets; //all tickets
    
    modifier only_owner() {
        require(msg.sender == owner, "Non sei autorizzato ad eseguire questa azione");
        _;
    }
    
    modifier only_reseller(address res) {
        require(res == reseller, "Il reseller specificato e' errato");
        _;
    }
    
    modifier only_payment(address pay) {
        require(pay == payment_system, "Non sei autorizzato ad eseguire questa azione");
        _;
    }

    
    event EventCreated(uint indexed eventid, address indexed creator);
    event EventOverrlue(uint indexed eventid, address indexed creator);
    event EventFinished(uint indexed eventid, address indexed creator);
    event TicketsGenerated(uint indexed eventid, uint indexed totalticket, address indexed creator);
    
    
    function  create_event(string memory title, string memory  luogo, string memory  date, uint seats, uint256 price, address res) public only_owner {
        {
            events.push(EventData(0, title, luogo,  date, seats, seats, price, "Non concluso" , owner));
            uint id=get_event_length() - 1;
            events[id].id=id;
            emit EventCreated(id, owner);
            generate_tickets(id, seats, res);
        }
    }
    
    function overrlue_event(uint id) public only_owner {
            events[id].state="Annullato";
            emit EventOverrlue(id, owner);
    }
    
    function finish_event(uint id) public only_owner {
        events[id].state="Concluso";
        emit EventFinished(id, owner);
    }
    
     function get_events() public view returns (EventData[] memory){
         return events;
     } 


    
    function generate_tickets(uint eventid, uint totalticket , address res) internal only_reseller(res) {
        for(uint i=0; i < totalticket; i++){
            tickets.push(TicketData("", "", 0, eventid, false, false));
            uint ticketid=tickets.length - 1;
            tickets[i].ticketid=ticketid;
        }
        emit TicketsGenerated(eventid, totalticket , res);
    }
    
    function get_event_ticket(uint eventid) internal view returns (TicketData memory){
        TicketData memory biglietto;
        for(uint i=0; i < get_ticket_lenght(); i++){ 
            if(tickets[i].eventid==eventid && tickets[i].sell==false){
                biglietto=tickets[i];
                break;
            }
        }
        return biglietto;
    }
    
    function set_ticket_sold(uint ticketid) internal returns(bool){
        bool flag=false;
        for(uint i=0; i < get_ticket_lenght(); i++){
            if(tickets[i].ticketid==ticketid && tickets[i].sell==false){
                tickets[i].sell=true;
                flag=true;
            }
            
        }
        return flag;
        
    }
    
    
    function buy_ticket(uint eventid, address payable customer, string memory name, string memory surname) external payable returns(string memory){
        require(events[eventid].remaining_tickets > 0, "Non ci sono piu' biglietti dispponibili");
        require(keccak256(abi.encodePacked(events[eventid].state))==keccak256(abi.encodePacked("Non concluso")), "L'evento e' concluso o annullato");
        EventData memory evento= events[eventid];
        // evento.remaining_tickets - 1;
        require(customer.balance > evento.price, "Fondi non sufficenti");
            customer.transfer(address(this).balance);
            TicketData memory biglietto=get_event_ticket(eventid);
            set_ticket_sold(biglietto.ticketid);
            return "Biglietto acquistato";
        }
    /*function set_event_sold(uint ticketid) internal returns (bool){
        bool flag=false;
        for(uint i=0; i < get_ticket_lenght(); i++){
            if(tickets[i].ticketid==ticketid){
                tickets[i].sell=true;
                flag=true;
            }
        }
        return flag;
    } */
    
    
    function get_tickets() public only_owner view returns(TicketData[] memory){
        return tickets;
    }
    
    /*function delete_event_list(uint id) public only_owner {
        bool deletable=false;
        string memory an="Annullato";
        string memory cn="Concluso";
        for(uint i=0; i < get_event_length(); i++){
            if(keccak256(abi.encodePacked(events[i]))==keccak256(abi.encodePacked(an)))
                deletable=true;
        }
        
        if(deletable)
            delete events;
    } */
  
     
     function get_event(uint id) public view returns(EventData memory evento){
         require(id < get_event_length(), "L'evento non esiste");
         for(uint i=0; i < get_event_length(); i++){
             if(events[i].id==id)
                return events[i];
         }
     }
     
     function get_event_length() internal view returns (uint){
         return events.length;
     }
     
     function get_ticket_lenght() public view returns (uint){
         return tickets.length;
     }
     
     function set_reseller(address r) only_owner public{
         reseller=r;
     }

    
}  