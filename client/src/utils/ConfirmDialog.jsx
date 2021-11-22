import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default class ConfirmDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
        open: true,
        result: ""
    };
  }

  open = () => {
    this.setState({ open: true , result: ""});
    
  };

  /*close = () => {
    this.setState({ open: false }); 
  };*/

  yes = () => {
    this.setState({ result: "yes" , open: false}); 
    console.log("yes")    
    //this.close()
  };
  
  no = () => {
    this.setState({ result: "no", open: false }); 
    console.log("no")    
    //this.close()
  };
  
  result = () => {
    return new Promise((resolve, reject)=> {
      
        if(this.state.result==="yes"){
          resolve(true)
        }else if(this.state.result==="no"){
          resolve(false)
        }       
      
    });
  }


  render(){
    return (
      <div>
     
      <Dialog
        open={this.state.open}
        onClose={this.no}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {this.props.text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.no}>No</Button>
          <Button onClick={this.yes}>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
    )
  }
}



