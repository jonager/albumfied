import React from 'react';
import Button from '../UI/Button/Button';
import * as utility from '../../shared/utility';

const LandingPage = () => {
    return (
        <div>
            <Button
                btnType={'Login'}
                clicked={utility.spotifyAuth}
            >Log In</Button>
            <h1>Hi</h1>
        </div>
    );
}
 
export default LandingPage;