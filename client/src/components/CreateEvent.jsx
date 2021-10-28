import React, { Component } from 'react';
import Web3 from 'web3';
import Event from "contracts/Event.json";
import renderNotification from '../utils/notification-handler.js';

let web3;

class CreateEvent extends Component {
  constructor() {
    super();
    
    this.state = {
      title: '',
      luogo: '',
      date: '',
      seats: '',
      price: '',

      today: new Date(),

      buttonText: "Pubblica evento",
      buttonEnabled: false
    };
    
    web3=new Web3(window.web3.currentProvider)
    this.onCreateEvent();
  }



  onCreateEvent = async (e) => {
    // indicazione di caricamento nel bottone
    this.setState({buttonText: "Pubblico..."});
    this.setState({ buttonEnabled: false });
    const id = await web3.eth.net.getId();
    const eventInstance = new web3.eth.Contract(Event.abi,Event.networks[id].address);
    console.log(eventInstance)
    const event_organizer = await web3.eth.getAccounts();
    console.log(event_organizer[0])
    var { title, luogo, date, seats,price } = this.state;
    try {
        const prova=await eventInstance.methods.set_reseller('0x6E32F255f7548A3765D373278F423dcAf7329782')
        .send({ from: event_organizer[0], gasprice: 0}).then((receipt) => {
          console.log(receipt);
        });
        await eventInstance.methods.set_validator('0xC4E4589f24b5E9cB9485B6485BA2410595030E65')
        .send({from: event_organizer[0], gasprice: 0})
        await eventInstance.methods
        .create_event(title,luogo,date,seats,price,'0x6E32F255f7548A3765D373278F423dcAf7329782')
        .send({ from: event_organizer[0]})
        .then((receipt) => {
          console.log(receipt);
        });
      
      // notifica di successo
      renderNotification('success', 'Successo', `Evento creato correttamente!`);

      // indicazione di caricamento nel bottone
      this.setState({buttonText: "Pubblica evento"});
      this.setState({ buttonEnabled: true});

    }

    catch(err){
        if(err.message === 'MetaMask Tx Signature: User denied transaction signature.'){
          renderNotification('danger', 'Errore: ', 'Transazione anullata dal utente');
        } else {
          renderNotification('danger', 'Errore: ', 'Non sei autorizzato a compiere questa azione');
        }
        this.setState({ buttonText: "Pubblica evento" });
        this.setState({ buttonEnabled: true });
      }
    }

    inputChangedHandler = (e) => {
      const state = this.state;
      state[e.target.name] = e.target.value;
      this.setState(state);
  
  
     if(this.state.title === '' || 
         this.state.luogo === '' ||
         this.state.date=== '' ||
         this.state.seats=== '' ||
         this.state.price === ''  ) {
           this.setState({buttonEnabled: false})
          } else {
            this.setState({buttonEnabled: true})
          } 
    }

























 render() {
    return (
      <div className="container" align="center" >
        <h4 className="center page-title">Creazione Evento</h4>
        <form className="form-create-event" onSubmit={this.onCreateEvent}>
          <label className="left">Titolo</label><br /><input id="title" type="text" className="validate" name="title" value={this.state.title} onChange={this.inputChangedHandler} /><br /><br />
          <label className="left">Luogo</label><br /><input id="luogo"  type="text" className="validate" name="luogo" value={this.state.luogo} onChange={this.inputChangedHandler} /><br /><br />
          <label className="left">Data</label><br /><input id="date" type="text" className="input-control" name="date" value={this.state.date} onChange={this.inputChangedHandler}></input><br /><br />
          <label className="left">Numero Biglietti </label><br /><input id="seats" placeholder="10" type="number" className="input-control" name="seats" value={this.state.seats} onChange={this.inputChangedHandler} /><br /><br />
          <label className="left">Prezzo (ETH) </label><br /><input id="price" placeholder="100" type="number" className="input-control" name="price" value={this.state.price} onChange={this.inputChangedHandler}></input><br /><br />
        <button type="submit" disabled={!this.state.buttonEnabled} className="btn waves-effect waves-light button-submit-form">{this.state.buttonText}</button>
        </form>
      </div>
    )
  }
  }

  export default CreateEvent;