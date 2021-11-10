import React, { Component } from 'react';
import Web3 from 'web3';
import renderNotification from '../utils/notification-handler.js';
import Ticket from "contracts/Ticket.json";
import Event from "contracts/Event.json";
import logger from '../utils/log-api.js'
let web3;

class InsertUserData extends Component {
  constructor(props) {
    super(props);
    
    this.state = {      
      name: '',
      surname: '',
      eventId: props.location.state,
      price: 0,

      buttonText: "Acquista il biglietto",
      buttonEnabled: false
    };
    
    web3=new Web3(window.ethereum)

    this.GetPrice();

  }


  GetPrice = async () => {
    const id = await web3.eth.net.getId();
    const eventInstance = new web3.eth.Contract(Event.abi,Event.networks[id].address); 
    const buyer = await web3.eth.getAccounts();
    try {  
    await eventInstance.methods
    .get_event_price(this.state.eventId)
    .call({from: buyer[0]}).then((result) => {
      console.log(result);
      this.setState({ price: result });  
    });    
    
    }catch(e){
    console.log("Error getting price:"+e);
    console.log('error', 'Error on get price for event '+JSON.stringify(this.state.eventId)+' by '+JSON.stringify(buyer[0]))
    }
  }





  onBuyTicket = async (e) => {
    e.preventDefault();
    const id = await web3.eth.net.getId();
    const ticketInstance = new web3.eth.Contract(Ticket.abi,Ticket.networks[id].address); 
    const buyer = await web3.eth.getAccounts();
    try {  
    var result=await web3.eth.sendTransaction({ from:buyer[0],to:"0x1f60a7C633DF64183c524C511BCAE908d65DD70c", value: web3.utils.toWei(this.state.price, 'milliether')});
    await ticketInstance.methods
    .buy_ticket(this.state.eventId, this.state.name, this.state.surname)
    .send({ from: buyer[0]})
    .then((receipt) => {
      console.log(receipt.events)
      logger.log("info","Buy the ticket: "+ JSON.stringify(receipt.events))

    });
    this.props.history.push({pathname: '/getevent'});
    renderNotification('success', 'Successo', 'Biglietto acquistato da '+ this.state.name + ' ' +this.state.surname );
    }catch(err){
      console.log(err);
      if(err.message === 'MetaMask Tx Signature: User denied transaction signature.'){
        renderNotification('danger', 'Errore: ', 'Transazione anullata dal utente');
        logger.log('error', 'Purchase ticket by '+JSON.stringify(buyer[0])+" failed with message: "+JSON.stringify(err.message))
      } 
      else{
        renderNotification('danger', 'Errore: ', "I biglietti sono terminati o l'evento non è più disponibile");
        logger.log('error', 'Purchase ticket by '+JSON.stringify(buyer[0])+" failed with message: "+JSON.stringify(err.message))
      }
    }

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