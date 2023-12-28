import { handleActions } from "redux-actions";
import { saveToStorage } from "../util/localstorage";

export default handleActions(
    {
        GET_BORROWER_DATA_WATCHER: (state, { payload }) => {
            return {
                ...state,
                borrowerInfo: payload,
            };
        },
    },
    {
        borrowerInfo: {},
    }
);
