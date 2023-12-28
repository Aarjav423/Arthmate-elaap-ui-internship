import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const YearAndMonthPicker = ({
  disabled,
  placeholder,
  onDateChange,
  value,
  inputFormat,
  views
}) => {
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        inputFormat={inputFormat}
        views={views}
        label={placeholder}
        value={value}
        disabled={disabled}
        onChange={(newValue) => {
          onDateChange(newValue);
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};

export default YearAndMonthPicker;
