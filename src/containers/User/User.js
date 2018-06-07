import React, { Component } from 'react';
import Header from '../../components/Layout/Header/Header';
import Sidebar from '../../components/Layout/Sidebar/Sidebar';
import styles from './User.css';

class User extends Component {
    render() { 
        return ( 
            <div className={styles.Layout}>
                <Header className/>
                <Sidebar/>
            </div>
         );
    }
}
 
export default User;