import React, { Component } from 'react';
import Web3 from 'web3';
import Event from "contracts/Event.json";
import Button from 'react-bootstrap/Button'
import logger from '../utils/log-api.js'

let web3;

class GetEvent extends Component {
    
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
    //get the address of the user 
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

  //function to buy the ticket and redirect to form to insert user data
  onBuyTicket = async (e) => {   
    this.props.history.push({pathname: '/buy-ticket', state: e.target.value});
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
                  <th>Tickets</th>
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
                      <div class="button-center"><Button variant="primary" type="button" onClick={this.onBuyTicket} value={event.id} disabled={event.remaining_tickets==='0' || event.state==="Concluso" || event.state==="Annullato"}>Buy ticket</Button>{' '}</div>
                  </tr>
              )}
          </tbody>
      </table>
      </div>
    );}  
  }

export default GetEvent;