const basePath =
  window.location.hostname.indexOf("localhost") > -1
    ? "http://localhost:5000/api/"
    : "/api/";
export const BASE_URL = `${basePath}`;

