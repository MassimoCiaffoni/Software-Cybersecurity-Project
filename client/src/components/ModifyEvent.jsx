import React, { Component } from 'react';
import Web3 from 'web3';
import Event from "contracts/Event.json";
import renderNotification from '../utils/notification-handler.js';
import logger from '../utils/log-api.js'
import ConfirmDialog from '../utils/ConfirmDialog.jsx'
import ReactDOM from 'react-dom'

let web3;

class ModifyEvent extends Component {
  constructor(props) {
    super(props);

    //event data
    this.state = {
      title: '',
      place: '',
      date: '',
      seats: '',
      eventid: props.location.state,

      today: new Date(),

      buttonText: "Modify the event",
      buttonEnabled: false
    };

    //connection with the blockchain
    web3=new Web3(window.ethereum)
  }

  onModifyEvent=async(e) =>{
    e.preventDefault();
    const dialog=ReactDOM.render(<ConfirmDialog text={"Are you sure to modify the event "+ this.state.eventid +" ?"} />, document.getElementById('popup')); 
    var event = dialog.open()    
    event.on && event.on('confirm', async (data) => {
      if(data.message==="yes"){
        this.setState({buttonText: "Modifying..."});
        this.setState({ buttonEnabled: false });
        const event_organizer = await web3.eth.getAccounts();
        //get the instance of the contract event
        const id = await web3.eth.net.getId();
        const eventInstance = new web3.eth.Contract(Event.abi,Event.networks[id].address);
        var { title, place, date, seats} = this.state;
        try{
        eventInstance.methods
        .modify_event(this.state.eventid,title,place,date,seats,event_organizer[0])
        .send({from: event_organizer[0]})
        .then((result) =>{
            console.log(result.events)
            logger.log('info', 'Event modified :'+JSON.stringify(result.events))
        });
        this.setState({buttonText: "Modifying the event"});
        this.setState({ buttonEnabled: true});
        }
        catch(err){
          console.log(err);
          if(err.message === 'MetaMask Tx Signature: User denied transaction signature.'){
            renderNotification('danger', 'Error: ', 'Transaction canceled by user');
            logger.log('error', 'Error on event modification by '+JSON.stringify(event_organizer[0])+' with message: '+JSON.stringify(err.message))
          } else {
            renderNotification('danger', 'Error: ', 'You are not authorized to take this action');
            logger.log('error', 'Error on event modification by '+JSON.stringify(event_organizer[0])+' with message: '+JSON.stringify(err.message))
          }

        }   
      }
    });
  }

  inputChangedHandler = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
    let inputDate = new Date(this.state.date);
    //if all fields are filled, enable the button
    if(this.state.title === '' || 
       this.state.place === '' ||
       this.state.date === '' ||
       this.state.seats === '' ||
       inputDate < this.state.today ) {
        this.setState({buttonEnabled: false})
       } else {
        this.setState({buttonEnabled: true})
       } 
  }

  render() {
    //form to get the event data and create the event 
     return (
       <div className="center" align="center" >
         <h4 className="page-title">Insert modified information for event {this.state.eventid}</h4>
         <form className="form-create-event" onSubmit={this.onModifyEvent}>
           <label className="left">Title</label><br /><input id="title" placeholder={"Concert"} type="text" className="validate" name="title" value={this.state.title} onChange={this.inputChangedHandler} /><br /><br />
           <label className="left">Place</label><br /><input id="place" placeholder={"Ancona"}  type="text" className="validate" name="place" value={this.state.place} onChange={this.inputChangedHandler} /><br /><br />
           <label className="left">Date</label><br /><input id="date" type="date" className="input-control" name="date" value={this.state.date} onChange={this.inputChangedHandler}></input><br /><br />
           <label className="left">New Tickets </label><br /><input id="seats" placeholder="10" type="number" className="input-control" name="seats" value={this.state.seats} onChange={this.inputChangedHandler} /><br /><br />
         <button type="submit" disabled={!this.state.buttonEnabled} className="btn waves-effect waves-light button-submit-form">{this.state.buttonText}</button>
         </form>
         <div id="popup"></div>
       </div>
     )
   }
}
 export default ModifyEvent;
