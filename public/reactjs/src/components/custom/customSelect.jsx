import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

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
  colors,
}) => {
  
  const handleChange = (e, value) => {
    handleDropdownChange(value);
  };

  return (
    <Autocomplete
      disablePortal
      multiple={multiple}
      value={value}
      id={id}
      options={data}
      defaultValue={value}
      disabled={disabled}
      disableClearable={value ? false : true}
      noOptionsText="No record"
      error={!!error}
      onChange={(e, value, reason) => handleChange(e, value, reason)}
      sx={{ width: width }}
      renderOption={
        colors && colors.length > 0
          ? (props, option) => {
              const { label, color } = option;
              return (
                <Grid container spacing={2} {...props}>
                  <Grid item xs={1}>
                    <div
                      style={{
                        width: "15px",
                        height: "15px",
                        border: "solid black",
                        backgroundColor: color,
                      }}
                    />
                  </Grid>
                  <Grid item xs={9}>
                    {label}
                  </Grid>
                </Grid>
              );
            }
          : null
      }
      renderInput={(params) => (
        <TextField
          {...params}
          error={error}
          helperText={helperText || ""}
          label={placeholder}
        />
      )}
    />
  );
};

export default CustomSelect;

