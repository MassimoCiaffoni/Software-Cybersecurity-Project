import React, { Component } from 'react';
import Web3 from 'web3';
import Event from "contracts/Event.json";
import renderNotification from '../utils/notification-handler.js';
import logger from '../utils/log-api.js'

let web3;

class ModifyTicket extends Component {
  constructor(props) {
    super(props);

    //event data
    this.state = {
      name: '',
      surname: '',
      ticketid: props.location.state,


      buttonText: "Modify the ticket",
      buttonEnabled: false
    };

    //connection with the blockchain
    web3=new Web3(window.ethereum)
  }

  onModifyTicket= async(e)=> {
    e.preventDefault();
    this.setState({buttonText: "Modifying..."});
    this.setState({ buttonEnabled: false });
    const customer = await web3.eth.getAccounts();
    //get the instance of the contract event
    const id = await web3.eth.net.getId();
    const eventInstance = new web3.eth.Contract(Event.abi,Event.networks[id].address);
    var {name, surname}= this.state;
    try{
        eventInstance.methods
        .modify_ticket(name, surname, this.state.ticketid)
        .send({from: customer[0]})
        .then((result) =>{
            console.log(result.events)
            logger.log('info', 'Ticket modified with message: '+JSON.stringify(result.events))
            this.props.history.push({pathname: '/tickets'});
            renderNotification('success', 'Success: ', 'Ticket modified correctly');
        })
    this.setState({buttonText: "Modifying the ticket"});
    this.setState({ buttonEnabled: true});
    }
    catch(err){
      console.log(err);
      if(err.message === 'MetaMask Tx Signature: User denied transaction signature.'){
        renderNotification('danger', 'Error: ', 'Transaction canceled by user');
        logger.log('error', 'Error on ticket modification by '+JSON.stringify(customer[0])+' with message: '+JSON.stringify(err.message))
      } else {
        renderNotification('danger', 'Error: ', 'You are not authorized to take this action');
        logger.log('error', 'Error on ticket modification by '+JSON.stringify(customer[0])+' with message: '+JSON.stringify(err.message))
      }

    }   
  }

  inputChangedHandler = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
    //if all fields are filled, enable the button
    if(this.state.name === '' || 
       this.state.surname === '' ) {
        this.setState({buttonEnabled: false})
       } else {
        this.setState({buttonEnabled: true})
       } 
  }

  render() {
    //form to get the event data and create the event 
     return (
       <div className="center" align="center" >
         <h4 className="center page-title">Insert modified information for the ticket {this.state.ticketid}</h4>
         <form className="form-create-event" onSubmit={this.onModifyTicket}>
           <label className="left">Name</label><br /><input id="name"  type="text" className="validate" name="name" value={this.state.name} onChange={this.inputChangedHandler} /><br /><br />
           <label className="left">Surname</label><br /><input id="surname"  type="text" className="validate" name="surname" value={this.state.surname} onChange={this.inputChangedHandler} /><br /><br />
         <button type="submit" disabled={!this.state.buttonEnabled} className="btn waves-effect waves-light button-submit-form">{this.state.buttonText}</button>
         </form>
       </div>
     )
   }
}
 export default ModifyTicket;
