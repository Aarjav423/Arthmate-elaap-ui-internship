import * as React from "react";
import { useState, useEffect } from "react";
import { styled } from "@material-ui/core/styles";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import AddUser from "./user/addUser";

export default function UserPopUp(props) {
  const {
    open,
    onModalClose,
    title,
    openDialog,
    handleClose,
    user,
    action,
    refreshData,
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

  const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
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
          maxWidth={"sm"}
          fullWidth={true}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            {title}
          </BootstrapDialogTitle>
          <AddUser
            action={action}
            user={user}
            cancelProcess={handleClose}
            refreshData={refreshData}
          />
        </BootstrapDialog>
      ) : null}
    </>
  );
}
