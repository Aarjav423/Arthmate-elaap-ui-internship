export function addPartnerFormWatcher(data, resolve, reject) {
  return {
    type: "ADD_PARTNER_WATCHER",
    payload: data,
    resolve,
    reject
  };
}
export function partnerListWatcher(data, resolve, reject) {
  return {
    type: "PARTNER_LIST_WATCHER",
    payload: data,
    resolve,
    reject
  };
}
export function viewPartnerDetailsWatcher(data, resolve, reject) {
  return {
    type: "VIEW_PARTNER_DETAILS_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

//
export function fetchPartDocsWatcher(data, resolve, reject) {
  return {
    type: "FETCH_PART_DOCS_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function viewPartDocsWatcher(data, resolve, reject) {
  return {
    type: "VIEW_PART_DOCS_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function uploadPartDocWatcher(data, resolve, reject) {
  return {
    type: "UPLOAD_PART_DOC_WATCHER",
    payload: data,
    resolve,
    reject
  };
}
