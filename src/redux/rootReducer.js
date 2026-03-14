import { combineReducers } from 'redux';
import usersReducer from './users/reducer';
import postsReducer from './posts/reducer';
import todosReducer from './todos/reducer';
import networkReducer from './network/reducer';

const rootReducer = combineReducers({
  users: usersReducer,
  posts: postsReducer,
  todos: todosReducer,
  network: networkReducer,
});

export default rootReducer;