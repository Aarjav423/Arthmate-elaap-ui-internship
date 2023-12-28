import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { getDesignationWatcher } from "actions/roleMetrix";
import CustomDropdown from "../custom/customSelect";

export default function DesignationDropdown(props) {
  const { onValueChange, placeholder, valueData, id, helperText } = props;
  const [designations, setDesignations] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getDesignationWatcher(
        (result) => {
          setDesignations(
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
      data={designations}
      value={valueData}
      id={id}
      helperText={helperText}
      handleDropdownChange={onValueChange}
    />
  );
}

DesignationDropdown.propTypes = {
  children: PropTypes.node,
};

DesignationDropdown.defaultProps = {
  children: "",
};
