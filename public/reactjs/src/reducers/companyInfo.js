import { handleActions } from "redux-actions";

export default handleActions(
    {
        FETCH_COMPANIES: (state, { payload }) => {
            return {
                ...state,
                companyInfo: payload,
            };
        },
    },
    {
        companyInfo: {},
    }
);
