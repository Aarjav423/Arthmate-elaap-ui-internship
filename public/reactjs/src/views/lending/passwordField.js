import * as React from "react";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import HttpsIcon from "@mui/icons-material/Https";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Typography from "@mui/material/Typography";

export default function PasswordField(props) {
  const { accessTags, passwordValue, doc_key, ...other } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickCopyPassword = () => {
    navigator.clipboard.writeText(doc_key);
    setShowCopied(true);
    setTimeout(() => {
      setShowCopied(false);
    }, 3000);
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          margin: "0 auto"
        }}
      >
        <>
          <Typography
            variant="span"
            component="span"
            style={{ fontSize: "18px", marginBottom: "10px" }}
          >
            File is password protected
          </Typography>
        </>

        <FormControl
          sx={{ width: "40ch", mb: 1, display: "flex", flexDirection: "row" }}
          variant="outlined"
        >
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            value={doc_key}
            startAdornment={
              <InputAdornment position="start">
                <HttpsIcon />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
                <IconButton aria-label="" onClick={handleClickCopyPassword}>
                  <ContentCopyIcon></ContentCopyIcon>
                </IconButton>
              </InputAdornment>
            }
          />
          {showCopied ? (
            <Typography
              variant="span"
              component="span"
              style={{
                fontSize: "18px",
                marginBottom: "10px",
                color: "green",
                alignSelf: "center",
                marginLeft: "10px"
              }}
            >
              copied!
            </Typography>
          ) : null}
        </FormControl>
        <Typography
          variant="span"
          component="p"
          style={{ fontSize: "18px", marginBottom: "10px" }}
        >
          Copy the password and open the document
        </Typography>
      </Box>
    </>
  );
}
