import React from "react";
import Box from "@mui/material/Box";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";

const ConfirmationPopUp = ({ setIsOpen, title, message, btnText }) => {
  return (
    <>
      <Dialog maxWidth={"sm"} open={true} onClose={() => setIsOpen()}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Grid
            sx={{
              ml: 1,
              mt: 1
            }}
          >
            {message}
          </Grid>

          <DialogActions>
            <Button
              variant="contained"
              onClick={() => setIsOpen()}
              color="success"
            >
              {btnText || "Okay"}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConfirmationPopUp;
