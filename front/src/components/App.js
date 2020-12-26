import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Wallet from './Wallet';
import CreateWallet from './CreateWallet';
import logo from '../assets/logo.png';

class App extends Component {

  state = { displayWallet: JSON.parse(localStorage.getItem('wallet')) || false };

  constructor(props) {
    super(props)
    this.toggleWallet = this.toggleWallet.bind(this);
  }

  toggleWallet = () => {
    this.setState({ displayWallet: !this.state.displayWallet });
    localStorage.setItem('wallet', JSON.stringify(this.state.displayWallet));
  }

  download = () => {
    fetch(`${document.location.origin}/api/download`)
    .then(res => res.blob())
    .then( blob => this.link(blob))
    .catch(err => alert(err.message));
  }

  link = (blob) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `blockchain-${Date.now()}.json`;
     // 3. Append to html page
     document.body.appendChild(link);
     // 4. Force download
     link.click();
     // 5. Clean up and remove the link
     window.URL.revokeObjectURL(url);
     link.remove();
  }

  get displayWallet() {

    if(this.state.displayWallet) {
      return (
        <div>
          <Wallet/>
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
        <img className='logo' src={logo}></img>
        <br/>
        <h3>Welcome to the blockchain...</h3>
        <br/>
        <div>
          <Button
            variant='info'
            size='sm'
            onClick={this.download}
          >Download as JSON file</Button>
        </div>
        <br/>
        {this.displayWallet}
      </div>
    );
  }
}

export default App;
