import { takeLatest, call, put } from "redux-saga/effects";
import { updatePreLoaderWatcher } from "../actions/user";
import { getOfferDetailsAPI } from "../apis/offerDetails";

export function* getOfferDetailsEffectSaga(action) {
  try {
    yield put(updatePreLoaderWatcher(true));
    const { data } = yield call(getOfferDetailsAPI, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* getOfferDetailsWatcherSaga() {
  yield takeLatest("GET_OFFER_DETAILS", getOfferDetailsEffectSaga);
}
