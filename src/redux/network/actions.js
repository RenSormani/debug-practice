export const FETCH_NETWORK_REQUEST = 'FETCH_NETWORK_REQUEST';
export const FETCH_NETWORK_SUCCESS = 'FETCH_NETWORK_SUCCESS';
export const FETCH_NETWORK_FAILURE = 'FETCH_NETWORK_FAILURE';

export const fetchNetworkRequest = () => ({
  type: FETCH_NETWORK_REQUEST,
});

export const fetchNetworkSuccess = (data) => ({
  type: FETCH_NETWORK_SUCCESS,
  payload: data,
});

export const fetchNetworkFailure = (error) => ({
  type: FETCH_NETWORK_FAILURE,
  payload: error,
});