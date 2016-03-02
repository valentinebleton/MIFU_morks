import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { combineReducers, compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import Main from './components/main'; // Our custom react component

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

// Reducers
import mainReducer from './ducks/mainDuck';

// Middlewares
const middlewares = [thunkMiddleware];

const reducer = combineReducers({
  main: mainReducer,
});

const store = compose(
  applyMiddleware(...middlewares),
  typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
)(createStore)(reducer);

// Render the main app react component into the app div.
ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('app')
);
