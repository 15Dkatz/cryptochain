import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import AuthRoute from './Route/AuthRoute';
import PrivateRoute from './Route/PrivateRoute';
import Auth from './Home/Auth';
import Layout from './Layout';
import Menu from './Dashboard/Menu';
import Navigation from './Navigation';
import Blocks from './Dashboard/Blocks';
import ConductTransaction from './Dashboard/ConductTransaction';
import TransactionPool from './Dashboard/TransactionPool';

const mapState = state => ({ isLogged: state.auth.isLogged });

const App = ({ ...props }) => {
  return (
    <Layout>
      <BrowserRouter>
        { props.isLogged ? <Navigation /> : false }
        <Switch>
          <AuthRoute path='/auth' isLogged={props.isLogged} component={Auth} />
          <PrivateRoute exact path='/' isLogged={props.isLogged} component={Menu} />
          <PrivateRoute path='/blocks' isLogged={props.isLogged} component={Blocks} />
          <PrivateRoute path='/conduct-transaction' isLogged={props.isLogged} component={ConductTransaction} />
          <PrivateRoute path='/transaction-pool' isLogged={props.isLogged} component={TransactionPool} />
        </Switch>
      </BrowserRouter>
    </Layout>
  );
}

export default connect(mapState)(App);
