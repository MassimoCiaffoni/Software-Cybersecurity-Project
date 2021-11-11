import React, { Component } from 'react';
import welcome from '../images/welcome.gif'

class Welcome extends Component {
  constructor() {
    super();
     
    

  }

  render() {
    return (<img class="welcome" src={welcome} alt="welcome" />)
  }
}  export default Welcome;