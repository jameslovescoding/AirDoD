import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// import Provider from react-redux
import { Provider } from 'react-redux';

// BrowserRouter
import { BrowserRouter } from 'react-router-dom';

// import the config store from redux folder
import configureStore from './store';

// custom fetch wrapped with XSRF-TOKEN
// restore XSRF-TOKEN function for developement mode
import { restoreCSRF, csrfFetch } from './store/csrf';

import * as sessionActions from './store/session';

// create the redux store
const store = configureStore();

// when in developement mode,
// use restoreCSRF to get the XSRF-TOKEN
// expose the redux store to the browser window object
if (process.env.NODE_ENV !== 'production') {
  restoreCSRF();
  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
}

// pass the created redux store to the provider
// and wrap the app with it
function Root() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
}


ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root'),
);
