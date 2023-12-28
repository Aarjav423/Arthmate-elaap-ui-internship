export function addProductDueConfigWatcher(data, resolve, reject) {
    return {
      type: "UPDATE_PRODUCT_DUE_CONFIG",
      payload: data,
      resolve,
      reject,
    };
  }
  