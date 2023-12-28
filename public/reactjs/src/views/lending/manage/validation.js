import * as React from "react";
import { useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { storedList } from "../../../util/localstorage";
import {useHistory} from 'react-router-dom'
import {
  updateBorrowerInfoCommonUncommonWatcher,
  updateBorrowerInfoWatcher,
  updateDaApprovalWatcher,
  updateMarkRepoWatcher
} from "../../../actions/borrowerInfo";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import UpdateMenu from "./UpdateMenu";
import { NativeSelect } from "@mui/material";
import { RejectLoanPopup } from "../RejectLoanPopup";
import { AlertBox } from "../../../components/AlertBox";
import { useState, useEffect } from "react";
const user = storedList("user");
import { checkAccessTags } from "../../../util/uam";
import CustomButton from "react-sdk/dist/components/Button/Button"
import CustomInputBox from "react-sdk/dist/components/InputBox/InputBox"
const inputBoxCss = {
  marginTop: "20px",
  width: "252px",
  marginLeft: "-116px",
  zIndex: 1
}
const isTagged =
  process.env.REACT_APP_BUILD_VERSION > 1
    ? user?.access_metrix_tags?.length
    : false;


const loanStatusObject = {
  open: "open",
  kyc_data_approved: "KYC data approved",
  credit_approved: "Credit approved",
  disbursal_approved: "Disbursal approved",
  disbursal_pending: "Pending Disbursal"
};


const statusMapping = {
  open: "open",
  "KYC data approved": "kyc_data_approved",
  "Credit approved": "credit_approved",
  "Disbursal approved": "disbursal_approved",
  rejected: "rejected",
  "Pending Disbursal": "disbursal_pending"
};


export default function Validation(props) {
  const {
    data,
    onError,
    onSuccess,
    loanSchemaId,
    setOpenSetLimit,
    setOpenUpdateLimit,
    allowLoc,
    lmsVersion,
    isReject = false,
    setIsReject,
    rejectRemark,
    rejectReason,
    setRejectRemark,
    setRejectReason,
    isMsme,
    ...other
  } = props;
  const dispatch = useDispatch();


  const [open, setOpen] = useState(false);
  const [selectedStatus, setStatus] = useState(data.loanStatus);
  const [disableStatus, setDisableStatus] = useState(false);
  //alert
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [option, setOption] = useState([]);
  const [isMsmeLoan, setIsMsmeLoan] = useState(isMsme ? true : false);
  const [isMarkRepo, setIsMarkRepo] = useState(false);
  const user = storedList("user");
  const history = useHistory();
  let statuses = [];
  if (data.loanStatus === "open") {
    statuses = ["open", "kyc_data_approved"];
  } else if (data.loanStatus === "kyc_data_approved") {
    statuses = ["open", "kyc_data_approved", "credit_approved"];
  } else if (data.loanStatus === "credit_approved") {
    statuses = ["kyc_data_approved", "credit_approved"];
  }
  if (!allowLoc) {
    if (data.loanStatus === "credit_approved") {
      statuses = ["kyc_data_approved", "credit_approved", "disbursal_approved"];
    }
    if (data.loanStatus === "disbursal_approved") {
      statuses = ["credit_approved", "disbursal_approved"];
    }
    if (data.loanStatus === "disbursal_pending") {
      statuses = ["disbursal_approved", "disbursal_pending"];
    }
  }
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
    }, 3000);
  };
  const handleLoanStatus = status => {
    if (status === "rejected" && !rejectReason) {
      return showAlert("Please provide the reason", "error");
    }
    const params = {
      company_id: data.company_id,
      product_id: data.product_id,
      loan_id: data.loan_id,
      loan_app_id: data.loan_app_id,
      partner_loan_id: data.partner_loan_id,
      partner_borrower_id: data.partner_borrower_id,
      borrower_id: data.borrower_id,
      status: statusMapping[status] ? statusMapping[status] : status,
      final_approve_date: "",
      loan_schema_id: loanSchemaId,
      sanction_amount: data.sanction_amount,
      reason: rejectReason,
      remarks: rejectRemark
    };
    dispatch(
      updateBorrowerInfoCommonUncommonWatcher(
        params,
        result => {
          setOpen(false);
          onSuccess(result.message);
        },
        error => {
          setOpen(false);
          onError(error.response.data.message);
        }
      )
    );
    setDisableStatus(true);
  };

  const handleMarkRepo = () =>{
    const payload = {
      company_id: data.company_id,
      product_id: data.product_id,
      loan_id: data.loan_id,
      is_repoed : !isMarkRepo
    };
    dispatch(
      updateMarkRepoWatcher(
        payload,
        (result) => {
          setOpen(false);
          onSuccess(result.message);
        },
        (error) => {
          setOpen(false);
          onError(error.response.data.message);
        }
      )
    );
  }

  const handleApproval = () => {
    const postData = {
      company_id: data.company_id,
      product_id: data.product_id,
      loan_id: data.loan_id,
      loan_app_id: data.loan_app_id,
      loan_schema_id: loanSchemaId,
      approve_for_da: 1,
      approve_for_da_date: Date.now(),
      approved_by: user?.username,
      approved_da: "CBI"
    };
    const options = {
      company_id: data.company_id,
      loan_schema_id: loanSchemaId,
      product_id: data.product_id
    };
    dispatch(
      updateDaApprovalWatcher(
        { options, postData },
        result => {
          setOpen(false);
          onSuccess(result.message);
        },
        error => {
          setOpen(false);
          onError(error.response.data.message);
        }
      )
    );
    setDisableStatus(true);
  };

  const handleOnClick = () => {
    if (user?.role_metrix?.length > 0 && user?.role_metrix[0]?.title === 'Partner Executive'){
      history.push(`/admin/msme/lead/${data.loan_app_id}/view`);
    }
    else{
    history.push(`/admin/msme/leads/${data.loan_app_id}`);
    }
  };

  useEffect(() => {
    if (data) {
      setIsMarkRepo(data?.is_repoed ? data.is_repoed : false)
      if (data.loanStatus === "open" && option.length === 0) {
        setOption(prevArray => [...prevArray, { "label": "open", "value": "open" }, { "label": "KYC data approved", "value": "KYC data approved" }]);
      }
      if (data.loanStatus === "kyc_data_approved" && option.length === 0) {
        setOption(prevArray => [...prevArray, { "label": "open", "value": "open" }, { "label": "KYC data approved", "value": "KYC data approved" }, { "label": "Credit approved", "value": "Credit approved" }]);
      }
      if (data.loanStatus === "credit_approved" && option.length === 0) {
        setOption(prevArray => [...prevArray, { "label": "KYC data approved", "value": "KYC data approved" }, { "label": "Credit approved", "value": "Credit approved" }]);
      }
      if (!allowLoc) {
        if (data.loanStatus === "credit_approved" && option.length === 0) {
          setOption([]);
          setOption(prevArray => [...prevArray, { "label": "KYC data approved", "value": "KYC data approved" }, { "label": "Credit approved", "value": "Credit approved" }, { "label": "Disbursal approved", "value": "Disbursal approved" }]);
        }
        if (data.loanStatus === "disbursal_approved" && option.length === 0) {
          setOption([]);
          setOption(prevArray => [...prevArray, { "label": "Credit approved", "value": "Credit approved" }, { "label": "Disbursal approved", "value": "Disbursal approved" }]);
        }
        if (data.loanStatus === "disbursal_pending" && option.length === 0) {
          setOption([]);
          setOption(prevArray => [...prevArray, { "label": "Disbursal approved", "value": "Disbursal approved" }, { "label": "Pending Disbursal", "value": "Pending Disbursal" }]);
        }
      }
    }
  }, [data, selectedStatus]);
  function capitalizeFunction(str) {
    const words = str.split('_');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedWords.join(' ');
  }
  
  const getColorCSS = (asset_class) => {
    if (['Standard: REGULAR'].includes(asset_class)) {
      return {
        color: 'green',
        border: '1px solid green',
      };
    }
    if (['Standard: SMA 0', 'Standard: SMA 1', 'Standard: SMA 2', 'Standard: SMA 3'].includes(asset_class)) {
      return {
        color: '#FFBF00',
        border: '1px solid #FFBF00',
      };
    }
    if (['Sub-Standard: NPA 1', 'Sub-Standard: NPA 2', 'Sub-Standard: NPA 3', 'Sub-Standard: NPA 4', 'Doubtful Assets: NPA 5', 'Loss Assets', 'Write-off'].includes(asset_class)) {
      return {
        color: 'red',
        border: '1px solid red',
      };
    }
    return {
      color: 'black',
      border: '1px solid black',
    };
  };

  const assetStyle = {
    fontFamily: 'Montserrat-Bold',
    padding: '2px 8px',
    borderRadius: '4px',
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
      <div>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" sx={{ mb: "20px", mt: "20px" }}>
            {"Are you sure you wish to cancel loan?"}
          </DialogTitle>
          <Grid
            container
            justifySelf={"center"}
            alignItems={"center"}
            xs={12}
            alignSelf={"center"}
            mb={2}
          >
            <Grid item xs={6} textAlign={"center"}>
              <Button
                fullWidth={true}
                variant="contained"
                color={"error"}
                onClick={() => setOpen(false)}
              >
                Not Confirm
              </Button>
            </Grid>
            <Grid item xs={6} textAlign={"center"}>
              <Button
                fullWidth={true}
                variant="contained"
                color={"success"}
                onClick={() => handleLoanStatus("cancelled")}
                autoFocus
              >
                Confirm
              </Button>
            </Grid>
          </Grid>
        </Dialog>
      </div>

      <Grid
        xs={3}
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          paddingLeft: "20px",
        }}
      >
        {data?.asset_class && (
          <div style={{ ...assetStyle, ...getColorCSS(data?.asset_class) }}>
            {data?.asset_class}
          </div>
        )}
      </Grid>

      <Grid
        xs={9}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px"
        }}
      >
        { 
         data?.loanStatus === "disbursed" && isTagged ? (
            checkAccessTags([
              "tag_loan_details_btn_update",
              "tag_loan_details_read_write",
              "tag_loan_queue_read_write",
              "tag_collateral_read_write",
              "tag_loan_details_btn_colend_action"
            ]) ? (
              <UpdateMenu data={data} />
            ) : null
          ) : (
            null
          )
        }
        {isMsmeLoan && isTagged && checkAccessTags(["tag_msme_loan_read"]) && (!checkAccessTags(['tag_msme_lead_view_int_read_write'])) && (!checkAccessTags(['tag_msme_lead_view_int_read']))? (
          <CustomButton label="Lead Details" buttonType="secondary" customStyle={{ borderColor: "#134CDE", color:"#134CDE",  height: "40px", fontSize: "16px", padding: "5px 24px 5px 24px", width: "158px", marginRight: "6px", borderRadius: "30px", marginTop: "5px" }} onClick={() => { handleOnClick(); }} />
        ) : null}
        {isTagged && checkAccessTags(["tag_approve_for_da_btn"]) ? (
          <CustomButton isDisabled={data?.approve_for_da ? true : false} label="DA Approval" buttonType="primary" customStyle={{ height: "48px", fontSize: "16px", padding: "12px 24px 12px 24px", width: "158px", marginRight: "6px" , borderRadius: "30px" }} onClick={() => { handleApproval(); }} />
        ) : null}
        {isTagged && checkAccessTags(["tag_loan_details_repo_btn","tag_loan_details_read_write"]) && (data.stage === 4) && !allowLoc? (
          <CustomButton
            label={isMarkRepo ? "Remove Repo" : "Mark Repo"}
            buttonType="primary"
            customStyle={{ height: "48px", fontSize: "16px", padding: "12px 24px 12px 24px", width: "178px", marginRight: "6px", borderRadius: "30px" }}
            onClick={() => { handleMarkRepo(); }} />
        ) : null}
        {isTagged && allowLoc && data.stage === 2 ? (
          checkAccessTags([
            "tag_loan_details_btn_set_credit_limit",
            "tag_loan_details_read_write",
            "tag_loan_queue_read_write",
            "tag_collateral_read_write"
          ]) ? (
            <CustomButton
            label="Set Credit Limit" 
            buttonType="primary"
            customStyle={{ height: "48px", fontSize: "16px", padding: "0px 24px 0px 24px", width: "190px", marginRight: "6px" , borderRadius: "30px" }}
              onClick={() => setOpenSetLimit(true)}
            />
              
            
          ) : null
        ) : allowLoc && data.stage === 2 ? (
          <CustomButton
            label="Set Credit Limit" 
            buttonType="primary"
            customStyle={{ height: "48px", fontSize: "16px", padding: "0px 24px 0px 24px", width: "190px", marginRight: "6px" , borderRadius: "30px" }}
              onClick={() => setOpenSetLimit(true)}
            />
        ) : null}


        {isTagged && allowLoc && data.stage === 4 ? (
          checkAccessTags([
            "tag_loan_details_btn_update_limit_read_write",
            "tag_loan_details_read_write",
            "tag_loan_queue_read_write",
            "tag_collateral_read_write"
          ]) ? (
            <CustomButton label="Update credit limit" buttonType="primary" customStyle={{ height: "48px", fontSize: "16px", padding: "12px 24px 12px 24px", width: "215px", marginRight: "6px" ,borderRadius: "30px"}} onClick={() => setOpenUpdateLimit(true)} />
          ) : null
        ) : allowLoc && data.stage === 4 ? (
          <CustomButton label="Update credit limit" buttonType="primary" customStyle={{ height: "48px", fontSize: "16px", padding: "12px 24px 12px 24px", width: "215px", marginRight: "6px",borderRadius: "30px" }} onClick={() => setOpenUpdateLimit(true)} />
        ) : null}


        {isTagged &&
          data.stage === 3 &&
          lmsVersion === "legacy_lms" &&
          user.type === "admin" ? (
          checkAccessTags([
            "tag_loan_details_btn_disburse_now",
            "tag_loan_details_read_write",
            "tag_loan_queue_read_write",
            "tag_collateral_read_write"
          ]) ? (
            <Button
              variant="contained"
              className="pull-right ml-4 mr-3"
              onClick={() => {
                handleLoanStatus("disbursed");
              }}
              sx={{
                color: "#fff",
                height: "30px"
              }}
            >
              Disburse Now
            </Button>
          ) : null
        ) : data.stage === 3 &&
          lmsVersion === "legacy_lms" &&
          user.type === "admin" ? (
          <Button
            variant="contained"
            className="pull-right ml-4 mr-3"
            onClick={() => {
              handleLoanStatus("disbursed");
            }}
            sx={{
              color: "#fff",
              height: "30px"
            }}
          >
            Disburse Now
          </Button>
        ) : null}


        {isTagged && data.stage === 4 ? (
          checkAccessTags([
            "tag_loan_details_btn_cancel_loan",
            "tag_loan_details_read_write",
            "tag_loan_queue_read_write",
            "tag_collateral_read_write"
          ]) ? (
            <CustomButton label="Cancel Loan" buttonType="secondary" customStyle={{ color: "red", border: "1px solid red", height: "48px", fontSize: "16px", padding: "12px 24px 12px 24px", width: "155px", marginRight: "8px",borderRadius: "30px" }}
              onClick={() => {
                setOpen(true)
              }} />
          ) : null
        ) : data.stage === 4 ? (
          <CustomButton label="Cancel Loan" buttonType="secondary" customStyle={{ color: "red", border: "1px solid red", height: "48px", fontSize: "16px", padding: "12px 24px 12px 24px", width: "155px", marginRight: "8px",borderRadius: "30px" }}
            onClick={() => {
              setOpen(true)
            }} />
        ) : null}


        { 
        data?.loanStatus !== "disbursed" &&  isTagged && !isMsmeLoan ? (
            checkAccessTags([
              "tag_loan_details_btn_update",
              "tag_loan_details_read_write",
              "tag_loan_queue_read_write",
              "tag_collateral_read_write",
              "tag_loan_details_btn_colend_action"
            ]) ? (
              <UpdateMenu data={data} />
            ) : null
          ) : (
            null
          )
        }
        {isTagged && statuses.length ? (
          checkAccessTags([
            "tag_loan_details_btn_status_change",
            "tag_loan_details_read_write",
            "tag_loan_queue_read_write",
            "tag_collateral_read_write"
          ]) ? (
            <CustomInputBox
              label= ""
              options={option}
              onClick={(event) => {
                setStatus(event.value);
                handleLoanStatus(event.value);
              }}
              initialValue={capitalizeFunction(data?.loanStatus)}
              isDrawdown={true}
              isDisabled={disableStatus}
              customDropdownClass={inputBoxCss}
              customClass={{ height: "50px", width: "140px", marginRight: "-8px", padding: "5px 15px 10px 10px" }}
            />
          ) : null
        ) : statuses.length ? (
          <NativeSelect
            inputProps={{
              name: "age",
              id: "uncontrolled-native"
            }}
            value={loanStatusObject[data.loanStatus]}
            defaultValue={loanStatusObject[data.loanStatus]}
            onChange={event => {
              setStatus(event.target.value);
              handleLoanStatus(event.target.value);
            }}
            disabled={disableStatus}
          >
            {statuses &&
              statuses.map(status => (
                <option key={status} value={selectedStatus}>
                  {loanStatusObject[status]}
                </option>
              ))}
          </NativeSelect>
        ) : null}
      </Grid>


      {isReject ? (
        <>
          <RejectLoanPopup
            handleClose={() => setIsReject(false)}
            isReject={isReject}
            setRejectReason={setRejectReason}
            setRejectRemark={setRejectRemark}
            handleLoanStatus={() => handleLoanStatus("rejected")}
          />
        </>
      ) : null}
    </>
  );
}