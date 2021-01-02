import React, { Component } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { logout } from '../../redux/features/auth/authSlice';

const Logout = () => {
  const dispatch = useDispatch();

  return(
    <Button
      variant='danger'
      size='sm'
      onClick={() => dispatch(logout())}
    >Logout</Button>
  );
}

export default Logout;
