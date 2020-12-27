
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import App from './components/App';
import Blocks from './components/Blocks';
import ConductTransaction from './components/ConductTransaction';
import TransactionPool from './components/TransactionPool';
import Wallet from './components/Wallet';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import Home from './components/Home';
import Sign from './components/Sign';
import history from './history';
import './stylesheets/style.css';

render(
  <Router history={history}>
    <Switch>
      <PublicRoute exact path='/' component={Home} />
      <PublicRoute restricted exact path='/sign' component={Sign} />
      <PrivateRoute exact path='/dashboard' component={App} />
      <PrivateRoute exact path='/blocks' component={Blocks}/>
      <PrivateRoute exact path='/conduct-transaction' component={ConductTransaction}/>
      <PrivateRoute exact path='/transaction-pool' component={TransactionPool}/>
      <PrivateRoute exact path='/wallet' component={Wallet}/>
    </Switch>
  </Router>,
  document.getElementById('root')
);
