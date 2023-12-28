import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import { Grid, CardContent } from "@mui/material";
import {
  deleteLeadWatcher,
  getLeadDetailsByIdWatcher,
  downloadCibilReport,
  leadManualReviewWatcher
} from "../../actions/loanRequest";
import { useHistory, useParams } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import DemoGraphicCard from "./lmsDemographicsCards";
import { AlertBox } from "../../components/AlertBox";
// import Button from "@mui/material/Button";
import axios from "axios";
import { saveAs } from "file-saver";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { checkAccessTags } from "../../util/uam";
import { storedList } from "../../util/localstorage";
import { makeStyles, styled } from "@material-ui/core/styles";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import CompanyProductDetails from "./companyProductDetails";
const user = storedList("user");
import Button from "react-sdk/dist/components/Button/Button";
import Accordion from "react-sdk/dist/components/Accordion/Accordion"
import { getAllCompaniesWatcher } from "../../actions/company";
import { getProductByIdWatcher } from "../../actions/product"; 
import InputBox from "react-sdk/dist/components/InputBox/InputBox"

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
            color: "white"
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const LeadDemographics = (props) => {
  const { open, data, loanSchemaId, onModalClose, title, ...other } = props;
  const [loanData, setLoanData] = useState(null);
  const [cardsData, setCardsData] = useState();
  const [disabled, setDisabled] = useState(false);
  //alert
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const { loan_app_id, company_id, product_id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const [borrower, setBorrower] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [showApproveButton, setShowApproveButton] = useState(false);
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const [comment, setComment] = useState("");
  const [manualReviewDecision, setManualReviewDecision] = useState("");
  const [openCompanyDetails, setOpenCompanyDetails] = useState(true);
  const [company, setCompany] = useState(null);
  const [product, setProduct] = useState(null);
  const inputBoxCss={
    marginTop:"8px",
    width:"235px",
    zIndex:1,
    minHeight:"161px"
  }

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const fetchLoandetails = () => {
    const params = {
      loan_app_id: loan_app_id,
      company_id: company_id,
      product_id: product_id
    };

    dispatch(
      getLeadDetailsByIdWatcher(
        params,
        (result) => {
          if (result.data?.lead_status === "manual") {
            setShowApproveButton(true);
          }
          setLoanData(result);
        },
        (error) => {
          return showAlert(error.response.data.message, "error");
        }
      )
    );
  };

  const downloadCibilReportApi = () => {
    const params = {
      loan_app_id: loan_app_id,
      company_id: company_id,
      product_id: product_id,
      borrower_type: borrower
    };
    dispatch(
      downloadCibilReport(
        params,
        (result) => {
          handleDownload(result, loan_app_id);
        },
        (error) => {
          return showAlert(error.response.data.message, "error");
        }
      )
    );
  };

  useEffect(() => {
    dispatch(
      getAllCompaniesWatcher(
        async companies => {
          const companyInRow = companies.filter(
            item => item._id.toString() === company_id
          )[0];
          setCompany(companyInRow);
          dispatch(
            getProductByIdWatcher(
              product_id,
              async productResp => {
                const productInRow = productResp;
                setProduct(productInRow);
              },
              productError => {}
            )
          );
        },
        error => {}
      )
    );
  }, []);

  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags([
        "tag_lead_details_read",
        "tag_lead_details_read_write",
        "tag_lead_list_read",
        "tag_lead_list_read_write"
      ])
    )
      fetchLoandetails();
    if (!isTagged) fetchLoandetails();
  }, []);

  useEffect(() => {
    if (loanData) {
    let data = loanData.fieldDepartmentMapper
    let productData = {
      title:"Product Details",
      data:[
          {
              body:product?.name,
              head:"PRODUCT NAME"
          },
          {
              body:company?.name,
              head:"COMPANY NAME"
          },
          {
            body:company?.code,
            head:"COMPANY CODE"
        }
      ]
  }
    const newArray = Object.keys(data).map(section => {
      return {
        title: section,
        data: data[section].fields.map(field => ({
          body: loanData.data[field] === "" || !loanData.data[field] ? "NA" : loanData.data[field],
          head: field.replace(/_/g, " ").toUpperCase()
        }))
      };
    });
    newArray.unshift(productData);
    setCardsData(newArray)
  };
  }, [loanData,product]);

  const handleDownload = async (data, loan_app_id) => {
    try {
      const linkSource = `data:application/pdf;base64,${data}`;
      const downloadLink = document.createElement("a");
      const fileName = `${loan_app_id}_cibil_report.pdf`;
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
      setDisabled(true);
    } catch (err) {
      setDisabled(true);
      console.error(err);
    }
  };

  const handleDelete = () => {
    const params = {
      loan_app_id: loan_app_id,
      company_id: company_id,
      product_id: product_id
    };

    dispatch(
      deleteLeadWatcher(
        params,
        (result) => {
          showAlert(result.message, "success");
          if (showApproveButton) {
            handleApprove("Rejected");
          }
          setTimeout(() => {
            history.push("/admin/lending/leads");
          }, 3000);
        },
        (error) => {
          setDisabled(false);
          return showAlert(error?.response?.data?.message, "error");
        }
      )
    );
    setDisabled(true);
  };

  const handleApprove = (value) => {
    let manualReviewDecision = value;
    const payload = {
      loan_app_id: loan_app_id,
      company_id: company_id,
      product_id: product_id,
      user_id: user._id,
      manual_review_decision: manualReviewDecision
    };
    new Promise((resolve, reject) => {
      dispatch(leadManualReviewWatcher(payload, resolve, reject));
    })
      .then((response) => {
        showAlert(response.message, "success");
        setTimeout(() => {
          history.push("/admin/lending/leads");
        }, 3000);
      })
      .catch((error) => {
        showAlert(error.message, "error");
      });
  };

  const handleAlertClose = () => {
    setAlert(false);
    setAlertMessage("");
    setSeverity("");
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 4000);
  };
  const [expanded, setExpanded] = useState(-1);
  const handleChange = (panel) => {
    expanded !== panel ? setExpanded(panel) : setExpanded(false);
    setOpenCompanyDetails(false);
  };

  const handleApprovePopup = () => {
    setIsOpen(!isOpen);
    setOpenDialog(!openDialog);
  };

  const renderApprovePopup = () => (
    <>
      <BootstrapDialog
        onClose={handleApprovePopup}
        aria-labelledby="customized-dialog-title"
        open={openDialog}
        maxWidth={"lg"}
        style={{ marginBottom: "200px" }}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleApprovePopup}
          style={{ color: "black", textAlign: "center" }}
        >
          {" "}
          Confirm
        </BootstrapDialogTitle>
        <Grid item sx={{ mb: 2 }} style={{ textAlign: "center" }}>
          <div>Please check the documents submitted for </div>
          <div>this lead to approve or reject the lead</div>
        </Grid>
        <Grid
          display="flex"
          justifyContent="center"
          alignItems="flex-end"
          style={{ marginBottom: "20px" }}
        >
          <Button
            label="Cancel"
            buttonType="primary"
            onClick={handleApprovePopup}
          />

          <Button
            label="Approve"
            buttonType="primary"
            onClick={() => {
              handleApprove("Approved");
            }}
          />
        </Grid>
      </BootstrapDialog>
    </>
  );

  const handleCloseConfirmPopup = () => {
    setIsOpenConfirm(!isOpenConfirm);
    setOpenDialogConfirm(!openDialogConfirm);
  };

  const renderConfirmPopup = () => (
    <>
      <BootstrapDialog
        onClose={handleCloseConfirmPopup}
        aria-labelledby="customized-dialog-title"
        open={openDialogConfirm}
        maxWidth={"lg"}
        style={{ marginBottom: "200px" }}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleCloseConfirmPopup}
          style={{ color: "black", textAlign: "center" }}
        >
          {" "}
          Confirm
        </BootstrapDialogTitle>
        <Grid item sx={{ mb: 2 }} style={{ textAlign: "center" }}>
          <div>Are you sure you want to reject the lead</div>
        </Grid>
        <Grid
          display="flex"
          justifyContent="center"
          alignItems="flex-end"
          style={{ marginBottom: "20px" }}
        >

<Button label="Cancel" buttonType="primary" onClick={handleCloseConfirmPopup} />
<Button label="Reject" buttonType="secondary"  customStyle={{color:"red" , border:"1px solid red"}} onClick={handleDelete} />
        </Grid>
      </BootstrapDialog>
    </>
  );

  return (
  <div style={{margin:"24px 24px 24px 10px"}}>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
    <div>
        {isOpen ? renderApprovePopup() : null}
        {isOpenConfirm ? renderConfirmPopup() : null}
        {isTagged ? (
          checkAccessTags([
            "tag_lead_details_read_write",
            "tag_lead_list_read_write",
            "tag_lead_list_read"
          ]) ? (
          <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "50px",
                height: "45px",
                alignItems: "center",
              }}
            >
              {checkAccessTags([
                "tag_lead_details_btn_cibil_report",
                "tag_lead_list_read_write",
                "tag_lead_details_read_write"
              ]) ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "20px",
                    marginRight: "15px",
                    height: "45px"
                  }}
                >
                  <InputBox
                    label="Select Borrower"
                    options={[{"label":"Borrower","value":"Borrower"},
                    {"label":"Co-Borrower-1","value":"Co-Borrower-1"},
                    {"label": "Co-Borrower-2","value": "Co-Borrower-2"}
                     ]}
                    isDrawdown={true}
                    onClick={(event) => {
                      if (event.value === "Borrower") {
                        setBorrower("0");
                      }
                      if (event.value === "Co-Borrower-1") {
                        setBorrower("1");
                      }
                      if (event.value === "Co-Borrower-2") {
                        setBorrower("2");
                      }
                    }}
                    customDropdownClass={inputBoxCss}
                    customClass={{height:"58px",width:"235px"}}
                  />
                </div>
              ) : null}
              {checkAccessTags([
                "tag_lead_details_btn_cibil_report",
                "tag_lead_list_read_write",
                "tag_lead_details_read_write"
              ])
                ? (
                  <Button label="Cibil Report" buttonType="primary" customStyle={{height:"48px",fontSize:"16px",borderRadius:"26px",padding: "12px 24px 12px 24px"}} onClick={downloadCibilReportApi} />
                    
                )
                : null}
              {checkAccessTags([
                "tag_lead_details_btn_approve",
                "tag_lead_list_read_write",
                "tag_lead_details_read_write"
              ]) && showApproveButton
                ? (
                 <Button label="Approve" buttonType="primary" customStyle={{height:"48px",fontSize:"16px",borderRadius:"26px",padding: "12px 24px 12px 24px"}} onClick={() => {
                    setIsOpen(!isOpen);
                    setOpenDialog(!openDialog);
                  }} />
                )
                : null}

              {checkAccessTags([
                "tag_lead_details_btn_delete",
                "tag_lead_list_read_write",
                "tag_lead_details_read_write"
              ])
                ?  (
                 <Button label="Reject" buttonType="secondary" customStyle={{color:"red" , border:"1px solid red",height:"48px",borderRadius:"26px",fontSize:"16px",padding: "12px 24px 12px 24px"}}
                  onClick={() => {
                    setIsOpenConfirm(!isOpenConfirm);
                    setOpenDialogConfirm(!openDialogConfirm);
                  }} />
                )
                : null}
            </div>
          ) : null
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "50px",
              height: "45px"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "20px",
                marginRight: "15px",
                height: "45px"
              }}
            >
              <InputBox
                    label="Select Borrower"
                    options={[{"label":"Borrower","value":"Borrower"},
                    {"label":"Co-Borrower-1","value":"Co-Borrower-1"},
                    {"label": "Co-Borrower-2","value": "Co-Borrower-2"}
                     ]}
                    isDrawdown={true}
                    onClick={(event) => {
                      if (event.value === "Borrower") {
                        setBorrower("0");
                      }
                      if (event.value === "Co-Borrower-1") {
                        setBorrower("1");
                      }
                      if (event.value === "Co-Borrower-2") {
                        setBorrower("2");
                      }
                    }}
                    customDropdownClass={inputBoxCss}
                    customClass={{height:"58px",width:"235px"}}
                  />
            </div>

          
             <Button label="Cibil Report" buttonType="primary" customStyle={{height:"48px",fontSize:"16px",borderRadius:"26px",padding: "12px 24px 12px 24px"}}  onClick={downloadCibilReportApi} />

            {showApproveButton ? (
              <Button
                label="Approve"
                buttonType="primary"
                customStyle={{height:"48px",fontSize:"16px",borderRadius:"26px",padding: "12px 24px 12px 24px"}}
                onClick={() => {
                  setIsOpen(!isOpen);
                  setOpenDialog(!openDialog);
                }}
              />
            ) : null}

            <Button
              label="Reject"
              buttonType="secondary"
              customStyle={{color:"red" , border:"1px solid red",height:"48px",fontSize:"16px",borderRadius:"26px",padding: "12px 24px 12px 24px"}}
              onClick={() => {
                setIsOpenConfirm(!isOpenConfirm);
                setOpenDialogConfirm(!openDialogConfirm);
              }}
            />
          </div>
        )}

        { cardsData ? <Accordion
          accordionData={cardsData}
          customClass={{width:"100%"}}
        /> : null}
      </div>
    </div>
  );
};

export default LeadDemographics;
