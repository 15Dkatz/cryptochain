import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = ({ component: Component, isLogged, ...rest }) => (
  <Route {...rest} render={props => ( isLogged ?
    <Redirect to='/' /> :
    <Component {...props} />
  )} />
);

export default AuthRoute;
