import { takeLatest, call, put } from "redux-saga/effects";
import {
  getCollateralListApi,
  getCollateralByIdApi,
  updateCollateralByIdApi, addCollateralByIdApi
} from "../apis/collateral";
import { updatePreLoaderWatcher } from "../actions/user";

export function* getCollateralListEffectSaga(action) {
    // data is obtained after axios call is resolved
    try {
        yield put(updatePreLoaderWatcher(true));
        const { data } = yield call(getCollateralListApi, action.payload);
        yield put(updatePreLoaderWatcher(false));
        action.resolve(data);
    } catch (e) {
        yield put(updatePreLoaderWatcher(false));
        action.reject(e);
    };
};

export function* getCollateralListWatcherSaga() {
    yield takeLatest(
        "GET_COLLATERAL_LIST_WATCHER",
        getCollateralListEffectSaga
    );
};

export function* getCollateralByIdEffectSaga(action) {
    // data is obtained after axios call is resolved
    try {
        yield put(updatePreLoaderWatcher(true));
        const { data } = yield call(getCollateralByIdApi, action.payload);
        yield put(updatePreLoaderWatcher(false));
        action.resolve(data);
    } catch (e) {
        yield put(updatePreLoaderWatcher(false));
        action.reject(e);
    };
};

export function* getCollateralByIdWatcherSaga() {
    yield takeLatest(
        "GET_COLLATERAL_BY_ID_WATCHER",
        getCollateralByIdEffectSaga
    );
};

export function* updateCollateralEffectSaga(action) {
    // data is obtained after axios call is resolved
    try {
        yield put(updatePreLoaderWatcher(true));
        const { data } = yield call(updateCollateralByIdApi, action.payload);
        yield put(updatePreLoaderWatcher(false));
        action.resolve(data);
    } catch (e) {
        yield put(updatePreLoaderWatcher(false));
        action.reject(e);
    };
};

export function* updateCollateralWatcherSaga() {
    yield takeLatest(
        "UPDATE_COLLATERAL_BY_ID_WATCHER",
        updateCollateralEffectSaga
    );
};

export function* addCollateralEffectSaga(action) {
    // data is obtained after axios call is resolved
    try {
        yield put(updatePreLoaderWatcher(true));
        const { data } = yield call(addCollateralByIdApi, action.payload);
        yield put(updatePreLoaderWatcher(false));
        action.resolve(data);
    } catch (e) {
        yield put(updatePreLoaderWatcher(false));
        action.reject(e);
    }
}

export function* addCollateralWatcherSaga() {
    yield takeLatest(
        "ADD_COLLATERAL_RECORD",
        addCollateralEffectSaga
    )
}
