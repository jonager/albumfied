import React, { Component } from 'react';
import Header from '../../components/Layout/Header/Header';
import MainContent from './MainContent/MainContent';
import styles from './User.css';

class User extends Component {
    render() {
        return (
            <div className={styles.Layout}>
                <Header/>
                <MainContent isSearch={this.props.isSearch}/>
            </div>
        );
    }
}

export default User;