import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import CustomizeTemplates from "../../loanSchema/templateTabs";
import {
  getCollectionCaseByIdWatcher,
} from "actions/collection/cases.action";
import {
  getLoanDocumentsWatcher,
} from "../../../actions/loanDocuments"
import TabPanel from "../../../components/tabPanel";
import UploadCard from "react-sdk/dist/components/UploadCard";
import ApplicationDetails from "./applicationDetails.view";
import LoanDetails from "./loanDetails.view";
import ProfileDetails from "./profileDetails.view";
import CaseStatus from "./caseStatus.view";
import CaseHistory from "./caseHistory.view";
import { useLocation } from "react-router-dom";
import {
  getFirstAndLastInitials,
  formatDate,
  formatDateTime,
  convertIntoINR,
  convertToFloat,
  snakeCaseToLetterCase,
} from "../../../util/collection/helper";
import "./case.view.css";
import { storedList } from "../../../util/localstorage"
import ViewDocuments from "../../../components/Collection/viewDocuments/viewDocuments.js";


const defaultProfileData = {
  full_name: "",
  short_name: "",
  contact_number: "",
  sourcing_partner: "N/A",
  loan_id: "",
};
const defaultStatusData = {
  paid_amount: 0,
  unpaid_amount: 0,
  case_status: "N/A",
  last_visit: "N/A",
  follow_up_date: "N/A",
};
const defaultApplicationData = {
  loan_id: "",
  customer_id: "",
  borrower_name: "",
  contact_number: "",
  gender: "",
  city: "",
  state: "",
  pincode: "",
  refs: [],
  coapplicant_details: {},
};
const defaultLoanData = {
  loan_app_id: "",
  sanction_amount: 0,
  insurance_amount: 0,
  tenure: 0,
  first_inst_date: "",
  overdue_days: 0,
  total_outstanding: 0,
  current_instalment_due: 0,
  current_principal_due: 0,
  current_late_payment_interest: 0,
  charge_amount_and_gst: 0,
  // total_amount_paid: 0,
  // total_amount_waived: 0,
  // total_gst_paid: 0,
  // total_gst_reversed: 0,
};
export default function CaseDetails(data) {
  const param = useLocation();
  const dispatch = useDispatch();
  const [caseDetailsData, setCaseDetailsData] = useState({});
  const [showApplicationDetails, setShowApplicationDetails] = useState(true);
  const [showLoanDetails, setShowLoanDetails] = useState(false);
  const [custDocs, setCustomerDocs] = useState([]);
  const [showDocumetDetails, setShowDocumetDetails] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [loanDetailsData, setLoanDetailsData] = useState(defaultLoanData);
  const [applicationDetailsData, setApplicationDetailsData] = useState(
    defaultApplicationData
  );
  const [profileDetailsData, setProfileDetailsData] =
    useState(defaultProfileData);
  const [caseStatusDetailsData, setcaseStatusDetailsData] =
    useState(defaultStatusData);

  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [viewDocumentComponent, setViewDocumentComponent] = useState(false)
  const [currentDoc, setCurrentDoc] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const user = storedList("user");

  useEffect(() => {
    fetchCaseDetails();
  }, []);

  useEffect(() => {
    getLoanDocuments();
  }, []);

  const getLoanDocuments = () => {
    const payload = {
      loanAppID: param.state.loanAppID,
      company_id: param.state.companyID,
      product_id: param.state.productID,
      user: user
    };
    new Promise((resolve, reject) => {
      dispatch(getLoanDocumentsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setCustomerDocs(response.docResponse);
      })
      .catch((error) => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(error.response?.data?.message);
        setTimeout(() => {
          handleAlertClose();
          setIsLoading(false);
        }, 4000);
      });
  };

  const fetchCaseDetails = () => {
    const payload = {
      collectionId: param.state.caseID,
    };

    new Promise((resolve, reject) => {
      dispatch(getCollectionCaseByIdWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setCaseDetailsData(response.data);
        loadData(response.data);
      })
      .catch((error) => {
        setAlert(true);
        setSeverity("error");
        setAlertMessage(error.response?.data?.message);
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      });
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const loadData = (data) => {
    // LOAD PROFILE DATA

    var fullName = `${data.first_name ? data.first_name : ""} ${data.last_name ? data.last_name : ""
      }`;
    fullName = fullName.trim();
    const shortName = getFirstAndLastInitials(fullName);

    setProfileDetailsData({
      loan_id: data.lms_id || defaultProfileData.loan_id,
      full_name: fullName || defaultProfileData.first_name,
      short_name: shortName || defaultProfileData.short_name,
      sourcing_partner:
        data.company_name || defaultProfileData.sourcing_partner,
      contact_number: data.appl_phone || defaultProfileData.contact_number,
    });

    // LOAD STATUS DATA
    const amount = convertToFloat(data.totalOutstandingSum);
    const amountPaid = convertToFloat(data.amountPaidSum);
    const unpaidAmount = convertToFloat(data.totalOutstandingSum);
    const lastVisit = formatDate(data.last_visit_at);
    const followUpDate = formatDate(data.scheduled_at);
    setcaseStatusDetailsData({
      paid_amount: amountPaid || defaultStatusData.paid_amount,
      unpaid_amount: unpaidAmount.toFixed(2) || defaultStatusData.unpaid_amount,
      case_status: data.deposition_status || defaultStatusData.case_status,
      last_visit: lastVisit || defaultStatusData.last_visit,
      follow_up_date: followUpDate || defaultStatusData.follow_up_date,
    });

    //LOAD LOAN DATA
    const chargeAmount = convertToFloat(data.charge_amount);
    const gst = convertToFloat(data.gst);
    const firstInstDate = formatDate(data.first_inst_date);
    const chargeAmountGST = chargeAmount + gst;

    setLoanDetailsData({
      loan_app_id: data.partner_loan_app_id || defaultLoanData.loan_app_id,
      sanction_amount:
        convertToFloat(data.sanction_amount) || defaultLoanData.sanction_amount,
      insurance_amount:
        convertToFloat(data.insurance_amount) ||
        defaultLoanData.insurance_amount,
      tenure: data.tenure || defaultLoanData.tenure,
      first_inst_date: firstInstDate || defaultLoanData.first_inst_date,
      overdue_days: data.overdue_days || defaultLoanData.overdue_days,
      total_outstanding:
        convertToFloat(data.total_outstanding) ||
        defaultLoanData.total_outstanding,
      current_instalment_due:
        convertToFloat(data.current_int_due) ||
        defaultLoanData.current_instalment_due,
      current_principal_due:
        convertToFloat(data.current_prin_due) ||
        defaultLoanData.current_principal_due,
      current_late_payment_interest:
        convertToFloat(data.current_lpi_due) ||
        defaultLoanData.current_late_payment_interest,
      charge_amount_and_gst:
        convertToFloat(chargeAmountGST) ||
        defaultLoanData.charge_amount_and_gst,
      // total_amount_paid:
      //   convertToFloat(data.total_amount_paid) ||
      //   defaultLoanData.total_amount_paid,
      // total_amount_waived:
      //   convertToFloat(data.total_amount_waived) ||
      //   defaultLoanData.total_amount_waived,
      // total_gst_paid:
      //   convertToFloat(data.total_gst_paid) || defaultLoanData.total_gst_paid,
      // total_gst_reversed:
      //   convertToFloat(data.total_gst_reversed) ||
      //   defaultLoanData.total_gst_reversed,
    });

    // LOAD APPLICATION DATA
    setApplicationDetailsData({
      loan_id: data.lms_id || defaultApplicationData.loan_id,
      customer_id:
        data.partner_borrower_id || defaultApplicationData.customer_id,
      borrower_name: fullName || defaultApplicationData.borrower_name,
      contact_number: data.appl_phone || defaultApplicationData.contact_number,
      gender: data.gender || defaultApplicationData.gender,
      city: data.city || defaultApplicationData.city,
      state: data.state || defaultApplicationData.state,
      pincode: data.pincode || defaultApplicationData.pincode,
      refs: data.refs || defaultApplicationData.refs,
      coapplicant_details:
        data.coapporgaur || defaultApplicationData.coapplicant_details,
    });
  };

  const handleLoanDetails = () => {
    setShowApplicationDetails(false);
    setShowHistory(false);
    setShowDocumetDetails(false);
    setShowLoanDetails(true);
  };

  const handleApplicationDetails = () => {
    setShowApplicationDetails(true);
    setShowLoanDetails(false);
    setShowHistory(false);
    setShowDocumetDetails(false);
  };

  const handleDocumentDetails = () => {
    setShowApplicationDetails(false);
    setShowLoanDetails(false);
    setShowHistory(false);
    setShowDocumetDetails(true);

  };

  const handleHistoryDetails = () => {
    setShowApplicationDetails(false);
    setShowLoanDetails(false);
    setShowDocumetDetails(false);
    setShowHistory(true);
  };

  const changeActiveTab = (tabName) => {
    const tabClickHandlers = {
      "application details": handleApplicationDetails,
      "loan details": handleLoanDetails,
      "customer documents": handleDocumentDetails,
      "history": handleHistoryDetails,
    };
    const tabClickHandler = tabClickHandlers[tabName];
    if (tabClickHandler) {
      tabClickHandler();
    }
  };

  return (
    <>
      <React.Fragment>
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "40% 56%",
              minWidth: "600px",
            }}
          >
            <ProfileDetails {...profileDetailsData} />
            <CaseStatus {...caseStatusDetailsData} status={param.state.caseStatus?param.state.caseStatus:"open"}/>
          </div>

          <div
            style={{
              marginTop: "30px",
              marginLeft: "15px",
              marginBottom: "30px",
            }}
          >
            <h1 style={{ marginLeft: "25px", marginBottom: "20px" }}>
              Application Data
            </h1>
            <CustomizeTemplates
              templatesdata={["Application Details", "Loan Details", "Customer Documents", "History"]}
              initialState={"Application Details"}
              onIndexChange={changeActiveTab}
            />
          </div>

          {/* APPLICATION DETAILS */}
          {showApplicationDetails ? (
            <ApplicationDetails {...applicationDetailsData} />
          ) : null}

          {/* LOAN DETAILS */}
          {showLoanDetails ? <LoanDetails {...loanDetailsData} /> : null}

          {currentDoc && viewDocumentComponent ?
            <ViewDocuments
              doc={currentDoc}
              loanAppID={param.state.loanAppID}
              companyID={param.state.companyID}
              productID={param.state.productID}
              userID={user}
              viewDocumentComponent={viewDocumentComponent}
              setViewDocumentComponent={setViewDocumentComponent}
            />
            : null
          }

          {/* CUSTOMER DOCUMENT DETAILS */}
          {showDocumetDetails ?
            <div className="case-customer-document">
              <TabPanel value={0} index={0} style={{ width: "100%" }} >
                <div style={{
                  display: "grid",
                  gridColumnGap: 0,
                  gridTemplateColumns: "33.33% 33.33% 33.33%"
                }}>
                  {custDocs && custDocs.length > 0 ? (
                    custDocs.map((doc, id) => (
                      <UploadCard
                        key={id}
                        hasDocument={doc.file_url ? true : false}
                        heading={snakeCaseToLetterCase(doc.file_type)}
                        viewOnClick={() => {
                          setViewDocumentComponent(true);
                          setCurrentDoc(doc);
                        }}
                        uploadRevoke={true}
                      />
                    ))
                  ) : (
                    <div style={{ gridColumn: "span 3", textAlign: "center" }}>
                      No Data Available
                    </div>
                  )}
                </div>
              </TabPanel>
            </div>
            : null}

          {/* History */}
          {showHistory ? <CaseHistory param={param} /> : null}
        </div>
      </React.Fragment>
    </>
  );
}
