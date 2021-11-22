import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import EventEmitter from "./EventEmitter.js"

export default class ConfirmDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
        open: true,
        result: ""
    };

    this.emitter = new EventEmitter()
  }

  open = () => {
    this.setState({ open: true , result: ""});
    this.emitter = new EventEmitter()
    return(this.emitter)
  };

  yes = () => {
    this.setState({ result: "yes" , open: false}); 
    this.emitter.emit && this.emitter.emit('confirm', { message: 'yes' })
  };
  
  no = () => {
    this.setState({ result: "no", open: false });  
    this.emitter.emit && this.emitter.emit('confirm', { message: 'no' })
  };
  
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



