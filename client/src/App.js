import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import ReactNotification from 'react-notifications-component';
import Web3 from 'web3'

import CreateEvent from './components/CreateEvent.jsx';
import GetEvent from './components/GetEvent.jsx';

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
        <nav className="navbar navbar-expand-sm bg-light navbar-light">
        <ul className="navbar-nav">
        <li className="nav-item" align="left">Account:{this.state.account}</li>
        <li className="nav-item">
        <a className="nav-link" href="#"><Link to="/getevents">Event</Link></a>
        </li>
        {/*<li class="nav-item">
        <a class="nav-link" href="buyticket.html"><Link to="/buyTickets">Ticket</Link></a>
        </li>*/}
        <li className="nav-item" align="center">
        <Link to="/event">Create Event</Link>
        </li>
        {/*<li class="nav-item">
        <a class="nav-link" href="#"><Link to="/tickets">My ticket</Link></a>
        </li>*/}
       </ul>
       </nav>
        <Switch>
          <Route path="/event" component={CreateEvent} />
          <Route path="/getevents" component={GetEvent} />

        </Switch>
      </div>

    </Router >
    
  );
}
}

export default App;