import { takeLatest, call, put } from "redux-saga/effects";
import { updatePreLoaderWatcher } from "../actions/user";
import { getCollectionBankDetailsApi } from "../apis/collectionBankDetails";

export function* getCollectionBankDetailsEffectSaga(action) {
    try {
      yield put(updatePreLoaderWatcher(true));
      const { data } = yield call(getCollectionBankDetailsApi);
      yield put(updatePreLoaderWatcher(false));
      action.resolve(data);
    } catch (e) {
      yield put(updatePreLoaderWatcher(false));
      action.reject(e);
    }
  }
  
  export function* getCollectionBankDetailsWatcherSaga() {
    yield takeLatest("GET_COLLECTION_BANK_DETAILS", getCollectionBankDetailsEffectSaga);
  }