import { takeLatest, call, put } from "redux-saga/effects";
import { updateProductDueConfigApi } from "../apis/productDueConfig";
import { updatePreLoaderWatcher } from "../actions/user";

export function* updateProductDueConfigEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(updateProductDueConfigApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* updProductDueConfigWatcherSaga() {
  yield takeLatest("UPDATE_PRODUCT_DUE_CONFIG", updateProductDueConfigEffectSaga);
}
