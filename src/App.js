import React, { Component } from 'react';
import { BrowserRouter} from 'react-router-dom';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import LandingPage from './components/LandingPage/LandingPage';
import Auth from './containers/Auth/Auth';
import User from './containers/User/User';
import Logout from './containers/Auth/Logout/Logout';
class App extends Component {
  render() {
    return (
        <BrowserRouter basename="/">
            <div className="App">
                <Switch>
                    <Route path="/callback" component={Auth} />
                    <Route path="/user" component={User} />
                    <Route path="/search" render={() => <User isSearch = {true}/>} />
                    <Route path="/logout" component={Logout} />
                    <Route path="/" render={(props) => <LandingPage isAuth={this.props.isAuth} />}/>
                </Switch>
            </div>
        </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
    return {
        isAuth: state.auth.isAuth
    }
}

export default connect(mapStateToProps)(App);
