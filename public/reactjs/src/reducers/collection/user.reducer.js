import { handleActions } from "redux-actions";
import { keyValuePairs } from "../../util/helper";

export default handleActions(
    {
        GET_FOS_USERS_DATA_WATCHER: (state, { payload }) => {
            return  keyValuePairs(payload,"_id")
        },
        ADD_FOS_USER_DATA_WATCHER:  (state,{payload})=>{
            if(payload['id']){
                payload['_id']=payload['id']
            }
            return {
                ...state,
                [payload['_id']]: payload,
            }
        },
        UPDATE_FOS_USER_DATA_WATCHER:  (state,{payload})=>{
            if(payload['id']){
                payload['_id']=payload['id']
            }

            return {
                ...state,
                [payload['_id']]: payload
            }
        }
    },
    {
        users: {},
    }
);
