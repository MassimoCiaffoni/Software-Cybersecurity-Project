import React, { Component } from 'react';
import Web3 from 'web3';
import Event from "contracts/Event.json";
import renderNotification from '../utils/notification-handler.js';
import logger from '../utils/log-api.js'

let web3;

class CreateEvent extends Component {
  constructor() {
    super();

    //event data
    this.state = {
      title: '',
      place: '',
      date: '',
      seats: '',
      price: '',

      today: new Date(),

      buttonText: "Publish the event",
      buttonEnabled: false
    };

    //connection with the blockchain
    web3=new Web3(window.ethereum)
  }

  //function that create the event on the blockchain
  onCreateEvent = async (e) => {
    e.preventDefault();
    // loading text in the button 
    this.setState({buttonText: "Publishing..."});
    this.setState({ buttonEnabled: false });
    //get the address of the user (event manager)
    const event_organizer = await web3.eth.getAccounts();
    //get the instance of the contract event
    const id = await web3.eth.net.getId();
    const eventInstance = new web3.eth.Contract(Event.abi,Event.networks[id].address);     
    var { title, place: luogo, date, seats, price } = this.state;
    try {    
      //create the event
      await eventInstance.methods
      .create_event(title,luogo,date,seats,price, event_organizer[0],'0x755E4DAA0f81c115451b76e9998e1BBA3B11602F')
      .send({ from: event_organizer[0]})
      .then((receipt) => {
        console.log(receipt.events);
        logger.log("info","Created event: "+ JSON.stringify(receipt.events))
      });        
      // successful notification
      renderNotification('success', 'Success', `Event created successfully!`);

      this.setState({buttonText: "Publish the event"});
      this.setState({ buttonEnabled: true});
      
    }catch(err){
      console.log(err);
      if(err.message === 'MetaMask Tx Signature: User denied transaction signature.'){
        renderNotification('danger', 'Error: ', 'Transaction canceled by user');
        logger.log('error', 'Error on event creation by '+JSON.stringify(event_organizer[0])+' with message: '+JSON.stringify(err.message))
      } else {
        renderNotification('danger', 'Error: ', 'You are not authorized to take this action');
        logger.log('error', 'Error on event creation by '+JSON.stringify(event_organizer[0])+' with message: '+JSON.stringify(err.message))
      }
      this.setState({ buttonText: "Publish the event" });
      this.setState({ buttonEnabled: true });
    }
  }

  //function to check the fields into form
  inputChangedHandler = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
    //if all fields are filled, enable the button
    if(this.state.title === '' || 
       this.state.place === '' ||
       this.state.date === '' ||
       this.state.seats === '' ||
       this.state.price === ''  ) {
        this.setState({buttonEnabled: false})
       } else {
        this.setState({buttonEnabled: true})
       } 
  }



 render() {
   //form to get the event data and create the event 
    return (
      <div className="container" align="center" >
        <h4 className="center page-title">Event creation</h4>
        <form className="form-create-event" onSubmit={this.onCreateEvent}>
          <label className="left">Titolo</label><br /><input id="title" type="text" className="validate" name="title" value={this.state.title} onChange={this.inputChangedHandler} /><br /><br />
          <label className="left">Luogo</label><br /><input id="luogo"  type="text" className="validate" name="luogo" value={this.state.luogo} onChange={this.inputChangedHandler} /><br /><br />
          <label className="left">Data</label><br /><input id="date" type="text" className="input-control" name="date" value={this.state.date} onChange={this.inputChangedHandler}></input><br /><br />
          <label className="left">Numero Biglietti </label><br /><input id="seats" placeholder="10" type="number" className="input-control" name="seats" value={this.state.seats} onChange={this.inputChangedHandler} /><br /><br />
          <label className="left">Prezzo (Wei) </label><br /><input id="price" placeholder="100" type="number" className="input-control" name="price" value={this.state.price} onChange={this.inputChangedHandler}></input><br /><br />
        <button type="submit" disabled={!this.state.buttonEnabled} className="btn waves-effect waves-light button-submit-form">{this.state.buttonText}</button>
        </form>
      </div>
    )
  }
  }

  export default CreateEvent;