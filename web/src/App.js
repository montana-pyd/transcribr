import 'semantic-ui-css/semantic.min.css'

import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import LandingPage from "./containers/LandingPage";
import Register from "./containers/Register";
import Login from './containers/Login';
import OAuthConnect from "./containers/OAuthConnect";
import Dashboard from "./containers/Dashboard";

class App extends Component {
  render() {
    return (
      <main className="App">
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/oauth-connect" component={OAuthConnect} />
          <Route exact path="/dashboard" component={Dashboard} />
        </Switch>
      </main>
    );
  }
}

export default App;
