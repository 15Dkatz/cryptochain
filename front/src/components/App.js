import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Wallet from './Wallet';
import CreateWallet from './CreateWallet';

class App extends Component {

  state = { displayWallet: localStorage.getItem('wallet') !== null || false };

  constructor(props) {
    super(props)
    this.toggleWallet = this.toggleWallet.bind(this);
  }

  toggleWallet = () => {
    localStorage.setItem('wallet', !this.state.displayWallet)
    this.setState({ displayWallet: !this.state.displayWallet });
  }

  get displayWallet() {

    if(this.state.displayWallet) {
      return (
        <div>
          <Wallet />
        </div>
      );
    }

    return (
      <div>
        <CreateWallet handler = {this.toggleWallet}/>
      </div>
    );
  }

  render() {
    return (
      <div className='App'>
        {this.displayWallet}
      </div>
    );
  }
}

export default App;
