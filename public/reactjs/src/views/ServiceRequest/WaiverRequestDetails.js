import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AlertBox } from "../../components/AlertBox";
import * as React from "react";
import { useEffect, useState } from "react";
import { storedList } from "../../util/localstorage";
import moment from "moment";
import {
  getWaiverRequestDetailsByReqIdWatcher,
  updateWaiverWaiverRequestStatusWatcher
} from "../../actions/waiverRequest.js";
import { getBorrowerDetailsByIdWatcher } from "../../actions/borrowerInfo";
import Table from "react-sdk/dist/components/Table/Table"
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Button from "react-sdk/dist/components/Button/Button";
import "react-sdk/dist/styles/_fonts.scss";

const statusToDisplay = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  expired: "Expired"
};

export default function WaiverRequestDetails(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = storedList("user");

  let { isForSingleLoan, handleClose } = props;

  let accessTags = user?.access_metrix_tags;
  const customAccessTags = isForSingleLoan
    ? accessTags.indexOf("tag_loan_queue_request_waiver_read_write") > -1
    : accessTags.indexOf("tag_service_request_waiver_read_write") > -1;
  const { company_id, product_id, loan_id, request_id } = useParams();
  const { isPropBased } = props;
  const cid = isPropBased ? props.company_id : company_id;
  const pid = isPropBased ? props.product_id : product_id;
  const lid = isPropBased ? props.loan_id : loan_id;
  const rid = isPropBased ? props.request_id : request_id;

  const [loanData, setLoanData] = useState("");
  const [waiverDetails, setWaiverDetails] = useState("");
  //Post waiver fields
  const [interestWaiver, setInterestWaiver] = useState("");
  const [lpiWaiver, setLPIWaiver] = useState("");
  const [bounceChargesWaiver, setBounceChargesWaiver] = useState("");
  const [gstReversalBC, setGSTReversalBC] = useState("");
  const [remarks, setRemarks] = useState("");
  //submit button state
  const [isDisableSubmit, setIsDisableSubmit] = useState(true);
  //alert
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");

  useEffect(() => {
    if (
      (interestWaiver * 1 == 0 &&
        lpiWaiver * 1 == 0 &&
        bounceChargesWaiver * 1 == 0) ||
      remarks.length < 1
    ) {
      setIsDisableSubmit(true);
    } else {
      setIsDisableSubmit(false);
    }
  }, [interestWaiver, lpiWaiver, bounceChargesWaiver, remarks]);

  //Show alert
  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  //close alert
  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  //Fetch waiver details and loan details initially
  useEffect(() => {
    fetchLoandetails();
    getWaiverDetailsByReqId();
  }, []);

  //Fetch waiver details by req id.
  const getWaiverDetailsByReqId = () => {
    const payload = {
      loan_id: lid,
      sr_req_id: rid,
      company_id: cid,
      product_id: pid,
      user_id: user._id
    };
    dispatch(
      getWaiverRequestDetailsByReqIdWatcher(
        payload,
        (response) => {
          setWaiverDetails(response);
          setInterestWaiver(response.data.interest_waiver * 1);
          setLPIWaiver(response.data.lpi_waiver * 1);
          setBounceChargesWaiver(response.data.bc_waiver * 1);
          setGSTReversalBC(response.data.gst_on_bc_at_waiver * 1);
        },
        (error) => {
          return showAlert(error.response.data.message, "error");
        }
      )
    );
  };

  //Fetch loan details
  const fetchLoandetails = () => {
    const params = {
      company_id: cid,
      product_id: pid,
      loan_id: lid
    };
    dispatch(
      getBorrowerDetailsByIdWatcher(
        params,
        (result) => {
          setLoanData(result.data);
        },
        (error) => {
          return showAlert(error?.response?.data?.message, "error");
        }
      )
    );
  };

  const handleUpdateWaiverReqStatus = (type) => {
    const payload = {
      company_id: cid,
      product_id: pid,
      user_id: user._id,
      postData: {
        id: waiverDetails?.data?._id,
        loan_id: lid,
        sr_req_id: rid,
        status: type,
        approver_remarks: remarks,
        interest_waiver: interestWaiver || 0,
        bc_waiver: bounceChargesWaiver || 0,
        lpiWaiver: lpiWaiver || 0
      }
    };
    dispatch(
      updateWaiverWaiverRequestStatusWatcher(
        payload,
        (response) => {
          setTimeout(() => {
            if (!isForSingleLoan) history.push("/admin/service-request");
            else handleClose();
          }, 4000);
          return showAlert(response.message, "success");
        },
        (error) => {
          setTimeout(() => {
            if (!isForSingleLoan) history.push("/admin/service-request");
            else handleClose();
          }, 4000);
          return showAlert(error.response.data.message, "error");
        }
      )
    );
  };

  const rows = [
    {
      id: 1,
      title: "Interest",
      current_value: waiverDetails?.interest,
      name: "interestWaiver",
      value: interestWaiver,
      setValue: setInterestWaiver,
      remaining: 0
    },
    {
      id: 2,
      title: "LPI due",
      current_value: waiverDetails?.lpi,
      name: "lpiWaiver",
      value: lpiWaiver,
      setValue: setLPIWaiver,
      remaining: 0
    },
    {
      id: 3,
      title: "Bounce charges",
      current_value: waiverDetails?.bounce_charges,
      name: "bounceChargesWaiver",
      value: bounceChargesWaiver,
      setValue: setBounceChargesWaiver,
      remaining: 0
    },
    {
      id: 4,
      title: "GST on bounce charges",
      current_value: waiverDetails?.gst_on_bounce_charges,
      value: bounceChargesWaiver * 0.18,
      name: "gstReversalBC",
      setValue: setGSTReversalBC,
      remaining: 0
    }
  ];

  const columns = [
    {id: "title", label: "NAME"},
    {id: "current_value", label: "CURRENT VALUE"},
    {id: "waiver", label: "WAIVER"},
    {id: "remaining", label: "REMAINING"}
  ];

  const data = rows && rows.map((item) => {
      return {
        title: item.title,
        current_value: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format((item.current_value * 1).toFixed(2)),
        waiver: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format((item.value * 1).toFixed(2)),
        remaining: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
          item?.current_value && item?.value
          ? (item.current_value * 1 - item.value * 1).toFixed(2)
          : 0)
      };
  });

  const styleLoanDetailsRow = {
    display: "flex",
    alignItems: "flex-start",
    gap: "40px",
    alignSelf: "stretch"
  };

  const styleLoanDetailsComponent = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    flex: "1 0 0",
    alignSelf: "stretch"
  };

  const styleLoanDetatilsFieldKey = {
    fontFamily: "Montserrat-Regular",
    fontSize: "12px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "150%",
    textTransform: "uppercase",
    color: "#6B6F80"
  };

  const styleLoanDetatilsFieldValue = {
    fontFamily: "Montserrat-Medium",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "150%",
    alignSelf: "stretch",
    color: "#141519"
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "16px",
        paddingTop: "24px",
        gap: "24px",
        alignSelf: "stretch"
      }}
    >
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}

      <div
        id="waiver-details-loan-details"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "24px",
          alignSelf: "stretch"
        }}
      >
        <div style={styleLoanDetailsRow}>
          <div style={styleLoanDetailsComponent}>
            <div style={styleLoanDetatilsFieldKey}>
              Request ID
            </div>
            <div style={styleLoanDetatilsFieldValue}>
              {rid}
            </div>
          </div>
          <div style={styleLoanDetailsComponent}>
            <div style={styleLoanDetatilsFieldKey}>
              Borrower ID
            </div>
            <div style={styleLoanDetatilsFieldValue}>
              {loanData.borrower_id}
            </div>
          </div>
          <div style={styleLoanDetailsComponent}>
            <div style={styleLoanDetatilsFieldKey}>
              Loan ID
            </div>
            <div style={styleLoanDetatilsFieldValue}>
              {lid}
            </div>
          </div>
          <div style={styleLoanDetailsComponent}>
            <div style={styleLoanDetatilsFieldKey}>
              Partner name
            </div>
            <div style={styleLoanDetatilsFieldValue}>
              {waiverDetails.data ? waiverDetails.data.company_name : ""}
            </div>
          </div>
        </div>

        <div style={styleLoanDetailsRow}>
          <div style={styleLoanDetailsComponent}>
            <div style={styleLoanDetatilsFieldKey}>
              Product name
            </div>
            <div style={styleLoanDetatilsFieldValue}>
              {waiverDetails.data ? waiverDetails.data.product_name : ""}
            </div>
          </div>
          <div style={styleLoanDetailsComponent}>
            <div style={styleLoanDetatilsFieldKey}>
              Customer name
            </div>
            <div style={styleLoanDetatilsFieldValue}>
              {`${loanData?.first_name ?? ""} ${loanData?.last_name ?? ""}`}
            </div>
          </div>
          <div style={styleLoanDetailsComponent}>
            <div style={styleLoanDetatilsFieldKey}>
              Loan amount
            </div>
            <div style={styleLoanDetatilsFieldValue}>
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(loanData.sanction_amount)}
            </div>
          </div>
          <div style={styleLoanDetailsComponent}>
            <div style={styleLoanDetatilsFieldKey}>
              Principal outstanding
            </div>
            <div style={styleLoanDetatilsFieldValue}>
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(waiverDetails ? waiverDetails.prin_os.toFixed(2) : 0)}
            </div>
          </div>
        </div>

        <div style={styleLoanDetailsRow}>
          <div style={styleLoanDetailsComponent}>
            <div style={styleLoanDetatilsFieldKey}>
              Request date
            </div>
            <div style={styleLoanDetatilsFieldValue}>
              {waiverDetails.data
                ? moment(waiverDetails.data.created_at).format("YYYY-MM-DD")
                : ""}
            </div>
          </div>
          <div style={styleLoanDetailsComponent}>
            <div style={styleLoanDetatilsFieldKey}>
              Status
            </div>
            <div style={styleLoanDetatilsFieldValue}>
              {statusToDisplay[
                  waiverDetails.data ? waiverDetails.data?.status : ""
                ]
              }
            </div>
          </div>
          <div style={styleLoanDetailsComponent}>
            <div style={styleLoanDetatilsFieldKey}>
              Completion Date
            </div>
            <div style={styleLoanDetatilsFieldValue}>
              {waiverDetails?.data?.action_date
                ? moment
                    .utc(new Date(waiverDetails.data.action_date))
                    .format("YYYY-MM-DD")
                : ""}
            </div>
          </div>
          <div style={styleLoanDetailsComponent}>
          </div>
        </div>
      </div>

      {waiverDetails.loan_id ? (
        <div
          id="waiver-details"
          style={{
            width: "100%",
            marginTop: "-20px"
          }}
        >
          <Table
            columns={columns}
            data={data}
            customStyle={{
              width: "100%",
              fontFamily: "Montserrat-Medium"
            }}
          />
        </div>
      ) : null}

      {waiverDetails.loan_id ? (
        <div
          id="waiver-details-comments"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "40px",
            alignSelf: "stretch"
          }}
        >
          <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              flex: "1 0 0",
              alignSelf: "stretch"
            }}
          >
            <div 
              style={{
                fontFamily: "Montserrat-Regular",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: "400",
                lineHeight: "150%",
                textTransform: "uppercase",
                color: "#6B6F80"
              }}
            >
              requesters comment
            </div>
            <div 
              style={{
                fontFamily: "Montserrat-Medium",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "500",
                lineHeight: "150%",
                alignSelf: "stretch",
                color: "#141519"
              }}
            >
              {waiverDetails.data.request_remark}
            </div>
          </div>
          
          <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              flex: "1 0 0",
              alignSelf: "stretch"
            }}
          >
            {waiverDetails.data?.status !== "pending" ? (
              <>
                <div 
                  style={{
                    fontFamily: "Montserrat-Regular",
                    fontSize: "12px",
                    fontStyle: "normal",
                    fontWeight: "400",
                    lineHeight: "150%",
                    textTransform: "uppercase",
                    color: "#6B6F80"
                  }}
                >
                  approvers comment
                </div>
                <div
                  style={{
                    fontFamily: "Montserrat-Medium",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: "500",
                    lineHeight: "150%",
                    alignSelf: "stretch",
                    color: "#141519"
                  }}
                >
                  {waiverDetails.data.approver_remarks}
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}

      {waiverDetails.data?.status === "pending" && customAccessTags ? (
        <div
          id="waiver-details-approver-add-comment"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            alignSelf: "stretch",
            width: "100%"
          }}
        >
          <InputBox
            label="Add Comment"
            initialValue={remarks}
            onClick={(event) => { setRemarks(event.value) }}
            customClass={{
              minWidth: "100%",
              height: "100px",
              fontFamily: "Montserrat-Regular"
            }}
            customInputClass={{
              fontFamily: "Montserrat-Regular",
              padding: "0px 16px",
              fontSize: "16px",
              fontWeight: "400",
              lineHeight: "150%",
              color: "#141519",
              minWidth: "100%",
              height: "100px",
            alignItems: "flex-start",
            justifyContent: "flex-start"
            }}
          />
        </div>
      ) : null}

      {waiverDetails.loan_id && waiverDetails.data?.status === "pending" ? (
        <div 
          id="waiver-details-action-btns"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            gap: "16px",
            alignSelf: "stretch"
          }}
        >
          <Button
            label="Reject"
            onClick={() => handleUpdateWaiverReqStatus("rejected")}
            buttonType="secondary"
            isDisabled={!customAccessTags}
            customStyle={{
              fontSize: "16px",
              fontWeight: "600",
              lineHeight: "150%",
              border: "1px solid #C00",
              borderRadius: "8px",
              width: "240px",
              height: "48px",
              padding: "13px 44px",
              color: "#C00",
              boxShadow: "none"
            }}
          />
          <Button
            label="Approve"
            onClick={() => handleUpdateWaiverReqStatus("approved")}
            buttonType="primary"
            isDisabled={isDisableSubmit || !customAccessTags}
            customStyle={{
              fontSize: "16px",
              fontWeight: "600",
              lineHeight: "150%",
              borderRadius: "8px",
              width: "240px",
              height: "48px",
              padding: "13px 44px"
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
