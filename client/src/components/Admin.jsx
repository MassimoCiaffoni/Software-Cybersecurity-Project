import React, { Component } from 'react';
import Web3 from 'web3';
import Event from "contracts/Event.json";
import renderNotification from '../utils/notification-handler.js';
import Button from 'react-bootstrap/Button'
import logger from '../utils/log-api.js'
import ConfirmDialog from '../utils/ConfirmDialog.jsx'
import ReactDOM from 'react-dom'


let web3;

class Admin extends Component {
  constructor() {
    super();
    
    this.state = {
      
      event_list: [],
      contract_balance: 0

    
    };
    
    //connection with the blockchain
    web3=new Web3(window.ethereum)

  }

  async componentDidMount() {
    //when the page is loaded, get the event list
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
    const dialog=ReactDOM.render(<ConfirmDialog text={"Are you sure to finish the event " + e.target.value + " ?"} />, document.getElementById('popup')); 
    var event = dialog.open()    
    event.on && event.on('confirm', async (data) => {
      if(data.message==="yes"){
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
            renderNotification('success', 'Successo', `Event finished correctly!`);
            logger.log("info","Finish the event: "+ JSON.stringify(result.events))
            this.onGetEvent();
          })    
          .catch((err) =>{
            console.log("Error while updating tickets:"+err);
            if(err.message === 'MetaMask Tx Signature: User denied transaction signature.'){
              renderNotification('danger', 'Errore: ', 'Transaction canceled by user');
              logger.log('error', 'Error on finish event by '+JSON.stringify(event_manager)+" with message: "+JSON.stringify(err.message))

            } else {
              renderNotification('danger', 'Errore: ', 'You are not authorized to take this action');
              logger.log('error', 'Error on finish event by '+JSON.stringify(event_manager)+" with message: "+JSON.stringify(err.message))
            }
        });
      }
    })
  }

  //function to overrlue an event
  onOverrlueEvent = async (e) => {
    e.preventDefault();
    
    const dialog=ReactDOM.render(<ConfirmDialog text={"Are you sure to invalidate the event " + e.target.value + " ?"} />, document.getElementById('popup')); 
    var event = dialog.open()    
    event.on && event.on('confirm', async (data) => {
      if(data.message==="yes"){
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
            renderNotification('success', 'Successo', `Event cancelled correctly!`);
            logger.log("info","Overlue the event: "+ JSON.stringify(result.events))
            this.onGetEvent();
          })
          .catch((e) =>{
            console.log("Error while updating tickets:"+e);
            if(e.message === 'MetaMask Tx Signature: User denied transaction signature.'){
              renderNotification('danger', 'Errore: ', 'Transaction canceled by user');
              logger.log('error', 'Error on invalidate event by '+JSON.stringify(event_manager)+" with message: "+JSON.stringify(e.message))
            } else {
              renderNotification('danger', 'Errore: ', 'You are not authorized to take this action');
              logger.log('error', 'Error on invalidate event by '+JSON.stringify(event_manager)+" with message: "+JSON.stringify(e.message))
            }
          });
      }
    })
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
      renderNotification('success', 'Successo', `Ether withdrawed correctly`);
      console.log(result.events)
      logger.log('info', 'Ether transfered to event manager with address: '+ JSON.stringify(result.events))
      this.onGetContractBalance();
    })
    .catch((err) =>{
      console.log(err);
      if(err.message === 'MetaMask Tx Signature: User denied transaction signature.'){
        renderNotification('danger', 'Errore: ', 'Transaction canceled by user');
        logger.log('error', 'Error on withdraw by '+JSON.stringify(event_manager)+' with message: '+JSON.stringify(err.message))
      } else {
        renderNotification('danger', 'Errore: ', 'You are not authorized to take this action');
        logger.log('error', 'Error on withdraw by '+JSON.stringify(event_manager)+' with message: '+JSON.stringify(err.message))
      }

    })
  }


  onModify= async (e) => {
    this.props.history.push({pathname: '/modify-event', state: e.target.value});
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
                    <th>Price (MilliEther)</th>
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
                        <td>{web3.utils.fromWei(event.price, "milliether")}</td>
                        <td>{event.state}</td>
                        <td>{event.owner}</td>
                        <div class="button-center"><Button variant="primary" type="button" onClick={this.onFinishEvent} value={event.id} disabled={event.state==="Concluso" || event.state==="Annullato"}>End Event</Button>{' '}</div>
                        <div class="button-center"><Button variant="primary" type="button" onClick={this.onOverrlueEvent} value={event.id} disabled={event.state==="Concluso" || event.state==="Annullato"}>Cancel Event</Button>{' '}</div>
                        <div class="button-center"><Button variant="primary" type="button" onClick={this.onModify} value={event.id} disabled={event.state==="Concluso" || event.state==="Annullato"}>Modify Event</Button>{' '}</div>
                    </tr>
                )}
            </tbody>
        </table>
        <div id="popup"></div>
         {/*<ConfirmDialog />*/}         
        <div>
        <h3 className="p-3 text-center">WithDraw Ether</h3>
        <div class="button-center"><Button variant="primary" type="button" onClick={this.onWithdraw} disabled={this.state.contract_balance==='0'}>Withdraw</Button>{' '}</div><br /><br /><br />
        </div>
        </div>
    )
  }
}

export default Admin;