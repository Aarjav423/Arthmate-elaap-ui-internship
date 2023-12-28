export function addCompanyWatcher(data, resolve, reject) {
    return {
      type: "ADD_COMPANY_WATCHER",
      payload: data,
      resolve,
      reject,
    };
  }
  
  export function getAllCompaniesWatcher(resolve, reject) {
    return {
      type: "GET_ALL_COMPANIES_WATCHER",
      resolve,
      reject,
    };
  }

  export function getAllLocCompaniesWatcher(resolve, reject) {
    return {
      type: "GET_ALL_LOC_COMPANIES_WATCHER",
      resolve,
      reject,
    };
  }
  
  export function getAllCoLenderCompaniesWatcher(resolve, reject) {
    return {
      type: "GET_ALL_CO_LENDER_COMPANIES_WATCHER",
      resolve,
      reject,
    };
  }
  
  export function getCompanyByIdWatcher(data, resolve, reject) {
    return {
      type: "GET_COMPANY_BY_ID_WATCHER",
      payload: data,
      resolve,
      reject,
    };
  }
  