import React, { Component } from 'react';
import { BrowserRouter} from 'react-router-dom';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import LandingPage from './components/LandingPage/LandingPage';
import Auth from './containers/Auth/Auth';
import Home from './containers/Home/Home';
import Logout from './containers/Auth/Logout/Logout';
class App extends Component {
  render() {
    return (
        <BrowserRouter basename="/">
            <div className="App">
                <Switch>
                    <Route path="/callback" component={Auth} />
                    <Route path="/home" component={Home} />
                    <Route path="/search" render={() => <Home isSearch = {true}/>} />
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

export default withRouter(connect(mapStateToProps)(App));
