import React from 'react';
import SearchBar from '../../UI/SearchBar/SearchBar';

const Content = (props) => {
    console.log(props.isSearch)
    return (
        <div>
            {props.isSearch ? <SearchBar/> : null}
        </div>
    );
}
 
export default Content;