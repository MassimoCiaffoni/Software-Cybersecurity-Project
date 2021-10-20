// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;



contract Event {
    
    address private owner=msg.sender;
    
    address public reseller;
    
    address private validator;
    
    
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
    
    modifier only_validator(address val) {
        require(val == validator, "Non sei il validator");
        _;
    }

    
    event EventCreated(uint indexed eventid, address indexed creator);
    event EventOverrlue(uint indexed eventid, address indexed creator);
    event EventFinished(uint indexed eventid, address indexed creator);
    event TicketsGenerated(uint indexed eventid, uint indexed totalticket, address indexed creator);
    event TicketSold(uint indexed eventid, uint ticketid, address indexed customer);
    
    
    function  create_event(string memory title, string memory  luogo, string memory  date, uint seats, uint256 price, address res) public only_owner returns(uint) {
        {
            events.push(EventData(0, title, luogo,  date, seats, seats, price, "Non concluso" , owner));
            uint id=get_event_length() - 1;
            events[id].id=id;
            emit EventCreated(id, owner);
            generate_tickets(id, seats, res);
            return id;
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


    
    function generate_tickets(uint eventid, uint totalticket , address res) internal only_reseller(res) returns(uint){
        uint ticketid=0;
        uint array_len=get_ticket_lenght()+totalticket;
        for(uint i=get_ticket_lenght(); i < array_len  ; i++){
            tickets.push(TicketData("", "", 0, eventid, false, false));
            ticketid=get_ticket_lenght() - 1;
            tickets[i].ticketid=ticketid;
        }
        emit TicketsGenerated(eventid, totalticket , res);
        return totalticket;
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
    
    function set_ticket_sold(uint ticketid, string memory name, string memory surname) internal returns(bool){
        bool flag=false;
        for(uint i=0; i < get_ticket_lenght(); i++){
            if(tickets[i].ticketid==ticketid && tickets[i].sell==false){
                tickets[i].sell=true;
                tickets[i].name=name;
                tickets[i].surname=surname;
                flag=true;
            }
            
        }
        return flag;
        
    }
    
    function check_ticket(uint eventid) external view returns(bool){
        EventData memory evento= get_event(eventid);
        if(evento.remaining_tickets == 0)
            return false;
        else if(keccak256(abi.encodePacked(evento.state))==keccak256(abi.encodePacked("Concluso")) || keccak256(abi.encodePacked(evento.state))==keccak256(abi.encodePacked("Annullato")) )
            return false;
        else 
            return true;
    }
    
    function buy_ticket(uint eventid, string memory name, string memory surname, address customer) external returns(string memory, bool, address){
        TicketData memory biglietto=get_event_ticket(eventid);
        set_ticket_sold(biglietto.ticketid, name, surname);
        reduce_remaining_tickets(eventid);
        emit TicketSold(eventid, biglietto.ticketid, customer);
        return ("Biglietto acquistato", true , customer);      
    }
    
    function reduce_remaining_tickets(uint eventid) internal{
        events[eventid].remaining_tickets --;
    }


    function validate_ticket(uint ticketid, address val) external only_validator(val)returns(string memory){
        bool flag=false;
        for(uint i=0; i < get_ticket_lenght(); i++){
            if(tickets[i].ticketid==ticketid && tickets[i].validate==false && tickets[i].sell==true){
                tickets[i].validate=true;
                flag=true;
            }
        }
        if(flag)
            return("Biglietto valido");
        else
            return("Biglitto gia' validato o non validabile");

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

    

    function get_event_price(uint eventid) public view returns(uint) {
        return events[eventid].price;
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
     
     function get_ticket_lenght() internal view returns (uint){
         return tickets.length;
     }
     
     function set_reseller(address r) only_owner public returns(string memory, address){
         reseller=r;
         return("Reseller impostato", reseller);
     }

     function set_validator(address v) only_owner public returns(string memory, address){
         validator=v;
         return("Validator impostato", validator);
     }
     
     function get_balance() public view returns (uint256){
        return owner.balance;
    }

    function get_address() public view returns(address){
        return owner;
    }

    
}  