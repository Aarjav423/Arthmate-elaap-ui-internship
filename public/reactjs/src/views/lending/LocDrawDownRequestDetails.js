import * as React from "react";
import { styled } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useEffect, useState } from "react";
import { drawDownRequestDetailsWatcher,rejectDrawDownRequestWatcher } from "../../actions/transactionHistory";
import ReactBSAlert from "react-bootstrap-sweetalert";
import { Button, Divider } from "@mui/material";
import ButtonNew from "react-sdk/dist/components/Button/Button"
import { useParams, useHistory} from "react-router-dom";
import { useDispatch ,useSelector } from "react-redux";
import { AlertBox } from "../../components/AlertBox";
import { checkAccessTags } from "../../util/uam";
import { storedList } from "../../util/localstorage";
import { Box, IconButton } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { convertImagesToPdf, convertTextFileToPdf } from "../../util/helper";
import { uploadDrawDownDocumentsWatcher } from "../../actions/loanDocuments";
import { getDrawDownDocsWatcher } from "../../actions/loanDocuments";
import { viewDocsWatcher } from "../../actions/loanDocuments";
import { b64ToBlob } from "../../util/helper";
import CustomizeTemplates from "../loanSchema/templateTabs";
import Accordion from "react-sdk/dist/components/Accordion/Accordion";
import UploadCard from "react-sdk/dist/components/UploadCard";
import Preloader from "../../components/custom/preLoader";

const user = storedList("user");
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

            color: "black"
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function LOCDrawdownRequests() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { company_id, product_id, loan_id, request_id,loan_app_id,status,line_pf} = useParams();
  const [cardsData, setCardsData] = useState([]);

  const [alert, setAlert] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");

  const [expanded, setExpanded] = useState(true);

  const [openUpload, setOpenUpload] = useState(false);

  const [severity, setSeverity] = useState("");

  const [pageType, setPageType] = useState("Details");

  const [fileData, setFileData] = useState(null);

  const [submitType, setSubmitType] = useState("");

  const [code, setCode] = useState(0);

  const [uploadComplete, setUploadComplete] = useState(false);

  const [fileName, setFileName] = useState("");

  const [isInvoiceUploaded, setisInvoiceUploaded] = useState(false);

  const [isDrawdownUploaded, setIsDrawdownUploaded] = useState(false);

  const [popupContent, setPopupContent] = useState("");

  const [loader, setLoader] = useState(false);

  const [buttonLoader, setButtonLoader] = useState(false);

  const [fetchedPreviousData, setFetchedPreviousData] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const isLoading = useSelector(state => state.profile.loading);

  const handleAlertClose = () => {
    setAlert(false);

    setSeverity("");

    setAlertMessage("");
  };

  const handleResponsePopUp = (message, severity) => {
    setAlert(true);

    setAlertMessage(message);

    setSeverity(severity);

    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };

  const getBase64Data = async fileData => {
    const b64Data = await convertImagesToPdf(fileData);

    setFileData(b64Data);
  };

  const handleFileChange = event => {
    let selectedFileEvent = event.target.files;

    if (selectedFileEvent[0]["size"] > 10e6) {
      handleResponsePopUp(
        "File size should not be greater than 8 MB",

        "error"
      );
    }

    const fileType = selectedFileEvent[0]["name"];

    const fileExtension = fileType.split(".").pop();

    setFileName(selectedFileEvent[0]["name"]);

    if (
      (selectedFileEvent.length > 0 && fileExtension === "png") ||
      fileExtension === "jpeg" ||
      fileExtension === "jpg"
    ) {
      let fileToLoad = selectedFileEvent[0];

      let fileReader = new FileReader();

      fileReader.onload = fileLoadedEvent => {
        getBase64Data(fileLoadedEvent.target.result);
      };

      fileReader.readAsDataURL(fileToLoad);
    }

    if (selectedFileEvent.length > 0 && fileExtension === "pdf") {
      let fileToLoad = selectedFileEvent[0];

      let fileReader = new FileReader();

      fileReader.onload = fileLoadedEvent => {
        setFileData(fileLoadedEvent.target.result);
      };

      fileReader.readAsDataURL(fileToLoad);
    }

    setTimeout(() => {
      setUploadComplete(true);
    }, 3000);
  };

  const handleFileUpload = () => {
    setButtonLoader(true);

    if (!fileData) {
      return handleResponsePopUp(
        "Please select file",

        "error"
      );
    }

    const foundItem = cardsData[0]?.data.find(
      item => item.head === "Loan App ID"
    );

    const data = {
      submitData: {
        loan_app_id: foundItem?.body || loan_app_id,

        drawdown_request_id: request_id,

        doc: [{ code: code, base64pdfencodedfile: fileData }]
      },

      userData: {
        company_id: company_id,

        product_id: product_id,

        user_id: user._id
      }
    };

    new Promise((resolve, reject) => {
      dispatch(uploadDrawDownDocumentsWatcher(data, resolve, reject));
    })

      .then(result => {
        delete data.submitData.base64pdfencodedfile;

        delete data.submitData.fileType;

        setFileData("");

        setFileName("");

        setCode("");

        setUploadComplete(false);

        handleResponsePopUp(
          result.uploadDocumentData[0].message,

          "success"
        );

        if (code === 104) {
          setisInvoiceUploaded(true);
        } else if (code === 102) {
          setIsDrawdownUploaded(true);
        }

        fetchPreviousDocuments();

        setButtonLoader(false);

        handleClose();
      })

      .catch(error => {
        setCode("");

        handleClose();

        handleResponsePopUp(error?.response?.data, "error");
      });
  };

  const handleViewDoc = (awsurl, doctype) => {
    const foundItem = cardsData[0]?.data.find(
      item => item.head === "Loan App ID"
    );

    let data = {
      company_id: company_id,

      product_id: product_id,

      loan_app_id: foundItem?.body || loan_app_id,

      awsurl,

      user_id: user._id
    };

    dispatch(
      viewDocsWatcher(
        data,

        response => {
          handleDocumentPopUp(response, doctype);
        },

        error => {}
      )
    );
  };

  const handleDocumentPopUp = (pdf, fileType) => {
    if (pdf.indexOf("data:application/pdf;base64,") >= 0) {
      pdf = pdf.replace("data:application/pdf;base64,", "");
    }

    const contentType = "application/pdf";

    const blob = b64ToBlob(pdf, contentType);

    const blobUrl = URL.createObjectURL(blob);

    setPopupContent(
      <ReactBSAlert
        style={{
          display: "block",

          marginTop: "-350px",

          width: "900px",

          padding: "15px 4px 3px 3px",

          position: "relative"
        }}
        title={fileType}
        confirmBtnBsStyle="success"
        btnSize="md"
        showConfirm={false}
      >
        <div>
          <button
            type="button"
            className="close"
            style={{
              position: "absolute",

              top: "21px",

              right: "20px",

              zIndex: "999"
            }}
            onClick={() => setPopupContent(false)}
          >
            <CloseIcon />
          </button>

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

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags([
        "tag_drawdown_request_read",

        "tag_drawdown_request_read_write",

        "tag_drawdown_request_details_read_write"
      ])
    )
      fetchDrawDownDetailsList();

    if (!isTagged) fetchDrawDownDetailsList();
  }, []);

  const showAlert = (msg, type) => {
    setAlert(true);

    setSeverity(type);

    setAlertMessage(msg);

    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  const fetchDrawDownDetailsList = () => {
    const payload = {
      user_id: user._id,

      request_id,

      loan_id: loan_id,

      company_id,

      product_id
    };

    new Promise((resolve, reject) => {
      dispatch(drawDownRequestDetailsWatcher(payload, resolve, reject));
    })

      .then(response => {
        const amountFields = [
          "USAGE FEE INCLUDING GST", "USAGE FEE", "GST USAGE FEE", "CGST USGAE FEE", "SGST USAGE FEE", "IGST USAGE FEE",
          "UPFRONT INTEREST", "BOUNCE CHARGES"
        ];

        const formattedData = response.data.map(item => {
          let bodyValue;
          if (amountFields.includes(item.key.toUpperCase())) {
            bodyValue = (item.value === "" || item.value === "N/A"  || (!item.value && item.value!=0)) ? "NA" 
              : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.value);
          } else {
            bodyValue = item.value;
          }

          return ({
            body: bodyValue,
            head: item.key.toUpperCase()
          })
        });

        const details = [
          {
            title: "Drawdown Details",

            data: formattedData
          }
        ];

        setCardsData(details);
        setDisabled(false)
      })

      .catch(() => {
        showAlert("No drawdown records found for the loan id", "error");
        setDisabled(true)
      });
  };

  const rejectDrawDownReject = () => {
    const payload = {
      user_id: user._id,
      request_id:request_id,
      loan_id: loan_id,
      company_id: company_id,
      product_id: product_id,
    };
    new Promise((resolve, reject) => {
      dispatch(rejectDrawDownRequestWatcher(payload, resolve, reject));
    })
      .then(response => {
        showAlert(response?.message,"success")
        setDisabled(true)
        setTimeout(() => {
          history.goBack(); 
        }, 2000);
      })
      .catch((error) => {
        console.log("error",error)
        showAlert(error?.response?.data?.message || "Error while rejecting drawdown request", "error");
      });
  };

  const handleClose = () => {
    setFileData(null);

    setOpenUpload(false);

    setUploadComplete(false);
  };

  const renderUploadModal = () => (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openUpload}
        maxWidth={"lg"}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
          style={{ color: "#151515", display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              fonSize: "18px",

              fontWeight: "500",

              lineHeight: "150%"
            }}
          >
            {submitType == "invoice"
              ? "Upload Invoice"
              : "Upload Drawdown Request"}
          </div>

          <div
            style={{
              fontSize: "12px",

              fontWeight: "400",

              lineHeight: "150%",

              color: "#9E9E9E"
            }}
          >
            {"PDF, PNG, JPG and JPEG files are allowed"}
          </div>
        </BootstrapDialogTitle>

        <div
          style={{
            backgroundColor: "#fff",
            width: "430px",
            margin: "15px 15px",
            display: "flex",
            flexDirection: "column",
            color: "var(--neutrals-9-e, #9E9E9E)"
          }}
        >
          {uploadComplete ? (
            <div
              style={{
                bordeRadius: "4px",

                border: "1px dashed var(--success-500-main, #0DB928)",

                background: "#EEFFF1",

                justifyContent: "center",

                alignItems: "center",

                display: "flex",

                flexDirection: "column",

                height: "250px"
              }}
            >
              <div>
                <CheckCircleIcon style={{ fontSize: "80", color: "#0DB928" }} />
              </div>

              <div
                style={{
                  marginTop: "20px",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >{`${fileName} upload successfully`}</div>
            </div>
          ) : (
            <div
              style={{
                bordeRadius: "4px",

                border: "1px dashed var(--neutrals-d-9, #D9D9D9)",

                background: "var(--neutrals-f-9, #F9F9F9)",

                justifyContent: "center",

                alignItems: "center",

                display: "flex",

                flexDirection: "column",

                height: "250px"
              }}
            >
              <input
                type="file"
                accept=".png,.jpeg,.jpg,.pdf"
                style={{ display: "none" }}
                onChange={e => {
                  handleFileChange(e);
                }}
                id="file-upload"
              />

              <label htmlFor="file-upload">
                <div>
                  <FileUploadOutlinedIcon style={{ fontSize: "80" }} />
                </div>
              </label>

              <div>{"Drag and drop or browse to choose a file"}</div>
            </div>
          )}

          <div
            style={{
              marginTop: "20px"
            }}
          >
            <Button
              variant="contained"
              color="primary"
              style={{
                textTransform: "none",

                alignItems: "center",

                width: "100%",

                paddingTop: "14px",

                paddingBottom: "14px"
              }}
              disabled={!uploadComplete}
              onClick={handleFileUpload}
            >
              {buttonLoader == true ? (
                <CircularProgress size={24} style={{ color: "white" }} />
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </div>
      </BootstrapDialog>
    </>
  );

  const fetchPreviousDocuments = () => {
    const foundItem = cardsData[0]?.data.find(
      item => item.head === "Loan App ID"
    );

    const params = {
      company_id: company_id,
      product_id: product_id,
      doc_stage: "draw_down_document",
      loan_app_id: foundItem?.body || loan_app_id,
      user_id: user._id
    };

    new Promise((resolve, reject) => {
      dispatch(getDrawDownDocsWatcher(params, resolve, reject));
    })

      .then(result => {
        const tempData = result.data.filter((item) => {
          return item.drawdown_request_id == request_id;
        });
        const splitCodeData = tempData.reduce((acc, curr) => {
          const code = curr.code;

          if (acc[code]) {
            acc[code].push(curr);
          } else {
            acc[code] = [curr];
          }

          return acc;
        }, {});

        if (splitCodeData["104"] && splitCodeData["104"].length >= 2) {
          splitCodeData["104"].reverse();
        }

        if (splitCodeData["102"] && splitCodeData["102"].length >= 2) {
          splitCodeData["102"].reverse();
        }

        setFetchedPreviousData(splitCodeData);

        if (splitCodeData["104"] && splitCodeData["104"].length > 0) {
          //perfoma invoice is present

          setisInvoiceUploaded(true);
        }

        if (splitCodeData["102"] && splitCodeData["102"].length > 0) {
          //drawdown request is present

          setIsDrawdownUploaded(true);
        }
      })

      .catch(error => {
        handleResponsePopUp(
          error?.response?.data?.message || "Something went wrong",

          "error"
        );
      });
  };

  const handleDocuments = () => {
    fetchPreviousDocuments();

    setPageType("Documents");
  };

  const handleDetails = () => {
    setPageType("Details");
  };

  const changeActiveTab = tabName => {
    const tabClickHandlers = {
      details: handleDetails,

      documents: handleDocuments
    };

    const tabClickHandler = tabClickHandlers[tabName];

    if (tabClickHandler) {
      tabClickHandler();
    }
  };
  const customButtonCss = {padding: "12px 24px",height:"48px",width:"101px",display:"flex",alignItems:"center",color:"red" ,bordeRadius:"26px", border:"1px solid red"}
  const customDisableButtons = {padding: "12px 24px",height:"48px",width:"101px",display:"flex",alignItems:"center",color:"#DADBE2" ,bordeRadius:"26px", border:"1px solid #DADBE2"}

  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onclose={handleAlertClose}
        />
      ) : null}

      {popupContent}

      {openUpload ? renderUploadModal() : null}

      <div style={{ margin: "24px" }}>
        <CustomizeTemplates
          templatesdata={["Details", "Documents"]}
          initialState={"Details"}
          onIndexChange={changeActiveTab}
          marginLeft={"0px"}
        />
      </div>

      {pageType == "Details" ? (
        <div style={{ margin: "24px",display:"flex",flexDirection:"column",gap:"24px" }}>
          {cardsData.length ? (
            <Accordion
              accordionData={cardsData}
              customClass={{ width: "100%" }}
            />
          ) : null}{" "}
        <div style={{display:"flex",justifyContent:"flex-end"}}>
        <ButtonNew
         label="Reject"
         buttonType="secondary"
         isDisabled={status ==1 || status==2 || status==4 || disabled || line_pf==="true" ? true : false}
         onClick={rejectDrawDownReject}
         customStyle={(status ==1 || status==2 || status==4 || disabled ||line_pf==="true") ? customDisableButtons : customButtonCss}
        />
        </div>
        </div>
      ) : pageType == "Documents" ? (
        <div style={{ display: "flex", margin: "24px" }}>
          <UploadCard
            hasDocument={isInvoiceUploaded}
            heading="Invoice"
            viewOnClick={() =>
              handleViewDoc(
                fetchedPreviousData["104"][0].value,

                "Invoice"
              )
            }
            uploadOnClick={() => {
              setCode(104);

              setSubmitType("invoice");

              setOpenUpload(true);
            }}
          />

          <UploadCard
            heading="Drawdown Agreement"
            hasDocument={isDrawdownUploaded}
            viewOnClick={() =>
              handleViewDoc(
                fetchedPreviousData["102"][0].value,

                "DrawdownRequest"
              )
            }
            uploadOnClick={() => {
              setCode(102);

              setSubmitType("drawDown");

              setOpenUpload(true);
            }}
          />
        </div>
      ) : null}
      {isLoading && <Preloader />}
    </>
  );
}
