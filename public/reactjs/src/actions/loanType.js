export function tempXlsxToJsonWatcher(data, type, resolve, reject) {
  return {
    type: "TEMP_XLSX_TO_JSON",
    payload: data,
    id: type,
    resolve,
    reject
  };
}

export function addLoanTypeWatcher(data, resolve, reject) {
  return {
    type: "ADD_LOAN_TYPE",
    payload: data,
    resolve,
    reject
  };
}

export function addLoanTemplateNameWatcher(data, resolve, reject) {
  return {
    type: "ADD_LOAN_TEMPLATE_NAMES",
    payload: data,
    resolve,
    reject
  };
}

export function getDefaultTemplatesWatcher(data, resolve, reject) {
  return {
    type: "GET_DEFAULT_TEMPLATES_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function getSchemaTemplatesWatcher(data, resolve, reject) {
  return {
    type: "GET_SCHEMA_TEMPLATES_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function updateCustomTemplatesWatcher(data, resolve, reject) {
  return {
    type: "UPDTAE_CUSTOM_TEMPLATES_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export function getLoanTypesWatcher(resolve, reject) {
  return {
    type: "GET_LOAN_TYPE",
    resolve,
    reject
  };
}

export function getLoanTemplateNamesWatcher(resolve, reject) {
  return {
    type: "LOAN_TEMPLATE_NAMES",
    resolve,
    reject
  };
}

export function getCompanyLoanSchemaWatcher(data, resolve, reject) {
  return {
    type: "GET_COMPANY_LOAN_SCHEMA_WATCHER",
    payload: data,
    resolve,
    reject
  };
}

export const updateSchemaListWatcher = payload => ({
  type: "UPDATE_SCHEMA_LIST_WATCHER",
  payload
});

export const addLoanDocTemplateWatcher = (payload, resolve, reject) => ({
  type: "ADD_LOAN_DOC_TEMPLATE",
  payload,
  resolve,
  reject
});
