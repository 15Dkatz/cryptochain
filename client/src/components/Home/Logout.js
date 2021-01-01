import React, { Component } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { logout } from '../../redux/features/auth/authSlice';

const Logout = () => {
  const dispatch = useDispatch();

  return(
    <div className='Logout'>
      <Button
        variant='danger'
        size='sm'
        onClick={() => dispatch(logout())}
      >Logout</Button>
    </div>
  );
}

export default Logout;
