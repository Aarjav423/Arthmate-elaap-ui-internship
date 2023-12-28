import * as React from "react";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkAccessTags } from "../../util/uam";
import { AlertBox } from "../../components/AlertBox";
import { storedList } from "../../util/localstorage";
import {
  getWaiverRequestDetailsWatcher,
  createWaiverRequestWatcher
} from "../../actions/waiverRequest.js";
import { getBorrowerDetailsByIdWatcher } from "../../actions/borrowerInfo";
import Table from "react-sdk/dist/components/Table/Table";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Button from "react-sdk/dist/components/Button/Button";
import "react-sdk/dist/styles/_fonts.scss";

export default function WaiverRequest(props) {
  const user = storedList("user");
  const { company_id, product_id, loan_id } = useParams();
  const { isPropBased } = props;
  const cid = isPropBased ? props.company_id : company_id;
  const pid = isPropBased ? props.product_id : product_id;
  const lid = isPropBased ? props.loan_id : loan_id;

  const dispatch = useDispatch();
  const history = useHistory();

  //alert
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [loanData, setLoanData] = useState("");
  const [waiverDetails, setWaiverDetails] = useState("");
  //Post waiver fields
  const [interestWaiver, setInterestWaiver] = useState(0);
  const [lpiWaiver, setLPIWaiver] = useState(0);
  const [bounceChargesWaiver, setBounceChargesWaiver] = useState(0);
  const [gstReversalBC, setGSTReversalBC] = useState(0);
  const [remarks, setRemarks] = useState("");
  //submit button state
  const [isDisableSubmit, setIsDisableSubmit] = useState(true);

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

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

  //Fetch waiver details
  const getWaiverDetails = () => {
    const payload = {
      loan_id: lid,
      company_id: cid,
      product_id: pid,
      user_id: user._id
    };
    dispatch(
      getWaiverRequestDetailsWatcher(
        payload,
        (response) => {
          setWaiverDetails(response);
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

  //Fetch waiver details and loan details initially
  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags([
        "tag_loan_queue_read_write",
        "tag_loan_queue_request_waiver"
      ])
    ) {
      getWaiverDetails();
      fetchLoandetails();
    }
    if (!isTagged) {
      getWaiverDetails();
      fetchLoandetails();
    }
  }, []);

  const handleInputChange = (name, setValue) => (event) => {
    let { value } = event.target;
    value = value.replace(/[,₹A-Za-z]/g, "");
    if (name === "bounceChargesWaiver") {
      setGSTReversalBC(Math.round((value * 0.18 + Number.EPSILON) * 100) / 100);
    }
    setValue(value);
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
      title: "LPI Due",
      current_value: waiverDetails?.lpi,
      name: "lpiWaiver",
      value: lpiWaiver,
      setValue: setLPIWaiver,
      remaining: 0
    },
    {
      id: 3,
      title: "Bounce Charges",
      current_value: waiverDetails?.bounce_charges,
      name: "bounceChargesWaiver",
      value: bounceChargesWaiver,
      setValue: setBounceChargesWaiver,
      remaining: 0
    },
    {
      id: 4,
      title: "GST on Bounce Charges",
      current_value: waiverDetails?.gst_on_bounce_charges,
      value: gstReversalBC,
      name: "gstReversalBC",
      setValue: setGSTReversalBC,
      remaining: 0
    }
  ];

  const validatePayload = () => {
    if (interestWaiver * 1 < 0)
      return showAlert("Waiver input cannot be negative.", "error");
    if (lpiWaiver * 1 < 0)
      return showAlert("Waiver input cannot be negative.", "error");
    if (bounceChargesWaiver * 1 < 0)
      return showAlert("Waiver input cannot be negative.", "error");
    if (!remarks) return showAlert("request_remark is required", "error");
    return true;
  };

  const handleSubmitWaiverDetails = () => {
    const validateData = validatePayload();
    if (validateData) {
      const payload = {
        tokenData: { company_id: cid, product_id: pid, user_id: user._id },
        postData: {
          loan_id: lid,
          interest_waiver: interestWaiver * 1,
          bc_waiver: bounceChargesWaiver * 1,
          gst_reversal_bc: gstReversalBC,
          lpi_waiver: lpiWaiver * 1,
          request_remark: remarks
        }
      };
      setIsDisableSubmit(true);
      dispatch(
        createWaiverRequestWatcher(
          payload,
          (response) => {
            setIsDisableSubmit(false);
            showAlert(response.message, "success");
            setTimeout(() => {
              history.push("/admin/lending/loan_queue");
            }, 4000);
            handleCancel();
          },
          (error) => {
            setIsDisableSubmit(false);
            return showAlert(error.response.data.message, "error");
          }
        )
      );
    }
  };

  const handleCancel = () => {
    setInterestWaiver(0);
    setLPIWaiver(0);
    setBounceChargesWaiver(0);
    setGSTReversalBC(0);
    setRemarks("");
    getWaiverDetails();
  };

  const columns = [
    {id: "title", label: "NAME"},
    {id: "current_value", label: "CURRENT VALUE"},
    {id: "waiver", label: "WAIVER"},
    {id: "remaining", label: "REMAINING"}
  ];

  const data = rows && rows.map((item) => {
      return {
        title: item.title,
        current_value: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.current_value),
        waiver: 
          <input
            id={`waiver-req-input-${item.title}`}
            key={`waiver-req-input-${item.title}`}
            type="text"
            value={
              "\u20B9" + (Number(item.name === "gstReversalBC"
              ? bounceChargesWaiver
                ? Math.round(
                    (bounceChargesWaiver * 0.18 +
                      Number.EPSILON) *
                      100
                  ) / 100
                : 0
              : item.value)).toLocaleString('en-IN')
            }
            onChange={handleInputChange(item.name, item.setValue)}
            disabled={item.name === "gstReversalBC"}
            style={{
              width: "217px",
              height: "44px",
              padding: "0 16px",
              borderRadius: "8px",
              border: "1px solid #BBBFCC",
              color: "#141519",
              fontFamily: "Montserrat-Regular",
              fontSize: "14px",
              fontWeight: "400",
              lineHeight: "150%" 
            }}
          />,
        remaining: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
          item?.current_value && item?.value
          ? Math.round(
              (item.current_value * 1 -
                item.value * 1 +
                Number.EPSILON) * 100 ) / 100
          : 0)
      };
  });

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
        id="waiver-request-loan-details"
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
            id="loan_id_title"
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
            Loan ID
          </div>
          <div
            id="loan_id_title_value"
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
            {loan_id}
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
          <div
            id="customer_name"
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
            Customer Name
          </div>
          <div
            id="customer_name_value"
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
            {`${loanData?.first_name ?? ""} ${loanData?.last_name ?? ""}`}
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
        </div>
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flex: "1 0 0",
            alignSelf: "stretch"
          }}
        >
        </div>
      </div>

      {waiverDetails.loan_id ? (
        <div
          id="waiver-request-form"
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
              fontFamily: "Montserrat-Medium",
            }}
          />
        </div>
      ) : null}

      {waiverDetails.loan_id ? (
        <div
          id="waiver-request-form-comment"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            alignSelf: "stretch",
            width: "100%"
          }}
        >
          <InputBox
            label="Add Comment"
            onClick={(event) => { setRemarks(event.value) }}
            initialValue={remarks}
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
              height: "100px"
            }}
          />
        </div>
      ) : null}

      {waiverDetails.loan_id ? (
        <div
          id="waiver-request-form-btns"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            gap: "16px",
            alignSelf: "stretch"
          }}
        >
          <Button
            label="Cancel"
            onClick={() => handleCancel()}
            buttonType="secondary"
            customStyle={{
              fontSize: "16px",
              fontWeight: "600",
              lineHeight: "150%",
              borderRadius: "8px",
              width: "240px",
              height: "48px",
              padding: "13px 44px",
              color: "#475BD8",
              border: "1px solid #475BD8",
              boxShadow: "none"
            }}
          />
          <Button
            label="Submit"
            onClick={() => handleSubmitWaiverDetails()}
            buttonType="primary"
            isDisabled={isDisableSubmit}
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
