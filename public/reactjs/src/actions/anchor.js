export function addAnchorFormWatcher(data, resolve, reject) {
  return {
    type: "ADD_ANCHOR_WATCHER",
    payload: data,
    resolve,
    reject
  };
}
export function anchorListWatcher(data, resolve, reject) {
  return {
    type: "ANCHOR_LIST_WATCHER",
    payload: data,
    resolve,
    reject
  };
}
export function viewAnchorDetailsWatcher(data, resolve, reject) {
  return {
    type: "VIEW_ANCHOR_DETAILS_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

//
export function fetchAnchorDocsWatcher(data, resolve, reject) {
  return {
    type: "FETCH_ANCHOR_DOCS_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function viewAnchorDocsWatcher(data, resolve, reject) {
  return {
    type: "VIEW_ANCHOR_DOCS_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function uploadAnchorDocWatcher(data, resolve, reject) {
  return {
    type: "UPLOAD_ANCHOR_DOC_WATCHER",
    payload: data,
    resolve,
    reject
  };
}
