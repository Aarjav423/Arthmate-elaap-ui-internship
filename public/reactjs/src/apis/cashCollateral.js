import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export const cashCollateralApi = payload => {
    const attr = payload.sendData
    return axios.post(
      `${BASE_URL}cash-collateral/${attr.page}/${attr.limit}?company_id=${attr.company_id}&product_id=${attr.product_id}`,
      payload
    );
  };

  export const disburseWithheldAmountApi = payload => {
    return axios.post(BASE_URL + "v2/disburse_withheld_amount", payload);
  };
