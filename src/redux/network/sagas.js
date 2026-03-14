import { put, takeLatest } from 'redux-saga/effects';
import {
  FETCH_NETWORK_REQUEST,
  fetchNetworkSuccess,
  fetchNetworkFailure,
} from './actions';
import { networkData } from '../../data/networkData';

function* fetchNetworkSaga() {
  try {
    // Simulate a small delay like a real API call
    yield new Promise((resolve) => setTimeout(resolve, 500));
    yield put(fetchNetworkSuccess(networkData));
  } catch (error) {
    yield put(fetchNetworkFailure(error.message));
  }
}

export function* networkRootSaga() {
  yield takeLatest(FETCH_NETWORK_REQUEST, fetchNetworkSaga);
}