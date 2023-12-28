import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// @mui material components
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import ReactBSAlert from "react-bootstrap-sweetalert";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TabPanel from "../../components/tabPanel";
import IconButton from "@mui/material/IconButton";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { b64ToBlob } from "../../util/helper";
import { storedList } from "../../util/localstorage";
import {
  uploadLoanDocumentsWatcher,
  viewDocsWatcher,
} from "../../actions/loanDocuments";

export default function DocUpload(props) {
  const { data, loanData, loanSchemaId, getLoanDocs, ...other } = props;
  const [tabIndex, setTabIndex] = useState(0);
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [fileData, setFileData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [upload, setUpload] = useState(false);
  const [alert, setAlert] = useState("");
  const [docCode, setDocCode] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (upload && fileData) {
      handleUploadFile(fileData);
    }
  }, [upload]);

  // Pop-Ups for response in Modals
  const handleResponsePopUp = (message, title, success, error) => {
    setAlert(
      <ReactBSAlert
        success={success}
        error={error}
        style={{ display: "block", marginTop: "-250px" }}
        title={title}
        onConfirm={() => handleModalClose()}
        confirmBtnBsStyle="success"
        btnSize="md"
      >
        {message}
      </ReactBSAlert>
    );
  };

  const handleFileChange = (event,name,field,code) => {
    setDocCode(code);
    let selectedFile = event.target.files;
    if (selectedFile[0]["size"] > 10e6) {
      return handleResponsePopUp(
        "File size should not be greater than 8 MB",
        "Error",
        false,
        true
      );
    }
    const fileType = selectedFile[0]["name"];
    const fileExtension = fileType.split(".").pop();
    if (fileExtension != "pdf") {
      return handleResponsePopUp(
        "Only .pdf file is allowed",
        "Error",
        false,
        true
      );
    }
    //Check File is not Empty
    if (selectedFile.length > 0) {
      // Select the very first file from list
      let fileToLoad = selectedFile[0];
      // FileReader function for read the file.
      let fileReader = new FileReader();
      // Onload of file read the file content
      fileReader.onload = (fileLoadedEvent) => {
        setFileData(fileLoadedEvent.target.result);
        setFileName(field);
      };
      // Convert data to base64
      fileReader.readAsDataURL(fileToLoad);
    }
  };

  const handleUpload = (fileData) => {
    setUpload(true);
  };

  const handleUploadFile = (fileData) => {
    const user = storedList("user");
    const data = {
      submitData: {
        base64pdfencodedfile: fileData,
        fileType: fileName,
        code: docCode,
        loan_id: loanData.loan_id,
        loan_app_id: loanData.loan_app_id,
        borrower_id: loanData.borrower_id,
        partner_loan_app_id: loanData.partner_loan_app_id,
        partner_borrower_id: loanData.partner_borrower_id,
      },
      userData: {
        company_id: loanData.company_id,
        loan_schema_id: loanSchemaId,
        product_id: loanData.product_id,
        user_id: user._id,
      },
    };

    dispatch(
      uploadLoanDocumentsWatcher(
        data,
        (response) => {
          handleResponsePopUp(response.uploadDocumentData.message, "Success", true, false);
          delete data.submitData.base64pdfencodedfile;
          delete data.submitData.fileType;
          setFileData("");
          setFileName("");
          setDocCode("")
          setUpload(false);
          getLoanDocs(data);
        },
        (error) => {
          setDocCode("")
          handleResponsePopUp(
            error.response.data.message,
            "Error",
            false,
            true
          );
        }
      )
    );
  };

  const handleModalClose = () => {
    setAlert("");
    setFileData("");
    setFileName("");
  };

  const handleViewDoc = (awsurl, doctype) => {
    let data = {};
    data.awsurl = awsurl;
    dispatch(
      viewDocsWatcher(
        data,
        (response) => {
          handleDocumentPopUp(response, doctype);
        },
        (error) => {}
      )
    );
  };

  const handleDocumentPopUp = (pdf, fileType) => {
    if (pdf.indexOf("data:application/pdf;base64,") >= 0)
      pdf = pdf.replace("data:application/pdf;base64,", "");
    const contentType = "application/pdf";
    const blob = b64ToBlob(pdf, contentType);
    const blobUrl = URL.createObjectURL(blob);
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-350px", width: "600px" }}
        title={fileType}
        onConfirm={() => handleModalClose()}
        confirmBtnBsStyle="success"
        btnSize="md"
      >
        <div>
          <iframe
            src={blobUrl}
            type="application/pdf"
            width="100%"
            height="450px"
          />
        </div>
      </ReactBSAlert>
    );
  };

  return (
    <Grid xs={12}>
      {alert}
      <Grid xs={12} container>
        <Grid item xs={12}>
          {data &&
            Object.keys(data).map((template, index) => {
              return (
                <TabPanel value={tabIndex} index={index} key={template}>
                  <Grid xs={12} container spacing={1}>
                    {data &&
                      data.map((doc, id) => {
                        return (
                          <Grid
                            xs={3}
                            item
                            key={id}
                            sx={{
                              border: "1px solid #ccc",
                              borderCollapse: "collapse",
                              padding: "5px",
                            }}
                          >
                            <FormGroup variant="outlined">
                              <Typography
                                variant="caption"
                                display="block"
                                sx={{
                                  color: "green",
                                  fontWeight: "bold",
                                }}
                              >
                                {doc.name}
                                {doc.checked === "TRUE" ? (
                                  <i style={{ color: "#FF0000" }}>*</i>
                                ) : null}
                              </Typography>
                              <div>
                                <IconButton
                                  aria-label="upload loan document"
                                  style={{ color: "black" }}
                                  onClick={() =>
                                    handleResponsePopUp(
                                      <div className="fileinput text-center">
                                        <div>
                                          <input
                                            type="file"
                                            name="file"
                                            onChange={(e) =>
                                              handleFileChange(e, doc.name,doc.field, doc.code)
                                            }
                                          />
                                        </div>
                                        <div>
                                          <Button
                                            size="sm"
                                            onClick={() =>
                                              handleUpload(fileData)
                                            }
                                          >
                                            Upload
                                          </Button>
                                        </div>
                                      </div>,
                                      doc.title
                                    )
                                  }
                                >
                                  <UploadFileIcon fontSize="medium" />
                                </IconButton>
                                {doc.value ? (
                                  <IconButton
                                    aria-label="view loan document"
                                    color="primary"
                                    onClick={() =>
                                      handleViewDoc(doc.value, doc.name)
                                    }
                                  >
                                    <ZoomOutIcon fontSize="large" />
                                  </IconButton>
                                ) : null}
                              </div>
                            </FormGroup>
                          </Grid>
                        );
                      })}
                  </Grid>
                </TabPanel>
              );
            })}
        </Grid>
      </Grid>
    </Grid>
  );
}