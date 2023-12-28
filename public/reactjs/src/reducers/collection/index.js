import { combineReducers } from "redux";
import location from "./location.reducer";
import users  from "./user.reducer";
import agencies  from "./agency.reducer";
import collectionCases from './caseList.reducer';
import activeFOS from "./activeFosAgent.reducer";
import collectionAgency from "./collectionAgency.reducer"

export default combineReducers({
    location,
    users,
    agencies,
    collectionCases,
    activeFOS,
    collectionAgency,
});