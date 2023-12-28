import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function getLoanStateByLoanIdApi(payload) {
  const { company_id, product_id, user_id, loan_id } = payload;
  return axios.get(
    `${BASE_URL}${"loan-states"}/${company_id}/${product_id}/${user_id}/${loan_id}`
  );
}
