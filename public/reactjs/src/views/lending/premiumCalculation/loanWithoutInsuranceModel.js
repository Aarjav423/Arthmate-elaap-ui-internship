import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import { AlertBox } from "../../../components/AlertBox";
import { storedList } from "../../../util/localstorage";

export default function LoanWithoutInsuranceModal(props) {
  const {
    openDialog,
    setOpenDialog,
    onAcceptLoanWithoutInsurance,
    onRejectLoanWithoutInsurance,
  } = props;
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleLoanWithoutInsuranceModalClose = () => {
    setOpenDialog(false);
  };

  const handleAcceptInsurance = () => {
    onAcceptLoanWithoutInsurance();
    setOpenDialog(false);
  };

  const rejectInsurance = () => {
    onRejectLoanWithoutInsurance();
    setOpenDialog(false);
  };

  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}

      <Dialog
        open={openDialog}
        onClose={handleLoanWithoutInsuranceModalClose}
        fullWidth
        maxWidth={"xs"}
      >
        <>
          <DialogContent>
            <Grid
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              direction={"column"}
            >
              <Grid item mt={3}>
                <Typography variant="h6">
                  {`Are you sure you want to book the loan without insurance?`}
                </Typography>
              </Grid>
              <Grid
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Grid item mt={2}>
                  <Button variant={"contained"} onClick={handleAcceptInsurance}>
                    Yes
                  </Button>
                </Grid>
                <Grid item mt={2}>
                  <Button variant={"contained"} onClick={rejectInsurance}>
                    No
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        </>
      </Dialog>
    </>
  );
}
