import * as React from "react";
import {useState, useEffect} from "react";
import {useDispatch} from "react-redux";
import PropTypes from "prop-types";
import {getRoleWatcher} from "../../actions/roleMetrix";
import CustomDropdown from "../custom/customSelect";

const RolesDropDown = props => {
  const {
    onValueChange,
    placeholder,
    valueData,
    id,
    helperText,
    setRolesList,
    ...other
  } = props;
  const [roles, setRoles] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getRoleWatcher(
        result => {
          setRolesList(result);
          setRoles(
            result.map(item => {
              return {
                value: item.title,
                label: item.title,
                id: item._id
              };
            })
          );
        },
        error => {}
      )
    );
  }, []);

  return (
    <CustomDropdown
      placeholder={placeholder}
      data={roles}
      value={valueData}
      id={id}
      error={helperText}
      multiple={true}
      handleDropdownChange={onValueChange}
      helperText={helperText}
    />
  );
};

RolesDropDown.propTypes = {
  children: PropTypes.node
};

RolesDropDown.defaultProps = {
  children: ""
};

export default RolesDropDown;
