import { put, takeLatest } from 'redux-saga/effects';
import {
  FETCH_NETWORK_REQUEST,
  fetchNetworkSuccess,
  fetchNetworkFailure,
} from './actions';
import { networkData } from '../../data/networkData';

function* fetchNetworkSaga() {
  try {
    yield put(fetchNetworkSuccess(networkData));
  } catch (error) {
    yield put(fetchNetworkFailure(error.message));
  }
}

export function* networkRootSaga() {
  yield takeLatest(FETCH_NETWORK_REQUEST, fetchNetworkSaga);
}

// For serverside — sends search term to API
// function* searchNetworkSaga(action) {
//   try {
//     const response = yield call(
//       fetch,
//       `https://your-api.com/network?search=${action.payload}`
//     );
//     const data = yield response.json();
//     yield put(fetchNetworkSuccess(data));
//   } catch (error) {
//     yield put(fetchNetworkFailure(error.message));
//   }
// }