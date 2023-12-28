export function addServiceWatcher(data, file, resolve, reject) {
    return {
      type: "ADD_SERVICE_WATCHER",
      payload: data,
      file: file,
      resolve: resolve,
      reject: reject,
    };
  }
  
  export function getAllServicesWatcher(resolve, reject) {
    return {
      type: "GET_ALL_SERVICES_WATCHER",
      resolve: resolve,
      reject: reject,
    };
  }
  
  export function getServiceInvoiceWatcher(data, resolve, reject) {
    return {
      type: "GET_SERVICE_INVOICE_WATCHER",
      payload: data,
      resolve: resolve,
      reject: reject,
    };
  }
  
  export function toggleServiceStatusWatcher(data, resolve, reject) {
    return {
      type: "TOGGLE_SERVICE_STATUS_WATCHER",
      payload: data,
      resolve: resolve,
      reject: reject,
    };
  }
  
  export function getCompanyServicesWatcher(data, resolve, reject) {
    return {
      type: "GET_COMPANY_SERVICES_WATCHER",
      payload: data,
      resolve,
      reject,
    };
  }
  
  export function toggleCompanyServicesWatcher(data, resolve, reject) {
    return {
      type: "TOGGLE_COMPANY_SERVICES_WATCHER",
      payload: data,
      resolve,
      reject,
    };
  }
  
  export function getServicesPCByCompanyWatcher(data, resolve, reject) {
    return {
      type: "GET_SERVICES_POSTMAN_COLLECTION_BY_COMPANY_WATCHER",
      payload: data,
      resolve,
      reject,
    };
  }

  export function getServiceByIdWatcher(data, resolve, reject) {
    return {
      type: "GET_SERVICE_BY_ID_WATCHER",
      payload: data,
      resolve,
      reject,
    };
  }
  
  export function editServiceWatcher(data, file, resolve, reject) {
    return {
      type: "EDIT_SERVICE_WATCHER",
      payload: data,
      file,
      resolve,
      reject,
    };
  }
  