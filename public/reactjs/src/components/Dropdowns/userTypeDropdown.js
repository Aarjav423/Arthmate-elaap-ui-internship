import * as React from "react";
import PropTypes from "prop-types";
import CustomDropdown from "../custom/customSelect";

const rolesOptions = [
  { value: "admin", label: "admin" },
  { value: "company", label: "company" },
  { value: "co-lender", label: "co-lender" }
];

export default function UserTypeDropDown(props) {
  const { onValueChange, placeholder, valueData, id, helperText, disabled } =
    props;
  return (
    <CustomDropdown
      placeholder={placeholder}
      data={rolesOptions}
      value={valueData}
      id={id}
      helperText={helperText}
      handleDropdownChange={onValueChange}
      disabled={disabled}
    />
  );
}

UserTypeDropDown.propTypes = {
  children: PropTypes.node
};

UserTypeDropDown.defaultProps = {
  children: ""
};
