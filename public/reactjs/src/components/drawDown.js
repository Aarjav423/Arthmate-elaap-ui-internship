import React, { useState } from "react";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { document } from "../config/borrower";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { storedList } from "../util/localstorage";
import Grid from "@mui/material/Grid";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Tooltip from '@mui/material/Tooltip';
import { makeStyles } from "@material-ui/core/styles";
import componentStyles from "assets/theme/components/drawDown.js";
import { convertImagesToPdf, convertTextFileToPdf } from "../util/helper";
import { AlertBox } from "../components/AlertBox";
import { uploadDrawDownDocumentsWatcher } from "../actions/loanDocuments";
const useStyles = makeStyles(componentStyles);
export default function DrawDown({
  getDrawDownDocs,
  state,
  handleViewDoc
}) {
  const dispatch = useDispatch();
  const [code, setCode] = React.useState("");
  const [field, setField] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [usageId, setUsageId] = React.useState("");
  const [docCode, setDocCode] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileData, setFileData] = useState('');
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  React.useEffect(() => {
    getDrawDownDocs();
  }, []);

  // Method to Uplaod a new document
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  // Method to close the dialog box
  const handleClose = () => {
    setOpen(false);
    setUsageId("");
    setCode("");
  };
  
  // Method to select the document type
  const handleChange = (event) => {
    setCode(event.target.value);
  };
  
  // Method to submit the document uplaoded against a usage/request id
  const handleSubmit = () => {
    handleUploadDrawFile(usageId, code);
    setOpen(false);
    setUsageId("");
    setCode("");
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleResponsePopUp = (message, severity) => {
    setAlert(true)
    setAlertMessage(message)
    setSeverity(severity)
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  const handleFileChange = (event, name, field, code, doc) => {
    setDocCode(code);
    let selectedFile = event.target.files;
  
    if (selectedFile[0]["size"] > 10e6) {
      handleResponsePopUp(
        "File size should not be greater than 8 MB",
        "error"
      );
    }
  
    const fileType = selectedFile[0]["name"];
    const fileExtension = fileType.split(".").pop();
    if (
      fileExtension != "pdf" &&
      fileExtension != "png" &&
      fileExtension !== "jpeg" &&
      fileExtension !== "txt" &&
      fileExtension !== "jpg" &&
      fileExtension !== "xls" &&
      fileExtension !== "xlsx" &&
      fileExtension !== "csv" &&
      fileExtension !== "xml" &&
      fileExtension !== "json"
    ) {
      let msg = "Only xlsx, xls, csv, pdf, png, jpeg, jpg, txt file is allowed";
      if (code === 114 || code == 116) {
        msg = "Only xml, json file is allowed";
      }
      return handleResponsePopUp(msg, "error");
    }
    if (
      selectedFile.length > 0 && document["xmlJsonType"]["upload"].includes(field)
    ) {
      if (fileExtension != "xml" && fileExtension != "json") {
        return handleResponsePopUp(
          "Only xml and json are allowed",
          "error"
        );
      }
  
      let fileToLoad = selectedFile[0];
      let fileReader = new FileReader();
      fileReader.onload = (fileLoadedEvent) => {
        setFileName(field)
        setFileData(fileLoadedEvent.target.result.replace(/^data:(.*,)?/, ""))
      };
      return fileReader.readAsDataURL(fileToLoad);
    }
  
    if (selectedFile.length > 0 && fileExtension === "txt") {
      let fileToLoad = selectedFile[0];
      let fileReader = new FileReader();
      fileReader.onload = (fileLoadedEvent) => {
        handleConvertTextToBase64Pdf(fileLoadedEvent.target.result);
        setFileName(field);
      };
      return fileReader.readAsText(fileToLoad);
    }
  
    if (
      (selectedFile.length > 0 && fileExtension === "png") ||
      fileExtension === "jpeg" ||
      fileExtension === "jpg"
    ) {
      let fileToLoad = selectedFile[0];
      let fileReader = new FileReader();
      fileReader.onload = (fileLoadedEvent) => {
        getBase64Data(fileLoadedEvent.target.result);
        setFileName(field);
      };
      fileReader.readAsDataURL(fileToLoad);
    }
  
    if (selectedFile.length > 0 && fileExtension === "pdf") {
      // Select the very first file from list
      let fileToLoad = selectedFile[0];
      // FileReader function for read the file.
      let fileReader = new FileReader();
      // Onload of file read the file content
      fileReader.onload = (fileLoadedEvent) => {
        setFileData(fileLoadedEvent.target.result)
        setFileName(field);
      };
      // Convert data to base64
      fileReader.readAsDataURL(fileToLoad);
    }
  
    if (
      (selectedFile.length > 0 && fileExtension === "xlsx") ||
      fileExtension === "xls" ||
      fileExtension === "csv"
    ) {
      // FileReader function for read the file.
      let fileReader = new FileReader();
      // Onload of file read the file content
      fileReader.onload = (fileLoadedEvent) => {
        setFileData({
          fieldname: selectedFile[0].fieldname,
          originalname: selectedFile[0].name,
          encoding: selectedFile[0].encoding,
          mimetype: selectedFile[0].mimetype,
          size: selectedFile[0]["size"],
          buffer: Buffer.from(fileLoadedEvent.target.result)
        });
        setFileName(field);
      };
      // Convert data to base64
      fileReader.readAsArrayBuffer(selectedFile[0]);
    }
  };

  const handleConvertTextToBase64Pdf = async (fileData, field) => {
    const base64Data = await convertTextFileToPdf(fileData);
    await setFileData(base64Data);
  };

  const getBase64Data = async fileData => {
    const b64Data = await convertImagesToPdf(fileData);
    await setFileData(b64Data);
  };

  const handleUploadDrawFile = (usageId, code) => {
    const user = storedList("user");
    setDocCode(code)
    if (!docCode) {
      return handleResponsePopUp(
        "Please select document type",
        "error"
      );
    }
    if (!usageId || usageId == "") {
      return handleResponsePopUp(
        "Please enter a valid Usage/Request ID",
        "error"
      );
    }
    if (!fileData) {
      return handleResponsePopUp(
        "Please select file",
        "error"
      );
    }
    const data = {
      submitData: {
        loan_app_id: state.loan_app_id,
        drawdown_request_id: usageId,
        doc: [{ code: code, base64pdfencodedfile: fileData }]
      },
      userData: {
        company_id: state.company_id,
        product_id: state.product_id,
        user_id: user._id
      }
    };
    new Promise((resolve, reject) => {
      dispatch(uploadDrawDownDocumentsWatcher(data, resolve, reject))
    })
      .then(result => {
        delete data.submitData.base64pdfencodedfile;
        delete data.submitData.fileType;
        setFileData("")
        setFileName("")
        setDocCode("")
        getDrawDownDocs(data);
        handleResponsePopUp(
          result.uploadDocumentData[0].message,
          "success"
        );
      })
      .catch(error => {
        setDocCode("")
        handleResponsePopUp(error?.response?.data, "error");
      });
  };
  
  const classes = {...useStyles()}
  return (
    <div >
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      <React.Fragment>
      <Button
          sx={{ mr: 2, mt : 5}}
          size="md"
          variant="contained"
          color="success"
          onClick={handleClickOpen}
        >
          <span className={classes.addDocButton}>+</span>Add
          Document
        </Button>
        {state.drawDocs &&
          state.drawDocs.drawdown_request_id.map((id, index) => {
            return (
              <div className={classes.drawBox} key={index}>
                <div className={classes.usageId}>
                  Drawdown Request ID : <b>{id}</b>
                </div>

                <Grid container rowSpacing={3}>
                  <div
                    className={classes.docGrid}
                  >
                    {state.drawDocs.data
                      .filter((obj) => obj.drawdown_request_id === id)
                      .map((item, id) => {
                        return (
                          <>
                            <div
                              key={id}
                              className = {classes.docItem}
                            >
                              {item.name}
                              <Tooltip title = "view">
                                <UploadFileIcon
                                  aria-label="upload loan document"
                                  className={classes.fileIcon}
                                  size = "sm"
                                  value = {item.value}
                                  onClick = {() => handleViewDoc(item.value, item.name,item.name,item.code,{name:item.name, doc_key:state.doc_key},true)}
                                ></UploadFileIcon>
                              </Tooltip>
                            </div>
                          </>
                        );
                      })}
                  </div>
                </Grid>
              </div>
            );
          })}
        

        <Dialog fullWidth open={open} onClose={handleClose}>
          <div className = {classes.dialogTitle}>
            <DialogTitle color="white">Upload drawdown document</DialogTitle>
          </div>
          <DialogContent>
            <Box
              noValidate
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "full-width",
              }}
            >
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="demo-simple-select-label">
                  Select document type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={code}
                  label="select document type"
                  onChange={handleChange}
                >
                  <MenuItem value={104} name="invoice">
                    Invoice
                  </MenuItem>
                  <MenuItem value={102} name="aggrement">
                    Drawdown agreement
                  </MenuItem>
                </Select>
              </FormControl>
              <TextField
                id="outlined-basic"
                label="Drawdown_request_ID"
                variant="outlined"
                value={usageId}
                onChange={(e) => setUsageId(e.target.value)}
                sx={{ mt: 4 }}
              />
              <div
                className={classes.fileInput}
              >
                <input
                  type="file"
                  name="file"
                  onChange={(e) => handleFileChange(e, field, field, code)}
                />
              </div>
            </Box>
          </DialogContent>
          <DialogActions sx={{ mb: 2 }}>
            <Button variant="contained" onClick={handleSubmit}>
              {" "}
              Submit{" "}
            </Button>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
}
