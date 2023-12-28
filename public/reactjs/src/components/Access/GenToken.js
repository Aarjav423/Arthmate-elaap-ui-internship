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
import {getTokenWatcher} from "../../actions/generateToken";
import {storedList} from "../../util/localstorage";
const user = storedList("user");

export default function GenToken(props) {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState(false);
  const {product, company, type, user, defineError, disabled} = props;
  const dispatch = useDispatch();

  const handleGenerateToken = () => {
    const data = {
      company_id: company.value,
      company_code: company.code,
      product_id: product._id,
      user_id: user._id,
      user_name: user.username,
      type
    };
    if (type === "api") {
      data["loan_schema_id"] = product.loan_schema_id;
      data["credit_rule_grid_id"] = product.credit_rule_grid_id;
      data["automatic_check_credit"] = product.automatic_check_credit;
    }
    dispatch(
      getTokenWatcher(
        data,
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

  return (
    <>
      <IconButton
        color="primary"
        aria-label="access-token"
        disabled={disabled}
        onClick={handleGenerateToken}
      >
        <KeyIcon />
      </IconButton>
      <Dialog
        open={open}
        fullWidth
        fullHeight
        onClose={() => {
          setOpen(false);
        }}
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
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </Button>
          <IconButton
            aria-label="access-token"
            onClick={navigator.clipboard.writeText(token)}
          >
            <ContentPasteIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
