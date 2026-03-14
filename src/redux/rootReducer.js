import { combineReducers } from 'redux';
import usersReducer from './users/reducer';
import postsReducer from './posts/reducer';
import todosReducer from './todos/reducer';

// combineReducers merges all our reducers into one
// Each reducer manages its own slice of state:
// state.users, state.posts, state.todos
const rootReducer = combineReducers({
  users: usersReducer,
  posts: postsReducer,
  todos: todosReducer,
});

export default rootReducer;