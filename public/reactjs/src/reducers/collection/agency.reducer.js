import { handleActions } from "redux-actions";
import { keyValuePairs } from "../../util/helper";

export default handleActions(
    {
        GET_AGENCIES_DATA_WATCHER: (state, { payload }) => {
            return  keyValuePairs(payload,"id")
        },
        ADD_AGENCIES_DATA_WATCHER:  (state,{payload})=>{
            return {
                ...state,
                [payload['id']]: payload,
            }
        },
        UPDATE_AGENCIES_DATA_WATCHER:  (state,{payload})=>{
            return {
                ...state,
                [payload['id']]: payload
            }
        }
    },
    {
        agencies: {},
    }
);