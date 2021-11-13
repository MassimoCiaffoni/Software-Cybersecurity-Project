import React, { Component } from 'react';
import Web3 from 'web3';
import Event from "contracts/Event.json";
import Ticket from "contracts/Ticket.json";
import renderNotification from '../utils/notification-handler.js';
import Button from 'react-bootstrap/Button'
import logger from '../utils/log-api.js'


let web3;

class ValidateTicket extends Component {
  constructor() {
    super();

     //define state to save the list of the tickets
    this.state = {      
      val_ticket_list: []    
    };

    //connection with the blockchain
    web3=new Web3(window.ethereum)

  }

  async componentDidMount() {
    await this.onGetValTicket();
  }

  //function to get the ticket from blockchain
  onGetValTicket = async () => {
    //get the address of the user 
    const validator = await web3.eth.getCoinbase();
    try{
      //get the instance of the contract event
      const id = await web3.eth.net.getId();
      const eventInstance = new web3.eth.Contract(Event.abi,Event.networks[id].address);
      //get tickets from the contract
      eventInstance.methods.get_ticket_to_validate(validator)
      .call({from: validator}).then((result) => {        
        this.setState({ val_ticket_list: result }); 
        console.log(this.state.val_ticket_list); 
      });    
      
    }catch(err){
      console.log("You are not authorized to log in:"+err);
      if(err.message === 'MetaMask Tx Signature: User denied transaction signature.'){
        renderNotification('danger', 'Error: ', 'Transaction canceled by user');
        logger.log('error', 'Error on get ticket to validate with message: '+JSON.stringify(err.message)+" by "+JSON.stringify(validator))
      } else {
        renderNotification('danger', 'Error: ', 'You are not authorized to log in');
        logger.log('error', 'Error on get ticket to validate with message: '+JSON.stringify(err.message)+" by "+JSON.stringify(validator))
      }
    }
  }

  //function to validate the ticket selected
  onValidateTicket = async (e) => {
    e.preventDefault();
    //get the address of the user 
    const validator = await web3.eth.getCoinbase();
    //get the instance of the contract ticket
    const id = await web3.eth.net.getId();
    const ticketInstance = new web3.eth.Contract(Ticket.abi,Ticket.networks[id].address);
    //validate the ticket
    ticketInstance.methods.validate_ticket(e.target.value)
    .send({ from: validator})
    .then((receipt) => {
      console.log(receipt.events);
      logger.log("info","Validate ticket: "+ JSON.stringify(receipt.events))
      renderNotification('success', 'Success', 'Validated ticket' );
      this.onGetValTicket();
    }).catch((err) =>{
      console.log("Ticket not validated or already valid : "+err);
      if(err.message === 'MetaMask Tx Signature: User denied transaction signature.'){
          renderNotification('danger', 'Error: ', 'Transaction canceled by user');
          logger.log('error', 'Error on validation with message: '+JSON.stringify(err.message)+" by "+JSON.stringify(validator))
        } else {
          renderNotification('danger', 'Error: ', 'Ticket not validated or already valid');
          logger.log('error', 'Error on validation with message: '+JSON.stringify(err.message)+" by "+JSON.stringify(validator))
        };

    }); 
  }
    
  render() {
    //table of the ticket
    return (
    <div className="container">
      <h3 className="p-3 text-center">Tickets to Validate</h3>
      <table className="table table-striped table-bordered">
          <thead>
              <tr>
                  <th>TicketID</th>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>EventID</th>
                  <th>Customer</th>
                  <th>Valid</th>
                  <th>Option</th>
              </tr>
          </thead>
          <tbody>
              {this.state.val_ticket_list && this.state.val_ticket_list.map(ticket =>
                  <tr key={ticket.ticketid}>
                      <td>{ticket.ticketid}</td>
                      <td>{ticket.name}</td>
                      <td>{ticket.surname}</td>
                      <td>{ticket.eventid}</td>
                      <td>{ticket.customer}</td>
                      <td>{ticket.validate?('yes'):('no')}</td>
                      <div class="button-center"><Button variant="primary" type="button" onClick={this.onValidateTicket} value={ticket.ticketid} disabled={ticket.validate===true}>Validate ticket</Button>{' '}</div>
                  </tr>
              )}
          </tbody>
      </table>
      </div>
    );}  
  }

export default ValidateTicket;