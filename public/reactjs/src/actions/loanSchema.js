export function addLoanSchemaWatcher(data, resolve, reject) {
  return {
    type: "ADD_LOAN_SCHEMA",
    payload: data,
    resolve,
    reject
  };
}

export function getLoanSchemaByCompanIdWatcher(data, resolve, reject) {
  return {
    type: "GET_LOAN_SCHEMA_BY_COMPANY_ID_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function updateLoanSchemaWatcher(data, resolve, reject) {
  return {
    type: "UPDATE_LOAN_SCHEMA_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function loadTemplateEnumsWatcher(data, resolve, reject) {
  return {
    type: "LOAD_TEMPLATE_ENUMS_WATCHER",
    payload: data,
    resolve,
    reject
  };
}
