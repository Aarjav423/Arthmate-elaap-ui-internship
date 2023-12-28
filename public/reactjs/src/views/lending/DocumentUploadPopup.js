import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { DropzoneArea } from "material-ui-dropzone";
import { AlertBox } from "../../components/AlertBox";
import { storedList } from "../../util/localstorage";
import {
  uploadLoanDocumentsWatcher,
  uploadLoanDocumentsXmlJsonWatcher
} from "../../actions/loanDocuments";
import { convertImagesToPdf, convertTextFileToPdf } from "../../util/helper";

const DocumentUploadPopup = (props) => {
  const useAsyncState = (initialState) => {
    const [state, setState] = useState(initialState);
    const asyncSetState = (value) => {
      return new Promise((resolve) => {
        setState(value);

        setState((current) => {
          resolve(current);

          return current;
        });
      });
    };

    return [state, asyncSetState];
  };

  const dispatch = useDispatch();
  const { handleClose, doc, loanData, refreshLoanDocs, docArray } = props;
  const [selectedFile, setSelectedFile] = useAsyncState(null);
  const [fileName, setFileName] = useAsyncState("");
  const [fileData, setFileData] = useAsyncState(null);
  const [passwordProtectedPDF, setPasswordProtectedPDF] = useAsyncState(false);
  const [docKey, setDocKey] = useAsyncState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  const readFileAs = (file, encoding) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        resolve(result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      if (encoding === "text") {
        reader.readAsText(file);
      } else if (encoding === "arrayBuffer") {
        reader.readAsArrayBuffer(file);
      } else {
        reject(new Error("Invalid encoding specified."));
      }
    });
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (file) => {
    await setPasswordProtectedPDF(false);
    await setSelectedFile(null);
    await setFileData(null);
    await setDocKey("");
    if (!file || !file?.length) return;
    let currentSelectedFile = file[0];
    const base64String = await convertFileToBase64(currentSelectedFile);
    if (currentSelectedFile["size"] > 8000000) {
      return showAlert("File size should not be greater than 8 MB", "error");
    }
    await setSelectedFile(file[0]);

    const fileType = currentSelectedFile["name"];
    const fileExtension = fileType.split(".").pop();

    if (["aadhaar_xml", "pan_xml"].includes(doc.field)) {
      if (!["xml", "json"].includes(fileExtension)) {
        return showAlert("Only xml and json are allowed", "error");
      }
      await setFileName(doc.field);
      await setFileData(base64String);
    }

    if (fileExtension === "txt") {
      const text = await readFileAs(file[0], "text");
      await handleConvertTextToBase64Pdf(text);
      await setFileName(doc.field);
    }

    if (["png", "jpeg", "jpg"].includes(fileExtension)) {
      await getBase64Data(base64String);
      await setFileName(doc.field);
    }

    if (fileExtension?.toLowerCase() === "pdf") {
      await setFileData(base64String);
      await setFileName(doc.field);

      let reader = new FileReader();
      await setPasswordProtectedPDF(false);
      reader.readAsArrayBuffer(file[0]);
      reader.onload = function (e) {
        var docInitParams = {
          data: e.target.result,
          password: ""
        };
        pdfjsLib
          .getDocument(docInitParams)
          .promise.then(async (pdfDocument) => {
            const numPages = pdfDocument.numPages;
            await setPasswordProtectedPDF(false);
          })
          .catch((err) => {
            setPasswordProtectedPDF(true);
          });
      };
    }

    if (["xlsx", "xls", "csv"].includes(fileExtension)) {
      const buffer = await readFileAs(file[0], "arrayBuffer");
      await setFileData({
        fieldname: currentSelectedFile.fieldname,
        originalname: currentSelectedFile.name,
        encoding: currentSelectedFile.encoding,
        mimetype: currentSelectedFile.mimetype,
        size: currentSelectedFile["size"],
        buffer: Buffer.from(buffer)
      });
      await setFileName(doc.field);
    }
  };

  let docExtArray = [];
  for (let ele of docArray) {
    if (ele.doc_code === doc.code) docExtArray = ele.doc_ext;
  }

  const handleUploadFile = () => {
    const user = storedList("user");
    if (!fileData) return showAlert("Please select file", "error");

    if (passwordProtectedPDF && fileData && (!docKey || docKey === ""))
      return showAlert(
        "File is password protected please provide password in Doc key section.",
        "error"
      );
    let isReport = false;
    if (
      docExtArray.includes(".xlsx") ||
      docExtArray.includes(".xls") ||
      docExtArray.includes(".csv")
    ) {
      isReport = true;
    }
    var submit = {
      base64pdfencodedfile: isReport ? "" : fileData,
      code: doc.code,
      loan_app_id: loanData.loan_app_id,
      file: isReport ? fileData : ""
    };

    if (["aadhaar_xml", "pan_xml"].includes(doc.field)) {
      submit = { ...submit, fileType: doc.field };
    }
    setSubmitButtonDisabled(true);
    const data = {
      submitData: {
        base64pdfencodedfile: isReport ? "" : fileData,
        fileType: fileName,
        code: doc.code,
        loan_app_id: loanData.loan_app_id,
        file: isReport ? fileData : null,
        doc_key: docKey || null
      },
      userData: {
        company_id: loanData.company_id,
        product_id: loanData.product_id,
        user_id: user._id
      }
    };

    new Promise((resolve, reject) => {
      if (["aadhaar_xml", "pan_xml"].includes(doc.field)) {
        dispatch(uploadLoanDocumentsXmlJsonWatcher(data, resolve, reject));
        dispatch(uploadLoanDocumentsXmlJsonWatcher(data, resolve, reject));
      } else {
        dispatch(uploadLoanDocumentsWatcher(data, resolve, reject));
      }
    })
      .then(async (result) => {
        setSubmitButtonDisabled(false);
        await setFileData(null);
        await setFileName("");
        await setSelectedFile(null);
        setDocKey("");
        if (["aadhaar_xml", "pan_xml"].includes(doc.field)) {
          showAlert(result?.message || result?.uploadFile?.message, "success");
        } else {
          showAlert(
            result?.uploadDocumentData?.message || result?.uploadFile?.message,
            "success"
          );
        }
        refreshLoanDocs();
        setTimeout(() => {
          handleClose();
        }, 1000);
      })
      .catch((error) => {
        setSubmitButtonDisabled(false);
        showAlert(error.response.data.message, "error");
      });
  };

  const handleConvertTextToBase64Pdf = async (fileData, field) => {
    const base64Data = await convertTextFileToPdf(fileData);
    await setFileData(base64Data);
  };

  const getBase64Data = async (fileData) => {
    const b64Data = await convertImagesToPdf(fileData);
    await setFileData(b64Data);
  };

  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={true}
        maxWidth={"sm"}
        fullWidth={true}
      >
        <DialogTitle sx={{ m: 0, p: 1, ml: 1 }}>
          {`Upload ${doc.name}`}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 1,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <>
          <div style={{ margin: "20px 20px 0px 20px", width: "auto" }}>
            <DropzoneArea
              showAlerts={false}
              showPreviews={false}
              showPreviewsInDropzone={false}
              showFileNames={true}
              filesLimit={1}
              maxFileSize={150000000}
              dropzoneText={`Drag and drop a file here or click. Allowed extensions are ${docExtArray}`}
              onChange={handleFileChange}
              acceptedFiles={docExtArray}
            />
          </div>
          <div style={{ margin: "10px 20px 5px 20px" }}>
            Selected file: {selectedFile?.name}
          </div>
          {passwordProtectedPDF ? (
            <>
              <div
                style={{
                  margin: "0 20px 5px 20px",
                  padding: "10px 20px 10px 20px ",
                  backgroundColor: "#FFFBE6",
                  border: "1px solid #FFE9A1",
                  borderRadius: "5px"
                }}
              >
                File is password protected please provide password
              </div>

              <div style={{ margin: "0 20px 0px 20px", width: "auto" }}>
                <TextField
                  margin="normal"
                  fullWidth
                  id="doc_key"
                  label="Doc key"
                  placeholder="Enter doc key"
                  name="text"
                  autoComplete="off"
                  autoFocus
                  value={docKey}
                  onChange={(event) => {
                    setDocKey(event.target.value);
                  }}
                />
                <span style={{ fontSize: "14px" }}>
                  Please ensure password entered by you is correct
                </span>
              </div>
            </>
          ) : null}
          <Button
            fullWidth
            variant="contained"
            onClick={handleUploadFile}
            disabled={!fileData || submitButtonDisabled}
            style={{
              margin: "10px 20px 5px 20px",
              width: "auto"
            }}
          >
            Upload
          </Button>
        </>
      </Dialog>
    </>
  );
};

export default DocumentUploadPopup;
