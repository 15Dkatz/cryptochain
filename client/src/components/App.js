import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import AuthRoute from './Routes/AuthRoute';
import PrivateRoute from './Routes/PrivateRoute';
import SignIn from './Home/SignIn';
import SignUp from './Home/SignUp';
import ForgetPassword from './Home/ForgetPassword';
import ResetPassword from './Home/ResetPassword';
import Layout from './Layout';
import Menu from './Dashboard/Menu';
import Blocks from './Dashboard/Blocks';
import ConductTransaction from './Dashboard/ConductTransaction';
import TransactionPool from './Dashboard/TransactionPool';

const mapState = state => ({ isLogged: state.auth.isLogged });

const App = ({ ...props }) => {
  return (
    <BrowserRouter>
      <Layout isLogged={props.isLogged}>
        <Switch>
          <AuthRoute path='/signin' isLogged={props.isLogged} component={SignIn} />
          <AuthRoute path='/signup' isLogged={props.isLogged} component={SignUp} />
          <AuthRoute path='/forget-password' isLogged={props.isLogged} component={ForgetPassword} />
          <AuthRoute path='/reset-password/:user_id/:token' isLogged={props.isLogged} component={ResetPassword} />
          <PrivateRoute exact path='/' isLogged={props.isLogged} component={Menu} />
          <PrivateRoute path='/blocks' isLogged={props.isLogged} component={Blocks} />
          <PrivateRoute path='/conduct-transaction' isLogged={props.isLogged} component={ConductTransaction} />
          <PrivateRoute path='/transaction-pool' isLogged={props.isLogged} component={TransactionPool} />
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}

export default connect(mapState)(App);
