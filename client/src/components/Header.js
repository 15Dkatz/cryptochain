import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem, Button } from 'react-bootstrap';
import Logout from './Home/Logout';
import logo from '../assets/logo.png';

const download = () => {
  fetch(`${document.location.origin}/api/download`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then( res => {
    if(!res.ok) throw new Error(`Request rejected with status ${res.status}`);
    return res.blob();
  })
  .then( blob => link(blob))
  .catch(err => alert(err.message));
}

const link = (blob) => {
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

const Header = ({ ...props }) => {
  return(
    <header>
      <nav className='navbar bg-dark navbar-dark'>
        <img className='logo navbar-brand' src={logo}></img>
        <h3>Welcome to the blockchain...</h3>
        <Nav as='ul' justify>
          <Button
            variant='info'
            size='sm'
            onClick={download}
          >Download as JSON file</Button>
          <NavItem as='li'><Link to='/'>Wallet</Link></NavItem>
          <NavItem as='li'><Link to='/blocks'>Blocks</Link></NavItem>
          <NavItem as='li'><Link to='/conduct-transaction'>Conduct a Transaction</Link></NavItem>
          <NavItem as='li'><Link to='/transaction-pool'>Transaction Pool</Link></NavItem>
          { props.isLogged ? <Logout /> : false}
        </Nav>
      </nav>
    </header>
  );
};

export default Header;
