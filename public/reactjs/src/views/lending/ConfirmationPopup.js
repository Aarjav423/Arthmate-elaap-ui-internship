import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";

export const ConfirmationPopup = props => {
  const {
    openPopup,
    setOpenPopup,
    header,
    confirmationMessage,
    handleConfirmed,
    yes,
    no,
    showOkay
  } = props;

  return (
    <>
      <Dialog
        open={openPopup}
        onClose={() => setOpenPopup(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ mb: "10px", mt: "10px" }}>
          {header ? (
            <Typography variant={"h6"} textAlign={"center"}>
              {" "}
              {header}{" "}
            </Typography>
          ) : null}
          <Typography>{confirmationMessage}</Typography>
        </DialogTitle>
        <Grid
          container
          justifySelf={"center"}
          alignItems={"center"}
          xs={12}
          alignSelf={"center"}
          mb={2}
        >
          {!showOkay && (
            <>
              <Grid item xs={6} textAlign={"center"}>
                <Button
                  fullWidth={true}
                  variant="contained"
                  color={"info"}
                  onClick={handleConfirmed}
                >
                  {yes}
                </Button>
              </Grid>
              <Grid item xs={6} textAlign={"center"}>
                <Button
                  fullWidth={true}
                  variant="outlined"
                  color={"info"}
                  onClick={() => setOpenPopup(false)}
                  autoFocus
                >
                  {no}
                </Button>
              </Grid>
            </>
          )}
          {showOkay && (
            <>
              <Grid item xs={12} textAlign={"center"}>
                <Button
                  fullWidth={true}
                  variant="contained"
                  color={"info"}
                  onClick={handleConfirmed}
                >
                  {"Okay"}
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </Dialog>
    </>
  );
};
