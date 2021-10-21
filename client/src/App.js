import React, { Component } from 'react'
import Web3 from 'web3'

import Event from "contracts/Event.json";
import Ticket from "contracts/Ticket.json";

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData()
  
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545")
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[3] }) 

    const id = await web3.eth.net.getId();
   
    const eventInstance = new web3.eth.Contract(Event.abi,Event.networks[id].address);
    const ticketInstance = new web3.eth.Contract(Event.abi,Ticket.networks[id].address);
    
    console.log(eventInstance);
    console.log(ticketInstance);
    await eventInstance.methods.set_reseller(accounts[3]);
    const newEventID = await eventInstance.methods.create_event('Concerto', 'Ancona', '22/02/2021', 5, 2000, accounts[3]).send({from:accounts[0]});
    console.log(newEventID);
  }

  

  constructor(props) {
    super(props)
    this.state = { account: '' }
  }

  render() {
    return (
      <div className="container">
        <h1>Hello, World!</h1>
        <p>Your account: {this.state.account}</p>
        <p>Your account: {this.newEventID.eventInstance}</p>
      </div>
    );
  }
}

export default App;
