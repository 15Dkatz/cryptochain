import React from 'react';
import logo from '../assets/logo.png';
import Logout from './Logout';
import Auth from '../modules/Auth';

const Header = () => {
  return(
    <div className='Header'>
      <img className='logo' src={logo}></img>
      <h3>Welcome to the blockchain...</h3>
      {Auth.isAuthenticate() ? <Logout /> : false}
    </div>
  );
}

export default Header;
