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

        address customer;
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
    event WithDraw(address indexed creator);
    
    
    function  create_event(string memory title, string memory  luogo, string memory  date, uint seats, uint256 price, address res, address val) public only_owner returns(uint) {
        {
            events.push(EventData(0, title, luogo,  date, seats, seats, price, "Non concluso" , owner));
            uint id=get_event_length() - 1;
            events[id].id=id;
            emit EventCreated(id, owner);
            reseller=res;
            validator=val;
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
            tickets.push(TicketData("", "", 0, eventid, false, false, 0x0000000000000000000000000000000000000000));
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
    
    function set_ticket_sold(uint ticketid, string memory name, string memory surname, address customer) internal returns(bool){
        bool flag=false;
        for(uint i=0; i < get_ticket_lenght(); i++){
            if(tickets[i].ticketid==ticketid && tickets[i].sell==false){
                tickets[i].sell=true;
                tickets[i].name=name;
                tickets[i].surname=surname;
                tickets[i].customer=customer;
                flag=true;
            }
            
        }
        require(flag==true, "Errore nella fase di acquisto");
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
    
    function buy_ticket( address payable customer, uint eventid, string memory name, string memory surname) external payable returns(uint){
        uint price=get_event_price(eventid);
        require(msg.value==price, "Fondi non sufficenti");
        TicketData memory biglietto=get_event_ticket(eventid);
        set_ticket_sold(biglietto.ticketid, name, surname, customer);
        reduce_remaining_tickets(eventid);
        emit TicketSold(eventid, biglietto.ticketid, customer);
        return  biglietto.ticketid;      
    }

    function withdraw() public only_owner {
        address payable indirizzo= payable(msg.sender);
        indirizzo.transfer(getBalance());
        emit WithDraw(indirizzo);
    }
    
    function reduce_remaining_tickets(uint eventid) internal{
        events[eventid].remaining_tickets --;
    }


    function get_ticket_to_validate(address val) public view only_validator(val) returns(TicketData[] memory){
        uint j=0;
        for(uint i=0; i < get_ticket_lenght(); i++){ 
            if(tickets[i].sell==true){
                j++;
            }
        }
        TicketData[] memory biglietti=new TicketData[](j);
        uint l=0;
        for(uint i=0; i < get_ticket_lenght(); i++){ 
            if(tickets[i].sell==true){
                biglietti[l]=TicketData(tickets[i].name,tickets[i].surname,tickets[i].ticketid,tickets[i].eventid,tickets[i].sell,tickets[i].validate,tickets[i].customer);
                l++;
            }
        }
        return biglietti;

    }


    function validate_ticket(uint ticketid, address val) external only_validator(val)returns(bool){
        bool flag=false;
        for(uint i=0; i < get_ticket_lenght(); i++){
            if(tickets[i].ticketid==ticketid && tickets[i].validate==false && tickets[i].sell==true){
                tickets[i].validate=true;
                flag=true;
            }
        }
        require(flag==true, "Biglietto gia' validato o invalidabile");
        return flag;

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

    function get_personal_tickets(address cliente) public view returns(TicketData[] memory big){
        uint j=0;
        for(uint i=0; i < get_ticket_lenght(); i++){ 
            if(tickets[i].customer==cliente){
                j++;
            }
        }
        TicketData[] memory biglietti=new TicketData[](j);
        uint l=0;
        for(uint i=0; i < get_ticket_lenght(); i++){ 
            if(tickets[i].customer==cliente){
                biglietti[l]=TicketData(tickets[i].name,tickets[i].surname,tickets[i].ticketid,tickets[i].eventid,tickets[i].sell,tickets[i].validate,tickets[i].customer);
                l++;
            }
        }
        return biglietti;
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
     
     function getBalance() public view returns (uint) {
         return address(this).balance;
     }
    
}  