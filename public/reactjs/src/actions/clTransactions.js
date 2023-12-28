export function getLoanData(data, resolve, reject) {
    return {
        type: "GET_LOAN_DATA",
        payload: data,
        resolve,
        reject,
    };
};

export function addLoanTransaction(data, resolve, reject) {
    return {
        type: "ADD_LOAN_TRANSACTION",
        payload: data,
        resolve,
        reject,
    };
};

export function getDisbursmentDataWatcher(data, resolve, reject) {
    return {
        type: "GET_DISBURSMENT_DATA_WATCHER",
        payload: data,
        resolve,
        reject,
    };
};