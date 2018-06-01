import React, { Component } from 'react';
import Header from '../../components/Layout/Header/Header';
import { connect } from 'react-redux';

class User extends Component {
    render() { 
        return ( 
            <div>
            <Header isAuth={this.props.isAuth}/>
                <h1>Welcome!</h1>
            </div>
         );
    }
}

const mapStateToProps = state => {
    return {
        isAuth: state.auth.isAuth
    }
}
 
export default connect(mapStateToProps)(User);