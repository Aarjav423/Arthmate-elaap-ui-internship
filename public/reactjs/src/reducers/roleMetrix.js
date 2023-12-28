import { handleActions } from "redux-actions";
import { saveToStorage } from "../util/localstorage";

export default handleActions(
  {
    UPDATE_ROLE_METRIX: (state, { payload }) => {
      saveToStorage("roleMetrix", payload);
      return {
        ...state,
        roleMetrix: payload,
      };
    },
  },
  {
    roleMetrix: {},
  }
);
