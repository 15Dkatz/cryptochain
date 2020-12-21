import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

class ConductTransaction extends Component {
  state = { recipient: '', amount: 0, knownAddresses: [] };

  fetchKnownAddresses() {
    fetch(`${document.location.origin}/api/known-addresses`)
    .then(res => res.json())
    .then(json => this.setState({ knownAddresses: json }));
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
    this.setState({ amount: Number(event.target.value) });
  }

  conductTransaction = () => {
    const { recipient, amount } = this.state;
    fetch(`${document.location.origin}/api/transact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient, amount })
    }).then(res => res.json())
    .then(json => {
      alert(json.message || json.type);
      if(json.type === 'success') {
        this.props.history.push('/transaction-pool');
      }
    });
  };

  render() {
    return (
      <div className='ConductTransaction'>
        <Link to='/'>Home</Link>
        <h3>Conduct a Tranasction</h3>
        <br/>
        <h4>Known Addresses</h4>
        {
          this.state.knownAddresses.map(knownAddress =>
            <div key={knownAddress}>
              <div>{knownAddress}</div>
              <br/>
            </div>
          )
        }
        <br/>
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
