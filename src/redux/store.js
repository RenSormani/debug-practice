import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import rootReducer from './rootReducer';
import { usersRootSaga } from './users/sagas';
import { postsRootSaga } from './posts/sagas';
import { todosRootSaga } from './todos/sagas';

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create the store with saga middleware
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

// Root saga that runs all sagas in parallel
function* rootSaga() {
  yield all([
    usersRootSaga(),
    postsRootSaga(),
    todosRootSaga(),
  ]);
}

sagaMiddleware.run(rootSaga);

export default store;