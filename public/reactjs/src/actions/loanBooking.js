export function fetchLoanSchemaCustomWatcher(data, resolve, reject) {
    return {
      type: "FETCH_LOAN_SCHEMA_CUSTOM_DATA",
      payload: data,
      resolve,
      reject,
    };
  }
  
  export function getAllLoanBookingTemplateWatcher(data, resolve, reject) {
    return {
      type: "GET_ALL_LOAN_BOOKING_TEMPLATES_WATCHER",
      payload: data,
      resolve,
      reject,
    };
  }
  