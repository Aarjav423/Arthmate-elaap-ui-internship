import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { storedList } from "../../util/localstorage";
import { checkAccessTags } from "../../util/uam";

import { getWaiverRequestLoanWatcher } from "../../actions/service-request.js";
import { getCompanyByIdWatcher } from "../../actions/company";
import { getProductByIdWatcher } from "../../actions/product";
import { getBorrowerDetailsWatcher } from "../../actions/borrowerInfo";
import WaiverRequests from "../ServiceRequest/WaiverRequestList";
import WaiverDetailsPopup from "../lending/waiver/WaiverDetailsPopup";
import { AlertBox } from "../../components/AlertBox";
import { getLoanStateByLoanIdWatcher } from "../../actions/loanState";
import { getLeadDetailsByIdWatcher } from "../../actions/loanRequest";
import Button from "react-sdk/dist/components/Button/Button";
import "react-sdk/dist/styles/_fonts.scss";

const AddNewWaiverRequest = (props) => {
  const dispatch = useDispatch();
  const { company_id, product_id, loan_id } = useParams();
  const { isPropBased } = props;
  const cid = isPropBased ? props.company_id : company_id;
  const pid = isPropBased ? props.product_id : product_id;
  const lid = isPropBased ? props.loan_id : loan_id;
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [result, setResult] = useState([]);
  const [company, setCompany] = useState({});
  const [product, setProduct] = useState({});

  const [borrowerDetails, setBorrowerDetails] = useState(null);
  const [addNewWaiverDisplay, setAddNewWaiverDisplay] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [loanState, setLoanState] = useState({});
  const [leadData, setLeadData] = useState({});

  const user = storedList("user");
  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const getWaiverReuests = () => {
    const payload = {
      user_id: user._id,
      product_id: pid,
      company_id: cid,
      loan_id: lid,
      requestStatus: "undefined",
      requestType: "waiver",
      page,
      limit
    };
    dispatch(
      getWaiverRequestLoanWatcher(
        payload,
        (response) => {
          setResult(response?.data?.rows);
          setCount(response?.data?.rows.length);
        },
        (error) => {
          showAlert(error.response.data.message, "error");
        }
      )
    );
  };

  useEffect(() => {
    const payload = {
      user_id: user._id,
      product_id: pid,
      company_id: cid,
      loan_id: lid,
      requestStatus: "undefined",
      requestType: "waiver",
      page,
      limit
    };

    if (pid && cid) {
      getWaiverReuests();
      dispatch(
        getCompanyByIdWatcher(
          cid,
          (response) => {
            setCompany(response);
          },
          (error) => {
            showAlert(error.response.data.message, "error");
          }
        )
      );
      dispatch(
        getProductByIdWatcher(
          pid,
          (response) => {
            setProduct(response);
          },
          (error) => {
            showAlert(error.response.data.message, "error");
          }
        )
      );
      dispatch(
        getBorrowerDetailsWatcher(
          {
            company_id: cid,
            product_id: pid,
            str: lid,
            loan_schema_id: null
          },
          (result) => {
            setBorrowerDetails(result[0]);
          },
          (error) => { }
        )
      );
      dispatch(
        getLoanStateByLoanIdWatcher(
          payload,
          (response) => {
            setLoanState(response);
          },
          (error) => {
            showAlert(error.response.data.message, "error");
          }
        )
      );
    }
  }, []);

  useEffect(() => {
    if (borrowerDetails) {
      dispatch(
        getLeadDetailsByIdWatcher(
          {
            company_id: cid,
            product_id: pid,
            loan_app_id: borrowerDetails.loan_app_id
          },
          (result) => {
            setLeadData(result.data);
          },
          (error) => {
            return showAlert(error.response.data.message, "error");
          }
        )
      );
    }
  }, [borrowerDetails]);

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleChangePageWaiver = (event, newPage) => {
    setPage(newPage);
  };

  const styleCustomerDetailsRow = {
    display: "flex",
    flexDirection: "row",
    margin: "16px 0",
    width: "700px",
    height: "42px",
    alignItems: "flex-start",
    gap: "40px"
  };
  const styleCustomerDetailsComponent = {
    display: "flex",
    flexDirection: "column",
    flex: "1 0 0",
    alignItems: "flex-start",
    alignSelf: "stretch"
  }

  const styleCustomerDetailsFieldKey = {
    fontFamily: "Montserrat-Regular",
    fontSize: "12px",
    fontWeight: "400",
    lineHeight: "150%",
    textTransform: "uppercase",
    color: "#6B6F80"
  };

  const styleCustomerDetailsFieldValue = {
    fontFamily: "Montserrat-Medium",
    alignSelf: "stretch",
    fontSize: "16px",
    fontWeight: "500",
    lineHeight: "150%",
    color: "#141519"
  };

  return (
    <div>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}

        <Button
          label={"New waiver request"}
          onClick={() => { setAddNewWaiverDisplay(true); }}
          isDisabled={
            isTagged
              ? !checkAccessTags([
                "tag_loan_queue_request_waiver_read_write"
              ])
              : false
          }
          buttonType="primary"
          customStyle={{
            marginTop: "108px",
            display: "inline-flex",
            marginRight: "17px",
            padding: "13px 26px",
            float: "right",
            top: "40px",
            height: "48px",
            radius: "8px",
            borderRadius: "8px",
            fontSize: "16px",
            lineHeight: "150%",
            justifyCcontent: "center",
            alignItems: "center",
            gap: "10px",
            fontFamily: "Montserrat-Regular",
            backgroundColor: "#475BD8",
            fontWeight: "600",
            fontStyle: "normal",
            lineHeight: "150%",
            backgroundColor: "#475BD8"
          }}
        />

      <WaiverDetailsPopup
        openDialog={addNewWaiverDisplay}
        handleClose={() => {
          getWaiverReuests();
          setAddNewWaiverDisplay(false);
        }}
        company_id={cid}
        product_id={pid}
        loan_id={lid}
        type="addnew"
        isPropBased={true}
        isForSingleLoan={true}
      />

      <div style={{marginTop:"30px", width: "97%", backgroundColor: "#F9F8FA", border: " 1px solid #EDEDED", borderRadius: "8px", marginLeft: "25px", padding: "16px", fontFamily: "Montserrat-SemiBold" }}>
        <h4 style={{ fontSize: "20px", lineHeight: "150%", fontFamily: "Montserrat-SemiBold", color: "#141519" }}>Loan Details</h4>
        <div style={{ display: "grid", gridTemplateColumns: "17% 30% 19% 19% 19%", marginTop: "16px" }}>
          <div style={{ fontFamily: "Montserrat-Regular", fontSize: "12px" }}>
            CUSTOMER NAME
            <div style={{ color: "black", fontFamily: "Montserrat-Regular", fontSize: "16px", fontWeight:"800" }}>
              {`${leadData.first_name} ${leadData.last_name}`}
            </div>
          </div>
          <div style={{ fontFamily: "Montserrat-Regular", fontSize: "12px" }} >
            LOAN ID
            <div style={{ color: "black", fontFamily: "Montserrat-Regular", fontSize: "16px", fontWeight:"800" }}>
              {lid}
            </div>
          </div>
          <div style={{ fontFamily: "Montserrat-Regular", fontSize: "12px" }} >
            POS
            <div style={{ color: "black", fontFamily: "Montserrat-Regular", fontSize: "16px", fontWeight:"800" }}>
              {loanState.prin_os ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(loanState?.prin_os) : "NA"}
            </div>
          </div>
          <div style={{ fontFamily: "Montserrat-Regular", fontSize: "12px" }} >
            PARTNER NAME
            <div style={{ color: "black", fontFamily: "Montserrat-Regular", fontSize: "16px", fontWeight:"800" }}>
              {company.name}
            </div>
          </div>
          <div style={{ fontFamily: "Montserrat-Regular", fontSize: "12px" }} >
            PRODUCT NAME
            <div style={{ color: "black", fontFamily: "Montserrat-Regular", fontSize: "16px", fontWeight:"800" }}>
              {product.name}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: "60px"
      }}
      >
        <div style={{
          fontFamily: "Montserrat-SemiBold",
          width: "268px",
          height: "30px",
          fontSize: "20px",
          fontWeight: "600",
          lineHeight: "150%",
          marginLeft: "26px",
          color: "#141519"
        }}
        >
          Previous Waiver Requests
        </div>
        <div>
          {result.length ? (
            <WaiverRequests
              accessTags={user?.access_metrix_tags}
              count={count}
              page={page}
              handleChangePage={handleChangePageWaiver}
              result={result}
              company={company}
              product={product}
              isForSingleLoan={true}
              onDataChange={() => {
                getWaiverReuests();
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AddNewWaiverRequest;
