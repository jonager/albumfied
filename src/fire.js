import firebase from 'firebase';
import * as env from './env';

var config = {
    apiKey: env.SPOTIFY_API_KEY,
    authDomain: "albumfied.firebaseapp.com",
    databaseURL: "https://albumfied.firebaseio.com",
    projectId: "albumfied",
    storageBucket: "albumfied.appspot.com",
    messagingSenderId: env.MESSAGING_SENDER_ID
  };

const fire = firebase.initializeApp(config);

export default fire;
