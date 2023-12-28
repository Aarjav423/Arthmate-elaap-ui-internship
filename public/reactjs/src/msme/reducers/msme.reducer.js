// import all reducers here

import { combineReducers } from "redux";
import agencies  from "./agency.reducer";
import leads  from "./lead.reducer";

export default combineReducers({
    agencies,
    leads
});