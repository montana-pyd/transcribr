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

export default class Register extends Component {
  constructor() {
    super();

    this.state = {
      firstName: '',
      lastName: '',
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
  register() {
    let { firstName, lastName, email, password } = this.state;

    client.register(firstName, lastName, email, password)
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
    if (this.state.error) {
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
        if(e.which === 13) {
          this.register();
        }
      }}>
        <Container>
          <Form>
            <Header>Register</Header>
            <Input 
              autoFocus
              fluid 
              value={this.state.firstName} 
              placeholder="First Name" onChange={e => this.setField(e.target.value, 'firstName')} 
              type="text" 
            />
            <Input
              fluid 
              value={this.state.lastName} 
              placeholder="Last Name" onChange={e => this.setField(e.target.value, 'lastName')} 
              type="text" 
            />
            <Input
              fluid 
              value={this.state.email} 
              placeholder="Email" 
              onChange={e => this.setField(e.target.value, 'email')} 
              type="text" 
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
              onClick={(() => this.register())}
              color="green"
            >
              Register
            </Button>
            {this.renderError()}
            <Text>
              Already have an account? <Link to="/login">Login</Link>
            </Text>
          </Form>
        </Container>
      </Page>
    );
  }
}
