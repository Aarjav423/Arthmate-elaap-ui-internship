import {takeLatest, call} from "redux-saga/effects";
import {
  getAccessMetrixAPI,
  addAccessMetrixAPI,
  updateAccessMetrixAPI
} from "../apis/accessMetrix";
import {saveToStorage} from "../util/localstorage";

export function* getAccessMetrixEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const {data} = yield call(getAccessMetrixAPI, action.data);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* getAccessMetrixWatcherSaga() {
  yield takeLatest("GET_ACCESS_METRIX", getAccessMetrixEffectSaga);
}

export function* addAccessMetrixEffectSaga(action) {
  try {
    const {data} = yield call(addAccessMetrixAPI, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* addAccessMetrixWatcherSaga() {
  yield takeLatest("ADD_ACCESS_METRIX", addAccessMetrixEffectSaga);
}

export function* updateAccessMetrixEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const {data} = yield call(updateAccessMetrixAPI, action.payload);
    action.resolve(data);
  } catch (e) {
    action.reject(e);
  }
}

export function* updateAccessMetrixWatcherSaga() {
  yield takeLatest("UPDATE_ACCESS_METRIX", updateAccessMetrixEffectSaga);
}
