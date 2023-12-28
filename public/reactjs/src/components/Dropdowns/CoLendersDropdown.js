import * as React from "react";
import {useDispatch} from "react-redux";
import CustomDropdown from "../custom/customSelect";
import {storedList} from "../../util/localstorage";
import { colendersListWatcher } from "../../actions/colenders";

export const CoLendersDropDown = ({onValueChange,value, width,disabled=false}) => {
  const [colenderNames, setColenderNames] = React.useState(false);
  const dispatch = useDispatch();
  const user = storedList("user");
  
  const fetchColendersList = () => {
    const payload = {};
    let names = [];
    new Promise((resolve, reject) => {
      dispatch(colendersListWatcher(payload, resolve, reject));
    })
      .then((res) => {
        for (let i = 0; i < res.length; i++) {
          if(res[i].status === 1)
            names.push({
              label: res[i].co_lender_name,
              _id: res[i]._id,
              co_lender_id: res[i].co_lender_id
            });
        }
        setColenderNames(names);
      }).catch((error) => {
      setTimeout(() => { }, 4000);
    });
  };
  
  React.useEffect(() => {
    fetchColendersList();
  }, []);
  
  return (
    <CustomDropdown
      placeholder={"Select co-lender"}
      data={colenderNames}
      value={value}
      multiple={false}
      id={"colender"}
      handleDropdownChange={onValueChange}
      disabled={disabled}
      width={width}
    />
  );
};

export default CoLendersDropDown;
