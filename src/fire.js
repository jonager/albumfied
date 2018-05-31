import firebase from 'firebase';
import * as env from './env';

var config = {
    apiKey: env.SPOTIFY_API_KEY,
    authDomain: env.AUTH_DOMAIN,
    databaseURL: env.DATABASE_URL,
    projectId: env.PROJECT_ID,
    storageBucket: env.STORAGE_BUTCKET,
    messagingSenderId: env.MESSAGING_SENDER_ID
  };

const fire = firebase.initializeApp(config);

export default fire;
