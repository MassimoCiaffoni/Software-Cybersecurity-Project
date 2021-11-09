import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import ReactNotification from 'react-notifications-component';
import Web3 from 'web3'

import CreateEvent from './components/CreateEvent.jsx';
import GetEvent from './components/GetEvent.jsx';
import GetTickets from './components/GetTickets.jsx';
import './App.css'
import InsertUserData from './components/InsertUserData.jsx';
import ValidateTicket from './components/ValidateTicket.jsx';
import Admin from './components/Admin.jsx';
import logger from './utils/log-api.js'

class App extends Component {
  constructor() {
    super();

    this.state = { account: {
      address:'',
      type: '',
      },
      data: null,
    }

    new Promise((resolve, reject) => {
      if (typeof window.ethereum !== 'undefined') {
        new Web3(window.ethereum);
        window.ethereum.enable()
          .then(() => {
            resolve(
              new Web3(window.ethereum)
            );
          })
          .catch(e => {
            reject(e);
          });
        return;
      }
      if (typeof window.web3 !== 'undefined') {
        return resolve(
           new Web3(window.web3.currentProvider)
        );
      }
      resolve(new Web3('http://127.0.0.1:7545'));
    });
    
    window.ethereum.on('accountsChanged', function () {
      window.location.reload();
    });
    this.getAccount();    
    
  }

  async getAccount() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545")
    const accounts=await web3.eth.getAccounts()
    this.setState((prevState) => ({
      account: { ...prevState.account, address: accounts[0]}, }));
    this.setAccountType(accounts[0]);
    logger.log("info","Connected with account "+this.state.account.type+" : "+ accounts[0] );
  }

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
                <div>{this.state.data}</div>
        </div>
        <Switch>
          <Route path="/event" component={CreateEvent} />
          <Route path="/getevent" component={GetEvent} />
          <Route path="/buy-ticket" component={InsertUserData} />
          <Route path="/tickets" component={GetTickets} />
          <Route path="/admin" component={Admin} />



        </Switch>
        </div>

        </Router >
    
      );
    


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
  
  
          </Switch>
          </div>
  
          </Router >
      
        );

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
  
  
          </Switch>
          </div>
  
          </Router >
      
        );

  }




}

}

export default App;