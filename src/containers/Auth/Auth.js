import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import * as utility from '../../shared/utility';
class Auth extends Component {
    componentDidMount() {
        // Get authentication from spotify
        let token = utility.parseParam(this.props.location.hash.substr(1), 'access_token');
        
        if(token) {
            this.props.onGetAuth(token);
            this.props.onSetUserId(token);     
        }
    }

    render() { 
        return (
            <Redirect to="/user" />
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetAuth: (token) => dispatch(actions.getAuth(token)),
        onSetUserId: (token) => dispatch(actions.getUserId(token)),
    };
};

export default connect(null, mapDispatchToProps)(Auth);
