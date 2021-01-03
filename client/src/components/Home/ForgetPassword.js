import React, { Component } from 'react';
import { Form, FormGroup, FormControl, FormLabel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services';

class ForgetPassword extends Component {

  state = { email: '' };

  #forgetPassword = () => {
    authAPI.fetchForgetPassword({ email: this.state.email })
    .then(json => {
      alert(json.type || json.message);
    })
    .catch(err => alert(err.message));
  }

  render() {
    return(
      <Form>
        <FormGroup>
          <FormLabel>Email</FormLabel>
          <FormControl
            input='email'
            type='email'
            placeholder=''
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
          />
        </FormGroup>
        <Link to='/signin'>Login</Link>
        <Button
          variant='danger'
          size='sm'
          onClick={this.#forgetPassword}
        >Submit</Button>
      </Form>
    );
  }
}

export default ForgetPassword;
