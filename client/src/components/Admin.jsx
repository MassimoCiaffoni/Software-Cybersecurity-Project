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
    
    this.state = {
      
      event_list: [],
      contract_balance: 0

    
    };
    
    web3=new Web3(window.ethereum)

  }

  async componentDidMount() {
    await this.onGetEvent();
    await this.onGetContractBalance();
  }

  onGetContractBalance = async () => {
    const event_manager = await web3.eth.getCoinbase();
    console.log(event_manager)
    const id = await web3.eth.net.getId();
    const eventInstance = new web3.eth.Contract(Event.abi,Event.networks[id].address);
    eventInstance.methods
    .getBalance()
    .call({from: event_manager})
    .then((result) => {
      console.log(result);
      this.setState({contract_balance: result})
    })
  }

  onGetEvent = async () => {
    const visitator = await web3.eth.getCoinbase();
    try{
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
      console.logger('error', 'Error on get events with message: '+JSON.stringify(e.message)+JSON.stringify(visitator))
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

  onWithdraw = async (e) => {
    e.preventDefault();
    const event_manager = await web3.eth.getCoinbase();
    console.log(event_manager)
    const id = await web3.eth.net.getId();
    const eventInstance = new web3.eth.Contract(Event.abi,Event.networks[id].address);
    eventInstance.methods
    .withdraw()
    .send({from: event_manager})
    .then((result) =>{
      renderNotification('success', 'Successo', `Ether ritirati correttamente`);
      console.log(result.events)
      logger.log('info', 'Ether transfered to event manager with address: '+ JSON.stringify(result.events))
      this.onGetContractBalance();
    })
    .catch((err) =>{
      console.log(err);
      if(err.message === 'MetaMask Tx Signature: User denied transaction signature.'){
        renderNotification('danger', 'Errore: ', 'Transazione anullata dal utente');
        logger.log('error', 'Error on withdraw by '+JSON.stringify(event_manager)+' with message: '+JSON.stringify(err.message))
      } else {
        renderNotification('danger', 'Errore: ', 'Non sei autorizzato a compiere questa azione');
        logger.log('error', 'Error on withdraw by '+JSON.stringify(event_manager)+' with message: '+JSON.stringify(err.message))
      }

    })
  }

  

  render() {
    return (
        <div div className="container">
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
        <div>
        <h3 className="p-3 text-center">WithDraw Ether</h3>
        <div class="button-center"><Button variant="primary" type="button" onClick={this.onWithdraw} disabled={this.state.contract_balance==='0'}>Withdraw</Button>{' '}</div>
        </div>
        </div>
    )
  }




}

export default Admin;