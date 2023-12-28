export function createProductWatcher(data, resolve, reject) {
  return {
    type: "CREATE_PRODUCT",
    payload: data,
    resolve,
    reject
  };
}

export function getAllProductByCompanyIDWatcher(data, resolve, reject) {
  return {
    type: "GET_ALL_PRODUCT_BY_COMPANY_ID_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function getAllProductByLocCompanyIDWatcher(data, resolve, reject) {
  return {
    type: "GET_ALL_PRODUCT_BY_LOC_COMPANY_ID_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function getProductByCompanyAndProductWatcher(data, resolve, reject) {
  return {
    type: "GET_PRODUCT_BY_COMPANY_AND_PRODUCT_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function toggleProductStatusWatcher(data, resolve, reject) {
  return {
    type: "TOGGLE_PRODUCT_STATUS",
    payload: data,
    resolve,
    reject
  };
}

export function getPostmanCollectionLoanBookWatcher(data, resolve, reject) {
  return {
    type: "POSTMAN_COLLECTION_LOANBOOK_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function getProductByIdWatcher(data, resolve, reject) {
  return {
    type: "PRODUCT_BY_ID_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function getProductByCompanyWatcher(data, resolve, reject) {
  return {
    type: "GET_PRODUCT_BY_COMPANY_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export const updateProductListWatcher = payload => ({
  type: "UPDATE_PRODUCT_LIST_WATCHER",
  payload
});

export function createProductWithConfigWatcher(data, resolve, reject) {
  return {
    type: "CREATE_PRODUCT_WITH_CONFIG",
    payload: data,
    resolve,
    reject
  };
}
