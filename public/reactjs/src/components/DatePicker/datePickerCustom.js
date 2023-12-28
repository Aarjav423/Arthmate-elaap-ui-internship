import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import moment from "moment";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";




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
  height,
  colors,
}) => {
  
    data = [
        { label: 'Today', value: 1 },
        { label: 'Yesterday', value: 2 },
        { label: 'Last 7 days', value: 3 },
        { label: 'This month', value: 4 },
        { label: 'Custom', value: 5 },
      ];

  const handleChange = (e, value) => {
    const currentDate = moment().format("YYYY-MM-DD")
    const date = {
        fromDate : '',
        toDate: '',
        state: ''
    }
    if(e.label == 'Today'){
        date.fromDate =  currentDate 
        date.toDate = currentDate
    }
    else if(e.label == 'Yesterday'){
        date.fromDate =  moment(currentDate).subtract(1 , 'd').format("YYYY-MM-DD") 
        date.toDate = moment(currentDate).subtract(1 , 'd').format("YYYY-MM-DD")
    }
    else if(e.label == 'Last 7 days'){
        date.fromDate =  moment(currentDate).subtract(6 , 'd').format("YYYY-MM-DD")
        date.toDate = currentDate
    }
    else if(e.label == 'This month'){
        date.fromDate =  moment(currentDate).startOf('month').format("YYYY-MM-DD")
        date.toDate = moment(currentDate).endOf('month').format("YYYY-MM-DD")

    }else if(e.label == 'Custom'){
        date.state = 'custom'
    }
    onDateChange(date);
  };

  const inputBoxWidth = width ? width : "15vw";

  return (
    <InputBox
    isDrawdown={true}
    customClass={{height: height ? height : "58px" , width:inputBoxWidth }}
    //   multiple={multiple}
    //   value={value}
    label="Duration"
      id={'date-picker'}
      options={data}
      defaultValue={value}
      customDropdownClass={{marginTop:"8px" , zIndex:"1" , width:inputBoxWidth}}
    //   disabled={disabled}
    //   disableClearable={value ? false : true}
    //   error={!!error}
      onClick={(e, value, reason) => handleChange(e, value, reason)}

    />
  );
};


export default CustomSelect;
