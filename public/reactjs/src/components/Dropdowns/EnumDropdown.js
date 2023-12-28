import * as React from "react";
import PropTypes from "prop-types";
import CustomDropdown from "../custom/customSelect";
import { useEffect, useState } from "react";

const EnumDropdown = ({
  onValueChange,
  placeholder,
  accessTags,
  id,
  disabled,
  data,
  error,
  helperText
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const changeValue = item => {
    setSelectedOption(item);
  };

  useEffect(() => {
    onValueChange(selectedOption);
  }, [selectedOption]);

  useEffect(() => {}, []);

  return (
    <CustomDropdown
      placeholder={placeholder}
      data={data}
      value={selectedOption}
      id={id}
      handleDropdownChange={changeValue}
      disabled={disabled}
      error={error}
      helperText={helperText}
    />
  );
};

export default EnumDropdown;
