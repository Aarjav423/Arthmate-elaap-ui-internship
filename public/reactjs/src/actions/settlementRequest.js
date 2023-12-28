export function getSettlementRequest(data, resolve, reject) { 
  return {
      type: "GET_SETTLEMENT_REQUEST",
      payload: data,
      resolve,
      reject
    };
  }