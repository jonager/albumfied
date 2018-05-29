import React, { Component } from 'react';
import { BrowserRouter} from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';

import LandingPage from './components/LandingPage/LandingPage';
import Auth from './containers/Auth/Auth';
import User from './containers/User/User';
class App extends Component {
  render() {
    return (
        <BrowserRouter basename="/">
            <div className="App">
                <Switch>
                    <Route path="/callback" component={Auth} />
                    <Route path="/user" component={User} />
                    <Route path="/" component={LandingPage} />
                </Switch>
            </div>
        </BrowserRouter>
    );
  }
}

export default App;
