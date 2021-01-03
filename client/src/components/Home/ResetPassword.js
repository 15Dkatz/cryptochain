import React, { Component } from 'react';
import { Form, FormGroup, FormControl, FormLabel, Button } from 'react-bootstrap';
import { authAPI } from '../../services';

class ResetPassword extends Component {

  state = { password: '', confirm: '' };

  #resetPassword() {
    authAPI.fetchResetPassword({
      id: this.props.match.params.user_id,
      token: this.props.match.params.token,
      password: this.state.password
    })
    .then(json => {
      alert(json.type || json.message);
      if(json.type === 'success') this.props.history.push('/signin');
    })
    .catch(err => alert(err.message));
  }

  render() {
    return(
      <Form>
        <FormGroup>
          <FormLabel>New Password</FormLabel>
          <FormControl
            input='password'
            type='password'
            placeholder=''
            value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Confirm password</FormLabel>
          <FormControl
            input='confirm'
            type='password'
            placeholder=''
            value={this.state.confirm}
            onChange={e => this.setState({ confirm: e.target.value })}
          />
        </FormGroup>
        <Button
          variant='danger'
          size='sm'
          onClick={() => {
            if(this.state.password !== this.state.confirm) return alert('password must match confirm');
            else this.#resetPassword();
          }}
        >Submit</Button>
      </Form>
    );
  }
}

export default ResetPassword;
