import * as React from "react";
import { bookLoansFormJsonFields } from "./bookLoansFormJson";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storedList, saveToStorage } from "../../../util/localstorage";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Button from "react-sdk/dist/components/Button";
import { getBookLoanDetailsWatcher, getMsmeLoanDocumentsWatcher } from "msme/actions/bookLoan.action";
import "react-sdk/dist/styles/_fonts.scss";
import BasicFilter from "../../components/BasicFilter/BasicFilter";
import BasicDatePicker from "../../../components/DatePicker/basicDatePicker";
import { validateData } from "../../../util/validation";
import { keyValuePairs, verifyDateAfter1800 } from "../../../util/helper";
import { patchMsmeDetailsWatcher, patchMsmeDocDeleteWatcher } from "../../actions/msme.action";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import Alert from "react-sdk/dist/components/Alert/Alert";
import { getMsmeCompaniesWatcher } from "../../actions/msme.action";
import { getMsmeProductByCompanyIDWatcher } from "../../actions/msme.action";
import { getMsmeSubmissionStatusWatcher } from "../../actions/msme.action";
import { getLeadSectionStatusWatcher } from "./../../actions/status.action";
import getSectionStatus from "./GetLeadSectionStatus/GetLeadSectionStatus";
import { SectionData } from "msme/config/sectionData";
import { getLeadStatusWatcher } from "../../actions/lead.action";
import AadharVerifyInputbox from "./reusableComponents/aadharVerifyInputbox"
import { useHistory, useLocation, useParams } from 'react-router-dom';
import getSubSectionRemarks from "./GetLeadSectionStatus/GetLeadSubSectionRemarks"
import "./bookLoans.style.css";
// KYCDocumentSelfieTittle
// import { KYCDocumentSelfieTittle, }

const sectionStatus = ["deviation", "approved", "rejected", "failed"]

import {
  KYCDocumentPANTittle,
  KYCDocumentSelfieTittle,
  KYCDocumentPanXMLTittle,
  KYCAadharTittle,
  AadharXML
} from "./uploadKycData";

import UploadFileInput from "../../components/uploadFileInput/UploadFileInput";
import {
  getStatesData,
  getPincodeData,
  States,
  Cities
} from "../../../constants/country-state-city-data";
import { stateCityWatcher } from "../../../actions/stateCity";
import moment from "moment";
import {
  createLoanIDWatcher,
  updateLoanIDWatcher
} from "./../../actions/bookLoan.action";
import { FamilyRestroomRounded } from "@mui/icons-material";
import { uploadLoanDocumentsWatcher } from "actions/loanDocuments";
import { dateTimePickerTabsClasses } from "@mui/x-date-pickers";
import { checkNumber } from "util/msme/helper";
import { documentCode } from "msme/config/docCode";

const BOOK_LOAN_OBJECT= keyValuePairs(bookLoansFormJsonFields(),'field')
const user = storedList('user');
const BOOK_LOAN_FORM_JSON = bookLoansFormJsonFields();
const sectionName = "primary-applicants";
const fetchObjectFieldsByDept = deptName => {
  const matchingObjects = [];
  for (let object of BOOK_LOAN_FORM_JSON) {
    if (object.dept === deptName) {
      matchingObjects.push(object.field);
    }
  }
  return matchingObjects; // Return the array of matching objects
};

const disabledFields = {
  view: [
    "company_id",
    "product_id",
    "loan_app_id",
    "partner_borrower_id",
    "partner_loan_app_id",
    "requested_loan_amount",
    "tenure_in_months",
    "interest_rate",
    "pan_value",
    ...fetchObjectFieldsByDept("Applicant Details"),
    ...fetchObjectFieldsByDept("KYC Document PAN"),
    ...fetchObjectFieldsByDept("Current Address"),
    ...fetchObjectFieldsByDept("Permanent Address")
  ],
  edit: [
    "company_id",
    "product_id",
    "loan_app_id",
    "partner_loan_app_id",
    "partner_borrower_id",
    "pan_value",
    ...fetchObjectFieldsByDept("Applicant Details"),
    ...fetchObjectFieldsByDept("KYC Document PAN"),
    ...fetchObjectFieldsByDept("Current Address"),
    ...fetchObjectFieldsByDept("Permanent Address")
  ]
};

const setDocumentView = (TitleOb, documents) => {
  return TitleOb.map((givenObj) => {
    const matchingObj = documents?.find(
      (otherObj) =>
        otherObj.code ===
        (givenObj?.documentCode ? givenObj?.documentCode : "")
    );
    if (matchingObj) {
      return {
        ...givenObj,
        s3_url: matchingObj.file_url,
        doc: matchingObj,
      };
    } else {
      return givenObj;
    }
  })
}

const checkDocStatus = (data) => {
  for (let ob of data) {
    if (!ob?.s3_url && ob.isRequired) {
      return false;
    }
  }
  return true;
}


export default function ApplicantDetailsForm(props) {
  const dispatch = useDispatch();
  const history= useHistory();
  const [isLeadRejected,setIsLeadRejected] = useState(false);
  const useAsyncState = initialState => {
    const [state, setState] = useState(initialState);

    const asyncSetState = value => {
      return new Promise(resolve => {
        setState(value);

        setState(current => {
          resolve(current);

          return current;
        });
      });
    };

    return [state, asyncSetState];
  };
  const {
    setNavState,
    setNavIconPrefixState,
    loanAppId,
    setLoanAppId,
    applicantData,
    setApplicantData,
    navIconPrefixState,
    setMSMECompanyId,
    setMSMEProductID,
    statusCheck,
    setStatusCheck,
    section_code,
    sub_section_code,
    documents,
    MSMECompanyId,
    MSMEProductId,
    loanDetailsSubsectionStatus,
    leadStatus,
    setLeadStatus,
    setShouldFetch,
    loanDetailsStatus
  } = props;


  // KYC-SELFIE
  const [selfieItem, setSelfiItem] = useState(KYCDocumentSelfieTittle)
  // PAN-IMAGE
  const [panImageItem, setPanImage] = useState(KYCDocumentPANTittle)
  // PAN-XML
  const [panXmlItem, setPanXml] = useState(KYCDocumentPanXMLTittle)
  //Aadhar front
  const [aadharItem, setAadharfront] = useState(KYCAadharTittle)
  //Aadhar frontXml
  const [aadharfrontXmlItem, setAadharfrontXml] = useState(AadharXML)
  const [subSectionStatus, setSubsectionStatus] = useState("");

  const fetchLeadStatus = () => {
    const payload = {
      loan_app_id: loanAppId,
      companyId: MSMECompanyId,
      productId: MSMEProductId,
      user: user,
    };
    new Promise((resolve, reject) => {
      dispatch(getLeadStatusWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setStatusObject(response.find(item => item.section_code === "primary"))
      })
      .catch((error) => {
        // showAlert(error?.response?.data?.message, "error");
      });
  };

  const fetchLeadDetails = () => {
    setSubsectionStatus(loanDetailsSubsectionStatus["100"]?.applicant_okyc);
  }

  useEffect(() => {
    if (loanAppId && MSMECompanyId && MSMEProductId) {
      if(loanDetailsStatus && loanDetailsStatus["primary"]=="rejected"){
        setIsLeadRejected(true);
      }

      fetchLeadStatus();
      getLoanDocuments();
    }
  }, [loanAppId, MSMECompanyId, MSMEProductId, leadStatus,loanDetailsStatus])

  useEffect(() => {
    if (loanDetailsSubsectionStatus && loanDetailsSubsectionStatus["100"]) {
      fetchLeadDetails();
    }
  }, [loanDetailsSubsectionStatus])

  const getLoanDocuments = () => {
    const payload = {
      loanAppID: loanAppId,
      companyId: MSMECompanyId,
      productId: MSMEProductId,
      user: user,
    };
    new Promise((resolve, reject) => {
      dispatch(getMsmeLoanDocumentsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        if (response) {
          let stateDoc = {
            applicant_image_value: false,
            aadhaar_front_image_value: false,
            aadhaar_back_image_value: false,
            pan_image_value: false,
            pan_xml_image_value: false,
            aadhaar_xml_image_value: false
          }

          let data = setDocumentView(KYCDocumentSelfieTittle, response);
          setSelfiItem(data);
          stateDoc['applicant_image_value'] = checkDocStatus(data)

          data = setDocumentView(KYCDocumentPANTittle, response);
          setPanImage(data);
          stateDoc['pan_image_value'] = checkDocStatus(data)

          data = setDocumentView(KYCDocumentPanXMLTittle, response);
          setPanXml(data);
          stateDoc['pan_xml_image_value'] = checkDocStatus(data);

          data = setDocumentView(KYCAadharTittle, response);
          setAadharfront(data);
          stateDoc['aadhaar_front_image_value'] = checkDocStatus(data);

          data = setDocumentView(AadharXML, response);
          setAadharfrontXml(data);
          stateDoc['aadhaar_xml_image_value'] = checkDocStatus(data);

          for (let obj of response) {
            if (obj.code == "116") {
              setSelectedFileType((prevState)=>({
                ...prevState,
                ["Response XML/JSON"]: false
              }))
            }
            if (obj.code == "114") {
              setAadharFileType("Response XML/JSON");
            }
          }
          setDocumentStateData(stateDoc);
        }
      })
      .catch((error) => {
        // showAlert(error.response?.data?.message, "error");
      });
  };



  let intervalId;
  const [statusObject, setStatusObject] = useState('')
  const [stateData, setStateData] = useState({...applicantData,  string_vl_purpose_of_loan:'Working Capital'}?? {
    string_vl_purpose_of_loan:'Working Capital'
  });
  const store = useSelector(state => state);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [company, setCompany] = useState([]);
  const [product, setProduct] = useState([]);
  const [companyID, setCompanyID] = useState();
  const [company_id, setCompany_id] = useState();
  const [productID, setProductID] = useState();
  const [validationData, setValidationData] = useState({});
  const [selectedFileType, setSelectedFileType] = useState({"Image & PDF":true,"Validation Doc":false});
  const [selectedAadhaarFileType, setSelectedAadhaarFileType] =useState({"Image & PDF":true,"Validation Doc":false});
  const [paViewPerAddress, setPaViewPerAddress] = useState(true);
  const [stateCityData, setStateCityDataStates] = useState([]);
  const [statesData, setStatesData] = useState(States);
  const [states, setStatesState] = useState(States ?? []);
  const [perCitiesData, setPerCitiesData] = useState([]);
  const [currCitiesData, setCurrCitiesData] = useState([]);
  const [city, setCityState] = useState([]);
  const [perCity, setPerCityState] = useState([]);
  const [newState, setNewState] = useState();
  const [newFile, setNewFile] = useState();
  const [panButtonState, setPanButtonState] = useState("button");
  const [verifyNextButtonState, setVerifyNextButtonState] = useState("primarys");
  const [validForm, setValidForm] = useState(false);
  const [panBorder, setPanBorder] = useState("border: 1px solid #BBBFCC");
  const [isPanValid, setIsPanValid] = useState(false);
  const [formComplete, setFormComplete] = useState(false);
  const [backgroundColorBlur, setBackgroundColorBlur] = useState(true);
  const [companyUser, setCompanyUser] = useState(false);
  const [compName, setCompName] = useState();
  const [prodName, setProdName] = useState();
  const [statusData, setStatusData] = useState();
  const [isFormDisabled, setIsFormDisabled] = useState(
    navIconPrefixState["Applicant Details"] == "success" ? true : false
  );
  const getStatseData = async data => {
    const statesData = await getStatesData(data);
    setStatesState(statesData);
  };
  const [userData, setUserData] = useState();
  const [uploadFileState, setUploadFileState] = useState({
    aadhaar_front_image_value_state: "button",
    aadhaar_back_image_value_state: "button",
    applicant_image_value_state: "button",
    pan_image_value_state: "button",
    aadhaar_xml_image_value_state: "button"
  });
  const fileInputRef = useRef(null);
  const [uploadSelectedFile, setUploadSelectedFile] = useState({
    aadhaar_front_image_value: "",
    aadhaar_back_image_value: "",
    applicant_image_value: "",
    pan_image_value: "",
    aadhaar_xml_image_value: ""
  });

  const [documentStateData, setDocumentStateData] = useState({
    applicant_image_value: false,
    aadhaar_front_image_value: false,
    aadhaar_back_image_value: false,
    pan_image_value: false,
    pan_xml_image_value: false,
    aadhaar_xml_image_value: false
  });



  const [sectionStatusCheck, setSectionStatusCheck] = useState("");
  useEffect(() => {
    if ((props.type == "edit" || props.type == "view") && applicantData) {
      setStateData(applicantData);
      if (applicantData.loan_app_id) {
        setLoanAppId(applicantData.loan_app_id);
        setPaViewPerAddress(applicantData.address_same ? false : true);
        if (loanDetailsSubsectionStatus && loanDetailsSubsectionStatus[100]) {
          if (loanDetailsSubsectionStatus[100]['primary_pan'] == "approved") {
            setStatusCheck(true);
            setIsPanValid(true);
            setBackgroundColorBlur(false);
            setPanButtonState("icon");
            setPanBorder("1px solid green");
          }
        }
      }
      if (company.length !== 0 && applicantData.company_id) {
        const data = company.find(
          item => item._id === applicantData.company_id
        );
        dropDownChange(data, "company_id");
      }
    }
    else {
      if (company.length !== 0 && user?.company_id) {
        const data = company.find(
          item => item._id === user.company_id
        );
        dropDownChange(data, "company_id");
        setCompanyUser(true)
      }
    }
  }, [props.type, company, applicantData, user]);

  useEffect(() => {
    if (product.length != 0) {
      if ((props.type == "edit" || props.type == "view")) {
        const data = product.find(item => item._id === applicantData.product_id);
        dropDownChange(data, "product_id");
      }
      else {
        const data = product[0]
        dropDownChange(data, "product_id");
      }
    }
  }, [props.type, product]);

  const handleInputBoxClick = (event, field) => {
    if (fileInputRef.current) {
      fileInputRef.current.click(field);
    } else {
      // <input>
    }
    setNewFile(field);
  };

  const handleFileInputChange = (field, event) => {
    setUploadFileState(prevState => ({
      ...prevState,
      [`${field}_state`]: "loader"
    }));
    const selectedFile = event?.target?.files;
    if (selectedFile[0]["size"] > 5e6) {
      showAlert("File size should not be greater than 5 MB", "error");
      return;
    }
    const fileType = selectedFile[0]["name"];
    const fileExtension = fileType.split(".").pop();
    if (
      fileExtension.toLowerCase() != "pdf" &&
      fileExtension.toLowerCase() != "png" &&
      fileExtension.toLowerCase() != "jpg" &&
      fileExtension.toLowerCase() != "jpeg"
    ) {
      showAlert("Only JPG,JPEG,PDF & PNG file is allowed", "error");
      return;
    }
    //Check File is not Empty
    if (selectedFile.length > 0) {
      let fileToLoad = selectedFile[0];
      let fileReader = new FileReader();
      fileReader.onload = async fileLoadedEvent => {
        setUploadSelectedFile(prevState => ({
          ...prevState,
          [newFile]: {
            name: fileType,
            data: fileLoadedEvent.target.result
          }
        }));
      };
      fileReader.readAsDataURL(fileToLoad);
    }

    setUploadFileState(prevState => ({
      ...prevState,
      [`${field}_state`]: "button"
    }));

    if (
      uploadSelectedFile.pan_image_value !== "" &&
      uploadSelectedFile.applicant_image_value !== "" &&
      ((uploadSelectedFile.aadhaar_front_image_value !== "" &&
        uploadSelectedFile.aadhaar_front_image_value !== "") ||
        uploadSelectedFile.aadhaar_xml_image_value !== "")
    ) {
    }
  };

  // const handleFileInputChange = (field, event, type) => {
  //     const selectedFile = event.target.files[0].name;
  //     const stateField = `${type}_vl_${newFile}`;
  //     setUploadSelectedFile((prevState) => ({
  //         ...prevState,
  //         [newFile]: selectedFile,
  //     }));
  // };

  const getCurrCitiesData = data => {
    const citiesData = Cities(data);
    setCurrCitiesData(citiesData);
  };

  const calculateAge = (birthMonth, birthDay, birthYear) => {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth();
    var currentDay = currentDate.getDate();
    var calculatedAge = currentYear - birthYear;

    if (currentMonth < birthMonth - 1) {
      calculatedAge--;
    }
    if (birthMonth - 1 == currentMonth && currentDay < birthDay) {
      calculatedAge--;
    }
    return calculatedAge;
  };

  useEffect(() => {
    if (stateData["curr_addr_state"] || stateData["per_addr_state"]) {
      setCurrCitiesData(Cities(stateData["curr_addr_state"]));
    }
  }, [stateData["curr_addr_state"] || stateData["per_addr_state"]]);

  useEffect(() => {
    let formValidated = false;
    let documentValidated = false;

    bookLoansFormJsonFields().map((item, idx) => {
      if (
        item.dept == "Applicant Details" ||
        item.dept == "select_company" ||
        item.dept == "select_partner" ||
        item.dept == "Current Address" ||
        item.dept == "Loan Requirement" ||
        item.dept == "Permanent Address" ||
        item.dept == "Applicant KYC 1"
      ) {
        //update field for documents
        if (item.isOptional == false) {
          if (!stateData[`${item.type}_vl_${item.field}`]) {
            formValidated = true;
          }
        }
      }
    });
    if (
      selectedFileType["Image & PDF"] &&
      selectedAadhaarFileType["Image & PDF"]
    ) {
      if (
        documentStateData.applicant_image_value &&
        documentStateData.aadhaar_front_image_value &&
        documentStateData.pan_image_value
      ) {
        documentValidated = true;
      }
    }
    if (
      selectedFileType["Validation Doc"] &&
      selectedAadhaarFileType["Image & PDF"]
    ) {
      if (
        documentStateData.applicant_image_value &&
        documentStateData.aadhaar_front_image_value &&
        documentStateData.pan_xml_image_value
      ) {
        documentValidated = true;
      }
    }
    if (
      selectedFileType["Validation Doc"] &&
      selectedAadhaarFileType["Validation Doc"]
    ) {
      if (
        documentStateData.applicant_image_value &&
        documentStateData.aadhaar_xml_image_value &&
        documentStateData.pan_xml_image_value
      ) {
        documentValidated = true;
      }
    }
    if (
      selectedFileType["Image & PDF"] &&
      selectedAadhaarFileType["Validation Doc"]
    ) {
      if (
        documentStateData.applicant_image_value &&
        documentStateData.aadhaar_xml_image_value &&
        documentStateData.pan_image_value
      ) {
        documentValidated = true;
      }
    }
    if (!formValidated && documentValidated) {
      setFormComplete(true);
    } else {
      setFormComplete(false);
    }
  }, [stateData, documentStateData]);

  const setInitialState = () => {
    let sectionArr = [
      "select_company",
      "Loan Requirement",
      "Applicant Details",
      "Current Address",
      "Permanent Address",
      "Applicant KYC 1",
      "Applicant Selfie",
      "KYC Document PAN",
      "KYC Document Aadhaar",
      "KYC Document XML Aadhaar"
    ];
    const tempStateObj = {};
    const tempErrorObj = {};

    for (const item of bookLoansFormJsonFields()) {
      if (sectionArr.includes(item.dept)) {
        const stateKey = `${item.type}_vl_${item.field}`;
        const errorKey = `${item.type}_vl_${item.field}State`;
        tempStateObj[stateKey] = "";
        tempErrorObj[errorKey] = "";
      }
    }
    setStateData(tempStateObj);
    setValidationData(tempErrorObj);
  };

  const handleGetPerCities = async value => {
    setPerCityState(Cities(value));
  };

  const showAlert = (msg, type) => {
    const element = document.getElementById("TopNavBar");

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    }

    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);

    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  const getCompanyFromID = id => {
    new Promise((resolve, reject) => {
      dispatch(getMsmeCompaniesWatcher(resolve, reject));
    }).then(result => {
      let temp = result;
      let allCompany = [];
      temp.forEach(comp => {
        allCompany.push({
          label: comp.name,
          value: comp.name,
          _id: comp._id
        });
      });
    });
    setCompany(allCompany);
    let obj = temp.find(comp => comp._id === id);
    let name = obj.name;
    setStateData(prevState => ({
      ...prevState,
      string_vl_company_id: name
    }));
  };

  const getProductNameFromID = (compID, id) => {
    new Promise((resolve, reject) => {
      dispatch(getMsmeProductByCompanyIDWatcher(compID, resolve, reject));
    }).then(result => {
      let temp = result;
      let allProduct = [];
      temp.forEach(prod => {
        if (prod.is_msme_automation_flag === "Y") {
          allProduct.push({
            label: prod.name,
            value: prod.name,
            _id: prod._id
          });
        }
      });
      setProduct(allProduct);
      let obj = temp.find(comp => comp._id === id);
      let name = obj.name;
      setStateData(prevState => ({
        ...prevState,
        string_vl_product_id: name
      }));
    });
  };

  // useEffect(() => {
  //   let payload = {
  //     loan_app_id: loanAppId,
  //     section: "primary_applicants",
  //   }
  //   new Promise((resolve, reject) => {
  //     dispatch(getBookLoanDetailsWatcher(payload, resolve, reject));
  //   })
  //     .then((response) => {
  //       let primAppl = response;
  //       setIsFormDisabled(true)
  //       getCompanyFromID(primAppl.company_id)
  //       getProductNameFromID(primAppl.company_id, primAppl.product_id)
  //       let data = {
  //         "float_vl_interest_rate": primAppl.loan_interest_rate,
  //         "float_vl_requested_loan_amount": primAppl.loan_amount,
  //         "mobile_vl_mobile_number": primAppl.primary_applicants.appl_phone,
  //         "number_vl_age": primAppl.primary_applicants.age,
  //         "number_vl_tenure_in_months": primAppl.loan_tenure,
  //         "pan_vl_pan_value": primAppl.primary_applicants.appl_pan,
  //         "pincode_vl_curr_addr_pincode": primAppl.primary_applicants.pincode,
  //         "pincode_vl_per_addr_pincode": primAppl.primary_applicants.per_pincode,
  //         "string_vl_curr_addr_city": primAppl.primary_applicants.city,
  //         "string_vl_curr_addr_ln1": primAppl.primary_applicants.resi_addr_ln1,
  //         "string_vl_curr_addr_state": primAppl.primary_applicants.state,
  //         "string_vl_father_full_name": primAppl.primary_applicants.father_name,
  //         "string_vl_first_name": primAppl.primary_applicants.first_name,
  //         "string_vl_gender": primAppl.primary_applicants.gender,
  //         "string_vl_last_name": primAppl.primary_applicants.last_name,
  //         "string_v1_middle_name": primAppl.primary_applicants.middle_name,
  //         "string_vl_partner_borrower_id": primAppl.partner_borrower_id,
  //         "string_vl_partner_loan_app_id": primAppl.partner_loan_app_id,
  //         "string_vl_per_addr_city": primAppl.primary_applicants.per_city,
  //         "string_vl_per_addr_ln1": primAppl.primary_applicants.per_addr_ln1,
  //         "string_vl_per_addr_ln2": primAppl.primary_applicants.per_addr_ln2,
  //         "string_vl_per_addr_state": primAppl.primary_applicants.per_state,
  //         "aadhaar_vl_aadhaar_value": primAppl.primary_applicants.aadhar_card_num
  //       }
  //       setStateData(data)
  //     })
  // }, [loanAppId])

  useEffect(() => {
    if (stateData["curr_addr_state"] || stateData["per_addr_state"]) {
      setCurrCitiesData(Cities(stateData["curr_addr_state"]));
    }
  }, [stateData["curr_addr_state"] || stateData["per_addr_state"]]);

  // useEffect(() => {
  //   let formValidated = false;

  //   bookLoansFormJsonFields().map((item, idx) => {
  //     if (
  //       item.dept == "Applicant Details" ||
  //       item.dept == "Current Address" ||
  //       item.dept == "select_partner" ||
  //       item.dept == "Permanent Address" ||
  //       item.dept == "Applicant KYC 1"
  //     ) {
  //       if (item.isOptional == false) {
  //         if (!stateData[`${item.type}_vl_${item.field}`]) {
  //           formValidated = true;
  //         }
  //       }
  //     }
  //   });
  //   if (formValidated) {
  //     setFormComplete(true);
  //   } else {
  //     setFormComplete(false);
  //   }
  // }, [stateData]);

  const handleGetStateCity = async () => {
    dispatch(
      stateCityWatcher(
        {},
        response => {
          setStateCityDataStates(response);
          getStatseData(response);
        },
        error => { }
      )
    );
  };
  const handleGetCities = async value => {
    setCityState(Cities(value));
  };

  const handleGenderChange = value => {
    let field = `string_vl_gender`;
    let isValid = validateData(
      field.substring(0, field.indexOf("_vl_")).toLowerCase(),
      value
    );
    setStateData(prevState => ({
      ...prevState,
      [field]: value
    }));
    setValidationData(prevState => ({
      ...prevState,
      [`${field}State`]: !isValid ? "has-danger" : ""
    }));
  };
  const Newfunction = (value, type, name) => {
    // const value = e.value;
    let field = `${type}_vl_${name}`;
    let isValid = validateData(
      field.substring(0, field.indexOf("_vl_")).toLowerCase(),
      value.value
    );
    // if (field === "string_vl_per_addr_ln1") {
    //     if (value.length <= 4) {
    //         isValid = false;
    //     }
    //}
    if (field.indexOf("curr") != -1 && !paViewPerAddress) {
      const perField = field.replace("curr", "per");
      let isValidData = validateData(
        perField.substring(0, perField.indexOf("_vl_")).toLowerCase(),
        value.value
      );
      setStateData(prevState => ({
        ...prevState,
        [perField]: value.value
      }));
      setValidationData(prevState => ({
        ...prevState,
        [`${perField}State`]: !isValidData ? "has-danger" : ""
      }));
    }
    setStateData(prevState => ({
      ...prevState,
      [field]: value.value
    }));
    setValidationData(prevState => ({
      ...prevState,
      [`${field}State`]: !isValid ? "has-danger" : ""
    }));
    setNewState(value);
    handleGetCities(value);
  };

  const inputBoxCss = {
    marginTop: "8px",
    maxHeight: "500px",
    zIndex: 1,
    width: "105%"
  };
  const headingCss = {
    color: "var(--neutrals-neutral-100, #161719)",
    fontFamily: "Montserrat-semibold",
    fontSize: "24px",
    fontWeight: 700,
    lineHeight: "150%",
    marginBottom: "24px",
    marginTop: "40px"
  };
  const inputBoxDropdownCss = {
    marginTop: "8px",
    maxHeight: "500px",
    width: "485px",
    zIndex: 1,
    padding: "0px 16px"
  };
  const radioCss = {
    color: "var(--neutrals-neutral-100, #161719)",
    fontFamily: "Montserrat-Regular",
    fontSize: "16px",
    fontWeight: "500",
    lineHeight: "20px",
    marginTop: "5px"
  };
  const radioInputCss = {
    accentColor:
      panButtonState === "icon"
        ? "#134CDE"
        : "var(--neutrals-neutral-60, #767888)",
    marginRight: "8px",
    marginBottom: "4px",
    height: "20px",
    width: "20px",
    verticalAlign: "middle"
    //boxShadow:"none"
  };
  const disabledRadioCss = {
    accentColor: "red",
    marginRight: "8px",
    marginBottom: "4px",
    height: "20px",
    width: "20px",
    verticalAlign: "middle"
  };

  const subHeadingCss = {
    color: "var(--neutrals-neutral-100, #161719)",
    fontFamily: "Montserrat-semibold",
    fontSize: "20px",
    fontWeight: 600,
    lineHeight: "150%",
    marginBottom: "24px",
    marginTop: "30px"
  };

  const handleDataFromChild = (id, data) => {
    console.log(`Received data for item with id ${id}:`, data);
    // setDisabled(false);
  };

  useEffect(() => {
    if (!paViewPerAddress) {
      bookLoansFormJsonFields().map((item, idx) => {
        if (item.dept == "Permanent Address") {
          let addressField = `${item.type}_vl_${item.field}`;
          setStateData(prevState => ({
            ...prevState,
            [addressField]: ""
          }));
          let field = item.field.replace("per", "curr");
          const value = stateData[`${item.type}_vl_${field}`];
          if (value) {
            let perField = `${item.type}_vl_${item.field}`;
            let isValid = validateData(
              perField.substring(0, perField.indexOf("_vl_")).toLowerCase(),
              value
            );
            setStateData(prevState => ({
              ...prevState,
              [perField]: value
            }));
            setValidationData(prevState => ({
              ...prevState,
              [`${perField}State`]: !isValid ? "has-danger" : ""
            }));
          }
        }
      });
    } else {
      if (!applicantData) {
        bookLoansFormJsonFields().map((item, idx) => {
          if (item.dept == "Permanent Address") {
            let field = `${item.type}_vl_${item.field}`;
            setStateData(prevState => ({
              ...prevState,
              [field]: ""
            }));
          }
        });
      }
    }
  }, [!paViewPerAddress]);

  useEffect(() => {
    if (stateData["date_vl_date_of_birth"]) {
      const dob = stateData["date_vl_date_of_birth"];
      const yyyyMmDdRegExp = /^\d{4}-\d{2}-\d{2}$/.test(dob);
      if (yyyyMmDdRegExp) {
        const age = calculateAge(
          dob.substring(5, 2),
          dob.substring(8, 2),
          dob.substring(0, 4)
        );
        setStateData(prevState => ({
          ...prevState,
          number_vl_age: age
        }));
        if (props.type == "view" || props.type == "edit") {
          setApplicantData(prevState => ({
            ...prevState,
            number_vl_age: age
          }))
        }

        let field = `number_vl_age`;
        let isValid = validateData(
          field.substring(0, field.indexOf("_vl_")).toLowerCase(),
          age
        );
        setValidationData(prevState => ({
          ...prevState,
          [`${field}State`]: !isValid ? "has-danger" : ""
        }));
      } else {
        setStateData(prevState => ({
          ...prevState,
          number_vl_age: " "
        }));
      }
      // const age=calculateAge()
    }
  }, [stateData["date_vl_date_of_birth"]]);

  const change = (e, type, name) => {
    const buttonText = e.target?.textContent;
    const valued = buttonText;
    if (valued === 'Send OTP') {
      //logic for send otp
    } else if (valued === "Verify") {
      // setBackgroundColorBlur(false);
      createLoanAppID();
    } else {
      let values = e.value;
      if (name === "pan_value") {
        values = e.value.toUpperCase();
        if (values?.length >= 10) {
          values = values.substring(0, 10);
        }
      } else if (name === "aadhaar_value") {
        values = e.value;

        if (values?.length >= 12) {
          values = values.substring(0, 12);
        }
      } else if (name === "mobile_number") {
        values = e.value;
        if (values?.length >= 10) {
          values = values.substring(0, 10);
        }
      } else if (name === "curr_addr_pincode" || name === "per_addr_pincode") {
        values = e.value;
        if (values?.length >= 6) {
          values = values.substring(0, 6);
        }
      }else if (name === "curr_addr_ln1" || name === "per_addr_ln1") {
        values = e.value;
        if (values?.length >= 40) {
          values = values.substring(0, 40);
        }
      } else if (name === "interest_rate") {
        let rawValue = e.value;

        if (rawValue < 0) {
          values = 0;
        } else if (rawValue > 100) {
          values = 100;
        } else {
          values = rawValue;
        }
      } else {
        values = e.value;
      }

      const value = values;
      let field = `${type}_vl_${name}`;
      let isValid = validateData(
        field.substring(0, field.indexOf("_vl_")).toLowerCase(),
        value
      );

      if (field.indexOf("curr") != -1 && !paViewPerAddress) {
        const perField = field.replace("curr", "per");
        let isValidData = validateData(
          perField.substring(0, perField.indexOf("_vl_")).toLowerCase(),
          value
        );
        setStateData(prevState => ({
          ...prevState,
          [perField]: value
        }));
        setValidationData(prevState => ({
          ...prevState,
          [`${perField}State`]: !isValidData ? "has-danger" : ""
        }));
      }
      setStateData(prevState => ({
        ...prevState,
        [field]: value
      }));
      setValidationData(prevState => ({
        ...prevState,
        [`${field}State`]: !isValid ? "has-danger" : ""
      }));
    }
  };

  useEffect(() => {
    dispatch(
      getMsmeCompaniesWatcher(
        result => {
          let temp = result;
          let allCompany = [];
          temp.forEach(comp => {
            allCompany.push({
              label: comp.name,
              value: comp.name,
              _id: comp._id
            });
          });
          setCompany(allCompany);
        },
        error => { }
      )
    );
  }, []);

  useEffect(() => {
    if (companyID) {
      dispatch(
        getMsmeProductByCompanyIDWatcher(
          companyID,
          result => {
            let temp = result;
            let allProduct = [];
            temp.forEach(prod => {
              if (prod.is_msme_automation_flag === "Y") {
                allProduct.push({
                  label: prod.name,
                  value: prod.name,
                  _id: prod._id
                });
              }
            });
            setProduct(allProduct);
          },
          error => { }
        )
      );
    }
  }, [companyID]);

  const dropDownChange = (value, name) => {
        setStateData(prevState => ({
      ...prevState,
      [`string_vl_${name}`]: value?.value ?? ""
    }));

    if (name === "company_id") {
      setCompanyID(value._id);
      setProduct([]);
      saveToStorage("msme_company_id", value._id);
      setMSMECompanyId(value._id);
    }

    if (name === "product_id") {
      setProductID(value._id);
      saveToStorage("msme_product_id", value._id);
      setMSMEProductID(value._id);
    }

    if (
      (name === "state" || name === "curr_addr_state") &&
      value !== undefined &&
      value !== null
    ) {
      handleGetCities(value);
      if (stateData.string_vl_curr_addr_city) {
        setStateData(prevState => ({
          ...prevState,
          [`string_vl_curr_addr_city`]: ""
        }));
      }
    }

    if(
      (name === "purpose_of_loan") &&
      value !== undefined &&
      value !== null
    ){
      if (stateData.string_vl_purpose_of_loan) {
        setStateData(prevState => ({
          ...prevState,
          string_vl_purpose_of_loan: value.label
        }));
      }
    }

    if (name === "per_addr_state" && value !== undefined && value !== null) {
      handleGetPerCities(value);
      if (stateData.string_vl_per_addr_city) {
        setStateData(prevState => ({
          ...prevState,
          [`string_vl_per_addr_city`]: ""
        }));
      }
    }

    if (name.indexOf("curr") != -1 && !paViewPerAddress) {
      const field = `string_vl_${name}`;
      const perField = field.replace("curr", "per");
      let isValidData = validateData(
        perField.substring(0, perField.indexOf("_vl_")).toLowerCase(),
        value?.value
      );
      setStateData(prevState => ({
        ...prevState,
        [perField]: value?.value
      }));
      setValidationData(prevState => ({
        ...prevState,
        [`${perField}State`]: !isValidData ? "has-danger" : ""
      }));
    }

    const validatingType = name === "pincode" ? "pincode" : "string";
    const isValid = validateData(validatingType, value?.value);

    setValidationData(prevState => ({
      ...prevState,
      [`${validatingType}_vl_${name}State`]: !isValid ? "has-danger" : ""
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
      [name]: date
    }));
    setValidationData(prevState => ({
      ...prevState,
      [`${name}State`]: !isValid ? "has-danger" : ""
    }));
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const fetchObjectsByDept = deptName => {
    const matchingObjects = [];
    for (const object of bookLoansFormJsonFields()) {
      if (object.dept === deptName) {
        matchingObjects.push(object);
      }
    }

    return matchingObjects; // Return the array of matching objects
  };

  const createLoanAppID = () => {
    let formValidated = true;

    bookLoansFormJsonFields().map((item, idx) => {
      if (
        (item.dept == "Applicant Details" ||
          item.dept == "Loan Requirement" ||
          item.dept == "select_company" ||
          item.dept == "Current Address" ||
          item.dept == "select_partner" ||
          item.dept == "Permanent Address" ||
          item.field == "pan_value") &&
        item.isOptional == false
      ) {
        const field = `${item.type}_vl_${item.field}`;
        if (
          stateData[field]?.length > 0 &&
          !validateData(
            field.substring(0, field.indexOf("_vl_")).toLowerCase(),
            stateData[field]
          )
        ) {
          setValidationData(prevState => ({
            ...prevState,
            [`${field}State`]: "has-danger"
          }));
          formValidated = false;
        }
        if (!stateData[field]) {
          setValidationData(prevState => ({
            ...prevState,
            [`${field}State`]: "has-danger"
          }));
          formValidated = false;
        }
      }
    });
    if (formValidated) {
      let obj_purpose_of_loan= BOOK_LOAN_OBJECT['purpose_of_loan']?.options?.find((item)=>item.label===stateData.string_vl_purpose_of_loan)
      if(!obj_purpose_of_loan){
        return showAlert("Please select purpose of loan","error")
      }
      let data = {
        loan_app_id: loanAppId,
        product_id: productID,
        company_id: companyID,
        address_same: paViewPerAddress ? 0 : 1,
        partner_loan_app_id: stateData.string_vl_partner_loan_app_id,
        partner_borrower_id: stateData.string_vl_partner_borrower_id,
        loan_amount: stateData.float_vl_requested_loan_amount,
        loan_tenure: stateData.number_vl_tenure_in_months,
        loan_interest_rate: stateData.float_vl_interest_rate,
        purpose_of_loan: obj_purpose_of_loan.value,
        appl_pan: stateData.pan_vl_pan_value,
        dob: stateData.date_vl_date_of_birth,
        first_name: stateData.string_vl_first_name,
        middle_name: stateData.string_vl_middle_name,
        last_name: stateData.string_vl_last_name,
        email_id: stateData.email_vl_email,
        father_fname: stateData.string_vl_father_full_name,
        type_of_addr: "Permanent",
        resi_addr_ln1: stateData.string_vl_curr_addr_ln1,
        resi_addr_ln2: stateData.string_vl_curr_addr_ln2,
        city: stateData.string_vl_curr_addr_city,
        state: stateData.string_vl_curr_addr_state,
        pincode: stateData.pincode_vl_curr_addr_pincode,
        per_addr_ln1: stateData.string_vl_per_addr_ln1,
        per_addr_ln2: stateData.string_vl_per_addr_ln2,
        per_city: stateData.string_vl_per_addr_city,
        per_state: stateData.string_vl_per_addr_state,
        per_pincode: stateData.pincode_vl_per_addr_pincode,
        appl_phone: stateData.mobile_vl_mobile_number,
        gender: stateData.string_vl_gender,
        sub_section_code: SectionData.primary.primary_pan.sub_section_code,
        section_code: SectionData.primary.section_code,
        section_sequence_no: SectionData.primary.section_sequence_no,
        section_name: SectionData.primary.section_name,
        sub_section_name: SectionData.primary.primary_pan.sub_section_name,
        sub_section_sequence_no: SectionData.primary.primary_pan.sub_section_sequence_no
      };
      setPanButtonState("loader");
      new Promise((resolve, reject) => {
        dispatch(createLoanIDWatcher(data, resolve, reject));
      })
        .then(response => {
          setLoanAppId(response.data.loan_app_id);
          // setPanButtonState("icon");
          // setPanBorder("1px solid green");
          // scheduleStatusApi(response.data.loan_app_id);
          setStatusCheckApi(
            response.data.loan_app_id,
            SectionData.primary.section_code,
            SectionData.primary.primary_pan.sub_section_code,
            dispatch
          );
        })
        .catch(error => {
          setPanButtonState("button");
          console.log("error::", error);
          showAlert(
            error?.response?.data?.message || "Something went wrong",
            "error"
          );
          setTimeout(() => {
            handleAlertClose();
          }, 4000);
          setPanBorder("1px solid red");
        });
    } else {
      showAlert("Kindly check for errors in fields", "error");
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
    }
  };

  // const getSectionStatus =(loanAppID) =>{
  //     new Promise((resolve, reject) => {
  //       console.log("status1","hit")
  //       dispatch(getLeadSectionStatusWatcher(loanAppID, resolve, reject))
  //     }).then((response)=> {
  //       console.log("status2","hit")
  //       let statusPerSection = response;
  //       statusPerSection.forEach(section => {
  //         if(section.section_code == "primary"){
  //           let temp = section.subsections;
  //           temp.forEach(subSection => {
  //           if(subSection.sub_section_code == "primary_pan"){
  //             if(subSection.sub_section_status == "approved"){
  //               setStatusCheck(true)
  //               setIsPanValid(true)
  //               setPanButtonState("icon");
  //               setPanBorder("1px solid green");
  //             } else if(subSection.sub_section_status == "deviation"){
  //               setStatusCheck(true)
  //               setIsPanValid(true)
  //               setPanButtonState("icon");
  //               setPanBorder("1px solid green");
  //               setNavIconPrefixState((prevState) => ({
  //                 ...prevState,
  //                 "Applicant Details": "deviation",
  //               }));
  //             } else if(subSection.sub_section_status == "rejected"){
  //               setStatusCheck(true)
  //               setIsPanValid(false)
  //               setPanButtonState("button");
  //               setPanBorder("border: 1px solid red");
  //             }else {
  //               setStatusCheck(true)
  //               setIsPanValid(false)
  //               setPanButtonState("button");
  //               setPanBorder("border: 1px solid #BBBFCC");
  //             }
  //             clearInterval(intervalId);
  //           }
  //          });
  //         }
  //       });
  //     }).catch((error) => {
  //       console.log(error)
  //     })
  // };

  // const setStatusCheckApi = (loanAppID,sectionCode,subSectionCode,dispatch) => {
  //   console.log(loanAppID, "status", "hit");
  //   intervalId = setInterval(async() => {
  //     let status = await getSectionStatus(loanAppID, sectionCode, subSectionCode,dispatch);
  //     console.log(status, "status is--->>>");
  //     if (status) {
  //       clearInterval(intervalId);
  //     }
  //   }, 10000);
  // };

  // const setStatusCheckApi = async (loanAppID, sectionCode, subSectionCode, dispatch) => {
  //   console.log(loanAppID, sectionCode, subSectionCode, dispatch, "check field");

  //   if (intervalId) {
  //     clearInterval(intervalId);
  //   }

  //   intervalId = setInterval(async () => {
  //     try {
  //       const status = await getSectionStatus(loanAppID, sectionCode, subSectionCode, dispatch);
  //       console.log("response is this-->>",status);

  //       if (status) {
  //         clearInterval(intervalId);
  //       }
  //     } catch (error) {
  //       // Handle any errors that occur during the status check.
  //       console.error("Error in getSectionStatus:", error);
  //       clearInterval(intervalId); // Clear the interval in case of an error.
  //     }
  //   }, 1000);
  // };

  // const setStatusCheckApi = (loanAppID, sectionCode, subSectionCode, dispatch) => {
  //   console.log(loanAppID, "status hit");

  //   if (intervalId) {
  //     clearInterval(intervalId);
  //   }

  //   intervalId = setInterval(() => {
  //     try {
  //       let status =   new Promise((resolve, reject) => {
  //         getSectionStatus(loanAppID, sectionCode, subSectionCode, dispatch)

  //       }).then((response)=>{
  //         console.log(response, "response");

  //       console.log(status , "status is")
  //       if (status) {
  //         clearInterval(intervalId);
  //       }
  //       })
  //       .catch((error) => {
  //         console.log(error);

  //       });
  //     } catch (error) {
  //       // Handle any errors that occur during the status check.
  //       console.error("Error in getSectionStatus:", error);
  //       clearInterval(intervalId); // Clear the interval in case of an error.
  //     }
  //   }, 1000);
  // };

  const dropDownOptions = row => {
    switch (row.field) {
      case "curr_addr_state":
      case "per_addr_state":
        return states;
      case "curr_addr_city":
        return city;
      case "per_addr_city":
        return perCity;
      case "company_id":
        return company;
      case "product_id":
        return product;
      default:
        return row.options;
    }
  };

  const renderFields = dept => {
    let deptArray = fetchObjectsByDept(dept);
    return (
      <div
        style={{
          display: "grid",
          rowGap: "28px",
          gridTemplateColumns: "32.8% 32.8% 32.8%",
          columnGap: "1%",
          width: "98%"
        }}
      >
        {deptArray &&
          deptArray.map((row, index) => {
            return (
              <>
                {row.field === "curr_addr_state" ||
                  row.field === "curr_addr_city" ||
                  row.field === "per_addr_state" ||
                  row.field === "per_addr_city" ||
                  row.field === "curr_addr_sub_area" ||
                  row.field === "per_addr_sub_area" ||
                  row.field === "purpose_of_loan"||
                  row.field === "company_id" ? (
                  <>
                    <InputBox
                      id={row.field}
                      label={row.title}
                      isDrawdown={
                        disabledFields[props.type] &&
                          disabledFields[props.type].includes(row.field)
                          ? false
                          : row.dept == "Current Address" &&
                            panButtonState === "icon"
                            ? false
                            : row.dept == "Permanent Address"
                              ? row.isDrawdown && !paViewPerAddress
                                ? false
                                : row.isDrawdown
                              : row.isDrawdown
                      }
                      initialValue={
                        stateData[`${row.type}_vl_${row.field}`] ?? ""
                      }
                      onClick={value => dropDownChange(value, row.field)}
                      isDisabled={
                        disabledFields[props.type] &&
                          disabledFields[props.type].includes(row.field)
                          ? true
                          : props.type != "edit" &&
                            loanAppId && statusCheck &&
                            row.field != "aadhaar_value"
                            ? true
                            : row.field === "age" ||
                              (row.dept == "Permanent Address" &&
                                !paViewPerAddress) ||
                              isFormDisabled
                              ? true
                              : (row.field === "company_id" && companyUser) ? true : false
                      }
                      customDropdownClass={
                        row.field == "gender" || row.field == "purpose_of_loan"
                          ? { ...inputBoxCss, width: "105%" }
                          : inputBoxCss
                      }
                      customClass={{
                        height: "56px",
                        width: "100%",
                        maxWidth: "100%"
                      }}
                      customInputClass={{
                        marginTop:
                          (loanAppId && row.field != "aadhaar_value") ||
                            row.field === "age" ||
                            (row.dept == "Permanent Address" &&
                              !paViewPerAddress) ||
                            isFormDisabled
                            ? "-3px"
                            : "0px",
                        minWidth: "100%",
                        backgroundColor: "#fff"
                      }}
                      // options = {row.options}
                      // onClick={value =>
                      //     Newfunction(value)
                      // }
                      options={dropDownOptions(row)}
                      // options={
                      //     row.field === "curr_addr_state" ||
                      //         row.field === "per_addr_state"
                      //         ? states
                      //         : row.field === "curr_addr_city" ||
                      //             row.field === "per_addr_city"
                      //             ? city
                      //             : row.options
                      // }
                      error={
                        row.checked.toLowerCase() === "true"
                          ? validationData[
                          `${row.type}_vl_${row.field}State`
                          ] === "has-danger"
                          : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                          validationData[
                          `${row.type}_vl_${row.field}State`
                          ] === "has-danger"
                      }
                      helperText={
                        row.checked.toLowerCase() === "true"
                          ? validationData[
                            `${row.type}_vl_${row.field}State`
                          ] === "has-danger"
                            ? row.validationMsg
                            : ""
                          : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                          (validationData[
                            `${row.type}_vl_${row.field}State`
                          ] === "has-danger"
                            ? row.validationMsg
                            : "")
                      }
                    // isRequired={row.checked?.toLowerCase() === "true" ? true : false}
                    />
                  </>
                ) :
                  row.field === "aadhaar_value" ? (
                    subSectionStatus === "in_progress" && leadStatus === "follow_up_kyc" ?
                      <AadharVerifyInputbox company_id={MSMECompanyId} product_id={MSMEProductId} row={row} stateData={stateData} props={props} disabledFields={disabledFields} loanAppId={loanAppId} viewPerAddress={paViewPerAddress} isFormDisabled={isFormDisabled} validationData={validationData} statusCheck={statusCheck} setValidationData={setValidationData} validateData={validateData} setStateData={setStateData} sectionCode={"primary"} sectionSequenceNumber={100} showAlert={showAlert} setShouldFetch={setShouldFetch} />
                      : <InputBox
                        id={row.field}
                        label={row.title}
                        type={
                          row.field == "aadhaar_value" &&
                            (props.type == "view")
                            ? "text"
                            : "number"
                        }
                        isDrawdown={false}
                        initialValue={
                          stateData[`${row.type}_vl_${row.field}`] ?? ""
                        }
                        onClick={event => change(event, row.type, row.field)}
                        isDisabled={
                          disabledFields[props.type] &&
                            disabledFields[props.type].includes(row.field)
                            ? true
                            : props.type != "edit" &&
                              !isPanValid &&
                              row.field === "aadhaar_value"
                              ? true
                              : row.field === "age" ||
                                (!paViewPerAddress &&
                                  row.dept == "Permanent Address") ||
                                isFormDisabled
                                ? true
                                : false
                        }
                        // isDisabled={
                        //   disabledFields[props.type] &&
                        //   disabledFields[props.type].includes(row.field)
                        //     ? true
                        //     : row.field === "age" && isFormDisabled
                        //     ? true
                        //     : false
                        // }
                        customDropdownClass={inputBoxCss}
                        customClass={{
                          height: "56px",
                          width: "100%",
                          maxWidth: "100%"
                        }}
                        customInputClass={{
                          marginTop:
                            (props.type != "edit" &&
                              loanAppId &&
                              row.field != "aadhaar_value") ||
                              row.field === "age" ||
                              (row.dept == "Permanent Address" &&
                                !paViewPerAddress) ||
                              isFormDisabled
                              ? "-3px"
                              : "0px",
                          minWidth: "100%",
                          backgroundColor: "#fff"
                        }}
                        error={
                          row.checked.toLowerCase() === "true"
                            ? validationData[
                            `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                            validationData[
                            `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                        }
                        helperText={
                          row.checked.toLowerCase() === "true"
                            ? validationData[
                              `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                              ? row.validationMsg
                              : ""
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                            (validationData[
                              `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                              ? row.validationMsg
                              : "")
                        }
                      // isRequired={row.checked?.toLowerCase() === "true" ? true : false}
                      />

                  )
                    :
                    row.field === "requested_loan_amount" ||
                      row.field == "tenure_in_months" ||
                      row.field === "interest_rate" ||
                      row.field === "curr_addr_pincode" ||
                      row.field === "per_addr_pincode" ||
                      row.field === "mobile_number" ||
                      row.field === "aadhaar_value" ? (
                      <>
                        <InputBox
                          id={row.field}
                          label={row.title}
                          type={"number"}
                          isDrawdown={false}
                          initialValue={row.field === "aadhaar_value" ? null : stateData[`${row.type}_vl_${row.field}`] ?? ""}
                          isBoxType={row.field === "aadhaar_value" ? "button" : null}
                          Buttonlabel={row.field === "aadhaar_value" ? "Send OTP" : null}
                          onClick={event => change(event, row.type, row.field)}
                          isDisabled={
                            row.field === "aadhaar_value" ? false :
                              disabledFields[props.type] &&
                                disabledFields[props.type].includes(row.field)
                                ? true
                                : props.type != "edit" &&
                                  loanAppId && statusCheck &&
                                  row.field != "aadhaar_value"
                                  ? true
                                  : row.field === "age" ||
                                    (!paViewPerAddress &&
                                      row.dept == "Permanent Address") ||
                                    isFormDisabled
                                    ? true
                                    : false
                          }
                          customDropdownClass={inputBoxCss}
                          customClass={{
                            height: "56px",
                            width: "100%",
                            maxWidth: "100%"
                          }}
                          customInputClass={{
                            marginTop:
                              (props.type != "edit" &&
                                loanAppId &&
                                row.field != "aadhaar_value") ||
                                row.field === "age" ||
                                (row.dept == "Permanent Address" &&
                                  !paViewPerAddress) ||
                                isFormDisabled
                                ? "-3px"
                                : "0px",
                            minWidth: "100%",
                            backgroundColor: "#fff"
                          }}
                          error={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                              validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                          }
                          helperText={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationMsg
                                : ""
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                              (validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationMsg
                                : "")
                          }
                        // isRequired={row.checked?.toLowerCase() === "true" ? true : false}
                        />
                      </>
                    ) : row.field === "aadhaar_front_image_value" ||
                      row.field === "aadhaar_back_image_value" ||
                      row.field === "applicant_image_value" ||
                      row.field === "aadhaar_xml_image_value" ||
                      row.field === "pan_image_value" ? (
                      <>
                        <InputBox
                          isBoxType={uploadFileState[`${row.field}_state`]}
                          Buttonlabel={
                            navIconPrefixState["Applicant Details"] == "success"
                              ? ""
                              : uploadSelectedFile[row.field] === ""
                                ? "Upload"
                                : "Change"
                          }
                          id={row.field}
                          label={row.title}
                          isDrawdown={false}
                          initialValue={uploadSelectedFile[row.field]}
                          // initialValue={stateData[`${row.type}_vl_${row.field}`] ?? ""}
                          onClick={event => {
                            handleInputBoxClick(event, row.field);
                          }}
                          // onClick={(event) => change(event, row.type, row.field)}
                          isDisabled={
                            disabledFields[props.type] &&
                              disabledFields[props.type].includes(row.field)
                              ? true
                              : row.field === "age" || isFormDisabled
                                ? true
                                : false
                          }
                          customDropdownClass={inputBoxCss}
                          customClass={{
                            height: "56px",
                            width: "100%",
                            maxWidth: "100%",
                            backgroundColor: backgroundColorBlur
                              ? "rgb(244, 244, 244)"
                              : ""
                          }}
                          customInputClass={{
                            marginTop:
                              (props.type != "edit" &&
                                loanAppId &&
                                row.field != "aadhaar_value") ||
                                row.field === "age" ||
                                (row.dept == "Permanent Address" &&
                                  !paViewPerAddress) ||
                                isFormDisabled
                                ? "-3px"
                                : "0px",
                            maxWidth: "82%",
                            backgroundColor: backgroundColorBlur
                              ? "rgb(244, 244, 244)"
                              : ""
                          }}
                          options={row.options}
                          error={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                              validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                          }
                          helperText={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationMsg
                                : ""
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                              (validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationMsg
                                : "")
                          }
                        // isRequired={row.checked?.toLowerCase() === "true" ? true : false}
                        />
                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: "none" }}
                          id={row.field}
                          onChange={e => {
                            handleFileInputChange(row.field, e, row.type);
                          }}
                        />
                      </>
                    ) : row.type === "pan" ? (
                      <>
                        <InputBox
                          isBoxType={panButtonState}
                          Buttonlabel={
                            navIconPrefixState["Applicant Details"] == "success"
                              ? ""
                              : "Verify"
                          }
                          id={row.field}
                          label={row.title}
                          isDrawdown={false}
                          // initialValue={""}
                          initialValue={(
                            stateData[`${row.type}_vl_${row.field}`] ?? ""
                          ).toUpperCase()}
                          onClick={event => change(event, "pan", row.field)}
                          // onClick={(event) => change(event, row.type, row.field)}
                          // isDisabled={row.field === "age" || isFormDisabled? true : false}
                          // onClick={(event) => change(event, row.type, row.field)}
                          isDisabled={
                            disabledFields[props.type] &&
                              disabledFields[props.type].includes(row.field)
                              ? true
                              : props.type != "edit" &&
                                loanAppId && isPanValid &&
                                row.field != "aadhaar_value"
                                ? true
                                : row.field === "age" || isFormDisabled
                                  ? true
                                  : false
                          }
                          customDropdownClass={inputBoxCss}
                          customClass={{
                            height: "56px",
                            width: "100%",
                            maxWidth: "100%",
                            border: panBorder,
                            pointerEvents: panButtonState === "icon" ? "none" : ""
                          }}
                          customInputClass={{
                            marginTop:
                              (props.type != "edit" &&
                                loanAppId &&
                                row.field != "aadhaar_value") ||
                                row.field === "age" ||
                                (row.dept == "Permanent Address" &&
                                  !paViewPerAddress) ||
                                isFormDisabled
                                ? "-3px"
                                : "0px",
                            maxWidth: "82%",
                            backgroundColor: "#fff"
                          }}
                          error={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                              validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                          }
                          helperText={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationMsg
                                : ""
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                              (validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationMsg
                                : "")
                          }
                        // isRequired={row.checked?.toLowerCase() === "true" ? true : false}
                        />
                      </>
                    ) : row.field === "gender" ? (
                      <>
                        <InputBox
                          id={row.field}
                          label={row.title}
                          isDrawdown={panButtonState === "icon" ? false : true}
                          initialValue={
                            stateData[`${row.type}_vl_${row.field}`] ?? ""
                          }
                          // onClick={(event) => change(event, row.type, row.field)}
                          isDisabled={
                            disabledFields[props.type] &&
                              disabledFields[props.type].includes(row.field)
                              ? true
                              : props.type != "edit" &&
                                loanAppId && statusCheck &&
                                row.field != "aadhaar_value"
                                ? true
                                : row.field === "age" ||
                                  (row.dept == "Permanent Address" &&
                                    !paViewPerAddress) ||
                                  isFormDisabled
                                  ? true
                                  : false
                          }
                          customDropdownClass={inputBoxCss}
                          customClass={{
                            height: "56px",
                            width: "100%",
                            maxWidth: "100%"
                          }}
                          customInputClass={{
                            marginTop:
                              (props.type != "edit" &&
                                loanAppId &&
                                row.field != "aadhaar_value") ||
                                row.field === "age" ||
                                (row.dept == "Permanent Address" &&
                                  !paViewPerAddress) ||
                                isFormDisabled
                                ? "-3px"
                                : "0px",
                            minWidth: "100%",
                            backgroundColor: "#fff"
                          }}
                          // options = {row.options}
                          onClick={event => change(event, row.type, row.field)}
                          options={row.isDrawdown ? row.options : []}
                          // options={row.isDrawdown ? row.field == 'curr_addr_state' || row.field == 'per_addr_state' ? statesData : city : item.options}
                          error={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                              validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                          }
                          helperText={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationMsg
                                : ""
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                              (validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationMsg
                                : "")
                          }
                        // isRequired={row.checked?.toLowerCase() === "true" ? true : false}
                        />
                      </>
                    ) : row.type === "date" ? (
                      <>
                        <BasicDatePicker
                          disabled={
                            disabledFields[props.type] &&
                              disabledFields[props.type].includes(row.field)
                              ? true
                              : props.type != "edit" &&
                                loanAppId && statusCheck &&
                                row.field != "aadhaar_value"
                                ? true
                                : isFormDisabled
                                  ? true
                                  : false
                          }
                          placeholder={"Date of Birth"}
                          style={{ height: "56px" }}
                          value={stateData[`${row.type}_vl_${row.field}`] || null}
                          format="dd-MM-yyyy"
                          shouldDisableDate={date => {
                            const today = new Date();
                            const selectedDate = new Date(date);
                            const age =
                              today.getFullYear() -
                              selectedDate.getFullYear() -
                              (today.getMonth() < selectedDate.getMonth() ||
                                (today.getMonth() === selectedDate.getMonth() &&
                                  today.getDate() < selectedDate.getDate())
                                ? 1
                                : 0);
                            return age < 18;
                          }}
                          shouldDisableYear={date => {
                            const today = new Date();
                            const selectedDate = new Date(date);
                            const age =
                              today.getFullYear() - selectedDate.getFullYear();
                            return age < 18;
                          }}
                          onDateChange={date => {
                            changeDateSelected(date, `${row.type}_vl_${row.field}`);
                          }}
                          error={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                              validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                          }
                          helperText={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationMsg
                                : ""
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                              (validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationMsg
                                : "")
                          }
                        />
                      </>
                    ) : row.field === "product_id" ? (
                      <>
                        <InputBox
                          key={companyID}
                          id={row.field}
                          label={row.title}
                          isDrawdown={
                            disabledFields[props.type] &&
                              disabledFields[props.type].includes(row.field)
                              ? false
                              : row.isDrawdown
                          }
                          initialValue={stateData[`${row.type}_vl_${row.field}`]}
                          onClick={value => dropDownChange(value, row.field)}
                          isDisabled={
                            disabledFields[props.type] &&
                              disabledFields[props.type].includes(row.field)
                              ? true
                              : props.type != "edit" &&
                                loanAppId && statusCheck &&
                                row.field != "aadhaar_value"
                                ? true
                                : row.field === "age" ||
                                  (row.dept == "Permanent Address" &&
                                    !paViewPerAddress) ||
                                  isFormDisabled
                                  ? true
                                  : false
                          }
                          customDropdownClass={inputBoxCss}
                          customClass={{
                            height: "56px",
                            width: "100%",
                            maxWidth: "100%"
                          }}
                          customInputClass={{
                            marginTop:
                              (props.type != "edit" &&
                                loanAppId &&
                                row.field != "aadhaar_value") ||
                                row.field === "age" ||
                                (row.dept == "Permanent Address" &&
                                  !paViewPerAddress) ||
                                isFormDisabled
                                ? "-3px"
                                : "0px",
                            minWidth: "100%",
                            backgroundColor: "#fff"
                          }}
                          options={dropDownOptions(row)}
                          error={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                              validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                          }
                          helperText={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationMsg
                                : ""
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                              (validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationMsg
                                : "")
                          }
                        />
                      </>
                    ) : (
                      <>
                        <InputBox
                          id={row.field}
                          label={row.title}
                          isDrawdown={false}
                          initialValue={
                            stateData[`${row.type}_vl_${row.field}`] ?? ""
                          }
                          onClick={event => change(event, row.type, row.field)}
                          isDisabled={
                            disabledFields[props.type] &&
                              disabledFields[props.type].includes(row.field)
                              ? true
                              : props.type != "edit" &&
                                loanAppId && statusCheck &&
                                row.field != "aadhaar_value"
                                ? true
                                : row.field === "age" ||
                                  (!paViewPerAddress &&
                                    row.dept == "Permanent Address") ||
                                  isFormDisabled
                                  ? true
                                  : false
                          }
                          customDropdownClass={inputBoxCss}
                          customClass={
                            row.field === "age"
                              ? {
                                height: "56px",
                                width: "100%",
                                maxWidth: "100%",
                                background: "#f4f4f4"
                              }
                              : {
                                height: "56px",
                                width: "100%",
                                maxWidth: "100%"
                              }
                          }
                          customInputClass={
                            row.field === "age"
                              ? {
                                marginTop: "-3px",
                                minWidth: "100%",
                                backgroundColor: "#f4f4f4",
                                marginTop:
                                  (props.type != "edit" &&
                                    loanAppId &&
                                    row.field != "aadhaar_value") ||
                                    row.field === "age" ||
                                    (row.dept == "Permanent Address" &&
                                      !paViewPerAddress) ||
                                    isFormDisabled
                                    ? "-3px"
                                    : "0px"
                              }
                              : {
                                minWidth: "100%",
                                backgroundColor: "#fff",
                                marginTop:
                                  (props.type != "edit" &&
                                    loanAppId &&
                                    row.field != "aadhaar_value") ||
                                    row.field === "age" ||
                                    (row.dept == "Permanent Address" &&
                                      !paViewPerAddress) ||
                                    isFormDisabled
                                    ? "-3px"
                                    : "0px"
                              }
                          }
                          error={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                              validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                          }
                          helperText={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationMsg
                                : ""
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                              (validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationMsg
                                : "")
                          }
                        // isRequired={row.checked?.toLowerCase() === "true" ? true : false}
                        />
                      </>
                    )}
              </>
            );
          })}
      </div>
    );
  };

  const deleteFile = async (documentCodes) => {
    const payload = {
      company_id: MSMECompanyId,
      product_id: MSMEProductId,
      user: user,
      loanAppId: loanAppId,
      code: [...documentCodes],
      borrowerId: stateData?.borrower_id
    };
    new Promise((resolve, reject)=>{
      dispatch(patchMsmeDocDeleteWatcher(payload, resolve, reject));
    }).then(response=>{
      showAlert(response.message, 'success')
    })
    .catch (error => {
      showAlert('Error deleting file', 'error');
    })
  };
  const handleCheckboxButton = event => {
    if(event.target.value == 'Image & PDF' && selectedFileType['Image & PDF'] 
    && !selectedFileType['Validation Doc']) return;
    else if(event.target.value == 'Validation Doc' && !selectedFileType['Image & PDF'] 
    && selectedFileType['Validation Doc']) return;
    if(selectedFileType[event.target.value]){
      setSelectedFileType((prevState)=>({
        ...prevState,
        [`${event.target.value}`]: false
      }))
    }else{
      setSelectedFileType((prevState)=>({
        ...prevState,
        [`${event.target.value}`]: true
      }))
    }
    if(event.target.value === "Validation Doc" && documentStateData.pan_xml_image_value){
      deleteFile([documentCode.applicant_pan_XML]);
      setDocumentStateData({...documentStateData, pan_xml_image_value:false});
    }else if(event.target.value === "Image & PDF" && documentStateData.pan_image_value){
      deleteFile([documentCode.applicant_pan]);
      setDocumentStateData({...documentStateData, pan_image_value:false})
      setUploadSelectedFile(prevState => ({
        ...prevState,
        pan_image_value : ""
      }));
    }
  };


  const handleAadhaarRadioButton = event => {
    if(event.target.value == 'Image & PDF' && selectedAadhaarFileType['Image & PDF'] 
    && !selectedAadhaarFileType['Validation Doc']) return;
    else if(event.target.value == 'Validation Doc' && !selectedAadhaarFileType['Image & PDF'] 
    && selectedAadhaarFileType['Validation Doc']) return;
    if(selectedAadhaarFileType[event.target.value]){
      setSelectedAadhaarFileType((prevState)=>({
        ...prevState,
        [`${event.target.value}`]: false
      }))
    }else{
      setSelectedAadhaarFileType((prevState)=>({
        ...prevState,
        [`${event.target.value}`]: true
      }))
    }
    if(event.target.value === "Validation Doc" && documentStateData.aadhaar_xml_image_value){
      deleteFile([documentCode.applicant_aadhaar_XML]);
      setDocumentStateData({...documentStateData,
         aadhaar_xml_image_value:false
        });
    }else if(event.target.value === "Image & PDF" && documentStateData.aadhaar_front_image_value ){
      deleteFile([documentCode.applicant_aadhaar_front,documentCode.applicant_aadhaar_back]);
      setDocumentStateData({...documentStateData, aadhaar_front_image_value:false, aadhaar_back_image_value:false})
      setUploadSelectedFile(prevState => ({
        ...prevState,
        aadhaar_front_image_value : "",
        aadhaar_back_image_value:""
      }));
    }
  };

  const updateApplicants = () => {
    let data = {
      section: "primary-applicants",
      product_id: productID,
      company_id: companyID,
      loan_app_id: loanAppId,
      partner_loan_app_id: stateData.string_vl_partner_loan_app_id,
      partner_borrower_id: stateData.string_vl_partner_borrower_id,
      appl_pan: stateData.pan_vl_pan_value,
      dob: stateData.date_vl_date_of_birth,
      first_name: stateData.string_vl_first_name,
      last_name: stateData.string_vl_last_name,
      father_fname: stateData.string_vl_father_full_name,
      type_of_addr: "Permanent",
      email_id: stateData.string_vl_email,
      resi_addr_ln1: stateData.string_vl_curr_addr_ln1,
      resi_addr_ln2: stateData.string_vl_curr_addr_ln2,
      city: stateData.string_vl_curr_addr_city,
      state: stateData.string_vl_curr_addr_state,
      pincode: stateData.pincode_vl_curr_addr_pincode,
      per_addr_ln1: stateData.string_vl_per_addr_ln1,
      per_addr_ln2: stateData.string_vl_per_addr_ln2,
      per_city: stateData.string_vl_per_addr_city,
      per_state: stateData.string_vl_per_addr_state,
      per_pincode: stateData.pincode_vl_per_addr_pincode,
      appl_phone: stateData.mobile_vl_mobile_number,
      gender: stateData.string_vl_gender,
      aadhar_card_num: stateData.aadhaar_vl_aadhaar_value,
      loan_amount: stateData.float_vl_requested_loan_amount,
      loan_tenure: stateData.number_vl_tenure_in_months,
      loan_interest_rate: stateData.float_vl_interest_rate,
      section_sequence_no: SectionData.primary.section_sequence_no,
      section_name: SectionData.primary.section_name,
      sub_section_code: SectionData.primary.primary_section_submit.sub_section_code,
      sub_section_name: SectionData.primary.primary_section_submit.sub_section_name,
      sub_section_sequence_no: SectionData.primary.primary_section_submit.sub_section_sequence_no,
      section_code: SectionData.primary.section_code,
    };

    setApplicantData(data);

    new Promise((resolve, reject) => {
      dispatch(updateLoanIDWatcher(data, resolve, reject));
    })
      .then(response => {
        setApplicantData(stateData);
        setNavState("Entity Details");
        setNavIconPrefixState(prevState => ({
          ...prevState,
          "Applicant Details": "success"
        }));
        showAlert(response?.message, "success");
        setShouldFetch((prev) => prev + 1);
      })
      .catch(error => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  // const getApplicants = (loanAppId) => {
  //   let data = {
  //     product_id: productID,
  //     company_id: companyID,
  //      loan_app_id: loanAppId,
  //      codeId:"primary_pan",
  //      sequenceId:"101",
  //      userId:user._id
  //   };

  //   new Promise((resolve, reject) => {
  //     dispatch(getMsmeSubmissionStatusWatcher(data, resolve, reject));
  //   })
  //     .then((response) => {
  //       setStatusData(response?.status);

  //       if (
  //         response?.status.toLowerCase() == "approved" ||
  //         response?.status.toLowerCase() == "rejected" ||
  //         response?.status.toLowerCase() == "failed"
  //       ) {
  //         clearInterval(interval);
  //         setPanButtonState("icon");
  //         setPanBorder("1px solid green");
  //       }
  //     })
  //     .catch((error) => {
  //       showAlert(error?.response?.data?.message, "error");
  //     });
  // };

  const handleSubmit = event => {
    // if (company == "" || company == nulls) {
    //     showAlert("Please Select Company", "error");
    //     return;
    // }

    // if (product == "" || product == null) {
    //     showAlert("Please Select Product", "error");
    //     return;
    // }

    if(isLeadRejected){
      return showAlert("Your lead has been rejected","error")
    }

    let postData = {};
    let formValidated = true;

    bookLoansFormJsonFields().map((item, idx) => {
      if (
        (item.dept == "Applicant Details" ||
          item.dept == "Loan Requirement" ||
          item.dept == "select_company" ||
          item.dept == "select_partner" ||
          item.dept == "Current Address" ||
          item.dept == "Permanent Address" ||
          item.dept == "Applicant KYC 1") &&
        item.isOptional == false
      ) {
        const field = `${item.type}_vl_${item.field}`;
        if (
          stateData[field]?.length > 0 &&
          !validateData(
            field.substring(0, field.indexOf("_vl_")).toLowerCase(),
            stateData[field]
          )
        ) {
          setValidationData(prevState => ({
            ...prevState,
            [`${field}State`]: "has-danger"
          }));
          formValidated = false;
        }
        if (!stateData[field]) {
          setValidationData(prevState => ({
            ...prevState,
            [`${field}State`]: "has-danger"
          }));
          formValidated = false;
        }
      }
    });
    if (formValidated) {
      // Object.keys(stateData).forEach((item) => {
      //     if (stateData[item].length > 0) {
      //         postData[item.substring(item.indexOf("_vl_") + 4, item.length)] =
      //             stateData[item];
      //     }
      // });
      //postData.loan_app_id = loan_app_id;
      // postData.company_id = company;
      // postData.product_id = product;
      // postData.user_id = user._id;

      setSectionStatusCheck('inProgress')
      postData = {
        loan_app_id: loanAppId,
        address_same: paViewPerAddress ? 0 : 1,
        section: "primary-applicants",
        msme_company_id: companyID,
        msme_product_id: productID,
        user_id: user._id,
        loan_amount: stateData.float_vl_requested_loan_amount,
        loan_tenure: stateData.number_vl_tenure_in_months,
        loan_interest_rate: stateData.float_vl_interest_rate,
        aadhar_card_num: stateData.aadhaar_vl_aadhaar_value,
        section_sequence_no: SectionData.primary.section_sequence_no,
        section_name: SectionData.primary.section_name,
        sub_section_code: SectionData.primary.primary_section_submit.sub_section_code,
        sub_section_name: SectionData.primary.primary_section_submit.sub_section_name,
        sub_section_sequence_no: SectionData.primary.primary_section_submit.sub_section_sequence_no,
        section_code: SectionData.primary.section_code,
      };
      new Promise((resolve, reject) => {
        dispatch(patchMsmeDetailsWatcher(postData, resolve, reject));
      })
        .then(response => {
          // setTimeout(() => {
          //     history.push("/admin/lending/leads");
          // }, 3000);
          setApplicantData(stateData);
          setStatusCheckApi(
            loanAppId,
            SectionData.primary.section_code,
            SectionData.primary.primary_section_submit.sub_section_code,
            dispatch
          );
          showAlert(response?.message, "success");
        })
        .catch(error => {
          showAlert(error?.response?.data?.message, "error");
        });

    } else {
      showAlert("Kindly check for errors in fields", "error");
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
    }
  };
  const handlePermanentAddress = () => {
    setPaViewPerAddress(!paViewPerAddress);
  };

  const setStatusCheckApi = async (
    loanAppID,
    sectionCode,
    subSectionCode,
    dispatch
  ) => {
    intervalId = setInterval(async () => {
      try {
        const status = await getSectionStatus(
          loanAppID,
          user,
          companyID,
          productID,
          sectionCode,
          subSectionCode,
          dispatch
        );

        let subSectionRemarks = await getSubSectionRemarks(
          loanAppID,
          user,
          MSMECompanyId,
          MSMEProductId,
          sectionCode,
          subSectionCode,
          dispatch
        );

        if (status == "approved") {
          if (subSectionCode == SectionData.primary.primary_pan.sub_section_code) {
            setStatusCheck(true);
            setIsPanValid(true);
            setBackgroundColorBlur(false);
            setPanButtonState("icon");
            setPanBorder("1px solid green");
            showAlert("Lead Created Succesfully", "success");
            setTimeout(() => {
              history.replace({
                pathname: `/admin/msme/lead/${loanAppID}/edit`,
                state: {
                  companyId: companyID,
                  productId: productID
                }
              })
            }, 1000)
          } else {
            setNavState("Entity Details");
            setNavIconPrefixState(prevState => ({
              ...prevState,
              "Applicant Details": "success"
            }));
            setSectionStatusCheck('completed');
            if (setShouldFetch) {
              setShouldFetch((prev) => prev + 1);
            }
          }
          clearInterval(intervalId);
          
        } else if (status == "deviation") {
          if (subSectionCode == SectionData.primary.primary_pan.sub_section_code) {
            setStatusCheck(true);
            setIsPanValid(true);
            setBackgroundColorBlur(false);
            setPanButtonState("icon");
            showAlert("Lead Created Succesfully", "success");
            setPanBorder("1px solid green");
          } else {
            setNavState("Entity Details");
            setNavIconPrefixState(prevState => ({
              ...prevState,
              "Applicant Details": "deviation"
            }));
            setSectionStatusCheck('completed');
          }
          clearInterval(intervalId);
        } else if (status == "rejected") {
          setStatusCheck(true);
          if (subSectionCode == SectionData.primary.primary_pan.sub_section_code) {
            showAlert(subSectionRemarks, "error");
            setPanButtonState("button");
          } else {
            showAlert(subSectionRemarks, "error");
            setSectionStatusCheck('completed');
            clearInterval(intervalId);
            setIsLeadRejected(true);
          }
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error in getSectionStatus:", error);
        clearInterval(intervalId);
      }
    }, 10000);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "98%",
        marginLeft: "1.7%",
        justifyContent: "space-around"
      }}
    >
      <h4
        style={{
          color: "var(--neutrals-neutral-100, #161719)",
          fontFamily: "Montserrat-semibold",
          fontSize: "24px",
          fontWeight: 700,
          lineHeight: "150%",
          marginBottom: "24px"
        }}
      >
        Select Company
      </h4>
      <div>
        <div style={{ marginBottom: "1.3rem" }}>
          {renderFields("select_company")}
        </div>
        <div>{renderFields("select_partner")}</div>
      </div>
      <h4 style={headingCss}>Loan Requirement</h4>
      <div>{renderFields("Loan Requirement")}</div>
      <h4 style={headingCss}>Applicant Details</h4>
      <div>{renderFields("Applicant Details")}</div>
      <h4 style={{ ...subHeadingCss, marginBottom: "16px" }}>
        Current Address
      </h4>
      <div>{renderFields("Current Address")}</div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h4 style={{ ...subHeadingCss, marginBottom: "16px" }}>
          Permanent Address
        </h4>

        <>
          <input
            style={{
              marginLeft: "16px",
              marginTop: "16px",
              width: "1rem",
              height: "1rem"
            }}
            type="checkbox"
            checked={!paViewPerAddress}
            onClick={handlePermanentAddress}
            disabled={panButtonState === "icon" ? true : false}
          ></input>
          <div
            style={{
              fontFamily: "Montserrat-Regular",
              fontSize: "0.9vw",
              marginLeft: "8px",
              color: "#767888",
              marginTop: "16px"
            }}
          >
            {" "}
            Same as current address
          </div>
        </>

      </div>
      {<div>{renderFields("Permanent Address")}</div>}

      <h4 style={headingCss}>Applicant KYC</h4>
      <div>{renderFields("Applicant KYC 1")}</div>
      <h4 style={{ ...subHeadingCss, marginBottom: "0px" }}>KYC Documents</h4>
      <div>
        <UploadFileInput
          onDataCallback={handleDataFromChild}
          backgroundColorChange={true}
          backgroundColorBlur={
            props.type && (props.type == "view" || props.type === "edit") ? false : backgroundColorBlur
          }
          items={selfieItem}
          title=""
          showAlert={showAlert}
          isXML={false}
          setDocumentStateData={setDocumentStateData}
          loanAppId={loanAppId}
          sectionName={sectionName}
          data={{ company_id: companyID, product_id: productID }}
          MSMECompanyId={MSMECompanyId}
          MSMEProductId={MSMEProductId}
          isChange={props.type && props.type == "edit" && !sectionStatus.includes(statusObject?.section_status)}
          type={props.type}
        />
      </div>

      {/* <div>
                {renderFields("KYC Document Selfie")}
            </div> */}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          columnGap: "2%",
          marginTop: "34px"
        }}
      >
        <p
          style={{
            color: "var(--neutrals-neutral-60, #767888)",
            fontFamily: "Montserrat-Regular",
            fontSize: "16px",
            fontWeight: "500"
          }}
        >
          Select PAN Document Type
        </p>
        <label
          style={{
            ...radioCss,
            color:
              panButtonState === "icon"
                ? "var(--neutrals-neutral-100, #161719)"
                : "#C0C1C8"
          }}
        >
          <input
            type="checkbox"
            value="Image & PDF"
            checked={selectedFileType["Image & PDF"]}
            onChange={handleCheckboxButton}
            style={radioInputCss}
            disabled={props.type == "view"}
          />
          Image & PDF
        </label>
        <label
          style={{
            ...radioCss,
            color:
              panButtonState === "icon"
                ? "var(--neutrals-neutral-100, #161719)"
                : "#C0C1C8"
          }}
        >
          <input
            type="checkbox"
            value="Validation Doc"
            checked={selectedFileType["Validation Doc"]}
            onChange={handleCheckboxButton}
            style={radioInputCss}
            disabled={props.type == "view" ? true : panButtonState === "icon" ? false : true}
          />
          Response XML / JSON
        </label>
      </div>

      <div style={{ marginTop: "-20px",display:"flex" }}>
      {selectedFileType["Image & PDF"]? (
        <div style={{marginRight:'2rem'}}>
          <UploadFileInput
            backgroundColorChange={true}
            backgroundColorBlur={
              props.type && (props.type == "view" || props.type === "edit") ? false : backgroundColorBlur
            }
            title=""
            showAlert={showAlert}
            isXML={false}
            setDocumentStateData={setDocumentStateData}
            loanAppId={loanAppId}
            sectionName={sectionName}
            data={{ company_id: companyID, product_id: productID }}
            MSMECompanyId={MSMECompanyId}
            MSMEProductId={MSMEProductId}
            items={panImageItem}
            isChange={props.type && props.type == "edit" && !sectionStatus.includes(statusObject?.section_status)}
            // shouldDelete={true}
            type={props.type}

          />
        </div>) : null}
        {selectedFileType["Validation Doc"] ? (
        <div>
          <UploadFileInput
            backgroundColorChange={true}
            backgroundColorBlur={
              props.type && (props.type == "view" || props.type === "edit") ? false : backgroundColorBlur
            }
            items={panXmlItem}
            title=""
            showAlert={showAlert}
            isXML={true}
            setDocumentStateData={setDocumentStateData}
            loanAppId={loanAppId}
            sectionName={sectionName}
            data={{ company_id: companyID, product_id: productID }}
            MSMECompanyId={MSMECompanyId}
            MSMEProductId={MSMEProductId}
            isChange={props.type && props.type == "edit" && !sectionStatus.includes(statusObject?.section_status)}
            // shouldDelete={true}
            type={props.type}
          />
        </div>): null}
      </div>

      {/* 
            <div>
                {renderFields("KYC Document PAN")}
            </div> */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          columnGap: "2%",
          marginTop: "34px"
        }}
      >
        <p
          style={{
            color: "var(--neutrals-neutral-60, #767888)",
            fontFamily: "Montserrat-Regular",
            fontSize: "16px",
            fontWeight: "500"
          }}
        >
          Select Aadhaar Document Type
        </p>
        <label
          style={{
            ...radioCss,
            color:
              panButtonState === "icon"
                ? "var(--neutrals-neutral-100, #161719)"
                : "#C0C1C8"
          }}
        >
          <input
            type="checkbox"
            value="Image & PDF"
            checked={selectedAadhaarFileType["Image & PDF"]}
            style={radioInputCss}
            onChange={handleAadhaarRadioButton}
            disabled={props.type == "view"}
          />
          Image & PDF
        </label>
        <label
          style={{
            ...radioCss,
            color:
              panButtonState === "icon"
                ? "var(--neutrals-neutral-100, #161719)"
                : "#C0C1C8"
          }}
        >
          <input
            type="checkbox"
            value="Validation Doc"
            checked={selectedAadhaarFileType["Validation Doc"]}
            onChange={handleAadhaarRadioButton}
            style={radioInputCss}
            disabled={props.type == "view" ? true : panButtonState === "icon" ? false : true}
          />
          Response XML / JSON
        </label>
      </div>
      {/* <div>
                {renderFields("KYC Document Aadhaar")}
            </div> */}
      <div style={{ marginTop: "-20px",display:"flex" }}>
      {selectedAadhaarFileType["Image & PDF"] ? (
        <div style={{marginRight:'2rem'}}>
          <UploadFileInput
            backgroundColorChange={true}
            backgroundColorBlur={
              statusObject?.section_status == "approved" ? true : props.type && (props.type == "view" || props.type === "edit") ? false : backgroundColorBlur
            }
            items={aadharItem}
            title=""
            showAlert={showAlert}
            isXML={false}
            loanAppId={loanAppId}
            setDocumentStateData={setDocumentStateData}
            sectionName={sectionName}
            data={{ company_id: companyID, product_id: productID }}
            MSMECompanyId={MSMECompanyId}
            MSMEProductId={MSMEProductId}
            isChange={props.type && props.type == "edit" && !sectionStatus.includes(statusObject?.section_status)}
            // shouldDelete={true}
            type={props.type}
          />
        </div>
      ) : null}
      {selectedAadhaarFileType["Validation Doc"] ?(
        <div>
          <UploadFileInput
            backgroundColorChange={true}
            backgroundColorBlur={
              props.type && (props.type == "view" || props.type === "edit") ? false : backgroundColorBlur
            }
            items={aadharfrontXmlItem}
            title=""
            showAlert={showAlert}
            isXML={true}
            loanAppId={loanAppId}
            setDocumentStateData={setDocumentStateData}
            sectionName={sectionName}
            data={{ company_id: companyID, product_id: productID }}
            MSMECompanyId={MSMECompanyId}
            MSMEProductId={MSMEProductId}
            isChange={props.type && props.type == "edit" && !sectionStatus.includes(statusObject?.section_status)}
            // shouldDelete={true}
            type={props.type}
          />
        </div>
      ): null}
      </div>

      {props.type == "edit" || !applicantData || sectionStatusCheck === 'inProgress' ? (
        <div className="book-loan-button-container book-loan-button-alignment-single-button">
          <Button
            label="Verify & Next"
            onClick={handleSubmit}
            buttonType="primarys"
            isLoading={sectionStatusCheck === 'inProgress' ? true : false}
            customStyle={{
              display: "inline - flex",
              height: "48px",
              padding: "10px 24px",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px",
              color: "#FFF",
              fontFamily: "Montserrat-Regular",
              fontSize: "16px",
              fontWeight: "800",
              width: 'max-content',
              pointerEvents: !formComplete === true ? "none" : "auto",
              lineHeight: "150%",
              flexShrink: "0",
              borderRadius: "40px",
              background: formComplete
                ? "var(--primary-blue-button-gradient, linear-gradient(180deg, #134CDE 0%, #163FB7 100%, #163FB7 100%))"
                : "var(--neutrals-neutral-30, #CCCDD3)"
            }}
            customLoaderClass={{
              borderTop: '4px solid #fff',
            }}
          ></Button>
        </div>
      ) : null}
      {alert ? (
        <Alert
          severity={severity}
          message={alertMessage}
          handleClose={handleAlertClose}
        />
      ) : null}
    </div>
  );
}
