import { handleActions } from "redux-actions";

export default handleActions(
  {
    GET_LOCATION_DATA_WATCHER: (state, { payload }) => {
      return {
        ...state,
        location: payload,
      };
    }
  },
  
  {
    location: {},
  }
);
