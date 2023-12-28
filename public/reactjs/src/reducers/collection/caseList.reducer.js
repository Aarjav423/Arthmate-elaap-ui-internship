import { handleActions } from "redux-actions";
import { keyValuePairs } from "../../util/helper";

export default handleActions(
    {
        GET_COLLECTION_CASE_DATA_WATCHER: (state, { payload }) => {
            return keyValuePairs(payload, "_id")
        },
        UPDATE_COLLECTION_CASE_DATA_WATCHER: (state, { payload }) => {
            let updatedState = {};
            payload.forEach(element => {
                if(element.success){
                    if (element.data['id']) {
                        element.data['_id'] = element.data['id']
                    }
                    updatedState = {...updatedState, [element.data['_id']]: element.data}
                }
            });
            return {
                ...state,
                ...updatedState
            }
        }
    },
    {
    }
);
