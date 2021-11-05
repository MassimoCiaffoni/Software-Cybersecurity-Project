import React, { Component } from 'react';
import Web3 from 'web3';
import Event from "contracts/Event.json";
import renderNotification from '../utils/notification-handler.js';
import Button from 'react-bootstrap/Button'



let web3;

class Admin extends Component {
  constructor() {
    super();
    
    this.state = {
      
      event_list: [],

    
    };
    
    web3=new Web3(window.ethereum)

  }

  async componentDidMount() {
    await this.onGetEvent();
  }

  onGetEvent = async () => {
    try{
      const visitator = await web3.eth.getCoinbase();
      console.log(visitator)
      const id = await web3.eth.net.getId();
      const eventInstance = new web3.eth.Contract(Event.abi,Event.networks[id].address);
      eventInstance.methods
      .get_events()
      .call({from: visitator}).then((result) => {
        console.log(result);
        this.setState({ event_list: result });  
      });    
      
    }catch(e){
      console.log("Error while updating the events:"+e);
    }
  }


  onFinishEvent = async (e) => {
    e.preventDefault();
    const event_manager = await web3.eth.getCoinbase();
    console.log(event_manager)
    const id = await web3.eth.net.getId();
    const eventInstance = new web3.eth.Contract(Event.abi,Event.networks[id].address);
    eventInstance.methods
      .finish_event(e.target.value)
      .send({from: event_manager})
      .then((result) => {
        console.log(result);
        renderNotification('success', 'Successo', `Evento terminato correttamente!`);
        window.location.reload(3000)
      })    
      .catch((err) =>{
      console.log("Error while updating tickets:"+err);
      if(e.message === 'MetaMask Tx Signature: User denied transaction signature.'){
        renderNotification('danger', 'Errore: ', 'Transazione anullata dal utente');
      } else {
        renderNotification('danger', 'Errore: ', 'Non sei autorizzato a compiere questa azione');
      }
    });
  }


  onOverlueEvent = async (e) => {
    e.preventDefault();
    const event_manager = await web3.eth.getCoinbase();
    console.log(event_manager)
    const id = await web3.eth.net.getId();
    const eventInstance = new web3.eth.Contract(Event.abi,Event.networks[id].address);
    eventInstance.methods
      .overrlue_event(e.target.value)
      .send({from: event_manager})
      .then((result) => {
        console.log(result);
        renderNotification('success', 'Successo', `Evento annullato!`);
        window.location.reload(3000)
      })
      .catch((e) =>{
      console.log("Error while updating tickets:"+e);
      if(e.message === 'MetaMask Tx Signature: User denied transaction signature.'){
        renderNotification('danger', 'Errore: ', 'Transazione anullata dal utente');
      } else {
        renderNotification('danger', 'Errore: ', 'Non sei autorizzato a compiere questa azione');
      }
    });

  }
  

  render() {
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
                        <div class="button-center"><Button variant="primary" type="button" onClick={this.onOverlueEvent} value={event.id} disabled={event.state==="Concluso" || event.state==="Annullato"}>Overrlue Event</Button>{' '}</div>

                    </tr>
                )}
            </tbody>
        </table>
        </div>  
    )
  }




}

export default Admin;