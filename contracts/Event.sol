// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;




contract Event {
    
    address private owner=msg.sender;
    
    struct EventData{ //event data structure
    
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
    
    
    event EventCreated(uint indexed eventId, address indexed creator);
    
 
    
    
    function  create_event(string memory title, string memory  luogo, string memory  date, uint seats, int price) public {
        require(msg.sender==owner , "Non sei autorizzato ad effettuare questa azione");{
            uint id=get_event_length()+1;
            events.push(EventData(title, luogo,  date, seats, seats, price, "Non concluso", owner));
            emit EventCreated(id, owner);
        }
    }
    
    
     function get_events() public view returns (EventData[] memory){
         return events;
     } 
     
     function get_event_length() public view returns (uint){
         return events.length;
     }

    
}  