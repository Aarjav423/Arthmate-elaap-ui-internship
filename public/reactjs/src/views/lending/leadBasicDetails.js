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
import Button from "@mui/material/Button";
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
            color: "white"
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const CompanyProductDetails = props => {
  const { open, data, loanSchemaId, onModalClose, title, ...other } = props;
  const [loanData, setLoanData] = useState(null);
  const [cardsData, setCardsData] = useState({});
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
        result => {
          if (result.data?.lead_status === "manual") {
            setShowApproveButton(true);
          }
          setLoanData(result);
        },
        error => {
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
        result => {
          handleDownload(result, loan_app_id);
        },
        error => {
          return showAlert(error.response.data.message, "error");
        }
      )
    );
  };

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
    if (loanData) setCardsData(loanData.fieldDepartmentMapper);
  }, [loanData]);

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
        result => {
          showAlert(result.message, "success");
          if (showApproveButton) {
            handleApprove("Rejected");
          }
          setTimeout(() => {
            history.push("/admin/lending/leads");
          }, 3000);
        },
        error => {
          setDisabled(false);
          return showAlert(error?.response?.data?.message, "error");
        }
      )
    );
    setDisabled(true);
  };

  const handleApprove = value => {
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
      .then(response => {
        showAlert(response.message, "success");
        setTimeout(() => {
          history.push("/admin/lending/leads");
        }, 3000);
      })
      .catch(error => {
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
  const [expanded, setExpanded] = useState(0);
  const handleChange = panel => {
    expanded !== panel ? setExpanded(panel) : setExpanded(false);
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
            className="ml-2"
            variant="contained"
            size="large"
            onClick={handleApprovePopup}
          >
            Cancel
          </Button>
          <Button
            className="ml-2"
            variant="contained"
            size="large"
            onClick={() => {
              handleApprove("Approved");
            }}
          >
            Approve
          </Button>
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
          <Button
            className="ml-2"
            variant="contained"
            size="large"
            onClick={handleCloseConfirmPopup}
          >
            Cancel
          </Button>
          <Button
            className="ml-2"
            variant="contained"
            size="large"
            color={"error"}
            onClick={handleDelete}
          >
            Reject
          </Button>
        </Grid>
      </BootstrapDialog>
    </>
  );

  return (
    <CardContent>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      <Grid xs={12} container>
        {title && (
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
        )}
        {isOpen ? renderApprovePopup() : null}
        {isOpenConfirm ? renderConfirmPopup() : null}
        {isTagged ? (
          checkAccessTags([
            "tag_lead_details_read_write",
            "tag_lead_list_read_write",
            "tag_lead_list_read"
          ]) ? (
            <Grid
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "20px",
                height: "45px"
              }}
            >
              {checkAccessTags([
                "tag_lead_details_btn_cibil_report",
                "tag_lead_list_read_write",
                "tag_lead_details_read_write"
              ]) ? (
                <Grid
                  item
                  xs={3}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "20px",
                    marginRight: "-5px",
                    height: "45px"
                  }}
                >
                  <Autocomplete
                    id="combo-box-demo"
                    options={["Borrower", "Co-Borrower-1", "Co-Borrower-2"]}
                    onChange={(event, value) => {
                      if (value === "Borrower") {
                        setBorrower("0");
                      }
                      if (value === "Co-Borrower-1") {
                        setBorrower("1");
                      }
                      if (value === "Co-Borrower-2") {
                        setBorrower("2");
                      }
                    }}
                    sx={{ mb: 2, minWidth: "55%" }}
                    renderInput={params => (
                      <TextField {...params} label="Select Borrower" />
                    )}
                  />
                </Grid>
              ) : null}
              {checkAccessTags([
                "tag_lead_details_btn_cibil_report",
                "tag_lead_list_read_write",
                "tag_lead_details_read_write"
              ]) ? (
                <Button
                  variant="contained"
                  onClick={downloadCibilReportApi}
                  className="pull-right mr-3"
                  disabled={disabled}
                  style={{ marginLeft: "10px" }}
                >
                  CIBIL REPORT
                </Button>
              ) : null}
              {checkAccessTags([
                "tag_lead_details_btn_approve",
                "tag_lead_list_read_write",
                "tag_lead_details_read_write"
              ]) && showApproveButton ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    setIsOpen(!isOpen);
                    setOpenDialog(!openDialog);
                  }}
                  className="pull-right mr-3"
                  color={"success"}
                  disabled={disabled}
                >
                  Approve
                </Button>
              ) : null}

              {checkAccessTags([
                "tag_lead_details_btn_delete",
                "tag_lead_list_read_write",
                "tag_lead_details_read_write"
              ]) ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    setIsOpenConfirm(!isOpenConfirm);
                    setOpenDialogConfirm(!openDialogConfirm);
                  }}
                  className="pull-right mr-3"
                  color={"error"}
                  disabled={disabled}
                >
                  Reject
                </Button>
              ) : null}
            </Grid>
          ) : null
        ) : (
          <Grid
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "20px",
              height: "45px"
            }}
          >
            <Grid
              item
              xs={3}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "20px",
                marginRight: "-5px",
                height: "45px"
              }}
            >
              <CompanyProductDetails
                title={"Product Details"}
                company_id={company_id}
                product_id={product_id}
              />
              <Autocomplete
                id="combo-box-demo"
                options={["Borrower", "Co-Borrower-1", "Co-Borrower-2"]}
                onChange={(event, value) => {
                  if (value === "Borrower") {
                    setBorrower("0");
                  }
                  if (value === "Co-Borrower-1") {
                    setBorrower("1");
                  }
                  if (value === "Co-Borrower-2") {
                    setBorrower("2");
                  }
                }}
                sx={{ mb: 2, minWidth: "55%" }}
                renderInput={params => (
                  <TextField {...params} label="Select Borrower" />
                )}
              />
            </Grid>

            <Button
              variant="contained"
              onClick={downloadCibilReportApi}
              className="pull-right mr-3"
              disabled={disabled}
              style={{ marginLeft: "10px" }}
            >
              CIBIL REPORT
            </Button>
            {showApproveButton ? (
              <Button
                variant="contained"
                onClick={() => {
                  setIsOpen(!isOpen);
                  setOpenDialog(!openDialog);
                }}
                className="pull-right mr-3"
                color={"success"}
                disabled={disabled}
              >
                Approve
              </Button>
            ) : null}

            <Button
              variant="contained"
              onClick={() => {
                setIsOpenConfirm(!isOpenConfirm);
                setOpenDialogConfirm(!openDialogConfirm);
              }}
              className="pull-right mr-3"
              color={"error"}
              disabled={disabled}
            >
              Reject
            </Button>
          </Grid>
        )}

        <Grid
          className="mt-5"
          style={{ justifyContent: "center", cursor: "pointer" }}
          xs={12}
          container
          spacing={2}
          sx={{ margin: 0 }}
        >
          {cardsData &&
            Object.keys(cardsData).map((item, index) => (
              <DemoGraphicCard
                key={index}
                panelId={index}
                expanded={expanded === index}
                handleChange={() => handleChange(index)}
                title={item.replace(/_/g, " ")}
                data={cardsData[item]}
                loanData={loanData.data}
              />
            ))}
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default CompanyProductDetails;
