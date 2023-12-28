import { combineReducers } from "redux";
import roleMetrix from "./roleMetrix";
import profile from "./profile";
import stateCity from './stateCity';
import borrowerInfo from './borrowerInfo';
import companyInfo from './companyInfo';
import fos from './collection';
import msme from "../msme/reducers/msme.reducer"

export default combineReducers({
  roleMetrix,
  profile,
  stateCity,
  borrowerInfo,
  companyInfo,
  fos,
  msme
});
