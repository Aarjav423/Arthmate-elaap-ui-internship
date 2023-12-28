import axios from "axios";
import { BASE_URL } from "../constants/apiUrls";

export async function addServiceApi(payload, file) {
  return axios.post(`${BASE_URL + "service"}/${payload.service_name}/${payload.vendor_name}/${payload.section}/${payload.url}/${payload.type}`, file);
}

export async function getAllServicesApi() {
  return axios.post(BASE_URL + "service");
}

export async function getServiceInvoiceApi(payload) {
  return axios.post(BASE_URL + "service_invoice", payload);
}

export function toggleServiceStatusApi(payload) {
  return axios.put(BASE_URL + "service", payload);
}

export async function editServiceApi(payload, file) {
  return axios.put(
    `${BASE_URL + "service"}/${payload.service_id}/${payload.service_name}/${payload.vendor_name}/${payload.section}/${payload.url}/${payload.type}`,
    file
  );
}

export function getCompanyServicesApi(payload) {
  return axios.get(`${BASE_URL + "company_services"}/${payload}`);
}

export function toggleCompanyServicesApi(payload) {
  return axios.post(BASE_URL + "company_services", payload);
}

export function getServicesPCByCompanyApi(payload) {
  return axios.post(`${BASE_URL + "company_services"}/pc/${payload.company_id}`, payload.companyServiceId);
}

export function getServiceByIdApi(payload) {
  return axios.get(`${BASE_URL + "service"}/${payload}`);
}
