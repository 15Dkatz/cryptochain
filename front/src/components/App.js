import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

class App extends Component {
  state = { walletInfo: {} };

  saveToFile = () => {
    fetch(`${document.location.origin}/api/save-to-file`)
      .then(res => res.json())
      .then( json => {
        alert(json.message || json.type);
      })
      .catch(err => alert(err.message));
  }

  download = () => {
    fetch(`${document.location.origin}/api/reload-from-file`)
    .then(res => res.json())
    .then( json => {
      alert(json.message || json.type);
    })
    .catch(err => alert(err.message));
  }

  componentDidMount() {
    fetch(`${document.location.origin}/api/wallet-info`)
      .then(res => res.json())
      .then( json => this.setState({ walletInfo: json }));
  }

  render() {
    const { address, balance } = this.state.walletInfo;

    return (
      <div className='App'>
        <img className='logo' src={logo}></img>
        <br/>
        <div>Welcome to the blockchain...</div>
        <br/>
        <div><Link to='/blocks'>Blocks</Link></div>
        <div><Link to='/conduct-transaction'>Conduct a Transaction</Link></div>
        <div><Link to='/transaction-pool'>Transaction Pool</Link></div>
        <div>
          <Button
            variant='info'
            size='sm'
            onClick={this.saveToFile}
          >Save chain to filesystem</Button>
          <Button
            variant='danger'
            size='sm'
            onClick={this.download}
          >Reload chain from filesystem</Button>
        </div>
        <br/>
        <div className='WalletInfo'>
          <div>Address : {address}</div>
          <div>Balance : {balance}</div>
        </div>
      </div>
    );
  }
}

export default App;
