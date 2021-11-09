import React, { Component } from 'react';
import Web3 from 'web3';
import Event from "contracts/Event.json";
import Ticket from "contracts/Ticket.json";
import renderNotification from '../utils/notification-handler.js';
import Button from 'react-bootstrap/Button'



let web3;

class ValidateTicket extends Component {
  constructor() {
    super();
    
    this.state = {
      
      val_ticket_list: [],

    
    };
    
    web3=new Web3(window.ethereum)

  }

  async componentDidMount() {
    await this.onGetValTicket();
  }

  onGetValTicket = async () => {
    try{
      const validator = await web3.eth.getCoinbase();
      console.log(validator)
      const id = await web3.eth.net.getId();
      const eventInstance = new web3.eth.Contract(Event.abi,Event.networks[id].address);
      eventInstance.methods
      .get_ticket_to_validate(validator)
      .call({from: validator}).then((result) => {
        console.log(result);
        this.setState({ val_ticket_list: result }); 
        console.log(this.state.val_ticket_list); 
      });    
      
    }catch(err){
      console.log("Non sei autorizzato ad accedere:"+err);
      if(err.message === 'MetaMask Tx Signature: User denied transaction signature.'){
        renderNotification('danger', 'Errore: ', 'Transazione anullata dal utente');
      } else {
        renderNotification('danger', 'Errore: ', 'Non sei autorizzato ad accedere');
      }
    }
  }

  onValidateTicket = async (e) => {
    e.preventDefault();
        const validator = await web3.eth.getCoinbase();
        console.log(validator)
        const id = await web3.eth.net.getId();
        const ticketInstance = new web3.eth.Contract(Ticket.abi,Ticket.networks[id].address);
        ticketInstance.methods
        .validate_ticket(e.target.value)
        .send({ from: validator})
        .then((receipt) => {
        console.log(receipt.events);
        renderNotification('success', 'Successo', 'Biglietto validato' );
        this.onGetValTicket();
      }).catch((err) =>{
        console.log("Biglietto non validato o già valido:"+err);
        if(err.message === 'MetaMask Tx Signature: User denied transaction signature.'){
            renderNotification('danger', 'Errore: ', 'Transazione anullata dal utente');
          } else {
            renderNotification('danger', 'Errore: ', 'Biglietto non validato o già valido');
          };

        }); 
      }
    /*catch(err){
    console.log("Biglietto non validato o già valido:"+err);
    if(err.message === 'MetaMask Tx Signature: User denied transaction signature.'){
        renderNotification('danger', 'Errore: ', 'Transazione anullata dal utente');
      } else {
        renderNotification('danger', 'Errore: ', 'Biglietto non validato o già valido');
      }
        } */
    
  render() {
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
              {this.state.val_ticket_list && this.state.val_ticket_list.map(event =>
                  <tr key={event.ticketid}>
                      <td>{event.ticketid}</td>
                      <td>{event.name}</td>
                      <td>{event.surname}</td>
                      <td>{event.eventid}</td>
                      <td>{event.customer}</td>
                      <td>{event.validate?('yes'):('no')}</td>
                      <div class="button-center"><Button variant="primary" type="button" onClick={this.onValidateTicket} value={event.ticketid} disabled={event.validate===true}>Validate ticket</Button>{' '}</div>
                  </tr>
              )}
          </tbody>
      </table>
      </div>
    );}  
  }

export default ValidateTicket;