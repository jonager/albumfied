import React, { Component } from 'react';
import { Route, Switch, withRouter,Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './App.css';

import Layout from './hoc/Layout/Layout';
import LandingPage from './components/LandingPage/LandingPage';
import Auth from './containers/Auth/Auth';
import Content from './components/LayoutUnits/Content/Content';
import Logout from './containers/Auth/Logout/Logout';

class App extends Component {
    render() {
        let routes = (
            <Switch>
              <Route path="/callback" component={Auth} />
              <Route path="/" exact component={LandingPage} />
              <Redirect to="/" />
            </Switch>
          );

        if ( this.props.isAuth ) {
            routes = (
                <Switch>
                    <Route path="/search" render={() => <Content isSearch = {true}/>} />
                    <Route path="/home" render={() => <Content isHome = {true} token = {this.props.token} />}  />
                    <Route path="/library" render={() => <Content isLibrary = {true}/>} />
                    
                    <Route path="/artist/:id" render={() => <Content isArtist={true} token = {this.props.token}/>} />
                    <Route path="/album/:id" render={() => <Content isAlbum={true} token = {this.props.token}/>} />
                    <Route path="/playlist/:playlistName" render={() => <Content isPlaylist = {true}/>} />
                    <Route path="/logout" component={Logout} />
                </Switch>
            );
        }

        return (
            <div className={styles.App}>
                <Layout isAuth={this.props.isAuth}>
                    {routes}
                </Layout>
            </div>
        );
    };
};

const mapStateToProps = state => {
    return {
        token: state.auth.spotifyToken,
        isAuth: state.auth.isAuth
    }
};

export default withRouter(connect(mapStateToProps)(App));
