import axios from "axios"
import { BASE_URL } from "../constants/apiUrls";

export function getAllScheme(req){
    return axios.post(`${BASE_URL}scheme-list`,req)
}

export function updateScheme(req){
    return axios.put(`${BASE_URL}scheme`,req)
}

export function postSchemeDetails(req) {
    return axios.post(`${BASE_URL}scheme`,req)
}