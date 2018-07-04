import React from 'react';
import Card from '../../../../components/UI/Card/Card';

const Results = (props) => {
    // TODO: debug why component renders twice
    return (
            <Card totalAlbums = {props.totalAlbums} results = {props.results} />
    );
}
 
export default Results;