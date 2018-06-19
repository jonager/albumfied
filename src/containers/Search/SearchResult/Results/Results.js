import React from 'react';

const Results = (props) => {
    let albums = props.results.items.map( item => <h3>{item.name}</h3>);

    return (
        <div>
            {albums}
        </div>
    )
}
 
export default Results;