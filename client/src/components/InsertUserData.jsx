import React, { Component } from 'react';
import Web3 from 'web3';
import renderNotification from '../utils/notification-handler.js';
import Ticket from "contracts/Ticket.json";
let web3;

class InsertUserData extends Component {
  constructor(props) {
    super(props);
    
    this.state = {      
      name: '',
      surname: '',
      eventId: props.location.state,

      buttonText: "Acquista il biglietto",
      buttonEnabled: false
    };
    
    web3=new Web3(window.ethereum)

  }



  onBuyTicket = async (e) => {
    e.preventDefault();
    const id = await web3.eth.net.getId();
    const ticketInstance = new web3.eth.Contract(Ticket.abi,Ticket.networks[id].address); 
    const buyer = await web3.eth.getAccounts();
    await ticketInstance.methods
    .buy_ticket(this.state.eventId, this.state.name, this.state.surname)
    .send({ from: buyer[0]})
    .then((receipt) => {
      console.log(receipt);
    });

    renderNotification('success', 'Successo', 'Biglietto acquistato da '+ this.state.name + ' ' +this.state.surname );


  }

  inputChangedHandler = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);

    if(this.state.name === '' || 
       this.state.surname === '') {
        this.setState({buttonEnabled: false})
       } else {
        this.setState({buttonEnabled: true})
       } 
  }



 render() {
    return (
      <div className="container" align="center" >
        <h4 className="center page-title">Insert user data to buy the ticket for the event {this.state.eventId} </h4>
        <form className="form-buy-ticket" onSubmit={this.onBuyTicket}>
          <label className="left">Name</label><br /><input id="name" type="text" className="validate" name="name" value={this.state.name} onChange={this.inputChangedHandler} /><br /><br />
          <label className="left">Surname</label><br /><input id="surname"  type="text" className="validate" name="surname" value={this.state.surname} onChange={this.inputChangedHandler} /><br /><br />
        <button type="submit" disabled={!this.state.buttonEnabled} className="btn waves-effect waves-light button-submit-form">{this.state.buttonText}</button>
        </form>
      </div>
    )
  }
  }

  export default InsertUserData;