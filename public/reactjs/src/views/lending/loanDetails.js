import { styled } from "@material-ui/core/styles";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import AccordianTab from "./lmsAdditionalInfoDemographicsCards.js";
import EditableAccordian from "react-sdk/dist/components/EditableAccordian"

import DialogTitle from "@mui/material/DialogTitle";
import moment from "moment";
import {
  addBorrowerInfoSinglefoWatcher,
  getBorrowerDetailsWatcher,
  updateBorrowerInfoWatcher
} from "../../actions/borrowerInfo";
import { getCompanyByIdWatcher } from "../../actions/company";
import { sendEnhancedReviewWatcher } from "../../actions/enhancedReview";
import {
  fetchLoanSchemaCustomWatcher,
  getAllLoanBookingTemplateWatcher
} from "../../actions/loanBooking";
import { getLoanRequestByLoanIdWatcher } from "../../actions/loanRequest";
import { loadTemplateEnumsWatcher } from "../../actions/loanSchema";
import { getProductByIdWatcher } from "../../actions/product";
import { AlertBox } from "../../components/AlertBox";
import { verifyDateAfter1800 } from "../../util/helper";
import { storedList } from "../../util/localstorage";
import { checkAccessTags } from "../../util/uam";
import { validateData } from "../../util/validation";
import LoanWithoutInsuranceModal from "./premiumCalculation/loanWithoutInsuranceModel.js";
import PremiumCalculatorForm from "./premiumCalculation/premiumCalculatorForm.js";
import CustomButton from "react-sdk/dist/components/Button/Button";

const user = storedList("user");

let mappingFieldsTobeDisabled =
  " partner_loan_app_id partner_borrower_id loan_app_id borrower_id";
let mappingFieldsAutoFill =
  "partner_loan_app_id partner_borrower_id loan_app_id borrower_id";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#5e72e4",
    color: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: theme.palette.common.black
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0
  }
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "10px",
  bgcolor: "background.paper",
  boxShadow: 24,
  minHeight: "10px",
  p: 4,
  backgroundColor: "#ffffff",
  borderRadius: "10px"
};

export default function LoanDetails(props) {
  const { ...other } = props;

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [partner, setPartner] = useState({});
  const [product, setProduct] = useState("");
  const [loanId, setLoanId] = useState("");
  const [loanSchemaId, setLoanSchemaId] = useState("");
  const [loanTemplate, setLoanTemplate] = useState([]);
  const [fieldMapper, setFieldMapper] = useState({});
  const [productData, setProductData] = useState({});
  const [loanRequest, setLoanRequest] = useState({});
  const [loan_custom_templates_id, setLoan_custom_templates_id] = useState("");
  const [stateData, setStateData] = useState({});
  const [paramsData, setParamsData] = useState({});
  const [validationData, setValidationData] = useState({});
  const [borrowerDetails, setBorrowerDetails] = useState({});
  const [nonEditableMode, setNonEditableMode] = useState(0);
  const [loanStatus, setLoanStatus] = useState("");
  const [bankDetailsEditableStatus, setBankDetailsEditableStatus] = useState();
  const [showErrorTable, setShowErrorTable] = useState(false);
  const [errorDetails, setErrorDetails] = useState("");

  const [enhancementReviewOpen, setEnhancementReviewOpen] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [buttonName, setButtonName] = useState("");
  const [buttonAction, setButtonAction] = useState("");
  const [comment, setComment] = useState("");
  const [commentState, setCommentState] = useState("");
  //alert
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [isDisabledSubmitBtn, setIsDisabledSubmitBtn] = useState(false);
  const [premiumCalculatorModel, setPremiumCalculatorModel] = useState(false);
  const [loanWithoutInsuranceModel, setLoanWithoutInsuranceModel] =
    useState(false);
  const [acceptLoanWithoutInsurance, setAcceptLoanWithoutInsurance] =
    useState(false);
  const [showPremiumScreen, setShowPremiumScreen] = useState("");
  const [premiumData, setPremiumData] = useState(null);
  const [borrowerAge, setBorrowerAge] = useState(null);
  const [coBorrowerAge, setCoBorrowerAge] = useState(null);
  const [enumFields, setEnumFields] = useState([]);
  const [inputBoxHavingDropdown, setInputBoxHavingDropdown] = useState([]);
  const [accordionData, setAccordianData] = useState([]);

  const [consentReceivedForNonInsurance, setConsentReceivedForNonInsurance] =
    useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { company_id, product_id, loan_id } = useParams();
  const search = useLocation().search;
  const name = new URLSearchParams(search).get("name");

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  // Step 1 get company id from url params and fetch company
  useEffect(() => {
    if (company_id && product_id && loan_id) {
      dispatch(
        getCompanyByIdWatcher(
          company_id,
          response => {
            if (!response.status) {
              showAlert("Company is not in active state", "error");
              setTimeout(() => {
                handleAlertClose();
              }, 4000);
            }
            setPartner(response);
          },
          error => {
            showAlert(error.response.data.message, "error");
            setTimeout(() => {
              handleAlertClose();
            }, 4000);
          }
        )
      );
    } else {
      showAlert("Something went wrong", "error");
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
    }
    dispatch(
      loadTemplateEnumsWatcher(
        {
          templates: ["lead", "loan", "loandocument"]
        },
        result => {
          setEnumFields(result.data);
           },
        error => {}
      )
    );
  }, []);

  // Step 2 once company is fetched get the product product details
  // Need loan_schema_id in order to fetch template uploaded for detail info of a borrower
  useEffect(() => {
    if (Object.prototype.hasOwnProperty.call(partner, "_id")) {
      dispatch(
        getProductByIdWatcher(
          product_id,
          response => {
            if (!response.status) {
              showAlert("Product is not in active state", "error");
              setTimeout(() => {
                handleAlertClose();
              }, 4000);
            }
            if (String(response._id) !== product_id) {
              showAlert("Product is not associated with this partner", "error");
              setTimeout(() => {
                handleAlertClose();
              }, 4000);
            }
            setProduct(response);
            setLoanSchemaId(response.loan_schema_id);
          },
          error => {
            showAlert(error.response.data.message, "error");
            setTimeout(() => {
              handleAlertClose();
            }, 4000);
          }
        )
      );
    }
  }, [partner]);

  // Step 3 when  you have loan_schema_id then get a loan schema
  // Here we get loan_custom_templates_id to fetch the uploaded template against detailedinfo
  useEffect(() => {
    if (loanSchemaId)
      dispatch(
        fetchLoanSchemaCustomWatcher(
          { loan_schema_id: loanSchemaId },
          result => {
            setLoan_custom_templates_id(result.loan_custom_templates_id);
          },
          error => {
            showAlert(error.response.data.message, "error");
            setTimeout(() => {
              handleAlertClose();
            }, 4000);
          }
        )
      );
  }, [loanSchemaId]);

  const handleMakeDefaultSelection = field => {
    mappingFieldsAutoFill += field;
  };

  const getTemplate = templatName => {
    if (loan_custom_templates_id) {
      dispatch(
        getAllLoanBookingTemplateWatcher(
          {
            loan_custom_templates_id,
            templatName
          },
          response => {
            const dataObj = {};
            const dataValidationObj = {};
            const data = response.filter(
              item =>
                item.checked.toLowerCase() === "true" ||
                item?.displayOnUI?.toLowerCase() === "true"
            );
            let fieldDepartmentMapper = {};
            const stateDataMapped = response
              .filter(
                item =>
                  item.checked.toLowerCase() === "true" ||
                  item?.displayOnUI?.toLowerCase() === "true"
              )
              .forEach(item => {
                let value = "";
                if (loanStatus === "open") {
                  handleMakeDefaultSelection(item.field);
                }

                if (mappingFieldsAutoFill.indexOf(item.field) > -1) {
                  value = loanRequest[item.field];
                  if (
                    loanStatus === "open" &&
                    item.field !== "bene_bank_acc_num" &&
                    item.field !== "bene_bank_ifsc" &&
                    item.field !== "bene_bank_account_holder_name"
                  ) {
                    mappingFieldsTobeDisabled += ` ${item.type}_vl_${item.field}`;
                  }
                }
                if (
                  bankDetailsEditableStatus > 2 &&
                  (item.field === "borro_bank_name" ||
                    item.field === "borro_bank_acc_num" ||
                    item.field === "borro_bank_ifsc" ||
                    item.field === "borro_bank_account_holder_name" ||
                    item.field === "borro_bank_account_type" ||
                    item.field === "bene_bank_name" ||
                    item.field === "bene_bank_acc_num" ||
                    item.field === "bene_bank_ifsc" ||
                    item.field === "bene_bank_account_holder_name" ||
                    item.field === "bene_bank_account_type")
                ) {
                  mappingFieldsTobeDisabled += `${item.type}_vl_${item.field}`;
                }

                if (borrowerDetails.loan_id) {
                  value = borrowerDetails[item.field];
                }
                if (
                  nonEditableMode ||
                  mappingFieldsTobeDisabled.indexOf(item.field) > -1
                ) {
                  mappingFieldsTobeDisabled += ` ${item.type}_vl_${item.field}`;
                }
                dataObj[`${item.type}_vl_${item.field}`] = value;
                dataValidationObj[`${item.type}_vl_${item.field}State`] = "";
                // get data as departments
                if (!fieldDepartmentMapper[item.dept]) {
                  fieldDepartmentMapper[item.dept] = {};
                  fieldDepartmentMapper[item.dept] = [];
                }
                fieldDepartmentMapper[item.dept].push(item);
              });
              setAccordianData(generateFormattedArray(fieldDepartmentMapper));
              let tempArray = [];
               Object.keys(dataObj).forEach(item => {
                const key = item.split("_vl_")[1];
                if(enumFields.loan.hasOwnProperty(key)){
                  tempArray.push({ [key]: item } )
                }
              }) ;
              setInputBoxHavingDropdown(tempArray);
            setFieldMapper(fieldDepartmentMapper);
            setLoanTemplate(data);
            setStateData(dataObj);
            setValidationData(dataValidationObj);
          },
          error => {}
        )
      );
    }
  };

  // Step 4 fetch template for getting fields of borrower details
  useEffect(() => {
    let page = 0;
    let limit = 10;
    if (loan_custom_templates_id) {
      dispatch(
        getLoanRequestByLoanIdWatcher(
          { loan_id, page, limit, company_id, product_id },
          result => {
            if (String(result.rows[0].product_id) !== product_id) {
              showAlert("Loan is not associated with product", "error");
              setTimeout(() => {
                handleAlertClose();
              }, 4000);
            }
            if (
              product.enhanced_review_required === 1 &&
              result.rows[0].lead_status !== "success"
            ) {
              showAlert(
                "Make sure that enhance review is completed for the loan request.",
                "error"
              );
              setTimeout(() => {
                handleAlertClose();
              }, 4000);
            }
            setLoanRequest(result.rows[0]);
          },
          error => {
            showAlert(error.response.data.message, "error");
            setTimeout(() => {
              handleAlertClose();
            }, 4000);
          }
        )
      );
    }
  }, [loan_custom_templates_id]);

  const handelOpenEnhancementReview = () => {
    setComment("");
    setCommentState("");
    setEnhancementReviewOpen(!enhancementReviewOpen);
  };

  useEffect(() => {
    dispatch(
      getBorrowerDetailsWatcher(
        {
          company_id,
          product_id,
          str: loan_id,
          loan_schema_id: null
        },
        result => {
          let borrowerData = {
            ...result[0],
            first_inst_date: moment(result[0]?.first_inst_date)?.format(
              "YYYY-MM-DD"
            ),
            final_approve_date: moment(result[0]?.final_approve_date)?.format(
              "YYYY-MM-DD"
            )
          };
          setLoanStatus(result[0].status);
          setBankDetailsEditableStatus(result[0].stage);
          setBorrowerDetails(borrowerData);
          if (!result.length && loanRequest._id) {
            return getTemplate("loan");
          }
          if (result[0].status == "disbursed") {
            setNonEditableMode(1);
            showAlert(
              `You cant edit details now loan is in ${result[0].status} status.`,
              "error"
            );
            setTimeout(() => {
              handleAlertClose();
            }, 4000);
          }
        },
        error => {
          getTemplate("loan");
        }
      )
    );
  }, [loanRequest]);

  useEffect(() => {
    if (borrowerDetails.loan_id) {
      getTemplate("loan");
    }
  }, [borrowerDetails]);

  const change = e => {
    const { name, value } = e.target;
    let isValid = validateData(
      name.substring(0, name.indexOf("_vl_")).toLowerCase(),
      value
    );
    if(value.toString() === ""){
      isValid = true;
    }
    setStateData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setValidationData(prevState => ({
      ...prevState,
      [`${name}State`]: !isValid ? "has-danger" : ""
    }));
  };

  const handleEnumDropdownChanged = (value, name) => {
    if (value)
      setStateData(prevState => ({
        ...prevState,
        [`${name}`]: value?.value
      }));
    else
      setStateData(prevState => ({
        ...prevState,
        [`${name}`]: ""
      }));

    const isValid = validateData(
      name.substring(0, name.indexOf("_vl_")).toLowerCase(),
      value
    );
  // const isValid = true;
    setValidationData(prevState => ({
      ...prevState,
      [`${name}State`]: !isValid ? "has-danger" : ""
    }));
  };

  const changeDateSelected = (value, name) => {
    const date = verifyDateAfter1800(moment(value).format("YYYY-MM-DD"))
      ? moment(value).format("YYYY-MM-DD")
      : value;
    const isValid = validateData(
      name.substring(0, name.indexOf("_vl_")).toLowerCase(),
      date
    );
    setStateData(prevState => ({
      ...prevState,
      [name]: date || null
    }));
    setValidationData(prevState => ({
      ...prevState,
      [`${name}State`]: !isValid ? "has-danger" : ""
    }));
  };

  const handleBack = message => {
    const url = "/admin/lending/leads";
    history.push(url);
  };

  const submitLoanDetails = () => {
    let formValidated = true;
    setIsDisabledSubmitBtn(true);
    Object.keys(stateData).forEach(item => {
      const currentField = loanTemplate.filter(ltItem => {
        return ltItem.field === item.substring(item.indexOf("_vl_") + 4);
      });
      if (
        currentField[0]?.checked?.toLowerCase() === "true" ||
        (currentField[0]?.checked?.toLowerCase() === "false" &&
          stateData[item] !== "")
      ) {
         let notEnum  = !enumFields?.loan.hasOwnProperty(currentField[0].field);
         let optionalEnum = currentField[0].isOptional.toLowerCase() === "false" && enumFields?.loan.hasOwnProperty(currentField[0].field);
            if(notEnum || optionalEnum){
          if (
            !validateData(
              item.substring(0, item.indexOf("_vl_")).toLowerCase(),
              stateData[item]
            )
          ) {
            setValidationData(prevState => ({
              ...prevState,
              [`${item}State`]: "has-danger"
            }));
            formValidated = false;
            setIsDisabledSubmitBtn(false);
          }
         }
      }
    });
    if (formValidated) {
      const options = {
        company_id: partner._id,
        company_code: partner.code,
        loan_schema_id: loanSchemaId,
        product_id: product._id
      };
      const postData = {};
      Object.keys(stateData).forEach(item => {
        // Check if optional fields have data if not ommit the field
        if (item !== "") {
          postData[item.substring(item.indexOf("_vl_") + 4, item.length)] =
            stateData[item];
        }
      });
      if (
        product.insurance_charges == 1 &&
        postData.hasOwnProperty("insurance_amount") &&
        (postData.insurance_amount * 1 < 1 ||
          postData.insurance_amount == " ") &&
        !consentReceivedForNonInsurance
      ) {
        return setLoanWithoutInsuranceModel(true);
      }
      if (!loanStatus) {
        dispatch(
          addBorrowerInfoSinglefoWatcher(
            { options, postData },
            response => {
              setLoanId(response.data[0].loan_id);
              showAlert(response.message, "success");
              setIsDisabledSubmitBtn(true);
              setTimeout(() => {
                handleAlertClose();
                handleBack(response.message);
              }, 4000);
            },
            error => {
              setIsDisabledSubmitBtn(false);
              const err = error?.response?.data?.data;
              if (err !== undefined) {
                if (err instanceof Array) {
                  setShowErrorTable(true);
                  handleOpen();
                  setErrorDetails(err);
                } else {
                  showAlert(error.response.data.message, "error");
                  setTimeout(() => {
                    handleAlertClose();
                  }, 4000);
                }
              } else {
                showAlert(error.response.data.message, "error");
                setTimeout(() => {
                  handleAlertClose();
                }, 4000);
              }
            }
          )
        );
      } else {
        options.loan_app_id = borrowerDetails?.loan_app_id;
        dispatch(
          updateBorrowerInfoWatcher(
            { options, postData },
            response => {
              showAlert(response.message, "success");
              setIsDisabledSubmitBtn(false);
              setTimeout(() => {
                handleAlertClose();
              }, 4000);
            },
            error => {
              if (error.response?.data?.message) {
                showAlert(error.response.data.message, "error");
              } else if (error.response?.data?.errorData?.body?.details)
                showAlert(error.response.data.errorData.body.details, "error");
              else showAlert("Error while updating loan", "error");
              setIsDisabledSubmitBtn(false);
              setTimeout(() => {
                handleAlertClose();
              }, 4000);
            }
          )
        );
      }
    } else {
      showAlert("Kindly check for errors in fields", "error");
      setIsDisabledSubmitBtn(false);
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
    }
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleBackToLoanQueue = () => {
    const url = "/admin/lending/loan_queue";
    history.push(url);
  };
  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
  };

  const commentChange = value => {
    setComment(value);
    const string = /^.{1,250}$/;
    string.test(value)
      ? setCommentState("has-success")
      : setCommentState("has-danger");
  };

  const submitEnhanceReview = () => {
    if (commentState !== "has-success") {
      setCommentState("has-danger");
      showAlert("Enter valid enhancement review comment.", "error");
      return;
    }

    let postData = Object.assign({}, loanRequest, { comment });
    dispatch(
      sendEnhancedReviewWatcher(
        postData,
        response => {
          if (response?.status) {
            handelOpenEnhancementReview();
            setNonEditableMode(true);
            showAlert(response?.message, "success");
            setTimeout(() => {
              handleAlertClose();
            }, 4000);
          } else {
            setEnhancementReviewOpen(false);
            showAlert(
              "Something went wrong while requesting enhanced review.",
              "error"
            );
            setTimeout(() => {
              handleAlertClose();
            }, 4000);
          }
        },
        error => {
          setEnhancementReviewOpen(false);
          showAlert(error?.response?.data?.message, "error");
          setTimeout(() => {
            handleAlertClose();
          }, 4000);
        }
      )
    );
  };

  const handleOpenPremiumCalculator = () => {
    setShowPremiumScreen(1);
    setPremiumCalculatorModel(true);
    //Clearing premium data and insurance_amount field
    setPremiumData(null);
    clearPremiumData();
  };

  const handlePremiumPopUpClose = (message, type) => {
    showAlert(message, type);
    setPremiumCalculatorModel(false);
  };

  const onAcceptInsurance = premiumData => {
    const stateDataObj = stateData;
    const { insurance_amount_key, tenure_key, sanction_amount_key } =
      getEditableFields();
    stateDataObj[insurance_amount_key] = premiumData.total_premium_inc_gst;
    setStateData(stateDataObj);
    setPremiumData(premiumData);
  };

  const handleloanWithoutInsurancePopUpClose = (message, type) => {
    showAlert(message, type);
    setLoanWithoutInsuranceModel(false);
  };

  const onAcceptLoanWithoutInsurance = () => {
    setLoanWithoutInsuranceModel(false);
    setConsentReceivedForNonInsurance(true);
    setAcceptLoanWithoutInsurance(true);
  };

  useEffect(() => {
    if (consentReceivedForNonInsurance) submitLoanDetails();
  }, [consentReceivedForNonInsurance]);

  const onRejectLoanWithoutInsurance = () => {
    setAcceptLoanWithoutInsurance(false);
    setPremiumCalculatorModel(false);
    setIsDisabledSubmitBtn(false);
    let stateDataNew = JSON.parse(JSON.stringify(stateData));
    let insurance_amount_label = "";
    Object.keys(stateData).forEach(item => {
      if (item.indexOf("insurance_amount") > -1) insurance_amount_label = item;
    });
    stateDataNew[insurance_amount_label] = "";
    setStateData(stateDataNew);
    setValidationData(prevState => ({
      ...prevState,
      [`${insurance_amount_label}State`]: "has-danger"
    }));
    setIsDisabledSubmitBtn(false);
  };

  const getEditableFields = () => {
    let insurance_amount_key = "";
    let tenure_key = "";
    let sanction_amount_key = "";
    for (let itemX in fieldMapper) {
      fieldMapper[itemX].forEach((itemY, i) => {
        if (itemY.field === "insurance_amount") {
          insurance_amount_key = `${itemY.type}_vl_insurance_amount`;
        }
      });
    }
    return { insurance_amount_key, tenure_key, sanction_amount_key };
  };

  const clearPremiumData = premiumData => {
    const stateDataObj = stateData;
    const { insurance_amount_key, tenure_key, sanction_amount_key } =
      getEditableFields();
    stateDataObj[insurance_amount_key] = "";
    stateDataObj[tenure_key] = "";
    stateDataObj[sanction_amount_key] = "";
    setStateData(stateDataObj);
  };

  const handleEditInsuranceAmount = () => {
    //Clearing premium data and insurance_amount field
    setPremiumData(null);
    clearPremiumData();
  };
  const checkDropdown = (isOptional , enumType ) => {
     let check = false;
     if(isOptional === "FALSE" && enumType) {
    check = true;
    }
    return check ? "*" : "";
  }

  function generateFormattedArray(fieldMapper) {
    const formattedArray = [];
     Object.keys(fieldMapper).forEach(item => {
          const dataArray =[];
          const firstVar = {
            title: item,
            data: dataArray
          };
          for (const key in fieldMapper[item]) {      
          const sectionData = {
              field: fieldMapper[item][key].field,
              title: fieldMapper[item][key].title + checkDropdown(fieldMapper[item][key].isOptional , enumFields.loan.hasOwnProperty(fieldMapper[item][key].field)),
              type: fieldMapper[item][key].type,
              validationmsg: fieldMapper[item][key].validationmsg === "Loan Application Date" || fieldMapper[item][key].validationmsg  === "First Installment Date" ?  fieldMapper[item][key].validationmsg  + " (YYYY-MM-DD)"  :fieldMapper[item][key].validationmsg,
              readOnly :                          
                premiumData
                  ? fieldMapper[item][key].field === "insurance_amount" ||
                    mappingFieldsTobeDisabled.indexOf(
                      `${fieldMapper[item][key].type}_vl_${fieldMapper[item][key].field}`
                    ) > -1 ||
                    nonEditableMode
                  : mappingFieldsTobeDisabled.indexOf(
                      `${fieldMapper[item][key].type}_vl_${fieldMapper[item][key].field}`
                    ) > -1 || nonEditableMode
            };
            if(enumFields?.lead && loanStatus === "" &&  enumFields.loan.hasOwnProperty(fieldMapper[item][key].field) ){
              dataArray.push(sectionData);
            }
            else if(!enumFields.loan.hasOwnProperty(fieldMapper[item][key].field)){
              dataArray.push(sectionData);
            }
        }
        formattedArray.push(firstVar);
    });
    return formattedArray;
  }

  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}

      <Grid container xs={12}>
        <Grid
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
            height: "45px"
          }}
        >
           <CustomButton isDisabled={product.insurance_charges == 1 ? false : true} label="Get premium" buttonType="primary" customStyle={{height: "48px", fontSize: "14px", padding: "12px ", width: "159px", marginRight: '30px',borderRadius:"26px" }} onClick={handleOpenPremiumCalculator} />

        </Grid>
      </Grid>

      {premiumCalculatorModel ? (
        <PremiumCalculatorForm
          onModalClose={handlePremiumPopUpClose}
          openDialog={premiumCalculatorModel}
          setOpenDialog={setPremiumCalculatorModel}
          showPremiumScreen={showPremiumScreen}
          setShowPremiumScreen={setShowPremiumScreen}
          companyId={company_id}
          productId={product_id}
          onAcceptInsurance={onAcceptInsurance}
        />
      ) : null}

      {loanWithoutInsuranceModel ? (
        <LoanWithoutInsuranceModal
          onModalClose={handleloanWithoutInsurancePopUpClose}
          openDialog={loanWithoutInsuranceModel}
          setOpenDialog={setLoanWithoutInsuranceModel}
          companyId={company_id}
          productId={product_id}
          onAcceptLoanWithoutInsurance={onAcceptLoanWithoutInsurance}
          onRejectLoanWithoutInsurance={onRejectLoanWithoutInsurance}
        />
      ) : null}

      <CardContent>
        <div>
          {fieldMapper &&
                <EditableAccordian
                customClass={{ width: "97.3%", marginLeft: "1.25%", alignSelf: "center" }}
                stateData={stateData}
                accordionData={accordionData}
                validationData={validationData}
                isEditable={true}
                key={"loan detail"}
                onChange={change}
                dropDownChange={handleEnumDropdownChanged}
                enumData = {enumFields}
                dropdownInputList= {inputBoxHavingDropdown}
                />
            }

        {isTagged ? (
          checkAccessTags([
            "tag_loan_info_read_write",
            "tag_lead_list_read_write"
          ]) ? (
            <div style={{display: 'flex' ,marginTop:'15px' , width: "98.5%"}}>
              {
                <CustomButton isDisabled={!checkAccessTags([
                  "tag_loan_info_read_write",
                  "tag_lead_list_read_write"
                ])} label="Back" buttonType="secondary" customStyle={{ color: "#475BD8", border: "1px solid #475BD8", height: "48px", fontSize: "14px", fontWeight: "600", padding: "12px 24px 12px 24px", width: "90px" ,marginLeft:'87%',borderRadius:"26px"}} onClick={handleBackToLoanQueue} />
              
        }
              {!!loanTemplate?.length > 0 && (
                  <CustomButton isDisabled={!["new", "success"].includes(loanRequest.lead_status) ||
                  nonEditableMode ||
                  isDisabledSubmitBtn ||
                  !checkAccessTags([
                    "tag_loan_info_read_write",
                    "tag_lead_list_read_write"
                  ])} label="Submit" buttonType="primary" customStyle={{height: "48px", fontSize: "14px", padding: "12px 24px 12px 24px", width: "109px",borderRadius:"26px" }} onClick={product.enhanced_review_required === 1 &&
                    loanRequest.lead_status !== "success"
                      ? handelOpenEnhancementReview
                      : submitLoanDetails} />
              )}
            </div>
          ) : null
        ) : (
          <div style={{display: 'flex' ,marginTop:'15px' , width: "98.5%"}}>
          <CustomButton isDisabled={false} label="Back" buttonType="secondary" customStyle={{ color: "#475BD8", border: "1px solid #475BD8", height: "48px", fontSize: "14px", fontWeight: "600", padding: "12px 24px 12px 24px", width: "90px",borderRadius:"26px"}} onClick={handleBackToLoanQueue} />
            {!!loanTemplate?.length > 0 && (
          
          <CustomButton isDisabled={!["new", "success"].includes(loanRequest.lead_status) ||
          nonEditableMode ||
          isDisabledSubmitBtn} label={product.enhanced_review_required === 1 &&
            loanRequest.lead_status !== "success"
              ? "Send For Enhanced Review"
              : "Submit"} buttonType="primary" customStyle={{height: "48px", fontSize: "14px", padding: "12px 24px 12px 24px", width: "109px", borderRadius:"26px" }} onClick={product.enhanced_review_required === 1 &&
            loanRequest.lead_status !== "success"
              ? handelOpenEnhancementReview
              : submitLoanDetails} />

            )}
          </div>
        )}
 </div>
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <Alert variant="filled" severity="error" sx={{ mb: 2 }}>
              Error!!!
            </Alert>
            {errorDetails.length ? (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell> Rule Code</StyledTableCell>
                      <StyledTableCell> Rule description</StyledTableCell>
                      <StyledTableCell> Action </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {errorDetails &&
                      errorDetails.map(item => (
                        <StyledTableRow key={item["rule-id"]}>
                          <StyledTableCell scope="row">
                            {item["rule-code"]}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {item["rule-description"]}
                          </StyledTableCell>
                          <StyledTableCell align="left">
                            {item.action}
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : null}
          </Box>
        </Modal>

        <Dialog
          open={enhancementReviewOpen}
          onClose={handelOpenEnhancementReview}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onBackdropClick="false"
          justifyContent="center"
          alignItems="center"
        >
          <DialogTitle id="alert-dialog-title">
            Enhanced Review Request
          </DialogTitle>
          <DialogContent>
            <Grid
              container
              item
              xs={12}
              sx={{
                marginTop: "1rem",
                display: "flex",
                flexDirection: "column",
                height: "250px",
                width: "500px"
              }}
            >
              <FormControl component={Box} marginBottom="1.5rem!important">
                <TextField
                  id="outlined-basic"
                  label="Enhanced Review Comment"
                  placeholder="Enter Enhanced Review Comment"
                  size="string"
                  rows={10}
                  multiline
                  required
                  autoFocus
                  value={comment}
                  onChange={event => commentChange(event.target.value)}
                  helperText={
                    commentState === "has-danger"
                      ? "Enter Valid Review Comment"
                      : ""
                  }
                />
              </FormControl>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid xs={12} container sx={{ margin: "10px 0" }}>
              <Stack spacing={2} direction="row">
                <Button
                  variant="contained"
                  className="pull-right ml-8 mr-5"
                  onClick={submitEnhanceReview}
                  size="large"
                >
                  Send
                </Button>
                <Button
                  variant="contained"
                  className="pull-right ml-4 mr-3"
                  onClick={handelOpenEnhancementReview}
                  size="large"
                  color="error"
                >
                  Cancel
                </Button>
              </Stack>
            </Grid>
          </DialogActions>
        </Dialog>
      </CardContent>
    </>
  );
}
