import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { getDepartmentWatcher } from "actions/roleMetrix";
import CustomDropdown from "../custom/customSelect";

export default function DepartmentDropdown(props) {
  const { onValueChange, placeholder, valueData, id, helperText } = props;
  const [departments, setDepartments] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getDepartmentWatcher(
        (result) => {
          setDepartments(
            result.map((item) => {
              return {
                value: item.title,
                label: item.title,
              };
            })
          );
        },
        (error) => {
          return error;
        }
      )
    );
  }, []);

  return (
    <CustomDropdown
      placeholder={placeholder}
      data={departments}
      value={valueData}
      id={id}
      multiple={true}
      helperText={helperText}
      handleDropdownChange={onValueChange}
    />
  );
}

DepartmentDropdown.propTypes = {
  children: PropTypes.node,
};

DepartmentDropdown.defaultProps = {
  children: "",
};
