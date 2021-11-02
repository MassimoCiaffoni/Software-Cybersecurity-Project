import React, { Component } from 'react';
import Web3 from 'web3';
import Event from "contracts/Event.json";


let web3;

class GetTickets extends Component {
  constructor() {
    super();
    
    this.state = {
      
      ticket_list: [],

    
    };
    
    web3=new Web3(window.ethereum)

  }

  async componentDidMount() {
    await this.onGetTicket();
  }

  onGetTicket = async () => {
    try{
      const visitator = await web3.eth.getCoinbase();
      console.log(visitator)
      const id = await web3.eth.net.getId();
      const eventInstance = new web3.eth.Contract(Event.abi,Event.networks[id].address);
      eventInstance.methods
      .get_tickets()
      .call({from: visitator}).then((result) => {
        console.log(result);
        this.setState({ ticket_list: result });  
      });    
      
    }catch(e){
      console.log("Error while updating tickets:"+e);
    }
  }

  render() {
    return (
    <div className="container">
      <h3 className="p-3 text-center">My Tickets</h3>
      <table className="table table-striped table-bordered">
          <thead>
              <tr>
                  <th>TicketID</th>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>EventID</th>
                  <th>Sell</th>
                  <th>Validate</th>
                  <th>Customer</th>
              </tr>
          </thead>
          <tbody>
              {this.state.ticket_list && this.state.ticket_list.map(event =>
                  <tr key={event.ticketid}>
                      <td>{event.ticketid}</td>
                      <td>{event.name}</td>
                      <td>{event.surname}</td>
                      <td>{event.eventid}</td>
                      <td>{event.sell}</td>
                      <td>{event.validate}</td>
                      <td>{event.customer}</td>
                  </tr>
              )}
          </tbody>
      </table>
      </div>
    );}  
  }

export default GetTickets;