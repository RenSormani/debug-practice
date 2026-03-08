import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import usersReducer from './reducer';
import rootSaga from './sagas';

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// Create the store with saga middleware
const store = createStore(
  usersReducer,
  applyMiddleware(sagaMiddleware)
);

// Run the root saga
sagaMiddleware.run(rootSaga);

export default store;