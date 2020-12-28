import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import logo from '../assets/logo.png';
import Logout from './Logout';
import Auth from '../modules/Auth';

class Header extends Component {

  download = () => {
    fetch(`${document.location.origin}/api/download`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      }
    })
    .then( res => {
      if(!res.ok) throw new Error(`Request rejected with status ${res.status}`);
      return res.blob();
    })
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

  render() {
    return(
      <div className='Header'>
        <img className='logo' src={logo}></img>
        <h3>Welcome to the blockchain...</h3>
        <Button
          variant='info'
          size='sm'
          onClick={this.download}
        >Download as JSON file</Button>
        {Auth.isAuthenticate() ? <Logout /> : false}
      </div>
    );
  }
}

export default Header;
