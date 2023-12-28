import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export const stateCityApi = async (payload) => {
    return axios.get(BASE_URL + 'get-state-city', payload);
};
