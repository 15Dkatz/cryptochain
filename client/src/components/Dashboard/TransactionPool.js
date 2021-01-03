import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Transaction from './Transaction';
import io from 'socket.io-client';
import { transactionPoolAPI } from '../../services';

class TransactionPool extends Component {
  state = { transactionPoolMap: {} };

  #fetchTransactionPoolMap() {
    transactionPoolAPI.fetchTransactionPoolMap()
    .then(json => this.setState({ transactionPoolMap: json }))
    .catch(err => alert(err.message));
  }

  #fetchMineTransactions = () => {
    transactionPoolAPI.fetchMineTransactions()
    .then(json => {
      alert(json.message || json.type);
      this.props.history.push('/blocks');
    })
    .catch(err => alert(err.message));
  }

  componentDidMount() {
    this.socket = io();
    this.socket.on('transaction', () => this.#fetchTransactionPoolMap());
    this.#fetchTransactionPoolMap();
  }

  componentWillUnmount() {
    this.socket.close();
  }

  render() {
    return (
      <div className='TransactionPool'>
        <h3>Transaction Pool</h3>
        <ul>
          {
            Object.values(this.state.transactionPoolMap).map(transaction =>
              <li key={transaction.id}>
                <Transaction transaction={transaction} />
              </li>
            )
          }
        </ul>
        <Button
          variant='danger'
          size='sm'
          onClick={this.#fetchMineTransactions}>Mine the Transactions</Button>
      </div>
    );
  }
}

export default TransactionPool;
