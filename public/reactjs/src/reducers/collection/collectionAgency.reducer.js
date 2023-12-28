import { handleActions } from "redux-actions";
import { keyValuePairs } from "../../util/helper";

export default handleActions(
  {
    GET_COLLECTION_AGENCY_DATA_WATCHER: (state, { payload }) => {
      return keyValuePairs(payload, "_id");
    },
    ADD_COLLECTION_AGENCY_DATA_WATCHER: (state, {payload}) =>{
      if(payload['id']){
        payload['_id'] = payload['id'];
      }
      return {
        ...state,
        [payload['_id']]:payload,
      }
    },
    UPDATE_COLLECTION_AGENCY_DATA_WATCHER: (state, { payload }) => {
      if (payload["id"]) {
        payload["_id"] = payload["id"];
      }
      return {
        ...state,
        [payload["_id"]]: payload,
      };
    },
  },
  {}
);
