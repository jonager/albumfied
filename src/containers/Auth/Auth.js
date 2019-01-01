import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import * as utility from '../../shared/utility';
class Auth extends Component {
    componentDidMount() {
        // Get spotifyId from url
        let spotifyId = utility.parseParam(
            this.props.location.search.substr(1),
            'spotifyId'
        );
        let spotifyToken = utility.parseParam(
            this.props.location.search.substr(1),
            'spotifyToken'
        );

        if (spotifyId) {
            localStorage.setItem('spotifyId', spotifyId);
            localStorage.setItem('spotifyToken', spotifyToken);
            this.props.onGetAuth(spotifyId, spotifyToken);
        }
    }

    render() {
        return <Redirect to="/home" />;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetAuth: token => dispatch(actions.getAuth(token))
    };
};

export default connect(
    null,
    mapDispatchToProps
)(Auth);
