import React, { Component } from 'react';
import welcome from '../images/welcome.gif'

//welcome page 
class Welcome extends Component {
  
  render() {
    //show gif of welcome page
    return (<img class="welcome" src={welcome} alt="welcome" />)
  }

}  export default Welcome;