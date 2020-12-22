import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Transaction from './Transaction';
import io from 'socket.io-client';

class TransactionPool extends Component {
  state = { transactionPoolMap: {} };

  fetchTransactionPoolMap = () => {
    fetch(`${document.location.origin}/api/transaction-pool-map`)
    .then(res => res.json())
    .then(json => this.setState({ transactionPoolMap: json }));
  }

  fetchMineTransactions = () => {
    fetch(`${document.location.origin}/api/mine-transactions`)
    .then( res => {
      if(res.status === 200) {
        alert('success');
        this.props.history.push('/blocks');
      } else {
        alert('The mine-transactions block request did not complete');
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
        <div><Link to='/'>Home</Link></div>
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
