import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import * as utility from '../../shared/utility';

class Auth extends Component {
    render() { 
        let token = utility.parseParam('access_token');
        if(token) {
            this.props.onGetAuth(token);
        }

        return (
            <Redirect to="/user" />
        );
    }
}
 
const mapDispatchToProps = dispatch => {
    return {
        onGetAuth: (token) => dispatch(actions.getAuth(token))
    };
};

export default connect(null, mapDispatchToProps)(Auth);
