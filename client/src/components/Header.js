import React from 'react';
import logo from '../assets/logo.png';
import { Jumbotron } from 'react-bootstrap';

const Header = () => {
  return(
    <header className='Header'>
      <Jumbotron>
        <img className='logo' src={logo}></img>
        <h3>Welcome to the blockchain...</h3>
      </Jumbotron>
    </header>
  );
}


export default Header;
