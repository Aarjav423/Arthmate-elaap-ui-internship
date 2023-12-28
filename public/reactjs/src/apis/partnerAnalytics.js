import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export function getCompanies() {
  return axios.get(BASE_URL + "analytics/companies");
}

export function getCompanyProducts(id) {
    return axios.get(BASE_URL + `analytics/companies/${id}/products`);
  }

export function getCompanyLeads(id) {
    return axios.get(BASE_URL + `analytics/companies/${id}/leads`);
}

export function getCompanyLoans(id) {
    return axios.get(BASE_URL + `analytics/companies/${id}/loans`);
}

export function getCompanyLoanDisbursed(id) {
    return axios.get(BASE_URL + `analytics/companies/${id}/loans/disbursed`);
}

export function getCompanyDpd(id) {
    return axios.get(BASE_URL + `analytics/companies/${id}/dpd`);
}

export function getCompanyServices(id) {
    return axios.get(BASE_URL + `analytics/companies/${id}/services`);
}

export function getCompanyProductLeads(companyId,productId) {
    return axios.get(BASE_URL + `analytics/companies/${companyId}/products/${productId}/leads`);
}

export function getCompanyProductLoans(companyId,productId) {
    return axios.get(BASE_URL + `analytics/companies/${companyId}/products/${productId}/loans`);
}

export function getCompanyProductLoanDisbursed(companyId,productId) {
    return axios.get(BASE_URL + `analytics/companies/${companyId}/products/${productId}/loans/disbursed`);
}

export function getCompanyProductDpd(companyId,productId) {
    return axios.get(BASE_URL + `analytics/companies/${companyId}/products/${productId}/dpd`);
}

export function getCompanyProductServices(companyId,productId) {
    return axios.get(BASE_URL + `analytics/companies/${companyId}/products/${productId}/services`);
}



