export function getAgenciesWatcher(payload, resolve, reject) {
    return {
      type: "GET_AGENCIES_LIST",
      payload,
      resolve,
      reject,
    };
  }

export function createCollectionAgencyWatcher(payload, resolve, reject) {
  return {
    type: "CREATE_COLLECTION_AGENCY",
    payload,
    resolve,
    reject,
  };
}

export function updateCollectionAgencyWatcher(payload, resolve, reject) {
  return {
    type: "UPDATE_COLLECTION_AGENCY",
    payload,
    resolve,
    reject,
  };
}

  