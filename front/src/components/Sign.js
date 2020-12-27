import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Auth from '../modules/Auth';
import Header from './Header';

class Sign extends Component {

  state = { username: '', email: '', password: '', confirm: '', hasAccount: Auth.isAuthenticate() || false };

  toggleHasAccount = () => {
    this.setState({ hasAccount: !this.state.hasAccount });
  }

  updateUsername = event => {
    this.setState({ username: event.target.value });
  }

  updateEmail = event => {
    this.setState({ email: event.target.value });
  }

  updatePassword = event => {
    this.setState({ password: event.target.value });
  }

  updateConfirm = event => {
    this.setState({ confirm: event.target.value });
  }

  signIn = () => {
    const { email, password } = this.state;
    fetch(`${document.location.origin}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then( res => {
      if(res.ok) {
        return res.json()
      }
      throw new Error(`Request rejected with status ${res.status}`);
    })
    .then(json => {
      Auth.authenticate(json.jwt);
      this.props.history.push('/dashboard');
    })
    .catch(err => alert(err.message));
  }

  signUp = () => {
    const { username, email, password, confirm } = this.state;
    if(password !== confirm) return alert('password must match confirm');
    fetch(`${document.location.origin}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })
    .then( res => {
      if(res.ok) {
        return res.json()
      }
      throw new Error(`Request rejected with status ${res.status}`);
    })
    .then(json => {
      this.signIn();
    })
    .catch(err => alert(err.message));
  }

  get signInOrSignUp() {
    if(this.state.hasAccount) {
      return(
        <div>
          <FormGroup>
            <FormControl
              input='email'
              type='email'
              placeholder='email'
              value={this.state.email}
              onChange={this.updateEmail}
            />
          </FormGroup>

          <FormGroup>
            <FormControl
              input='password'
              type='password'
              placeholder='password'
              value={this.state.password}
              onChange={this.updatePassword}
            />
          </FormGroup>
          <div>
            <Button
              variant='info'
              size='sm'
              onClick={this.toggleHasAccount}
            >Create account</Button>
            <Button
              variant='danger'
              size='sm'
              onClick={this.signIn}
            >Submit</Button>
          </div>
        </div>
      );
    }

    return(
      <div>
        <FormGroup>
          <FormControl
            input='username'
            type='text'
            placeholder='username'
            value={this.state.username}
            onChange={this.updateUsername}
          />
        </FormGroup>
        <FormGroup>
          <FormControl
            input='email'
            type='email'
            placeholder='email'
            value={this.state.email}
            onChange={this.updateEmail}
          />
        </FormGroup>
        <FormGroup>
          <FormControl
            input='password'
            type='password'
            placeholder='password'
            value={this.state.password}
            onChange={this.updatePassword}
          />
        </FormGroup>
        <FormGroup>
          <FormControl
            input='confirm'
            type='password'
            placeholder='confirm'
            value={this.state.confirm}
            onChange={this.updateConfirm}
          />
        </FormGroup>
        <div>
        <Button
          variant='info'
          size='sm'
          onClick={this.toggleHasAccount}
        >Already have an account</Button>
          <Button
            variant='danger'
            size='sm'
            onClick={this.signUp}
          >Submit</Button>
        </div>
      </div>
    );
  }

  render() {

    return (
      <div className='Sign'>
        <Header />
        {this.signInOrSignUp}
      </div>
    );
  }
}

export default Sign;
