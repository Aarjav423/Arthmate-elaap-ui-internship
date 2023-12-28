import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const BasicDatePicker = ({
  disableFutureDate,
  disabled,
  placeholder,
  onDateChange,
  value,
  open,
  error,
  helperText,
  style,
  format="",
  shouldDisableDate,
  shouldDisableYear
}) => {
  const [openPopUp, setOpenPopUp] = React.useState(open);

  React.useEffect(() => {
    setOpenPopUp(open);
  }, [open]);
  const apiFormat = "YYYY-MM-DD";

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        disableFuture={disableFutureDate}
        PopperProps={{
          style: { zIndex: 1000000 }
        }}
        label={placeholder}
        value={value}
        open={openPopUp}
        onOpen={() => setOpenPopUp(true)}
        onClose={() => setOpenPopUp(false)}
        disabled={disabled}
        inputFormat={format === "" ? "MM/dd/yyyy" : "dd-MM-yyyy"}
        shouldDisableDate={shouldDisableDate}
        shouldDisableYear={shouldDisableYear}
        onChange={newValue => {
          onDateChange(newValue);
        }}
        renderInput={params => (
          <TextField
            {...params}
            error={error}
            helperText={helperText || ""}
            label={placeholder}
            style={style}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default BasicDatePicker;
