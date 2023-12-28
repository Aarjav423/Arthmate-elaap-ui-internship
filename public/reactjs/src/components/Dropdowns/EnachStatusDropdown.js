import * as React from "react";
import CustomDropdown from "../custom/customSelect";
import { useEffect, useState } from "react";

const EnachDropdown = (props) => {
  const {
    onEnachStatusChanged,
    placeholder,
    accessTags,
    id,
    data,
    disabled,
    changeValue,
    value,
    error,
    helperText
  } = props;

  useEffect(() => {}, []);
  return (
    <CustomDropdown
      placeholder={placeholder}
      data={data}
      value={value}
      id={id}
      handleDropdownChange={changeValue}
      disabled={disabled}
      error={error}
      helperText={helperText}
    />
  );
};

export default EnachDropdown;
