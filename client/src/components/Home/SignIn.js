import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, FormGroup, FormControl, FormLabel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { login } from '../../redux/features/auth/authSlice';

const SignIn = ({ ...props }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return(
    <Form>
      <FormGroup>
        <FormLabel>Email Address</FormLabel>
        <FormControl
          input='email'
          type='email'
          placeholder='John@protonmail.ch'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>Password</FormLabel>
        <FormControl
          input='password'
          type='password'
          placeholder='Your password here'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </FormGroup>
      {props.children}
      <Button
        variant='danger'
        size='sm'
        onClick={() => dispatch(login({ email, password }))}
      >Submit</Button>
    </Form>
  );
};

export default SignIn;
