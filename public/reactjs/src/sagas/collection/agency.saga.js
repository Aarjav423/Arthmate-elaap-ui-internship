
import { takeLatest, call, put } from "redux-saga/effects";
import {
  getAgenciesApi,
  createCollectionAgencyAPI,
  updateCollectionAgencyAPI
} from "../../apis/collection/agency.api";

export function* getAgencyEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    const response = yield call(getAgenciesApi, action.payload);
    if (action.payload.pagination !== true) {
      yield put({
        type: "GET_AGENCIES_DATA_WATCHER",
        payload: response?.data?.data,
      });
    } else {
      yield put({
        type: "GET_COLLECTION_AGENCY_DATA_WATCHER",
        payload: response?.data?.data?.results,
      });
    }
    action.resolve(response.data);
  } catch (e) {
    console.log("Error", e);
    action.reject(e);
  }
}

export function* getAgenciesWatcherSaga() {
  yield takeLatest("GET_AGENCIES_LIST", getAgencyEffectSaga);
}

export function* createAgencyEffectSaga(action){
  try{
    const response = yield call(createCollectionAgencyAPI, action.payload);
    yield put({
      type: "ADD_COLLECTION_AGENCY_DATA_WATCHER",
      payload: response?.data?.data,
    });
    action.resolve(response.data);
  }catch(e){
    console.log("Error", e);
    action.reject(e);
  }
}

export function* createAgencyWatcherSaga(){
  yield takeLatest("CREATE_COLLECTION_AGENCY", createAgencyEffectSaga);
}

export function* updateAgencyEffectSaga(action) {
  try {
    const response = yield call(updateCollectionAgencyAPI, action.payload);
    yield put({
      type: "UPDATE_COLLECTION_AGENCY_DATA_WATCHER",
      payload: response?.data?.data,
    });
    action.resolve(response.data);
  } catch (e) {
    console.log("Error", e);
    action.reject(e);
  }
}

export function* updateAgencyWatcherSaga() {
  yield takeLatest("UPDATE_COLLECTION_AGENCY", updateAgencyEffectSaga);
}