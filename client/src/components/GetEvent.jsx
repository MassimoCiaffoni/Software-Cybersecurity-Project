import React, { Component } from 'react';
import Web3 from 'web3';
import Event from "contracts/Event.json";


let web3;

class GetEvent extends Component {
  constructor() {
    super();
    
    this.state = {
      


    
    };
    
    web3=new Web3(window.web3.currentProvider)
    this.onGetEvent();
  }

  onGetEvent = async () => {
    try{
        const visitator = await web3.eth.getCoinbase();
        console.log(visitator)
        const id = await web3.eth.net.getId();
        const eventInstance = new web3.eth.Contract(Event.abi,Event.networks[id].address);
        console.log(eventInstance)
        const event_list=eventInstance.methods
        .get_events()
        .call({from: visitator});
        }
    catch(e){
        console.log("Error while updating the events");
        }
    }
  render() {
    return (
      <div>
      <h1>Evento: {}</h1>
      </div>
    );

  }
}

export default GetEvent;