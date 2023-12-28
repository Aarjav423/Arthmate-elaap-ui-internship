export function getSoaDetailsWatcher(data, resolve, reject) { 
    return {
        type: "GET_SOA_DETAILS",
        payload: data,
        resolve,
        reject
      };
  }
  
  export function getSoaRequestWatcher(data, resolve, reject) {
    return {
        type: "GET_SOA_REQUEST",
        payload: data,
        resolve,
        reject
      };
  }

  export function downLoadFileSoaRequestWatcher(data, resolve, reject) {
    return {
        type: "DOWNLOAD_SOA_REQUEST",
        payload: data,
        resolve,
        reject
      };
  }