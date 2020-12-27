import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Auth from '../modules/Auth';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return(
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route {...rest}
      render={ props => Auth.isAuthenticate() ?
        <Component {...props} /> :
        <Redirect to='/sign' /> }
    />
  );
};

export default PrivateRoute;
