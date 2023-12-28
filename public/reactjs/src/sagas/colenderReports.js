import { takeLatest, call, put } from "redux-saga/effects";
import { updatePreLoaderWatcher } from "../actions/user";
import { getBorrowerReportsAPI,generateBorrowerReportsAPI,downloadBorrowerReportsAPI,getP2pReportsAPI,generateP2pReportsAPI,downloadP2pReportsAPI,downloadUTRReportsAPI,getCoLenderRepaymentAPI } from '../apis/colenderReports';

export function* getBorrowerReportsEffectSaga(action) {
    try {
        yield put(updatePreLoaderWatcher(true));
        const { data } = yield call(getBorrowerReportsAPI, action.payload);
        yield put(updatePreLoaderWatcher(false));
        action.resolve(data);
    } catch (e) {
        yield put(updatePreLoaderWatcher(false));
        action.reject(e);
    }
}

export function* getBorrowerReportsWatcherSaga() {
    yield takeLatest(
        "GET_BORROWER_REPORTS",
        getBorrowerReportsEffectSaga
    );
}

export function* generateBorrowerReportsEffectSaga(action) {
    try {
        yield put(updatePreLoaderWatcher(true));
        const { data } = yield call(generateBorrowerReportsAPI, action.payload);
        yield put(updatePreLoaderWatcher(false));
        action.resolve(data);
    } catch (e) {
        yield put(updatePreLoaderWatcher(false));
        action.reject(e);
    }
}

export function* generateBorrowerReportsWatcherSaga() {
    yield takeLatest(
        "GENERATE_BORROWER_REPORTS",
        generateBorrowerReportsEffectSaga
     );
}

export function* downloadBorrowerReportsEffectSaga(action) {
    try {
        yield put(updatePreLoaderWatcher(true));
        const { data } = yield call(downloadBorrowerReportsAPI, action.payload);
        yield put(updatePreLoaderWatcher(false));
        action.resolve(data);
    } catch (e) {
        yield put(updatePreLoaderWatcher(false));
        action.reject(e);
    }
}

export function* downloadBorrowerReportsWatcherSaga() {
    yield takeLatest(
        "DOWNLOAD_BORROWER_REPORTS",
        downloadBorrowerReportsEffectSaga
    );
}

//this EffectSaga used to download the  UTR report
export function* downloadUTRReportsEffectSaga(action) {
    try {
        yield put(updatePreLoaderWatcher(true));
        const { data } = yield call(downloadUTRReportsAPI, action.payload);
        yield put(updatePreLoaderWatcher(false));
        action.resolve(data);
    } catch (e) {
        yield put(updatePreLoaderWatcher(false));
        action.reject(e);
    }
}

//this WatcherSaga used to download the  UTR report
export function* downloadUTRReportsWatcherSaga() {
    yield takeLatest(
        "DOWNLOAD_UTR_REPORTS",
        downloadUTRReportsEffectSaga
    );
}

export function* getRepaymentReportsEffectSaga(action) {
    try {
        yield put(updatePreLoaderWatcher(true));
        const { data } = yield call(getCoLenderRepaymentAPI, action.payload);
        yield put(updatePreLoaderWatcher(false));
        action.resolve(data);
    } catch (e) {
        yield put(updatePreLoaderWatcher(false));
        action.reject(e);
    }
}

export function* getCoLenderRepaymentWatcherSaga() {
    yield takeLatest(
        "GET_CO_LENDER_REPAYMENT_REPORTS",
        getRepaymentReportsEffectSaga
    );
}

export function* getP2pReportsWatcherSaga() {
    yield takeLatest(
        "GET_P2P_REPORTS",
        getP2pReportsEffectSaga
    );
}

export function* getP2pReportsEffectSaga(action) {
    try {
        yield put(updatePreLoaderWatcher(true));
        const { data } = yield call(getP2pReportsAPI, action.payload);
        yield put(updatePreLoaderWatcher(false));
        action.resolve(data);
    } catch (e) {
        yield put(updatePreLoaderWatcher(false));
        action.reject(e);
    }
}

export function* generateP2pReportsEffectSaga(action) {
    try {
        yield put(updatePreLoaderWatcher(true));
        const { data } = yield call(generateP2pReportsAPI, action.payload);
        yield put(updatePreLoaderWatcher(false));
        action.resolve(data);
    } catch (e) {
        yield put(updatePreLoaderWatcher(false));
        action.reject(e);
    }
}

export function* generateP2pReportsWatcherSaga() {
    yield takeLatest(
        "GENERATE_P2P_REPORTS",
        generateP2pReportsEffectSaga
     );
}

export function* downloadP2pReportsWatcherSaga() {
    yield takeLatest(
        "DOWNLOAD_P2P_REPORTS",
        downloadP2pReportsEffectSaga
    );
}

export function* downloadP2pReportsEffectSaga(action) {
    try {
        yield put(updatePreLoaderWatcher(true));
        const { data } = yield call(downloadP2pReportsAPI, action.payload);
        yield put(updatePreLoaderWatcher(false));
        action.resolve(data);
    } catch (e) {
        yield put(updatePreLoaderWatcher(false));
        action.reject(e);
    }
}