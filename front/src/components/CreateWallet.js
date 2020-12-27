import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import Wallet from './Wallet';

class CreateWallet extends Component {

  state = { privateKey: '', hasPrivateKey: false };

  updateKey = event => {
    this.setState({ privateKey: event.target.value });
  }

  toggleHasPrivateKey = () => {
    this.setState({ hasPrivateKey: !this.state.hasPrivateKey });
  }

  createWallet = () => {
    const { privateKey } = this.state;
    fetch(`${document.location.origin}/api/create-wallet-and-miner`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ privateKey })
    })
    .then( res => {
      if(res.ok) {
        return res.json()
      }
      throw new Error(`Request rejected with status ${res.status}`);
    }).then( json => {
      this.props.handler();
      alert(json.message || json.type);
    })
    .catch(err => alert(err.message));
  }

  get displayPrivateKeyForm() {
    if(this.state.hasPrivateKey) {
      return(
        <div>
          <FormGroup>
            <FormControl
              input='text'
              placeholder='privateKey'
              value={this.state.privateKey}
              onChange={this.updateKey}
            />
          </FormGroup>
          <Button
            variant='info'
            size='sm'
            onClick={this.toggleHasPrivateKey}
          >I haven't got private key</Button>
          <Button
            variant='danger'
            size='sm'
            onClick={this.createWallet}
          >Go</Button>
        </div>
      );
    }

    return(
      <div>
        <Button
          variant='info'
          size='sm'
          onClick={this.toggleHasPrivateKey}
        >I have a private key</Button>
        <Button
          variant='danger'
          size='sm'
          onClick={this.createWallet}
        >Go</Button>
      </div>
    );
  }

  render() {

    return (
      <div className='CreateWallet'>
        <h4>Create Wallet</h4>
        {this.displayPrivateKeyForm}
      </div>
    );
  }
}

export default CreateWallet;
