import React, { Component } from 'react';

export default class ConnectGoogleCloud extends Component {
  render() {
    return (
      <a href={getOAuthUrl('http://localhost:3000')}>
        <div className="Button">Connect Google Account</div>
      </a>
    );
  }
}
