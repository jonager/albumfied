import React, { Component } from 'react';
import Sidebar from '../../../components/Layout/Sidebar/Sidebar';
import Content from '../../../components/Layout/Content/Content';
import styles from './MainContent.css';

class MainContent extends Component {
    render() { 
        return ( 
            <div className={styles.MainContent}>
                <Sidebar/>
                <Content isSearch={this.props.isSearch}/>
            </div>
         );
    }
}
 
export default MainContent;