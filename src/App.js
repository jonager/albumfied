import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './App.css';
import * as actions from './store/actions/index';
import { ToastContainer } from 'react-toastify';
import Layout from './hoc/Layout/Layout';
import LandingPage from './components/LandingPage/LandingPage';
import Auth from './containers/Auth/Auth';
import Content from './components/LayoutUnits/Content/Content';
import Logout from './containers/Auth/Logout/Logout';

class App extends Component {
    constructor(props) {
        super(props);
        // Log out user when page is refreshed
        if (window.performance) {
            if (performance.navigation.type === 1) {
                this.props.onLogout();
            }
        }
    }

    render() {
        let routes = (
            <Switch>
                <Route path="/callback" component={Auth} />
                <Route path="/" exact component={LandingPage} />
                <Redirect to="/" />
            </Switch>
        );

        if (this.props.spotifyId) {
            routes = (
                <Switch>
                    <Route
                        path="/search"
                        render={() => <Content isSearch={true} />}
                    />
                    <Route
                        path="/home"
                        render={() => <Content isHome={true} />}
                    />
                    <Route
                        path="/library"
                        render={() => <Content isLibrary={true} />}
                    />

                    <Route
                        path="/artist/:id"
                        render={() => (
                            <Content isArtist={true} token={this.props.token} />
                        )}
                    />
                    <Route
                        path="/album/:id"
                        render={() => (
                            <Content isAlbum={true} token={this.props.token} />
                        )}
                    />
                    <Route
                        path="/playlist/:playlist_id"
                        render={() => <Content isPlaylist={true} />}
                    />
                    <Route path="/logout" component={Logout} />
                </Switch>
            );
        }

        return (
            <div className={styles.App}>
                <Layout isAuth={this.props.isAuth}>{routes}</Layout>
                <ToastContainer autoClose={2000} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.auth.spotifyToken,
        spotifyId: state.auth.spotifyId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.userLogout())
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(App)
);
