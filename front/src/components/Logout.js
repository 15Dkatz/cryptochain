import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Auth from '../modules/Auth';

class Logout extends Component {

  logout = () => {
    fetch(`${document.location.origin}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      }
    })
    .then( res => res.json() )
    .then( json => {
      alert(json.message || json.type);
      if(json.type === 'success') {
        Auth.logout();
      }
    })
    .catch(err => alert(err.message));
  }

  render() {
    return(
      <div className='Logout'>
        <Button
          variant='danger'
          size='sm'
          onClick={this.logout}
        >Logout</Button>
      </div>
    );
  }
}

export default Logout;
