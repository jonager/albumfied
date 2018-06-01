import React from 'react';
import Button from '../UI/Button/Button';
import * as utility from '../../shared/utility';
import Header from '../Layout/Header/Header';

const LandingPage = (props) => {
    return (
        <div>
            <Header isAuth={props.isAuth}/>
            <Button
                btnType={'Login'}
                clicked={utility.spotifyAuth}
            >Log In</Button>
            <h1>Hi</h1>
        </div>
    );
}
 
export default LandingPage;