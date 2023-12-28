import * as React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog(props) {
  const {open, content, handleAlertDilogClose, title, ...other} = props;

  return (
    <>
      <Dialog
        open={open}
        onClose={handleAlertDilogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onBackdropClick="false"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Grid alignItems="center" justifyContent="center">
            <Button variant="contained" onClick={handleAlertDilogClose}>
              OK
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </>
  );
}
