import React from 'react';
import { Link } from 'react-router-dom';

const Nav = ({ ...props }) => {
  return(
    <nav>
      <ul>
        <li><Link to='/'>Wallet</Link></li>
        <li><Link to='/blocks'>Blocks</Link></li>
        <li><Link to='/conduct-transaction'>Conduct a Transaction</Link></li>
        <li><Link to='/transaction-pool'>Transaction Pool</Link></li>
      </ul>
      { props.children }
    </nav>
  );
};

export default Nav;
