import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import ReactNotification from 'react-notifications-component';
import Web3 from 'web3'

import CreateEvent from './components/CreateEvent.jsx';
import GetEvent from './components/GetEvent.jsx';
import GetTickets from './components/GetTickets.jsx';
import './App.css'
import InsertUserData from './components/InsertUserData.jsx';

class App extends Component {
  constructor() {
    super();

    this.state = { account: ''}

    new Promise((resolve, reject) => {
      if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
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
    this.setState({account: accounts[0]})
  }


render() {
  return (
    <Router>



      <div >
      <ReactNotification />
      <div className="App">
                <header>
                    <div className="container">
                    <div className="address">Address: &ensp;<span>{this.state.account}</span></div>
                        <Link to='/getevent' activeClassName="is-active">Event</Link>
                        <Link activeClassName='is-active' to="/event">Create Event</Link>
                        <Link activeClassName='is-active' to="/tickets">My Tickets</Link>
                    </div>
                </header>
      </div>
      <Switch>
        <Route path="/event" component={CreateEvent} />
        <Route path="/getevent" component={GetEvent} />
        <Route path="/buy-ticket" component={InsertUserData} />
        <Route path="/tickets" component={GetTickets} />

      </Switch>
      </div>

    </Router >
    
  );
}
}

export default App;