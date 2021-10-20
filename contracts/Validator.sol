// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;


import "./Event.sol";

contract Validator{
    address private owner=msg.sender;
    address public eventAddress;

    modifier only_owner() {
        require(msg.sender == owner, "Errore");
        _;
    }

    constructor(address _eventAddress) {
        eventAddress = _eventAddress;
    }

    function get_address() public view returns(address){
        return owner;
    }

    function validate_ticket(uint ticketid) public returns(string memory) {
        Event ev= Event(eventAddress);
        return ev.validate_ticket(ticketid, msg.sender);
    }


}