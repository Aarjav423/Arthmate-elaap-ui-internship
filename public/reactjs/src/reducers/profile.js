import { handleActions } from "redux-actions";
import { saveToStorage } from "../util/localstorage";

export default handleActions(
  {
    UPDATE_PROFILE: (state, { payload }) => ({
      ...state,
      user: payload,
    }),
    UPDATE_USERS_LIST_WATCHER: (state, { payload }) => ({
      ...state,
      listUsers: payload,
    }),
    UPDATE_PARTNERS_LIST_WATCHER: (state, { payload }) => ({
      ...state,
      listPartners: payload,
    }),
    UPDATE_SELECTED_PARTNER_WATCHER: (state, { payload }) => {
      saveToStorage("selectedPartner", payload);
      return {
        ...state,
        selectedPartner: payload,
      };
    },
    UPDATE_SELECTED_PRODUCT_WATCHER: (state, { payload }) => {
      saveToStorage("selectedProduct", payload);
      return {
        ...state,
        selectedProduct: payload,
      };
    },
    UPDATE_PRODUCT_LIST_WATCHER: (state, { payload }) => ({
      ...state,
      listProducts: payload,
    }),
    UPDATE_SCHEMA_LIST_WATCHER: (state, { payload }) => ({
      ...state,
      listSchemas: payload,
    }),
    UPDATE_COMPANY_SERVICE_LIST_WATCHER: (state, { payload }) => ({
      ...state,
      companyServices: payload,
    }),
    UPDATE_PRE_LOADER_WATCHER: (state = false, { payload }) => ({
      ...state,
      loading: payload,
    }),
    LOG_OUT_WATCHER: (state = undefined) => ({ ...state }),
    UPDATE_ALEART: (state, { payload }) => ({
      ...state,
      aleart: payload,
    }),
  },
  {
    profile: {},
    listUsers: [],
    listPartners: [],
    selectedPartner: {},
    selectedProduct: {},
    listProducts: [],
    listSchemas: [],
    companyServices: [],
    aleart: {},
  }
);
