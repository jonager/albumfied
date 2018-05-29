import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import authReducer from './store/reducers/auth';

let rootReducer = combineReducers({
    auth: authReducer
});

let store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
