import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import moment from "moment";




const CustomSelect = ({
  placeholder,
  data,
  value,
  multiple,
  onDateChange,
  id,
  error,
  helperText,
  disabled,
  width,
  colors,
}) => {
  
    data = [
        { label: 'Today', id: 1 },
        { label: 'Yesterday', id: 2 },
        { label: 'Last 7 days', id: 3 },
        { label: 'This month', id: 4 },
        { label: 'Custom', id: 5 },
      ];

  const handleChange = (e, value) => {
    const currentDate = moment().format("YYYY-MM-DD")
    const date = {
        fromDate : '',
        toDate: '',
        state: ''
    }
    if(value.label == 'Today'){
        date.fromDate =  currentDate 
        date.toDate = currentDate
    }
    else if(value.label == 'Yesterday'){
        date.fromDate =  moment(currentDate).subtract(1 , 'd').format("YYYY-MM-DD") 
        date.toDate = moment(currentDate).subtract(1 , 'd').format("YYYY-MM-DD")
    }
    else if(value.label == 'Last 7 days'){
        date.fromDate =  moment(currentDate).subtract(6 , 'd').format("YYYY-MM-DD")
        date.toDate = currentDate
    }
    else if(value.label == 'This month'){
        date.fromDate =  moment(currentDate).startOf('month').format("YYYY-MM-DD")
        date.toDate = moment(currentDate).endOf('month').format("YYYY-MM-DD")

    }else if(value.label == 'Custom'){
        date.state = 'custom'
    }
    onDateChange(date);
  };

  return (
    <Autocomplete
      multiple={multiple}
      value={value}
      id={'date-picker'}
      options={data}
      defaultValue={value}
      disabled={disabled}
      disableClearable={value ? false : true}
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
