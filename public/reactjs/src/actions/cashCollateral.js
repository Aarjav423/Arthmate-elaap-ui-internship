export const cashCollateralWatcher = (data, resolve, reject) => {
    return {
      type: "CASH_COLLATERAL_DETAILS",
      payload: data,
      resolve,
      reject
    };
  }

  export const disburseWithheldAmountWatcher = (data, resolve, reject) => {
    return {
      type: "DISBURSE_WITHHELD_AMOUNT",
      payload: data,
      resolve,
      reject
    };
  }