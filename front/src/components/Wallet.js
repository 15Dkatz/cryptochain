import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

class Wallet extends Component {
  state = { walletInfo: {} };

  componentDidMount() {
    fetch(`${document.location.origin}/api/wallet-info`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      }
    })
    .then( res => {
      if(!res.ok) throw new Error(`Request rejected with status ${res.status}`);
      return res.json();
    })
    .then( json => this.setState({ walletInfo: json }))
    .catch(err => alert(err.message) );
  }

  render() {
    const { address, balance } = this.state.walletInfo;

    return (
      <div className='Wallet'>
        <div><Link to='/blocks'>Blocks</Link></div>
        <div><Link to='/conduct-transaction'>Conduct a Transaction</Link></div>
        <div><Link to='/transaction-pool'>Transaction Pool</Link></div>
        <br/>
        <div className='WalletInfo'>
          <div>Address : {address}</div>
          <div>Balance : {balance}</div>
        </div>
      </div>
    );
  }
}

export default Wallet;
