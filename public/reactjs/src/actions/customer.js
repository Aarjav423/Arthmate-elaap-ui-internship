export function getCustomerDataWatcher(data, resolve, reject) {
    return {
      type: "GET_CUSTOMER_DATA_WATCHER",
      payload: data,
      resolve,
      reject
    };
  }

export function getCustomerDocsWatcher(data, resolve, reject) {
    return {
      type:"GET_CUSTOMER_DOCS_WATCHER",
      payload: data,
      resolve,
      reject
    };
}
export function viewCustomerDocsWatcher(data, resolve, reject) {
  return {
    type: "VIEW_CUSTOMER_DOCS_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function getCustomerDetailsWatcher(data,resolve,reject) {
  return {
    type:"GET_CUSTOMER_DETAILS_WATCHER",
    payload:data,
    resolve,
    reject
  }
}

