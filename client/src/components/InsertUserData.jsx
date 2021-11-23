import React, { Component } from 'react';
import Web3 from 'web3';
import renderNotification from '../utils/notification-handler.js';
import Ticket from "contracts/Ticket.json";
import Event from "contracts/Event.json";
import ConfirmDialog from '../utils/ConfirmDialog.jsx'
import logger from '../utils/log-api.js'
import ReactDOM from 'react-dom'

let web3;

class InsertUserData extends Component {
  constructor(props) {
    super(props);
    
    //define state to save user data
    this.state = {      
      name: '',
      surname: '',
      eventId: props.location.state,
      price: 0,

      buttonEnabled: false
    };

    //connection with the blockchain
    web3=new Web3(window.ethereum)

    //get the price of this event
    this.GetPrice();
  }

  //function that get the price of the event selected
  GetPrice = async () => {
    //get the address of the user (buyer)
    const buyer = await web3.eth.getAccounts();
    //get the instance of the contract event
    const id = await web3.eth.net.getId();
    const eventInstance = new web3.eth.Contract(Event.abi,Event.networks[id].address); 
   
    try {  
      //get the price 
      await eventInstance.methods
      .get_event_price(this.state.eventId)
      .call({from: buyer[0]}).then((result) => {
        console.log(result);
        this.setState({ price: result });  
      });    
    }catch(e){
      console.log("Error getting price:"+e);
      logger.log('error', 'Error on get price for event '+JSON.stringify(this.state.eventId)+' by '+JSON.stringify(buyer[0]))
    }
  }




  onBuyTicket = async (e) => {
    e.preventDefault();
    const dialog=ReactDOM.render(<ConfirmDialog text={"Are you sure to buy a ticket for the event " + this.state.eventId+ " ?"} />, document.getElementById('popup')); 
    var event = dialog.open()    
    event.on && event.on('confirm', async (data) => {
      if(data.message==="yes"){
        //get the address of the user (buyer)
        const buyer = await web3.eth.getAccounts();
        //get the instance of the contract ticket
        const id = await web3.eth.net.getId();
        const ticketInstance = new web3.eth.Contract(Ticket.abi,Ticket.networks[id].address,{transactionConfirmationBlocks: 1}); 
          ticketInstance.methods
          .buy_ticket(this.state.eventId, this.state.name, this.state.surname)
          .send({ from: buyer[0], value: this.state.price})
          .then((receipt) => {
            console.log(receipt.events)
            logger.log("info","Buy the ticket: "+ JSON.stringify(receipt.events))
            this.props.history.push({pathname: '/getevent'});
            renderNotification('success', 'Successo', 'Ticket purchased by '+ this.state.name + ' ' +this.state.surname );
          })
          .catch((err)=>{
          console.log(err);
          if(err.message === 'MetaMask Tx Signature: User denied transaction signature.'){
            renderNotification('danger', 'Error: ', 'Transaction canceled by user');
            logger.log('error', 'Purchase ticket by '+JSON.stringify(buyer[0])+" failed with message: "+JSON.stringify(err.message))
          } 
          else{
            renderNotification('danger', 'Error: ', "Tickets have run out or the event is no longer available");
            logger.log('error', 'Purchase ticket by '+JSON.stringify(buyer[0])+" failed with message: "+JSON.stringify(err.message))
          }
        })
      }
    })
  }

  //function to check the fields into form
  inputChangedHandler = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
    //if all fields are filled, enable the button
    if(this.state.name === '' || 
       this.state.surname === '') {
        this.setState({buttonEnabled: false})
       } else {
        this.setState({buttonEnabled: true})
       } 
  }

 render() {
   //form to get the user data 
    return (
      <div className="center" align="center" >
        <h4 className="page-title">Insert user data to buy the ticket for the event {this.state.eventId} </h4>
        <form className="form-buy-ticket" onSubmit={this.onBuyTicket}>
          <label className="left">Name</label><br /><input id="name" type="text" className="validate" name="name" value={this.state.name} onChange={this.inputChangedHandler} /><br /><br />
          <label className="left">Surname</label><br /><input id="surname"  type="text" className="validate" name="surname" value={this.state.surname} onChange={this.inputChangedHandler} /><br /><br />
        <button type="submit" disabled={!this.state.buttonEnabled} className="btn waves-effect waves-light button-submit-form">Buy the ticket</button>
        </form>
        <div id="popup"></div>
                  
        <div></div>
      </div>
      
    )
  }
  }

  export default InsertUserData;