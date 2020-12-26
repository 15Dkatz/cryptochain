
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import App from './components/App';
import Blocks from './components/Blocks';
import ConductTransaction from './components/ConductTransaction';
import TransactionPool from './components/TransactionPool';
import Wallet from './components/Wallet';
import history from './history';
import './stylesheets/style.css';

render(
  <Router history={history}>
    <Switch>
      <Route exact path='/' component={App}/>
      <Route path='/blocks' component={Blocks}/>
      <Route path='/conduct-transaction' component={ConductTransaction}/>
      <Route path='/transaction-pool' component={TransactionPool}/>
      <Route path='/wallet' component={Wallet}/>
    </Switch>
  </Router>,
  document.getElementById('root')
);
