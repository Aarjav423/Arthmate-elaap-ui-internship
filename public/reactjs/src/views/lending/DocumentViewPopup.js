import * as React from "react";
import { styled } from "@material-ui/core/styles";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import PasswordField from "./passwordField";

export default function DocumentViewPopup(props) {
  const {
    open,
    onModalClose,
    title,
    openDialog,
    handleClose,
    blobUrl,
    accessTags,
    doc_key,
    doc,
    ...other
  } = props;
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(3)
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1)
    }
  }));

  const BootstrapDialogTitle = props => {
    const { children, onClose, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 1 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 1,
              color: theme => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  };

  return (
    <>
      {openDialog ? (
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={openDialog}
          maxWidth={"lg"}
          fullWidth={true}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            {title}
          </BootstrapDialogTitle>
          <>
            <div style={{ marginTop: "20px" }}>
              <iframe
                src={blobUrl}
                type="application/pdf"
                width="100%"
                height="450px"
              />
            </div>
            {doc_key && doc_key !== "" ? (
              <PasswordField doc_key={doc_key} sx={{ mt: 1 }} />
            ) : null}
          </>
        </BootstrapDialog>
      ) : null}
    </>
  );
}
