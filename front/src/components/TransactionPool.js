import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Transaction from './Transaction';
import io from 'socket.io-client';
import Header from './Header';

class TransactionPool extends Component {
  state = { transactionPoolMap: {} };

  fetchTransactionPoolMap = () => {
    fetch(`${document.location.origin}/api/transaction-pool-map`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      }
    })
    .then( res => {
      if(res.ok) {
        return res.json()
      }
      throw new Error(`Request rejected with status ${res.status}`);
    })
    .then(json => this.setState({ transactionPoolMap: json }))
    .catch(err => alert(err.message));
  }

  fetchMineTransactions = () => {
    fetch(`${document.location.origin}/api/mine-transactions`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      }
    })
    .then( res => {
      if(res.ok) {
        alert('success');
        this.props.history.push('/blocks');
      } else {
        throw new Error(`Request rejected with status ${res.status}`);
      }
    })
    .catch(err => alert(err.message) );
  }

  componentDidMount() {
    this.socket = io();
    this.socket.on('sync', () => {
      this.fetchTransactionPoolMap();
    });
    this.fetchTransactionPoolMap();
  }

  componentWillUnmount() {
    this.socket.close();
  }

  render() {
    return (
      <div className='TransactionPool'>
        <Header />
        <div><Link to='/dashboard'>Dashboard</Link></div>
        <h3>Transaction Pool</h3>
        {
          Object.values(this.state.transactionPoolMap).map(transaction =>
            <div key={transaction.id}>
              <hr/>
              <Transaction transaction={transaction} />
            </div>
          )
        }
        <hr/>
        <Button
          variant='danger'
          size='sm'
          onClick={this.fetchMineTransactions}>Mine the Transactions</Button>
      </div>
    );
  }
}

export default TransactionPool;
