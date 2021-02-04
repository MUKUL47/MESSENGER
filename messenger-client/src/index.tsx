import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/main';
import './index.css';
import {Provider} from 'react-redux'
import { createStore } from 'redux';
import store from './redux'
ReactDOM.render(
  <Provider store={createStore(store)}>
    <Main />
  </Provider>,
  document.getElementById('root')
);
