import React from 'react';

const Results = (props) => {
    // TODO: debug why component renders twice
    let card = props.results.items.map(item => {
            return (
                <div key={item.name} className="card">
                    {item.images.length !== 0 ? <img style={{width:'180px', height: '180px'}} src={item.images[0].url} alt="Album/Artist"/> : <img src="https://imgplaceholder.com/180x180/75a016/d8db26?text=picture+unavailable&font-size=20" alt="Album/Artist"/>}
                    <div className="info">
                        <h3>{item.name}</h3> 
                        {/* <p></p> */}
                    </div>
                </div>
            );
        });

    return (
        <React.Fragment>
            {card}
        </React.Fragment>
    )
}
 
export default Results;