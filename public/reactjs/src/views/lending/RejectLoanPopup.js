import {Button} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import * as React from "react";
import CustomDropdown from "../../components/custom/customSelect";
import Grid from "@mui/material/Grid";

export const RejectLoanPopup = props => {
  const {
    isReject,
    handleClose,
    setRejectReason,
    setRejectRemark,
    handleLoanStatus
  } = props;

  const reasonsList = {
    "Incorrect loan amount I01": "I01",
    "Incorrect net disbursement amount or fees I02": "I02",
    "Incorrect tenure I03": "I03",
    "Incorrect interest type I04": "I04",
    "Incorrect interest rate I05": "I05",
    "Incorrect repayment type I06": "I06",
    "Incorrect borrower details I07": "I07",
    "Disbursement could not happen on time I08": "I08",
    "Screening failed I09":"I09"
  };

  return (
    <div>
      <Dialog onClose={handleClose} open={isReject} fullWidth={"xs"}>
        <DialogTitle>Reject loan reason</DialogTitle>
        <DialogContent>
          <Grid mt={2}>
            <Grid item xs={12}>
              <CustomDropdown
                placeholder="Select reason"
                data={Object.keys(reasonsList)}
                handleDropdownChange={value => {
                  setRejectReason(value ? reasonsList[value] : "");
                }}
              />
            </Grid>
          </Grid>
          <Grid>
            <Grid item xs={12} mt={2}>
              <TextField
                fullWidth
                autoFocus
                inputProps={{
                  maxlength: 250
                }}
                label="Remarks"
                variant="standard"
                onChange={event => {
                  setRejectRemark(event.target.value);
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleLoanStatus()}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
