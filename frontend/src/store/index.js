// frontend/src/store/index.js
import { combineReducers, applyMiddleware, compose } from 'redux';
import { legacy_createStore as createStore } from 'redux';
import thunk from 'redux-thunk';

// import reducers
import sessionReducer from './session';
import spotReducer from './spot';

// frontend/src/store/index.js
// ...
const rootReducer = combineReducers({
  session: sessionReducer,
  spots: spotReducer,
});

// frontend/src/store/index.js
// ...

let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

// frontend/src/store/index.js
// ...

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
