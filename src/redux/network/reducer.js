import {
  FETCH_NETWORK_REQUEST,
  FETCH_NETWORK_SUCCESS,
  FETCH_NETWORK_FAILURE,
} from "./actions";

const initialState = {
  loading: false,
  data: [],
  error: null,
};

const networkReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NETWORK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_NETWORK_SUCCESS:
      console.log(
        "FETCH_NETWORK_SUCCESS received, data length:",
        action.payload.length,
      );
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case FETCH_NETWORK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default networkReducer;
