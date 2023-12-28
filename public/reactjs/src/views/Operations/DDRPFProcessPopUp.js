import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";

const DDRPFProcessPopUp = ({ setIsOpen, title, message }) => {
  const [progress, setProgress] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);
  const progressRef = React.useRef(() => {});

  React.useEffect(() => {});

  React.useEffect(() => {}, []);

  return (
    <div>
      <React.Fragment>
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
                Okay
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    </div>
  );
};

export default DDRPFProcessPopUp;
