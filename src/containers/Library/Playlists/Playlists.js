import React, { Component } from 'react';
import fire from '../../../fire';

class Playlists extends Component {
    state = {
        playlists: null
    }

    getAlbumsFirebase = (userid) => {
        let ref = fire.database().ref(`users/${userid}/playlists`);
        ref.on('value', function(snapshot){
            this.setState({
                playlists: snapshot.val()
            })
        })
    }

    componentDidMount() {
        this.getAlbumsFirebase('jagn29')
    }

    render() { 
        console.log(this.state.playlists)
        return ( <p>ho</p> )
    }
}
 
export default Playlists;