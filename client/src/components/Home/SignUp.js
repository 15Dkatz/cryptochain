import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, FormGroup, FormControl, FormLabel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { register } from '../../redux/features/auth/authSlice';

const SignUp = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  return(
    <Form>
      <FormGroup>
        <FormLabel>Username</FormLabel>
        <FormControl
          input='username'
          type='text'
          placeholder='Pseudo'
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>Email</FormLabel>
        <FormControl
          input='email'
          type='email'
          placeholder='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>Pawword</FormLabel>
        <FormControl
          input='password'
          type='password'
          placeholder='Your password here'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>Confirm Password</FormLabel>
        <FormControl
          input='confirm'
          type='password'
          placeholder='Confirm your password'
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />
      </FormGroup>
      <Link to='/signin'>Login</Link>
      <Button
        variant='danger'
        size='sm'
        onClick={() => {
          if(password !== confirm) return alert('password must match confirm');
          else dispatch(register({ username, email, password }))
        }}
      >Submit</Button>
    </Form>
  );
};

export default SignUp;
