export function collectionBankDetailsWatcher(resolve, reject) {
    return {
      type: "GET_COLLECTION_BANK_DETAILS",
      resolve,
      reject
    };
  }