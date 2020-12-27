import React from 'react';
import logo from '../assets/logo.png';

const Header = () => {
  return(
    <div className='Header'>
      <img className='logo' src={logo}></img>
      <br/>
      <h3>Welcome to the blockchain...</h3>
    </div>
  );
}

export default Header;
