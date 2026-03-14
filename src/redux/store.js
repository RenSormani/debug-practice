import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import rootReducer from './rootReducer';
import { usersRootSaga } from './users/sagas';
import { postsRootSaga } from './posts/sagas';
import { todosRootSaga } from './todos/sagas';
import { networkRootSaga } from './network/sagas';

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

function* rootSaga() {
  yield all([
    usersRootSaga(),
    postsRootSaga(),
    todosRootSaga(),
    networkRootSaga(),
  ]);
}

sagaMiddleware.run(rootSaga);

export default store;