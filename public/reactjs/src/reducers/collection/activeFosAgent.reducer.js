import { handleActions } from "redux-actions";
import { keyValuePairs } from "../../util/helper";

export default handleActions(
    {
        GET_ACTIVE_FOS_USERS_DATA_WATCHER: (state, { payload }) => {
            return keyValuePairs(payload, "id")
        },
        ADD_ACTIVE_FOS_USER_DATA_WATCHER: (state, { payload }) => {

            if (payload['_id']) {
                payload['id'] = payload['_id']
            }
            return {
                ...state,
                [payload['id']]: { id: payload.id, name: payload.name },
            }
        },
        UPDATE_ACTIVE_FOS_USER_DATA_WATCHER: (state, { payload }) => {
            if (payload.isActive === true) {
                if (payload['_id']) {
                    payload['id'] = payload['_id']
                }

                return {
                    ...state,
                    [payload['id']]: { id: payload.id, name: payload.name },
                }
            } else {
                delete state[[payload['id']]];
                return state;
            }
        }
    },
    {}
);
