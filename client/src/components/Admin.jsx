import React, { Component } from 'react';
import Web3 from 'web3';
import Event from "contracts/Event.json";
import renderNotification from '../utils/notification-handler.js';
import Button from 'react-bootstrap/Button'
import logger from '../utils/log-api.js'


let web3;

class Admin extends Component {
  constructor() {
    super();
    
    //define state to save the list of the events
    this.state = {      
      event_list: []    
    };
    
    //connection with the blockchain
    web3=new Web3(window.ethereum)

  }

  async componentDidMount() {
    //when the page is loaded, get the event list
    await this.onGetEvent();
  }

  //function that get the event list from the blockchain
  onGetEvent = async () => {
    //get the address of the user (event manager)
    const user = await web3.eth.getCoinbase();
    try{
      //get the instance of the contract event
      const id = await web3.eth.net.getId();
      const eventInstance = new web3.eth.Contract(Event.abi,Event.networks[id].address);
      //get events list from the contract
      eventInstance.methods.get_events()
      .call({from: user}).then((result) => {
        console.log(result);
        this.setState({ event_list: result });  
      });    
      
    }catch(e){
      console.log("Error while updating the events:"+e);
      logger.log("Error with get events by "+JSON.stringify(user)+" with message: "+JSON.stringify(e.message))
    }
  }

  //function to set an event as finished
  onFinishEvent = async (e) => {
    e.preventDefault();
    //get the address of the user (event manager)
    const event_manager = await web3.eth.getCoinbase();
    console.log(event_manager)
    //get the instance of the contract event
    const id = await web3.eth.net.getId();
    const eventInstance = new web3.eth.Contract(Event.abi,Event.networks[id].address);
    //set the event as finished
    eventInstance.methods
      .finish_event(e.target.value)
      .send({from: event_manager})
      .then((result) => {
        console.log(result.events);
        renderNotification('success', 'Successo', `Evento terminato correttamente!`);
        logger.log("info","Finish the event: "+ JSON.stringify(result.events))
        this.onGetEvent();
      })    
      .catch((err) =>{
        console.log("Error while updating tickets:"+err);
        if(err.message === 'MetaMask Tx Signature: User denied transaction signature.'){
          renderNotification('danger', 'Errore: ', 'Transazione anullata dal utente');
          logger.log('error', 'Error on finish event by '+JSON.stringify(event_manager)+" with message: "+JSON.stringify(err.message))

        } else {
          renderNotification('danger', 'Errore: ', 'Non sei autorizzato a compiere questa azione');
          logger.log('error', 'Error on finish event by '+JSON.stringify(event_manager)+" with message: "+JSON.stringify(err.message))
        }
    });
  }

  //function to overrlue an event
  onOverrlueEvent = async (e) => {
    e.preventDefault();
    //get the address of the user (event manager)
    const event_manager = await web3.eth.getCoinbase();
    console.log(event_manager)
    //get the instance of the contract event
    const id = await web3.eth.net.getId();
    const eventInstance = new web3.eth.Contract(Event.abi,Event.networks[id].address);
    //set the event as overrlued
    eventInstance.methods
      .overrlue_event(e.target.value)
      .send({from: event_manager})
      .then((result) => {
        console.log(result.events);
        renderNotification('success', 'Successo', `Evento annullato!`);
        logger.log("info","Overlue the event: "+ JSON.stringify(result.events))
        this.onGetEvent();
      })
      .catch((e) =>{
        console.log("Error while updating tickets:"+e);
        if(e.message === 'MetaMask Tx Signature: User denied transaction signature.'){
          renderNotification('danger', 'Errore: ', 'Transazione anullata dal utente');
          logger.log('error', 'Error on invalidate event by '+JSON.stringify(event_manager)+" with message: "+JSON.stringify(e.message))
        } else {
          renderNotification('danger', 'Errore: ', 'Non sei autorizzato a compiere questa azione');
          logger.log('error', 'Error on invalidate event by '+JSON.stringify(event_manager)+" with message: "+JSON.stringify(e.message))
        }
      });
  }
  

  render() {
    //table of the events
    return (
        <div className="container">
        <h3 className="p-3 text-center">List of Events</h3>
        <table className="table table-striped table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Place</th>
                    <th>Date</th>
                    <th>Seats</th>
                    <th>Remaining tickets</th>
                    <th>Price</th>
                    <th>State</th>
                    <th>Owner</th>
                    <th>Options</th>
                </tr>
            </thead>
            <tbody>
                {this.state.event_list && this.state.event_list.map(event =>
                    <tr key={event.id}>
                        <td>{event.id}</td>
                        <td>{event.title}</td>
                        <td>{event.luogo}</td>
                        <td>{event.date}</td>
                        <td>{event.seats}</td>
                        <td>{event.remaining_tickets}</td>
                        <td>{event.price}</td>
                        <td>{event.state}</td>
                        <td>{event.owner}</td>
                        <div class="button-center"><Button variant="primary" type="button" onClick={this.onFinishEvent} value={event.id} disabled={event.state==="Concluso" || event.state==="Annullato"}>End Event</Button>{' '}</div>
                        <div class="button-center"><Button variant="primary" type="button" onClick={this.onOverrlueEvent} value={event.id} disabled={event.state==="Concluso" || event.state==="Annullato"}>Overrlue Event</Button>{' '}</div>

                    </tr>
                )}
            </tbody>
        </table>
        </div>  
    )
  }
}

export default Admin;