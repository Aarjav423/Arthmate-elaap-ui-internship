
import { handleActions } from "redux-actions";
import { keyValuePairs } from "../../util/helper";

export default handleActions(
    {
        GET_MSME_AGENCIES_DATA_WATCHER: (state, { payload }) => {
            return  keyValuePairs(payload,"id")
        },
    },
    {
        agencies: {},
    }
)