import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

class ConductTransaction extends Component {
  state = { recipient: '', amount: 0, knownAddresses: [] };

  fetchKnownAddresses() {
    fetch(`${document.location.origin}/api/known-addresses`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      }
    })
    .then( res => {
      if(!res.ok) throw new Error(`Request rejected with status ${res.status}`);
      return res.json();
    })
    .then(json => this.setState({ knownAddresses: json }) )
    .catch(err => alert(err.message));
  }

  componentDidMount() {
    this.socket = io();
    this.socket.on('newAddress', () => {
      this.fetchKnownAddresses();
    });
    this.fetchKnownAddresses();
  }

  componentWillUnmount() {
    this.socket.close();
  }

  updateRecipient = event => {
    this.setState({ recipient: event.target.value });
  }

  updateAmount = event => {
    if( !Number.isNaN()) {
      this.setState({ amount: Number(event.target.value) || 0 });
    }
  }

  conductTransaction = () => {
    const { recipient, amount } = this.state;
    fetch(`${document.location.origin}/api/transact`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ recipient, amount })
    })
    .then( res => {
      if(!res.ok) throw new Error(`Request rejected with status ${res.status}`);
      return res.json();
    })
    .then( json => {
      alert(json.message || json.type);
      if(json.type === 'success') {
        this.props.history.push('/transaction-pool');
      }
    })
    .catch(err => alert(err.message));
  }

  render() {
    return (
      <div className='ConductTransaction'>
        <Link to='/dashboard'>Dashboard</Link>
        <h3>Conduct a Transaction</h3>
        <h4>Known Addresses</h4>
        {
          this.state.knownAddresses.map( address =>
            <div key={address[0]}>
              <div>{address[0]} - {address[1]}</div>
            </div>
          )
        }
        <FormGroup>
          <FormControl
            input='text'
            placeholder='recipient'
            value={this.state.recipient}
            onChange={this.updateRecipient}
          />
        </FormGroup>
        <FormGroup>
          <FormControl
            input='number' placeholder='amount'
            value={this.state.amount}
            onChange={this.updateAmount}
          />
        </FormGroup>
        <div>
          <Button
            variant='danger'
            size='sm'
            onClick={this.conductTransaction}
          >Submit</Button>
        </div>
      </div>
    );
  }
}

export default ConductTransaction;
