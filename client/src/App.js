import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import ReactNotification from 'react-notifications-component';
import Web3 from 'web3'

import CreateEvent from './components/CreateEvent';

class App extends Component {
  constructor() {
    super();

    this.state = { account: '',
    balance: ''}

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
  }


render() {
  return (
    <Router>


      <div >
        <ReactNotification />
        <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
        <ul class="navbar-nav">
        {/*<li class="nav-item active">
        <a class="nav-link" href="#">User</a>
        </li>
        <li class="nav-item">
        <a class="nav-link" href="#"><Link to="/getevents">Event</Link></a>
        </li>
        <li class="nav-item">
        <a class="nav-link" href="buyticket.html"><Link to="/buyTickets">Ticket</Link></a>
        </li>*/}
        <li class="nav-item">
        <a class="nav-link" href="#"><Link to="/event">Create Event</Link></a>
        </li>
        {/*<li class="nav-item">
        <a class="nav-link" href="#"><Link to="/tickets">My ticket</Link></a>
        </li>*/}
       </ul>
       </nav>
        <Switch>
          <Route path="/event" component={CreateEvent} />
        </Switch>
      </div>

    </Router >
    
  );
}
}

export default App;