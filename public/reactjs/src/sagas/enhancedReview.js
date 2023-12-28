import {
  takeLatest,
  call,
  put
} from "redux-saga/effects";
import {
  sendEnhancedReviewApi
} from "../apis/enhancedReview";
import {
  updatePreLoaderWatcher
} from "../actions/user";

export function* sendEnhancedReviewEffectSaga(action) {
  // data is obtained after axios call is resolved
  try {
    yield put(updatePreLoaderWatcher(true));
    const {
      data
    } = yield call(sendEnhancedReviewApi, action.payload);
    yield put(updatePreLoaderWatcher(false));
    action.resolve(data);
  } catch (e) {
    yield put(updatePreLoaderWatcher(false));
    action.reject(e);
  }
}

export function* sendEnhancedReviewWatcherSaga() {
  yield takeLatest(
    "SEND_ENHANCED_REVIEW_WATCHER",
    sendEnhancedReviewEffectSaga
  );
}
