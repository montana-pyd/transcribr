import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import client from './../util/client';
import { Page } from './../styles/App';
import Input from './../components/Input';
import Button from './../components/Button';
import {
  Container,
  Form,
  Header,
  Text,
} from './../styles/containers/Auth';

export default class Login extends Component {
  constructor() {
    super();
    
    this.state = {
      email: '',
      password: '',
      error: null,
    };
  }
  setField(value, field) {
    this.setState({
      [field]: value,
      error: null,
    });
  }
  login() {
    let { email, password } = this.state;

    client.login(email, password)
    .then(res => {
      this.props.history.push('/dashboard');
    })
    .catch(err => {
      this.setState({
        error: err,
      });
    })
  }
  renderError() {
    if(this.state.error) {
      return (
        <div className="Error">
          {this.state.error}
        </div>
      );
    }
  }
  render() {
    return (
      <Page onKeyPress={e => {
        if (e.which === 13) {
          this.login();
        }
      }}>
        <Container>
          <Form>
            <Header>Login</Header>
            <Input 
              fluid
              autoFocus 
              value={this.state.email} 
              placeholder="Email" 
              onChange={e => this.setField(e.target.value, 'email')} 
              type="email" 
            />
            <Input 
              fluid
              value={this.state.password} 
              placeholder="Password" 
              onChange={e => this.setField(e.target.value, 'password')} 
              type="password" 
            />
            <Button 
              fluid 
              onClick={(() => this.login())} 
              color="green"
            >
              Login
            </Button>
            {this.renderError()}
            <Text>
              Need an account? <Link to="/register">Register</Link>
            </Text>
          </Form>
        </Container>
      </Page >
    );
  }
}
