import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';
import App from './App';
import Sign from './Sign';

class Home extends Component {
  render() {
    return (
      <div className='Home'>
        {Auth.isAuthenticate() ? this.props.history.push('/dashboard') : this.props.history.push('/sign')}
      </div>
    );
  }
}

export default Home;
