export function getAllProductRequestWatcher(data, resolve, reject) {
  return {
    type: "GET_ALL_PRODUCT_REQUEST",
    payload: data,
    resolve,
    reject
  };
}

export function getAllActiveProductRequestWatcher(data, resolve, reject) {
  return {
    type: "GET_ALL_ACTIVE_PRODUCTS",
    payload: data,
    resolve,
    reject
  };
}

export function getAllProductSchemeMappingWatcher(data, resolve, reject) {
  return {
    type: "GET_ALL_PRODUCT_SCHEME_MAPPING",
    payload: data,
    resolve,
    reject
  };
}

export function getAllProductSchemeWatcher(data, resolve, reject) {
  return {
    type: "GET_ALL_SCHEME",
    payload: data,
    resolve,
    reject
  };
}

export function toggleProductSchemeStatusWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_TOGGLE_PRODUCT_SCHEME_STATUS",
    payload: data,
    resolve: resolve,
    reject: reject
  };
}

export function getAllSchemesListWatcher(data, resolve, reject) {
  return {
    type: "GET_ALL_SCHEMES_LIST",
    payload: data,
    resolve: resolve,
    reject: reject
  };
}
export function productSchemeMappedWatcher(data, resolve, reject) {
  return {
    type: "PRODUCT_SCHEME_MAPPED",
    payload: data,
    resolve: resolve,
    reject: reject
  };
}
