import { handleActions } from "redux-actions";
import { saveToStorage } from "../util/localstorage";

export default handleActions(
  {
    STAE_CITY_DATA_WATCHER: (state, { payload }) => {
      return {
        ...state,
        stateCityData: payload,
      };
    },
  },
  {
    stateCityData: {},
  }
);
