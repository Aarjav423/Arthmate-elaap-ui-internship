import * as React from "react";
import {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import PropTypes from "prop-types";
import {getAccessMetrixWatcher} from "../../actions/accessMetrix";
import CustomDropdown from "../custom/customSelect";

const AccessMetrixDropDown = props => {
  const {
    onValueChange,
    placeholder,
    valueData,
    id,
    helperText,
    ...other
  } = props;
  const [accessMetrix, setAccessMetrix] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    new Promise((resolve, reject) => {
      dispatch(getAccessMetrixWatcher({page:0, limit:0},resolve, reject))
    }).then(result => {
      let list = [];
      result.data.rows.map(item => {
        list.push({
          label : item.title || item.name
        })
      })
      setAccessMetrix(list);
    }).catch(error=>{});
  }, []);

  return (
    <CustomDropdown
      placeholder={placeholder}
      data={accessMetrix}
      value={valueData}
      id={id}
      multiple={true}
      handleDropdownChange={onValueChange}
    />
  );
};

AccessMetrixDropDown.propTypes = {
  children: PropTypes.node
};

AccessMetrixDropDown.defaultProps = {
  children: ""
};

export default AccessMetrixDropDown;
