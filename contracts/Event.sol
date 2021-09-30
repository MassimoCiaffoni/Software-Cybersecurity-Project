// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;




contract Event {
    
    address private owner=msg.sender;
    
    struct EventData{ //event data structure
    
        uint id;
    
        string title;
        
        string luogo;
        
        string date;
        
        uint seats;
        
        uint remaining_tickets;
        
        int price;
        
        string state;
        
        address owner;
    } 
    
    //all events
    EventData[] private events;
    
    modifier only_owner() {
        require(msg.sender == owner, "Non sei autorizzato ad eseguire questa azione");
        _;
    }
    
    
    event EventCreated(uint indexed eventid, address indexed creator);
    event EventOverrlue(uint indexed eventid, address indexed creator);
    
    
    function  create_event(string memory title, string memory  luogo, string memory  date, uint seats, int price) public only_owner {
        {
            events.push(EventData(0, title, luogo,  date, seats, seats, price, "Non concluso", owner));
            uint id=events.length - 1;
            events[id].id=id;
            emit EventCreated(id, owner);
        }
    }
    
    function overrlue_event(uint id) public only_owner returns(EventData memory){
            EventData memory evento=get_event(id);
            evento.state= "Annullato";
            emit EventOverrlue(id, owner);
            return evento;
    }
    
     function get_events() public view returns (EventData[] memory){
         return events;
     } 
     
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

    
}  