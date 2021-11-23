import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import ReactNotification from 'react-notifications-component';
import Web3 from 'web3'
import './App.css'
//import component
import CreateEvent from './components/CreateEvent.jsx';
import GetEvent from './components/GetEvent.jsx';
import GetTickets from './components/GetTickets.jsx';
import Welcome from './components/Welcome.jsx';
import InsertUserData from './components/InsertUserData.jsx';
import ValidateTicket from './components/ValidateTicket.jsx';
import Admin from './components/Admin.jsx';
import ModifyEvent from './components/ModifyEvent';
import ModifyTicket from './components/ModifyTicket';
//import logger used for logging event to server
import logger from './utils/log-api.js'


class App extends Component {
  constructor() {
    super();

    //state to save account data
    this.state = { 
      account: {
        address:'',
        type: '',
      }
    }

    //event to reload the page when changhe the account of metamask 
    window.ethereum.on('accountsChanged', function () {
      window.location.reload();
    });

    //get the currently connected account
    this.getAccount();    
        
  }

  //function that get the account information from blockchain and log the connection
  async getAccount() {
    //connect with web3 blockchain
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545")
    //get accounts from blockchain
    const accounts=await web3.eth.getAccounts()
    //set the state with account address
    this.setState((prevState) => ({account: { ...prevState.account, address: accounts[0]}}));
    //set the state with account type
    this.setAccountType(accounts[0]);
    //log the connection of this account
    if(this.state.account.type)
      logger.log("info","Connected with account "+this.state.account.type+" : "+ accounts[0] );
  }

  //function that get different account type from the address
  setAccountType(current_account) {
    switch (current_account) {
      case "0x1f60a7C633DF64183c524C511BCAE908d65DD70c":
        this.setState((prevState) => ({
          account: { ...prevState.account, type: "event manager" },
        }));
        break;
      case "0x755E4DAA0f81c115451b76e9998e1BBA3B11602F":
        this.setState((prevState) => ({
          account: { ...prevState.account, type: "validator" },
        }));
        break;
      default:
        this.setState((prevState) => ({
          account: { ...prevState.account, type: "buyer" },
        }));
        break;
    }
  }
  

render() {
  
  switch (this.state.account.type) {
    case "event manager":
      //if the account is event manager, display all page
      return (
        
        <Router>          
          <div >
            <ReactNotification />
            <div className="App">
              <header>
                <div className="container">
                <div className="address">Address: &ensp;<span>{this.state.account.address}</span></div>
                <div className="address">Type: &ensp;<span>{this.state.account.type}</span></div>
                  <Link to='/getevent' activeClassName="is-active">Event</Link>
                  <Link activeClassName='is-active' to="/event">Create Event</Link>
                  <Link activeClassName='is-active' to="/tickets">My Tickets</Link>
                  <Link activeClassName='is-active' to="/admin">Admin Options</Link>
                </div>
              </header>
            </div>
            
            <Switch>
              <Route path="/event" component={CreateEvent} />
              <Route path="/getevent" component={GetEvent} />
              <Route path="/buy-ticket" component={InsertUserData} />
              <Route path="/tickets" component={GetTickets} />
              <Route path="/admin" component={Admin} />
              <Route path="/modify-event" component={ModifyEvent} />
              <Route path="/modify-ticket" component={ModifyTicket} />
              <Route path="/" component={Welcome} />
            </Switch>
          </div>          
        </Router >
    
      );
    

      //if the account is validator, display the validation page
      case "validator":
        return (
          <Router>  
            <div >
              <ReactNotification />
              <div className="App">
                <header>
                  <div className="container">
                  <div className="address">Address: &ensp;<span>{this.state.account.address}</span></div>
                  <div className="address">Type: &ensp;<span>{this.state.account.type}</span></div>
                    <Link to='/getevent' activeClassName="is-active">Event</Link>
                    <Link activeClassName='is-active' to="/tickets">My Tickets</Link>
                    <Link activeClassName='is-active' to="/validation">Validate Tickets</Link>
                  </div>
                </header>
              </div>
              <Switch>
                <Route path="/getevent" component={GetEvent} />
                <Route path="/buy-ticket" component={InsertUserData} />
                <Route path="/tickets" component={GetTickets} />
                <Route path="/validation" component={ValidateTicket} />
                <Route path="/modify-ticket" component={ModifyTicket} />
                <Route path="/" component={Welcome} />      
              </Switch>
            </div>    
          </Router >
      
        );

      //if is a buyer, display only the event list, buy ticket section and his purchased ticket
      default:
        return (
          <Router>  
            <div >
              <ReactNotification />
              <div className="App">
                <header>
                  <div className="container">
                  <div className="address">Address: &ensp;<span>{this.state.account.address}</span></div>
                  <div className="address">Type: &ensp;<span>{this.state.account.type}</span></div>
                    <Link to='/getevent' activeClassName="is-active">Event</Link>
                    <Link activeClassName='is-active' to="/tickets">My Tickets</Link>
                  </div>
                </header>
              </div>
              <Switch>
                <Route path="/getevent" component={GetEvent} />
                <Route path="/buy-ticket" component={InsertUserData} />
                <Route path="/tickets" component={GetTickets} />
                <Route path="/modify-ticket" component={ModifyTicket} />
                <Route path="/" component={Welcome} />      
              </Switch>
            </div>  
          </Router >
      
        );

  }

}

}

export default App;