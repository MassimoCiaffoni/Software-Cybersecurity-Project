import React, { Component } from 'react';
import Web3 from 'web3';
import Event from "contracts/Event.json";


let web3;

class GetEvent extends Component {
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
                  </tr>
              )}
          </tbody>
      </table>
      </div>
    );}  
  }

export default GetEvent;