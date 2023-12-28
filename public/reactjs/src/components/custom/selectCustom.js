import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import InputBox from "react-sdk/dist/components/InputBox/InputBox"

const CustomSelect = ({
  placeholder,
  data,
  value,
  multiple,
  handleDropdownChange,
  id,
  error,
  helperText,
  disabled,
  defaultValue,
  co_lender,
  width,
  height,
  colors,
}) => {
  
  const handleChange = (e, value) => {
    handleDropdownChange(value);
  };

  return (
    <InputBox
    isDrawdown={true}
    label="Status"
      customClass={{height: height ? height :"58px" , width:width ? width :"15vw" }}
      customDropdownClass={{marginTop:"8px" , zIndex:"1" , width: "15vw"}}
      options={data}
      onClick={handleDropdownChange}
    />
  );
};

export default CustomSelect;
