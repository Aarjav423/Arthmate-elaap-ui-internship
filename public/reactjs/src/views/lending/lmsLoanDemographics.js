import * as React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { useParams, useHistory } from "react-router-dom";
import DemoGraphicCard from "./lmsDemographicsCards";
import Validation from "./manage/validation";
import {
  getBorrowerDetailsByIdWatcher,
  getAcceptBorrowerDetailsByIdWatcher
} from "../../actions/borrowerInfo";
import { statusToDisplay } from "../../util/helper";
import { AlertBox } from "../../components/AlertBox";
import { setCreditLimitWatcher } from "../../actions/credit-limit";
import { storedList } from "../../util/localstorage";
import { SetCreditLimitPopup } from "./SetCreditLimitPopup";
import { Button } from "@mui/material";
const user = storedList("user");
import { checkAccessTags } from "../../util/uam";
import { UpdateCreditLimitPopup } from "./UpdateCreditLimitPopup";
import Preloader from "../../components/custom/preLoader";
import CompanyProductDetails from "./companyProductDetails";
import Accordian from "react-sdk/dist/components/Accordion/Accordion";
import { getAllCompaniesWatcher } from "../../actions/company";
import { getProductByIdWatcher } from "../../actions/product";
import CustomButton from "react-sdk/dist/components/Button/Button"


const lmsLoanDemographics = props => {
  const isLoading = useSelector(state => state.profile.loading);
  const { open, data, loanSchemaId, onModalClose, title, ...other } = props;
  const [loanData, setLoanData] = useState(null);
  const [cardsData, setCardsData] = useState({});
  const [validationData, setValidationData] = useState({});
  //alert
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const { loan_id, product_id, company_id, loan_schema_id, lms_version } =
    useParams();
  const [loanAppId, setLoanAppId] = useState();
  const [allowLoc, setAllowLoc] = useState();
  const [limitAmount, setLimitAmount] = useState();
  const [openSetLimit, setOpenSetLimit] = useState(false);
  const [openUpdateLimit, setOpenUpdateLimit] = useState(false);
  const [isReject, setIsReject] = useState(false);
  const [rejectReason, setRejectReason] = useState(false);
  const [rejectRemark, setRejectRemark] = useState(false);
  const [accordian, setAccordion] = useState();
  const dispatch = useDispatch();
  const history = useHistory();
  const [openCompanyDetails, setOpenCompanyDetails] = useState(true);
  const [company, setCompany] = useState(null);
  const [product, setProduct] = useState(null);
  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;


  const updateAcceptStatus = () => {
    const params = {
      company_id: company_id,
      product_id: product_id,
      loan_id: loan_id,
      loan_schema_id: loan_schema_id
    };
    dispatch(
      getAcceptBorrowerDetailsByIdWatcher(
        params,
        result => {
          let obj = {
            ...result
          };
          window.location.reload();
        },
        error => {
          return showAlert(error?.response?.data?.message, "error");
        }
      )
    );
  };

  function formatAmount(str) {
    const [rupees, paise = ''] = str.split('.');
    const formattedRupees = rupees.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formattedAmount = paise ? `${formattedRupees}.${paise}` : formattedRupees;
    return `₹${formattedAmount}`;
  }
  




  const fetchLoandetails = () => {
    const params = {
      company_id: company_id,
      product_id: product_id,
      loan_id: loan_id,
      loan_schema_id: loan_schema_id
    };
    dispatch(
      getBorrowerDetailsByIdWatcher(
        params,
        result => {
          let obj = {
            ...result
          };
          setLoanAppId(result.loanAppId);
          setAllowLoc(result.allowLoc);
          obj.data.loanStatus = result?.data?.status;
          obj.data.status = statusToDisplay[result?.data?.status];
          obj.data.sanction_match_status =
            statusToDisplay[result?.data?.scr_match_result];
          obj.data.sanction_match_count = result?.data?.scr_match_count;
          setLoanData(result);
          setValidationData(result.data);
          setLimitAmount(result.data?.limit_amount);
        },
        error => {
          return showAlert(error?.response?.data?.message, "error");
        }
      )
    );
  };


  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags([
        "tag_loan_details_read",
        "tag_loan_details_read_write",
        "tag_loan_queue_read_write",
        "tag_collateral_read_write"
      ])
    )
      fetchLoandetails();
    if (!isTagged) fetchLoandetails();
  }, []);


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
              productError => { }
            )
          );
        },
        error => { }
      )
    );
  }, []);
  const Capitalize = (str) => {
    const words = str.split(' ');
    const capitalizedWords = words.map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(' ');
  }

  // if the field belongs to any of this field from this array then add rupee symbol and comma login acc to en-IN
  const amountFields = [
    "NET DISBUR AMT", "SANCTION AMOUNT", "PRIN OS", "INT OS", "PRIN OVERDUE", "INT OVERDUE", "BOUNCE CHARGES",
    "ADDITIONAL CHARGES", "AVAILABLE BALANCE", "LOAN AMOUNT REQUESTED", "DOWNPAYMENT AMOUNT", "PROCESSING FEES AMT",
    "GST ON PF AMT", "SUBSCRIPTION FEE", "SUBVENTION FEES", "USAGE FEE", "UPFRONT INTEREST", "CONV FEES",
    "APPLICATION FEES", "STAMP CHARGES", "PREPAYMENT CHARGES AMT", "FEES", "INSURANCE AMOUNT", "TOTAL CHARGES",
    "ADVANCE EMI", "FLDG AMT", "MORAT EMI", "NORMAL EMI", "LOAN INT AMT", "BROKEN PERIOD INT AMT", "EMI AMOUNT",
    "INVOICE AMOUNT", "AVG MONTHLY TXN AMOUNT", "AVG 3 MNTS TXN AMT", "AVG BANKING TURNOVER 6 MONTHS",
    "BANKING OUTFLOW 6 MONTHS", "BANKING INFLOW 6 MONTHS", "TOTAL BANKING TURNOVER 6 MONTHS",
    "TOTAL BANKING DEPOSITS AMT", "TOTAL BANKING WITHDRAWAL AMT", "TOTAL BANKING TURNOVER", "MEDIAN OF BANKING TXN",
    "DAILY HOUSEHOLD INCOME", "AVG WEEKLY PAYOUTS", "MONTHLY INCOME", "MONTHLY HOUSEHOLD INCOME",
    "ANNUAL HOUSEHOLD INCOME", "NET INCOME", "HOUSEHOLD EXPENSE", "SUM OF CREDIT BALANCE IN ALL CREDIT CARDS",
    "TOTAL MONTHLY SALES", "MONTHLY TURNOVER", "ANNUAL TURNOVER", "PLATFORM COMMISSION", "LATE PAYMENT PENALTY"
  ];

  useEffect(() => {
    if (loanData) setCardsData(loanData.fieldDepartmentMapper);
    if (loanData) {
      let data = loanData.fieldDepartmentMapper
      let productData = {
        title: "Product Details",
        data: [
          {
            body: product?.name,
            head: "PRODUCT NAME"
          },
          {
            body: company?.name,
            head: "COMPANY NAME"
          },
          {
            body: company?.code,
            head: "COMPANY CODE"
          }
        ]
      }
      const newArray = Object.keys(data).map(section => {
        return {
          title: Capitalize(section.replace(/_/g, " ")),
          data: data[section].fields.map(field => ({
            body: 
              (amountFields.includes(field.replace(/_/g, " ").toUpperCase()))
              ? loanData.data[field] === "" || !loanData.data[field] ? "NA" :  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(loanData.data[field])
              : loanData.data[field] === "" || !loanData.data[field] ? "NA" : loanData.data[field],
            head: field.replace(/_/g, " ").toUpperCase()
          }))
        };
      });
      newArray.unshift(productData);
      setAccordion(newArray);
    }
  }, [loanData, product]);


  const onValidationError = message => {
    showAlert(message, "error");
  };


  const onValidationSuccess = message => {
    showAlert(message, "success");
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
      history.push("/admin/lending/loan_queue");
    }, 3000);
  };


  const handleCloseSetLimit = () => {
    setOpenSetLimit(false);
  };


  const handleCloseUpdateLimit = () => {
    setOpenUpdateLimit(false);
  };


  const handleSetCreditLimit = () => {
    setOpenSetLimit(false);
    const payload = {
      company_id: company_id,
      product_id: product_id,
      loan_id: loan_id,
      user_id: user._id,
      loan_app_id: loanAppId,
      limit_amount: limitAmount
    };
    dispatch(
      setCreditLimitWatcher(
        payload,
        result => {
          setOpenSetLimit(false);
          showAlert(result.message, "success");
        },
        error => {
          setOpenSetLimit(false);
          return showAlert(error?.response?.data?.message, "error");
        }
      )
    );
  };


  const [expanded, setExpanded] = useState(-1);
  const handleChange = panel => {
    expanded !== panel ? setExpanded(panel) : setExpanded(false);
    setOpenCompanyDetails(false);
  };


  return (
    <>
      <CardContent>
        {alert ? (
          <AlertBox
            severity={severity}
            msg={alertMessage}
            onClose={handleAlertClose}
          />
        ) : null}


        {openSetLimit ? (
          <SetCreditLimitPopup
            handleClose={handleCloseSetLimit}
            openLimit={openSetLimit}
            handleSetCreditLimit={handleSetCreditLimit}
            setLimitAmount={setLimitAmount}
          />
        ) : null}


        {openUpdateLimit ? (
          <UpdateCreditLimitPopup
            handleClose={handleCloseUpdateLimit}
            openUpdateLimit={openUpdateLimit}
            data={{
              company_id: company_id,
              product_id: product_id,
              loan_id: loan_id,
              user_id: user._id,
              loan_app_id: loanAppId,
              limit_amount: limitAmount
            }}
          />
        ) : null}


        <Grid xs={12} container>
          <Validation
            data={validationData}
            onError={onValidationError}
            onSuccess={onValidationSuccess}
            loanSchemaId={loan_schema_id}
            setOpenSetLimit={setOpenSetLimit}
            setOpenUpdateLimit={setOpenUpdateLimit}
            allowLoc={allowLoc}
            lmsVersion={lms_version}
            isReject={isReject}
            setIsReject={setIsReject}
            rejectRemark={rejectRemark}
            rejectReason={rejectReason}
            setRejectReason={setRejectReason}
            setRejectRemark={setRejectRemark}
          />
          <Grid
            className="mt-2"
            style={{ justifyContent: "center", cursor: "pointer" }}
            xs={12}
            container
            spacing={1}
            sx={{ margin: 0 }}
          >
          </Grid>
        </Grid>
        {accordian ? <Accordian accordionData={accordian} /> : null}


        {isTagged &&
          ((allowLoc &&
            (validationData.stage === 0 ||
              validationData.stage === 902 ||
              validationData.stage === 901)) ||
            (!allowLoc &&
              (validationData.stage <= 2 ||
                validationData.stage === 902 ||
                validationData.stage === 901))) ? (
          checkAccessTags([
            "tag_loan_details_btn_reject",
            "tag_loan_details_read_write",
            "tag_loan_queue_read_write",
            "tag_collateral_read_write"
          ]) ? (
            <Grid
              display={"flex"}
              justifyContent={"right"}
              alignItems={"center"}
              m={2}
            >
              {loanData &&
                loanData.data &&
                loanData.data.scr_status &&
                loanData.data.scr_status == "pending" &&
                checkAccessTags(["tag_loan_details_btn_apr"]) ? (
                <>
                  <Button
                    variant={"contained"}
                    color={"info"}
                    onClick={() => updateAcceptStatus()}
                  >
                    Approve
                  </Button>
                </>
              ) : null}
              <CustomButton label="Reject" buttonType="secondary" customStyle={{ color: "red", border: "1px solid red", height: "48px", fontSize: "16px", fontWeight: "600", padding: "12px 24px 12px 24px", width: "101px", marginRight: "-15px", marginTop: "5px" , borderRadius: "30px"}} onClick={() => { setIsReject(true); }} />
            </Grid>
          ) : null
        ) : (allowLoc &&
          (validationData.stage === 0 ||
            validationData.stage === 902 ||
            validationData.stage === 901)) ||
          (!allowLoc &&
            (validationData.stage <= 2 ||
              validationData.stage === 902 ||
              validationData.stage === 901)) ? (
          <Grid
            display={"flex"}
            justifyContent={"right"}
            alignItems={"center"}
            m={2}
          >
            {loanData &&
              loanData.data.scr_status &&
              loanData.data.scr_status == "pending" &&
              checkAccessTags(["tag_loan_details_btn_apr"]) ? (
              <Button
                variant={"contained"}
                color={"info"}
                onClick={() => updateAcceptStatus()}
              >
                Approve
              </Button>
            ) : null}
            <Button
              variant={"contained"}
              color={"info"}
              onClick={() => setIsReject(true)}
            >
              Reject
            </Button>
          </Grid>
        ) : null}
      </CardContent>
      {isLoading && <Preloader />}
    </>
  );
};


export default lmsLoanDemographics;



