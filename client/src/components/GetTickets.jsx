import React, { Component } from 'react';
import Web3 from 'web3';
import Button from 'react-bootstrap/Button'
import Event from "contracts/Event.json";
import logger from '../utils/log-api.js'

let web3;

class GetTickets extends Component {
  constructor() {
    super();

     //define state to save the list of the tickets
    this.state = {      
      ticket_list: []    
    };

    //connection with the blockchain
    web3=new Web3(window.ethereum)

  }

  async componentDidMount() {
     //when the page is loaded, get the event list
    await this.onGetTicket();
  }

  //function that get the ticket list from the blockchain
  onGetTicket = async () => {
    //get the address of the user 
    const visitator = await web3.eth.getCoinbase();
    try{      
      //get the instance of the contract event
      const id = await web3.eth.net.getId();
      const eventInstance = new web3.eth.Contract(Event.abi,Event.networks[id].address);
      //get ticket list from the contract
      eventInstance.methods.get_personal_tickets()
      .call({from: visitator}).then((result) => {
        console.log(result);
        this.setState({ ticket_list: result });  
      });    
      
    }catch(e){
      console.log("Error while updating tickets:"+e);
      logger.log("Error with get tickets by "+JSON.stringify(visitator)+" with message: "+JSON.stringify(e.message))
    }
  }

  onModify= async (e) => {
    this.props.history.push({pathname: '/modify-ticket', state: e.target.value});
  }
  

  render() {
    //table of the tickets
    return (
    <div className="container">
      <h3 className="p-3 text-center">My Tickets</h3>
      <table className="table table-striped table-bordered">
          <thead>
              <tr>
                  <th>TicketID</th>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>EventID</th>
                  <th>Customer</th>
                  <th>Options</th> 
              </tr>
          </thead>
          <tbody>
              {this.state.ticket_list && this.state.ticket_list.map(ticket =>
                  <tr key={ticket.ticketid}>
                      <td>{ticket.ticketid}</td>
                      <td>{ticket.name}</td>
                      <td>{ticket.surname}</td>
                      <td>{ticket.eventid}</td>
                      <td>{ticket.customer}</td>
                      <div class="button-center"><Button variant="primary" type="button" onClick={this.onModify} value={ticket.ticketid}>Modify Ticket</Button>{' '}</div>
                  </tr>
              )}
          </tbody>
      </table>
      </div>
    );}  
  }

export default GetTickets;