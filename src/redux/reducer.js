import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
} from "./actions";

// This is the initial state of our app
const initialState = {
  loading: false,
  users: [],
  error: null,
};

// The reducer takes the current state and an action, and returns the new state
const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_USERS_SUCCESS:
  return {
    ...state,
    loading: false,
    users: action.payload,
  };

    case FETCH_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default usersReducer;
