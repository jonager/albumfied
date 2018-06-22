import React, { Component } from 'react';
import Header from '../../components/LayoutUnits/Header/Header';
import styles from './Layout.css';

class Layout extends Component {
    state = {}
    render() { 
        return ( 
            <div className={styles.Layout}>
                <Header/>
                <main>
                    {this.props.children}
                </main>
            </div>
         )
    }
}
 
export default Layout;