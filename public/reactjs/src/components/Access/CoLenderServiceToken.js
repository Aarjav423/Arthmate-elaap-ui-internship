import * as React from "react";
import {useState} from "react";
import {useDispatch} from "react-redux";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import KeyIcon from "@mui/icons-material/Key";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import {getCoLenderTokenWatcher} from "../../actions/generateCoLenderToken";
import {storedList} from "../../util/localstorage";

const user = storedList("user");

export default function CoLenderServiceToken(data) {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const {co_lender_id,co_lender_shortcode, type, user, defineError, disabled} = data;
  const dispatch = useDispatch();

  const handleGenerateToken = () => {
    const tokenData = {
      co_lender_id,
      co_lender_shortcode,
      user_id: user._id,
      user_name: user.username,
      type
    };
    dispatch(
      getCoLenderTokenWatcher(
        tokenData,
        response => {
          setToken(response.token);
          setOpen(true);
        },
        error => {
          defineError(error.response.data.message);
        }
      )
    );
  };

  const handleClose = () => {
      setOpen(false)
  }

  return (
    <>
      <IconButton
        color="primary"
        aria-label="co-lender-service-token"
        disabled={disabled}
        onClick={()=>{ handleGenerateToken()}}
      >
        <KeyIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Use this access key for all API calls.
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{wordWrap: "break-word"}}
          >
            <Typography
              variant="caption"
              display="block"
              gutterBottom
              sx={{wordWrap: "break-word"}}
            >
              {token}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
          >
            Close
          </Button>
          <IconButton
            aria-label="co-lender-service-token"
            onClick={async () => await navigator.clipboard.writeText(token)}
          >
            <ContentPasteIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
