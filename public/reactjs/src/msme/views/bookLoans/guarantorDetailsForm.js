import * as React from 'react';
import { bookLoansFormJsonFields } from './bookLoansFormJson';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { storedList } from '../../../util/localstorage';
import InputBox from 'react-sdk/dist/components/InputBox/InputBox';
import Button from 'react-sdk/dist/components/Button';
import { validateData } from '../../../util/validation';
import BasicDatePicker from '../../../components/DatePicker/basicDatePicker';
import { verifyDateAfter1800 } from '../../../util/helper';
import 'react-sdk/dist/styles/_fonts.scss';
import { getStatesData, getPincodeData, States, Cities } from '../../../constants/country-state-city-data';
import moment from 'moment';

import UploadFileInput from '../../components/uploadFileInput/UploadFileInput';
import { patchMsmeDetailsWatcher, patchMsmeDocDeleteWatcher, putMsmeDraftSaverWatcher } from '../../actions/msme.action';
import Alert from 'react-sdk/dist/components/Alert/Alert';

import { GuarantorSelfie, Guarantor_PanTittle, AadharImage, Guarantor_PanInputTittleXML, Guarantor_AadharInputTittleXML } from './uploadKycData';
import { getBookLoanDetailsWatcher, getMsmeLoanDocumentsWatcher } from './../../actions/bookLoan.action';
import { guarantorDetailsMapping } from './bookLoanMapData';
import getSectionStatus from './GetLeadSectionStatus/GetLeadSectionStatus';
import { SectionData } from '../../config/sectionData';
import { getLeadStatusWatcher } from 'msme/actions/lead.action';
import { LeadNewStatus } from '../../config/LeadStatus';
import { LogViewer } from 'msme/components/LogViewer/LogViewer';
import getSubSectionRemarks from "./GetLeadSectionStatus/GetLeadSubSectionRemarks"

import {documentCode} from 'msme/config/docCode'
const user = { _id: storedList('user')?._id, id: storedList('user')?.id };
const sectionName = 'guarantors';
const BOOK_LOAN_FORM_JSON = bookLoansFormJsonFields();

const setDocumentView = (TitleOb, documents) => {
  return TitleOb.map((givenObj) => {
    const matchingObj = documents?.find((otherObj) => otherObj.code === (givenObj?.documentCode ? givenObj?.documentCode : ''));
    if (matchingObj) {
      return {
        ...givenObj,
        s3_url: matchingObj.file_url,
        doc: matchingObj,
      };
    } else {
      return givenObj;
    }
  });
};

const checkDocStatus = (data) => {
  for (let ob of data) {
    if (!ob?.s3_url && ob.isRequired) {
      return false;
    }
  }

  return true;
};

const sectionStatus = ['deviation', 'approved', 'rejected', 'failed'];

const fetchObjectFieldsByDept = (deptName) => {
  const matchingObjects = [];
  for (let object of BOOK_LOAN_FORM_JSON) {
    if (object.dept === deptName) {
      matchingObjects.push(object.field);
    }
  }

  return matchingObjects; // Return the array of matching objects
};

const disabledFields = {
  view: [...fetchObjectFieldsByDept('Guarantor Details'), ...fetchObjectFieldsByDept('Guarantor Current Address'), ...fetchObjectFieldsByDept('Guarantor Permanent Address'), ...fetchObjectFieldsByDept('Guarantor KYC'), ...fetchObjectFieldsByDept('Guarantor Aadhar Details'), ...fetchObjectFieldsByDept('Guarantor PAN Details'), ...fetchObjectFieldsByDept('Guarantor KYC Documents')],
  edit: [],
};

export default function GuarantorForm(props) {
  const [index, setIndex] = useState(1);
  const { item, navIconPrefixState, setNavIconPrefixState, setNavState, guarantorsData, setGuarantorsData, guarantorArray, setGuarantorArray, GuarantorCount, setGuarantorCount, guarantorStatus, setGuarantorStatus, loanAppId, MSMECompanyId, MSMEProductId, leadStatus, setLeadStatus, showShareHolding, documents, loanDetailsSubsectionStatus, setShouldFetch, loanSectionObject, setLoanSectionObject, setShouldFetchDocument } = props;
  const [guarantorIndex, setGuarantorIndex] = useState(parseInt(item[item.length - 1]));
  const dispatch = useDispatch();
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const store = useSelector((state) => state);
  const [viewPerAddress, setViewPerAddress] = useState(guarantorsData[guarantorIndex - 1] && guarantorsData[guarantorIndex - 1]['address_same'] ? false : true);
  const [stateData, setStateData] = useState(guarantorsData[guarantorIndex - 1]);
  const [backgroundColorBlur, setBackgroundColorBlur] = useState(true);
  const [validationData, setValidationData] = useState({});
  const [panButtonState, setPanButtonState] = useState('button');
  const [selectedPANFileType, setSelectedPANFileType] = useState({'Image & PDF':true,'Response XML/JSON':false});
  const [selectedAadharFileType, setAadharFileType] = useState({'Image & PDF':true,'Response XML/JSON':false});
  const [states, setStatesState] = useState(States);
  const [currCity, setCurrCityState] = useState([]);
  const [perCity, setPerCityState] = useState([]);
  const [panBorder, setPanBorder] = useState('border: 1px solid #BBBFCC');
  const [sectionStatusCheck, setSectionStatusCheck] = useState('');
  const [addGuarantorLoader, setAddGuarantorLoader] = useState('');
  const [validForm, setValidForm] = useState(true);
  const [panVerify, setPanVerify] = useState(false);
  const [statusObject, setStatusObject] = useState('');
  const [disableDraftButton, setDisableDraftButton] = useState(false);
  const [isLeadRejected,setIsLeadRejected] = useState(false);
  const [documentStateData, setDocumentStateData] = useState({
    Applicant_Selfie_1: false,
    Pan_1: false,
    Pan_XML: false,
    Aadhar_XML: false,
    Aadhar_Front_1: false,
    Aadhar_Back_1: false,
    aadhar_front: false,
    Aadhar_back: false,
  });

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
      setShouldFetchDocument(prev=>prev+1);
    })
    .catch (error => {
      showAlert('Error deleting file', 'error');
    })
  };

  const handlePANRadioButton = (event) => {
    if(event.target.value == 'Image & PDF' && selectedPANFileType['Image & PDF'] 
    && !selectedPANFileType['Response XML/JSON']) return;
    else if(event.target.value == 'Response XML/JSON' && !selectedPANFileType['Image & PDF'] 
    && selectedPANFileType['Response XML/JSON']) return;
    if(selectedPANFileType[event.target.value]){
      setSelectedPANFileType((prevState)=>({
        ...prevState,
        [`${event.target.value}`]: false
      }))
    }else{
      setSelectedPANFileType((prevState)=>({
        ...prevState,
        [`${event.target.value}`]: true
      }))
    }

    if(event.target.value === 'Response XML/JSON' && documentStateData.Pan_XML){
      deleteFile([documentCode.guar_pan_XML])
      setDocumentStateData({...documentStateData, Pan_XML:false});
    }else if(event.target.value === "Image & PDF" && documentStateData.Pan_1){
      deleteFile([documentCode.guar_pan]);
      setDocumentStateData({...documentStateData, Pan_1:false});
    }
  };

  const handleAadharRadioButton = (event) => {
    if(event.target.value == 'Image & PDF' && selectedAadharFileType['Image & PDF'] 
    && !selectedAadharFileType['Response XML/JSON']) return;
    else if(event.target.value == 'Response XML/JSON' && !selectedAadharFileType['Image & PDF'] 
    && selectedAadharFileType['Response XML/JSON']) return;
    if(selectedAadharFileType[event.target.value]){
      setAadharFileType((prevState)=>({
        ...prevState,
        [`${event.target.value}`]: false
      }))
    }else{
      setAadharFileType((prevState)=>({
        ...prevState,
        [`${event.target.value}`]: true
      }))
    }

    if(event.target.value === "Response XML/JSON" && (documentStateData.Aadhar_XML)){
      deleteFile([documentCode.guar_aadhaar_XML]);
      setDocumentStateData({...documentStateData, Aadhar_XML:false});
    }else if(event.target.value === "Image & PDF" && (documentStateData.Aadhar_Front_1 || documentStateData.Aadhar_back)){
      deleteFile([documentCode.guar_aadhaar_front, documentCode.guar_aadhaar_back]);
      setDocumentStateData({...documentStateData, Aadhar_Front_1:false, Aadhar_Back_1:false, aadhar_front:false, Aadhar_back:false});
    }

  };
  const uploadFileName = 'guarantor_details';

  let intervalId;

  let code = 399 + parseInt(item[item.length - 1]);

  const [guarantorSelfieState, setGuarantorSelfieState] = useState(GuarantorSelfie);
  const [guarantorPanState, setGuarantorPanState] = useState(Guarantor_PanTittle);
  const [guarantorPanXMLState, setGuarantorPanXMLState] = useState(Guarantor_PanInputTittleXML);
  const [guarantorAadharState, setGuarantorAadharState] = useState(AadharImage);
  const [guarantorAadharXMLState, setGuarantorAadharXMLState] = useState(Guarantor_AadharInputTittleXML);

  useEffect(() => {

    if (loanDetailsSubsectionStatus && loanDetailsSubsectionStatus[code]) {
      if (loanDetailsSubsectionStatus[code]['guarantor_pan'] == 'approved') {
        setBackgroundColorBlur(false);
        setPanButtonState('icon');
        fetchLoanDetails(0);
        setPanBorder('1px solid green');
        setPanVerify(true);
      }
    }
    if(props.loanDetailsStatus &&  props.loanDetailsStatus[`guarantor_details_${parseInt(item[item.length - 1])}`]=="rejected"){
      setIsLeadRejected(true);
    }
  }, [loanDetailsSubsectionStatus, statusObject]);

  const radioCss = {
    color: 'var(--neutrals-neutral-100, #161719)',
    fontFamily: 'Montserrat-Regular',
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '20px',
    marginTop: '1%',
  };

  const radioInputCss = {
    accentColor: '#134CDE',
    marginRight: '8px',
    marginBottom: '4px',
    height: '20px',
    width: '20px',
    verticalAlign: 'middle',
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

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity('');
    setAlertMessage('');
  };

  const showAlert = (msg, type) => {
    const element = document.getElementById('TopNavBar');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    }
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  const checkCityAndState = (section) => {
    let currArr;
    let perArr;
    if (section == 'city') {
      currArr = currCity;
      perArr = perCity;
    } else {
      currArr = States;
      perArr = States;
    }

    let isCurrCityValid = false;
    let isPerCityValid = false;
    if (!viewPerAddress) {
      if (stateData[`string_vl_gua_${section}`]) {
        currArr.map((item, idx) => {
          if (item.label == stateData[`string_vl_gua_${section}`]) {
            isCurrCityValid = true;
          }
        });
      }
      if (!isCurrCityValid) {
        setValidationData((prevState) => ({
          ...prevState,
          [`string_vl_gua_${section}State`]: 'has-danger',
        }));
      }
      return isCurrCityValid;
    } else {
      if (stateData[`string_vl_gua_${section}`]) {
        currArr.map((item, idx) => {
          if (item.label == stateData[`string_vl_gua_${section}`]) {
            isCurrCityValid = true;
          }
        });
        if (!isCurrCityValid) {
          setValidationData((prevState) => ({
            ...prevState,
            [`string_vl_gua_${section}State`]: 'has-danger',
          }));
          return isCurrCityValid;
        }
      }
      if (stateData[`string_vl_gua_per_${section}`]) {
        perArr.map((item, idx) => {
          if (item.label == stateData[`string_vl_gua_per_${section}`]) {
            isPerCityValid = true;
          }
        });
        if (!isPerCityValid) {
          setValidationData((prevState) => ({
            ...prevState,
            [`string_vl_gua_per_${section}State`]: 'has-danger',
          }));
        }
        return isCurrCityValid && isPerCityValid;
      }
    }
    return false;
  };

  const handleGuarantorArray = () => {
    let temp = [...guarantorArray];
    for (let i = 1; i <= GuarantorCount; i++) {
      if (i > guarantorArray.length) {
        temp.push(`Guarantor ${i}`);
      }
    }
    setGuarantorArray(temp);
  };

  const InputBoxStyle = {
    marginTop: '8px',
    maxHeight: '500px',
    zIndex: 1,
    width: '105%',
  };

  const CustomHeaderStyle = {
    fontFamily: 'Montserrat-Bold',
    marginLeft: '2%',
    marginTop: '30px',
    color: '#161719',
    fontSize: '1.3vw',
    marginBottom: '20px',
  };

  const CustomTitleStyle = {
    fontFamily: 'Montserrat-Bold',
    marginLeft: '2%',
    color: '#161719',
    fontSize: '1.3vw',
    marginBottom: '20px',
  };

  const customSubHeaderStyle = {
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: '2%',
    marginTop: '30px',
    color: '#161719',
    fontSize: '1.2vw',
    marginRight: '1%',
    marginBottom: '15px',
  };

  const CustomHeader = {
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: '2%',
    marginTop: '1%',
    color: '#161719',
    fontSize: '1.0vw',
    marginRight: '1%',
    color: '#767888',
  };

  const customButtonStyle = {
    fontSize: '16px',
    color: '#134CDE',
    border: '1px solid #134CDE',
    marginLeft: '2%',
    width: '20vw',
    paddingLeft: '1%',
    paddingRight: '1%',
    borderRadius: '32px',
  };
  const customSaveButton = {
    fontSize: '16px',
    color: '#134CDE',
    border: '1px solid #134CDE',
    width: '156px',
    height: '48px',
    paddingLeft: '1%',
    paddingRight: '1%',
    borderRadius: '32px',
  };

  useEffect(() => {
    if (stateData?.borrower_id && documents) {
      getLoanDocuments();
    }
  }, [documents]);

  useEffect(() => {
    getLeadStatus();

  }, [loanSectionObject, guarantorIndex]);

  const getLoanDocuments = () => {
    const borrowerId = stateData?.borrower_id;
    const response = documents.filter(item => item.borrower_id == borrowerId);
    let stateDoc = {
      Applicant_Selfie_1: false,
      Pan_1: false,
      Pan_XML: false,
      Aadhar_XML:false,
      Aadhar_Front_1: false,
      Aadhar_Back_1: false,
      aadhar_front: false,
      Aadhar_back: false,
    };

    let data = setDocumentView(GuarantorSelfie, response);
    setGuarantorSelfieState(data);
    stateDoc['Applicant_Selfie_1'] = checkDocStatus(data);

    data = setDocumentView(Guarantor_PanTittle, response);
    setGuarantorPanState(data);
    stateDoc['Pan_1'] = checkDocStatus(data);

    data = setDocumentView(Guarantor_PanInputTittleXML, response);
    setGuarantorPanXMLState(data);
    stateDoc['Pan_XML'] = checkDocStatus(data);

    data = setDocumentView(AadharImage, response);
    setGuarantorAadharState(data);
    stateDoc['Aadhar_Front_1'] = checkDocStatus(data);
    stateDoc['aadhar_front'] = checkDocStatus(data);

    data = setDocumentView(Guarantor_AadharInputTittleXML, response);
    setGuarantorAadharXMLState(data);
    stateDoc['Aadhar_XML'] = checkDocStatus(data);
    stateDoc['aadhar_front'] = checkDocStatus(data) || stateDoc['aadhar_front'];

    for (let obj of response) {
      if (obj.code == '203') {
        setSelectedPANFileType((prevState)=> ({
          ...prevState,
          ['Response XML/JSON']:true
        }));
      }
      if (obj.code == '204') {
        setAadharFileType((prevState)=> ({
          ...prevState,
          ['Response XML/JSON']:true
        }));
      }
    }

    setDocumentStateData(stateDoc);
  };

  const getLeadStatus = () => {
    if (loanSectionObject && loanSectionObject[`guarantor_details_${guarantorIndex}`]) {
      setStatusObject(loanSectionObject[`guarantor_details_${guarantorIndex}`]);
    }
  };

  const handleGetCurrCities = async (value, name) => {
    setCurrCityState(Cities(value));
  };

  const handleGetPerCities = async (value, name) => {
    setPerCityState(Cities(value));
  };

  const change = (e, type, name) => {
    const buttonText = e.target?.textContent;
    const valued = buttonText;
    if (valued === 'Verify') {
      let formValidated = true;

      bookLoansFormJsonFields().map((item, idx) => {
        if ((item.dept == 'Guarantor Details' || item.dept == 'Gurantor Current Address' || item.dept == 'Guarantor Permanent Address' || item.field == 'gua_pan') && item.isOptional == false) {
          const field = `${item.type}_vl_${item.field}`;
          if (stateData[field]?.length > 0 && !validateData(field.substring(0, field.indexOf('_vl_')).toLowerCase(), stateData[field])) {
            setValidationData((prevState) => ({
              ...prevState,
              [`${field}State`]: 'has-danger',
            }));
            formValidated = false;
          }
          if (!stateData[field]) {
            setValidationData((prevState) => ({
              ...prevState,
              [`${field}State`]: 'has-danger',
            }));
            formValidated = false;
          }
        }
      });
      if (formValidated && checkCityAndState('city') && checkCityAndState('state')) {
        patchCall();
      } else {
        showAlert('Kindly check for errors in fields', 'error');
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      }
    } else {
      let value = e.value;
      if (name === 'gua_pan' || name === 'gua_mobile') {
        if (name == 'gua_pan') {
          value = e?.value?.toUpperCase();
        }
        if (value?.length >= 10) {
          value = value.substring(0, 10);
        }
      } else if (name === 'gua_aadhaar') {
        if (value?.length >= 12) {
          value = value.substring(0, 12);
        }
        if (value && (value[value.length - 1] < '0' || value[value.length - 1] > '9')) {
          value = value.substring(0, value.length - 1);
        }
      } else if (name === 'gua_pincode' || name === 'gua_per_pincode') {
        if (value?.length >= 6) {
          value = value.substring(0, 6);
        }
      } else if (name === "gua_resi_addr_ln1" || name === "gua_per_addr_ln1") {
        if (value?.length >= 40) {
          value = value.substring(0, 40);
        }
      }
      const field = `${type}_vl_${name}`;
      let isValid = validateData(field.substring(0, field.indexOf('_vl_')).toLowerCase(), value);
      if (field.indexOf('curr') != -1 && !viewPerAddress) {
        const perField = field.replace('curr', 'per');
        let isValidData = validateData(perField.substring(0, perField.indexOf('_vl_')).toLowerCase(), value);
        setStateData((prevState) => ({
          ...prevState,
          [perField]: value,
        }));
        setValidationData((prevState) => ({
          ...prevState,
          [`${perField}State`]: !isValidData ? 'has-danger' : '',
        }));
      }
      setStateData((prevState) => ({
        ...prevState,
        [field]: value,
      }));
      setValidationData((prevState) => ({
        ...prevState,
        [`${field}State`]: !isValid ? 'has-danger' : '',
      }));
    }
    let addrfield = `${type}_vl_${name}`;
    if ((addrfield.indexOf('resi') != -1 || addrfield == 'string_vl_gua_city' || addrfield == 'string_vl_gua_state' || addrfield == 'pincode_vl_gua_pincode') && !viewPerAddress) {
      let perField;
      if (addrfield == 'string_vl_gua_city') {
        perField = `string_vl_gua_per_city`;
      } else if (addrfield == 'string_vl_gua_state') {
        perField = `string_vl_gua_per_state`;
      } else if (addrfield == 'pincode_vl_gua_pincode') {
        perField = `pincode_vl_gua_per_pincode`;
      } else {
        perField = field.replace('resi', 'per');
      }
      let isValidData = validateData(perField.substring(0, perField.indexOf('_vl_')).toLowerCase(), e.value);
      setStateData((prevState) => ({
        ...prevState,
        [perField]: e.value,
      }));
      setValidationData((prevState) => ({
        ...prevState,
        [`${perField}State`]: !isValidData ? 'has-danger' : '',
      }));
    }
    if (name === 'gua_state') {
      handleGetCurrCities(e, name);
      if (stateData.string_vl_gua_city) {
        setStateData((prevState) => ({
          ...prevState,
          [`string_vl_gua_city`]: '',
        }));
      }
    }
    if (name === 'gua_per_state') {
      handleGetPerCities(e, name);
      if (stateData.string_vl_gua_per_city) {
        setStateData((prevState) => ({
          ...prevState,
          [`string_vl_gua_per_city`]: '',
        }));
      }
    }
  };

  const setStatusCheckApi = async (loanAppID, sectionCode, subSectionCode, dispatch, addGuarantor) => {
    intervalId = setInterval(async () => {
      try {
        const status = await getSectionStatus(loanAppID, user, MSMECompanyId, MSMEProductId, sectionCode, subSectionCode, dispatch, false, code);
        let subSectionRemarks = await getSubSectionRemarks(
          loanAppID,
          user,
          MSMECompanyId,
          MSMEProductId,
          sectionCode,
          subSectionCode,
          dispatch
        );
        if (status == 'approved') {
          if (subSectionCode == 'guarantor_pan') {
            setBackgroundColorBlur(false);
            setPanButtonState('icon');
            showAlert('PAN verified successfully', 'success');
            fetchLoanDetails(0);
            setPanBorder('1px solid green');
            setPanVerify(true);
          } else {
            let statusObj = { ...loanSectionObject[`guarantor_details_${guarantorIndex}`] }
            statusObj.section_status = "approved";
            setLoanSectionObject((prevState) => ({
              ...prevState,
              [`guarantor_details_${guarantorIndex}`]: statusObj
            }))
            if (addGuarantor == 1) {
              setGuarantorCount(GuarantorCount + 1);
              setAddGuarantorLoader('completed');
              setShouldFetchDocument(prev=>prev+1);
              handleGuarrantorDraft(true);
            } else {
              setNavIconPrefixState((prevState) => ({
                ...prevState,
                'Guarantor Details': 'success',
              }));
              if (showShareHolding) {
                setNavState('Shareholding');
              } else {
                // setNavState('Financial Docs');
                setTimeout(() => {
                  if (props?.setShouldFetch) {
                    setShouldFetch((prev) => prev + 1)
                  }
                }, 1000)
              }
              setSectionStatusCheck('completed');
            }
            showAlert('Guarantor details added successfully', 'success');
          }
          clearInterval(intervalId);
        } else if (status == 'deviation') {
          if (subSectionCode == 'guarantor_pan') {
            setBackgroundColorBlur(false);
            setPanButtonState('icon');
            showAlert('There is deviation in PAN validation, but you can still proceed further.', 'info');
            fetchLoanDetails(0);
            setPanBorder('1px solid yellow');
            setPanVerify(true);
          } else {
            let statusObj = { ...loanSectionObject[`guarantor_details_${guarantorIndex}`] }
            statusObj.section_status = "deviation";
            setLoanSectionObject((prevState) => ({
              ...prevState,
              [`guarantor_details_${guarantorIndex}`]: statusObj
            }))
            if (addGuarantor == 1) {
              setGuarantorCount(GuarantorCount + 1);
              setAddGuarantorLoader('completed');
              setShouldFetchDocument(prev=>prev+1)
            } else {
              setNavIconPrefixState((prevState) => ({
                ...prevState,
                'Guarantor Details': 'deviation',
              }));
              if (showShareHolding) {
                setNavState('Shareholding');
              } else {
                // setNavState('Financial Docs');
                setTimeout(() => {
                  if (props?.setShouldFetch) {
                    setShouldFetch((prev) => prev + 1)
                  }
                }, 1000)
              }
              setSectionStatusCheck('completed');
            }
            showAlert('Guarantor details added successfully', 'success');
          }
          clearInterval(intervalId);
        } else if (status == 'rejected') {
          if (subSectionCode == 'guarantor_pan') {
            setPanVerify(false);
            setPanButtonState('button');
            setBackgroundColorBlur(true);
            fetchLoanDetails(0);
            showAlert(subSectionRemarks, 'error');
          } else {
            showAlert(subSectionRemarks, 'error');
            setSectionStatusCheck('');
            setAddGuarantorLoader('');
            setIsLeadRejected(true);
          }
          clearInterval(intervalId);
        }
      } catch (error) {
        showAlert('Technical error, please try again.', 'error');
        clearInterval(intervalId);
      }
    }, 10000);
  };

  const patchCall = () => {
    const bookLoanPayload = {
      user_id: user._id,
      companyId: MSMECompanyId,
      productId: MSMEProductId,
      loan_app_id: loanAppId,
      user: JSON.stringify(user),
    };

    new Promise((resolve, reject) => {
      dispatch(getBookLoanDetailsWatcher(bookLoanPayload, resolve, reject));
    })
      .then((response) => {
        let id = -1;

        if (response?.guarantor_details.length == parseInt(item[item.length - 1])) {
          id = response?.guarantor_details[parseInt(item[item.length - 1]) - 1]?._id ?? -1;
        }

        const payload = {
          loan_app_id: loanAppId,
          section: 'guarantors',
          address_same: viewPerAddress ? 0 : 1,
          msme_company_id: MSMECompanyId,
          msme_product_id: MSMEProductId,
          user_id: user._id,
          gua_fname: stateData[`string_vl_gua_fname`],
          gua_mname: stateData[`string_vl_gua_mname`] ?? ' ',
          gua_lname: stateData[`string_vl_gua_lname`],
          gua_father_name: stateData[`string_vl_gua_father_name`],
          gua_mobile: stateData[`mobile_vl_gua_mobile`],
          gua_email: stateData['email_vl_guarantor_email'],
          gua_father_mname: 'Achhaibar',
          gua_father_lname: 'Dubey',
          gua_resi_addr_ln1: stateData[`string_vl_gua_resi_addr_ln1`],
          gua_resi_addr_ln2: stateData[`string_vl_gua_resi_addr_ln2`] ?? ' ',
          gua_city: stateData[`string_vl_gua_city`],
          gua_state: stateData[`string_vl_gua_state`],
          gua_pincode: stateData[`pincode_vl_gua_pincode`],
          gua_per_addr_ln1: stateData[`string_vl_gua_per_addr_ln1`],
          gua_per_addr_ln2: stateData[`string_vl_gua_per_addr_ln2`] ?? ' ',
          gua_per_city: stateData[`string_vl_gua_per_city`],
          gua_per_state: stateData[`string_vl_gua_per_state`],
          gua_per_pincode: stateData[`pincode_vl_gua_per_pincode`],
          gua_pan: stateData[`pan_vl_gua_pan`],
          gua_aadhaar: stateData[`aadhaar_vl_gua_aadhaar`],
          gua_age: stateData[`number_vl_gua_age`],
          gua_dob: stateData[`date_vl_gua_dob`],
          gua_gender: stateData[`string_vl_gua_gender`],
          gua_relation_entity: ' ',
          gua_monthly_income: ' ',
          gua_is_guar: ' ',
          section_code: SectionData.guarantor.section_code,
          sub_section_code: SectionData.guarantor.guarantor_pan.sub_section_code,
          section_sequence_no: SectionData.guarantor.section_sequence_no,
          section_name: SectionData.guarantor.section_name,
          sub_section_name: SectionData.guarantor.guarantor_pan.sub_section_name,
          sub_section_sequence_no: SectionData.guarantor.guarantor_pan.sub_section_sequence_no,
        };
        if (id && id !== -1) {
          payload._id = id;
        } else if (stateData[`_id`]) {
          payload._id = stateData[`_id`];
        }
        dispatch(
          patchMsmeDetailsWatcher(
            payload,
            async (result) => {
              setPanButtonState('loader');
              setStatusCheckApi(loanAppId, SectionData.guarantor.section_code, SectionData.guarantor.guarantor_pan.sub_section_code, dispatch, 0);
            },
            (error) => {
              showAlert('Error while adding details', 'error');
            },
          ),
        );
      })
      .catch((error) => { });
  };

  const customValidateButton = {
    display: 'inline - flex',
    height: '48px',
    width: 'max-content',
    padding: '10px 24px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    color: '#FFF',
    fontFamily: 'Montserrat-Regular',
    fontSize: '16px',
    fontWeight: '800',
    lineHeight: '150%',
    flexShrink: '0',
    borderRadius: '40px',
    background:
      statusObject?.section_status === LeadNewStatus.InProgress && leadStatus === LeadNewStatus.Pending ? 'var(--primary-blue-button-gradient, linear-gradient(180deg, #134CDE 0%, #163FB7 100%, #163FB7 100%))' : validForm && documentStateData.Applicant_Selfie_1 && (documentStateData.aadhar_front || documentStateData.Aadhar_Front_1 || documentStateData.Aadhar_XML) && (documentStateData.Pan_1 || documentStateData.Pan_XML) ? 'var(--primary-blue-button-gradient, linear-gradient(180deg, #134CDE 0%, #163FB7 100%, #163FB7 100%))' : 'var(--neutrals-neutral-30, #CCCDD3)',
  };

  const handlePermanentAddress = () => {
    setViewPerAddress(!viewPerAddress);
  };

  const handleGuarantorNumber = () => {
    let postData = {};
    let formValidated = true;

    bookLoansFormJsonFields().map((item, idx) => {
      if (item.field == 'gua_aadhaar' && item.isOptional == false) {
        const field = `${item.type}_vl_${item.field}`;
        if (stateData[field]?.length > 0 && !validateData(field.substring(0, field.indexOf('_vl_')).toLowerCase(), stateData[field])) {
          setValidationData((prevState) => ({
            ...prevState,
            [`${field}State`]: 'has-danger',
          }));
          formValidated = false;
        }
        if (!stateData[field]) {
          setValidationData((prevState) => ({
            ...prevState,
            [`${field}State`]: 'has-danger',
          }));
          formValidated = false;
        }
      }
    });
    if (formValidated && documentStateData.Applicant_Selfie_1 && (documentStateData.aadhar_front || documentStateData.Aadhar_Front_1 || documentStateData.Aadhar_XML) && (documentStateData.Pan_1 || documentStateData.Pan_XML)) {
      const payload = {
        loan_app_id: loanAppId,
        section: 'guarantors',
        msme_company_id: MSMECompanyId,
        msme_product_id: MSMEProductId,
        user_id: user._id,
        gua_fname: stateData[`string_vl_gua_fname`],
        gua_mname: stateData[`string_vl_gua_mname`] ?? ' ',
        gua_lname: stateData[`string_vl_gua_lname`],
        gua_email: stateData['email_vl_guarantor_email'],
        gua_father_name: stateData[`string_vl_gua_father_name`],
        gua_mobile: stateData[`mobile_vl_gua_mobile`],
        gua_resi_addr_ln1: stateData[`string_vl_gua_resi_addr_ln1`],
        gua_resi_addr_ln2: stateData[`string_vl_gua_resi_addr_ln2`] ?? ' ',
        gua_city: stateData[`string_vl_gua_city`],
        gua_state: stateData[`string_vl_gua_state`],
        gua_pincode: stateData[`pincode_vl_gua_pincode`],
        gua_per_addr_ln1: stateData[`string_vl_gua_per_addr_ln1`],
        gua_per_addr_ln2: stateData[`string_vl_gua_per_addr_ln2`] ?? ' ',
        gua_per_city: stateData[`string_vl_gua_per_city`],
        gua_per_state: stateData[`string_vl_gua_per_state`],
        gua_per_pincode: stateData[`pincode_vl_gua_per_pincode`],
        gua_pan: stateData[`pan_vl_gua_pan`],
        gua_aadhaar: stateData[`aadhaar_vl_gua_aadhaar`],
        gua_age: stateData[`number_vl_gua_age`],
        gua_dob: stateData[`date_vl_gua_dob`],
        gua_gender: stateData[`string_vl_gua_gender`],
        _id: stateData[`_id`],
        section_code: SectionData.guarantor.section_code,
        sub_section_code: SectionData.guarantor.guarantor_section_submit.sub_section_code,
        section_sequence_no: SectionData.guarantor.section_sequence_no,
        section_name: SectionData.guarantor.section_name,
        sub_section_name: SectionData.guarantor.guarantor_section_submit.sub_section_name,
        sub_section_sequence_no: SectionData.guarantor.guarantor_section_submit.sub_section_sequence_no,
      };
      setAddGuarantorLoader('inProgress');
      dispatch(
        patchMsmeDetailsWatcher(
          payload,
          async (result) => {
            setStatusCheckApi(loanAppId, SectionData.guarantor.section_code, SectionData.guarantor.guarantor_section_submit.sub_section_code, dispatch, 1);
          },
          (error) => {
            showAlert(error?.response?.data?.message, 'error');
          },
        ),
      );
    } else {
      showAlert('Kindly check for errors in fields', 'error');
    }
  };

  useEffect(() => {
    let data = {
      ...stateData,
    };
    if (stateData && stateData['date_vl_gua_dob']) {
      data = {
        ...data,
        number_vl_gua_age: handleAge(),
      };
    }

    setStateData({ ...stateData, ...guarantorsData[guarantorIndex - 1] });
    if (guarantorStatus[guarantorIndex - 1]) {
      setBackgroundColorBlur(true);
    }
  }, [guarantorStatus]);

  useEffect(() => {
    let vlForm = 1;
    bookLoansFormJsonFields().map((item, idx) => {
      if (item.field != 'gua_age' && item.field != 'gua_father_name' && (item.dept == 'Guarantor Details' || item.dept == 'Guarantor Current Address' || item.dept == 'Guarantor Permanent Address' || item.dept == 'Guarantor KYC')) {
        if (item.isOptional == false) {
          if (!stateData) {
            vlForm = 0;
          }
          if (stateData && !stateData[`${item.type}_vl_${item.field}`]) {
            vlForm = 0;
          }
        }
      }
    });
    if (vlForm) {
      setValidForm(true);
    } else {
      setValidForm(false);
    }
    const guaData = [...guarantorsData];
    guaData[guarantorIndex - 1] = stateData;
    setGuarantorsData(guaData);
    if (stateData && stateData['string_vl_gua_state']) {
      const stateInfoObject = states.filter(item => item.name === stateData['string_vl_gua_state'])
      handleGetCurrCities(stateInfoObject[0], "");
    }
    if (stateData && stateData['string_vl_gua_per_state']) {
      const stateInfoObject = states.filter(item => item.name === stateData['string_vl_gua_per_state'])
      handleGetPerCities(stateInfoObject[0], "");
    }
  }, [stateData]);

  useEffect(() => {
    if (stateData && stateData['date_vl_gua_dob']) {
      handleAge();
    }
  }, [stateData?.date_vl_gua_dob]);

  const customDropdownStyle = {
    marginTop: '8px',
    zIndex: '1',
    width: '105.1%',
  };
  useEffect(() => {
    handleGuarantorArray();
    if (guarantorIndex == 1) {
      fetchLoanDetails(1);
    }
  }, [GuarantorCount]);

  useEffect(() => {
    if (!viewPerAddress) {
      bookLoansFormJsonFields().map((item, idx) => {
        if (item.dept == 'Guarantor Permanent Address') {
          let addressField = `${item.type}_vl_${item.field}`;
          setStateData((prevState) => ({
            ...prevState,
            [addressField]: null,
          }));
          const str = item.field == 'gua_per_state' || item.field == 'gua_per_city' || item.field == 'gua_per_pincode' ? '' : 'resi_';
          let field = item.field.replace('per_', str);
          const value = stateData[`${item.type}_vl_${field}`];
          if (value) {
            let perField = `${item.type}_vl_${item.field}`;
            let isValid = validateData(perField.substring(0, perField.indexOf('_vl_')).toLowerCase(), value);
            setStateData((prevState) => ({
              ...prevState,
              [perField]: value,
            }));
            setValidationData((prevState) => ({
              ...prevState,
              [`${perField}State`]: !isValid ? 'has-danger' : '',
            }));
          }
        }
      });
    } else {
      if (!guarantorStatus[guarantorIndex - 1] && props.type !== 'edit' && props.type !== 'view') {
        bookLoansFormJsonFields().map((item, idx) => {
          if (item.dept == 'Guarantor Permanent Address') {
            let field = `${item.type}_vl_${item.field}`;
            setStateData((prevState) => ({
              ...prevState,
              [field]: null,
            }));
          }
        });
      }
    }
  }, [viewPerAddress]);

  const handleDeleteButton = () => {
    const payload = {
      loan_app_id: loanAppId,
      section: 'guarantors',
      msme_company_id: MSMECompanyId,
      msme_product_id: MSMEProductId,
      user_id: user._id,
      _id: stateData[`_id`],
      gua_pan: stateData[`pan_vl_gua_pan`],
      delete: true,
    };
    dispatch(
      patchMsmeDetailsWatcher(
        payload,
        async (result) => {
          showAlert('Guarantor Deleted Successfully', 'success');
          const guaData = [...guarantorsData];
          guaData.splice(guarantorIndex - 1, 1);
          guaData.push({});
          setGuarantorsData(guaData);
          if (GuarantorCount > 1) {
            const guaArr = [...guarantorArray];
            guaArr.splice(guarantorArray.length - 1, 1);
            setGuarantorArray(guaArr);
            setGuarantorCount(GuarantorCount - 1);
          }
          setPanVerify(false);
          const guaSt = [...guarantorStatus];
          guaSt.splice(guarantorIndex - 1, 1);
          guaSt.push(false);
          setGuarantorStatus(guaSt);
        },
        (error) => { },
      ),
    );
  };

  const handleAge = () => {
    const dob = stateData['date_vl_gua_dob'];
    const yyyyMmDdRegExp = /^\d{4}-\d{2}-\d{2}$/.test(dob);
    if (yyyyMmDdRegExp) {
      const age = calculateAge(dob.substring(5, 2), dob.substring(8, 2), dob.substring(0, 4));
      setStateData((prevState) => ({
        ...prevState,
        number_vl_gua_age: age,
      }));
      let field = `number_vl_gua_age`;
      let isValid = validateData(field.substring(0, field.indexOf('_vl_')).toLowerCase(), age);
      setValidationData((prevState) => ({
        ...prevState,
        [`${field}State`]: !isValid ? 'has-danger' : '',
      }));
      return age;
    } else {
      setStateData((prevState) => ({
        ...prevState,
        number_vl_gua_age: '',
      }));
      return ' ';
    }
  };

  const fetchLoanDetails = (addGua) => {
    let guaNumber = 0;
    const payload = {
      user_id: user._id,
      companyId: MSMECompanyId,
      productId: MSMEProductId,
      loan_app_id: loanAppId,
      user: JSON.stringify(user),
    };
    dispatch(
      getBookLoanDetailsWatcher(
        payload,
        async (res) => {
          let arr = [...guarantorsData];
          setLeadStatus(res.lead_status);
          if (res?.guarantor_details) {
            let statusArr = Array.from({ length: 2 }, () => false);
            guaNumber = res['guarantor_details'].length >= 2 ? 2 : res['guarantor_details'].length;
            for (let i = 0; i < (res['guarantor_details'].length >= 2 ? 2 : res['guarantor_details'].length); i++) {
              const result = res['guarantor_details'][i];
              bookLoansFormJsonFields().map((item, idx) => {
                if (item.dept == 'Guarantor Details' || item.dept === 'Guarantor Current Address' || item.dept === 'Guarantor Permanent Address' || item.dept === 'Guarantor KYC') {
                  if (result[`${item.field}`]) {
                    arr[i][`${item.type}_vl_${item.field}`] = result[`${item.field}`] ?? null;
                  } else if (result[`_id`]) {
                    addGua = 0;
                  }
                }
              });
              arr[i][`_id`] = result[`_id`];
              if (result[`borrower_id`]) {
                arr[i][`borrower_id`] = result[`borrower_id`];
              }
            }
            setGuarantorStatus(statusArr);
            setGuarantorsData(arr);
          }
        },
        (error) => { },
      ),
    );
  };

  const changeDateSelected = (value, name) => {
    const date = verifyDateAfter1800(moment(value).format('YYYY-MM-DD')) ? moment(value).format('YYYY-MM-DD') : value;
    const isValid = validateData(name.substring(0, name.indexOf('_vl_')).toLowerCase(), date);
    setStateData((prevState) => ({
      ...prevState,
      [name]: date,
    }));
    setValidationData((prevState) => ({
      ...prevState,
      [`${name}State`]: !isValid ? 'has-danger' : '',
    }));
  };
  const handleGuarrantorDraft = (firstDraft = false) => {
    const payloadtoFetch = {
      user_id: user._id,
      companyId: MSMECompanyId,
      productId: MSMEProductId,
      loan_app_id: loanAppId,
      user: JSON.stringify(user),
    };
    dispatch(
      getBookLoanDetailsWatcher(
        payloadtoFetch,
        async (response) => {
          let id;
          if (response?.guarantor_details[guarantorIndex - 1]?._id) {
            id = response?.guarantor_details[guarantorIndex - 1][`_id`];
          }
          else {
            id = -1;
          }

          if (id) {
            setDisableDraftButton(true);
            let data = {};
            if(firstDraft === true){
              data.section ='guarantors';
              data.sequence_no = 400 + guarantorIndex;
          }
            else{
            data = {
              section: 'guarantors',
              _id: ' ',
              gua_fname: stateData ? stateData[`string_vl_gua_fname`]: ' ',
              gua_mname: stateData ? stateData[`string_vl_gua_mname`] : ' ',
              gua_lname: stateData ? stateData[`string_vl_gua_lname`]: ' ',
              gua_father_name: stateData ? stateData[`string_vl_gua_father_name`]: ' ',
              gua_dob: stateData ? stateData[`date_vl_gua_dob`]: ' ',
              gua_gender: stateData ? stateData[`string_vl_gua_gender`]: ' ',
              gua_mobile: stateData ? stateData[`mobile_vl_gua_mobile`]: ' ',
              gua_email: stateData ? stateData[`email_vl_guarantor_email`]: ' ',
              gua_father_mname: null,
              gua_father_lname: null,
              gua_resi_addr_ln1: stateData ? stateData[`string_vl_gua_resi_addr_ln1`]: ' ',
              gua_resi_addr_ln2: stateData ? stateData[`string_vl_gua_resi_addr_ln2`] : ' ',
              gua_city: stateData ? stateData[`string_vl_gua_city`]: ' ',
              gua_state: stateData ? stateData[`string_vl_gua_state`]: ' ',
              gua_pincode: stateData ? stateData[`pincode_vl_gua_pincode`]: ' ',
              gua_per_addr_ln1: stateData ? stateData[`string_vl_gua_per_addr_ln1`]: ' ',
              gua_per_addr_ln2: stateData ? stateData[`string_vl_gua_per_addr_ln2`] : ' ',
              gua_per_city: stateData ? stateData[`string_vl_gua_per_city`]: ' ',
              gua_per_state: stateData ? stateData[`string_vl_gua_per_state`]: ' ',
              gua_per_pincode: stateData ? stateData[`pincode_vl_gua_per_pincode`]: ' ',
              gua_pan: stateData ? stateData[`pan_vl_gua_pan`]: ' ',
              gua_aadhaar: stateData ? stateData[`aadhaar_vl_gua_aadhaar`]: ' ',
            };
            if (id !== -1) {
              data._id = id;
            }
             }
            let bodyObject = Object.fromEntries(Object.entries(data).filter(([key, value]) => value !== null && value !== ' ' && value !== ''));
            const payload = {
              loan_app_id: loanAppId,
              tokenData: {
                user_id: user._id,
                product_id: MSMEProductId,
                company_id: MSMECompanyId,
              },
              bodyData: bodyObject,
            };
            new Promise((resolve, reject) => {
              dispatch(putMsmeDraftSaverWatcher(payload, resolve, reject));
            })
              .then((response) => {
                setDisableDraftButton(false);
                showAlert('Draft saved successfully', 'success');
              })
              .catch((error) => {
                showAlert(error?.message ?? 'Error while saving draft', 'error');
              });
          } else {
          }
        },
        (error) => { },
      ),
    );
  };

  const renderFields = (department) => {
    return (
      <>
        <div
          style={{
            display: 'grid',
            rowGap: '15px',
            gridTemplateColumns: '32.8% 32.8% 32.8%',
            columnGap: '1%',
            width: '98%',
            marginLeft: '1.7%',
          }}
        >
          {bookLoansFormJsonFields().map((item, idx) => {
            return (
              <>
                {item.dept == department ? (
                  item.field == 'gua_dob' ? (
                    <BasicDatePicker
                      disabled={(disabledFields[props.type] && disabledFields[props.type].includes(item.field)) || navIconPrefixState['Guarantor Details'] == 'success' || panVerify || guarantorStatus[guarantorIndex - 1] ? true : false}
                      format="dd-MM-yyyy"
                      placeholder={'Date of Birth'}
                      style={{ height: '56px' }}
                      value={stateData && stateData[`${item.type}_vl_${item.field}`] || null}
                      shouldDisableDate={(date) => {
                        const today = new Date();
                        const selectedDate = new Date(date);
                        const age = today.getFullYear() - selectedDate.getFullYear() - (today.getMonth() < selectedDate.getMonth() || (today.getMonth() === selectedDate.getMonth() && today.getDate() < selectedDate.getDate()) ? 1 : 0);
                        return age < 18;
                      }}
                      shouldDisableYear={(date) => {
                        const today = new Date();
                        const selectedDate = new Date(date);
                        const age = today.getFullYear() - selectedDate.getFullYear();
                        return age < 18;
                      }}
                      onDateChange={(date) => changeDateSelected(date, `${item.type}_vl_${item.field}`)}
                      error={item.checked.toLowerCase() === 'true' ? validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' : stateData && stateData[`${item.type}_vl_${item.field}`] !== '' && validationData[`${item.type}_vl_${item.field}State`] === 'has-danger'}
                      helperText={item.checked.toLowerCase() === 'true' ? (validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' ? item.validationMsg : '') : stateData && stateData[`${item.type}_vl_${item.field}`] !== '' && (validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' ? item.validationMsg : '')}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <InputBox
                        id={item.field}
                        label={item.title}
                        type={'text'}
                        isDrawdown={disabledFields[props.type] && item?.field && disabledFields[props.type].includes(item.field) ? false : navIconPrefixState['Guarantor Details'] == 'success' ? false : panVerify && item.field != 'gua_aadhaar' ? false : guarantorStatus[guarantorIndex - 1] || (department == 'Guarantor Permanent Address' && !viewPerAddress) || item.field == 'gua_age' ? false : item?.isDrawdown ? true : false}
                        initialValue={stateData ? stateData[`${item.type}_vl_${item.field}`] ?? '' : ''}
                        isDisabled={disabledFields[props.type] && item?.field && disabledFields[props.type].includes(item.field) ? true : navIconPrefixState['Guarantor Details'] == 'success' ? true : !panVerify && item.field == 'gua_aadhaar' ? true : panVerify && item.field != 'gua_aadhaar' ? true : guarantorStatus[guarantorIndex - 1] || (department == 'Guarantor Permanent Address' && !viewPerAddress) || item.field == 'gua_age' ? true : false}
                        onClick={(event) => change(event, item.type, item.field)}
                        customDropdownClass={InputBoxStyle}
                        customInputClass={{
                          minWidth: '100%',
                          marginTop: `${navIconPrefixState['Guarantor Details'] == 'success' ? '-3px' : panVerify && item.field != 'gua_aadhaar' ? '-3px' : guarantorStatus[guarantorIndex - 1] || (department == 'Guarantor Permanent Address' && !viewPerAddress) || item.field == 'gua_age' ? '-3px' : '0px'}`,
                        }}
                        error={item.checked.toLowerCase() === 'true' ? validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' : stateData && stateData[`${item.type}_vl_${item.field}`] !== '' && validationData[`${item.type}_vl_${item.field}State`] === 'has-danger'}
                        helperText={item.checked.toLowerCase() === 'true' ? (validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' ? item.validationMsg : '') : stateData && stateData[`${item.type}_vl_${item.field}`] !== '' && (validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' ? item.validationMsg : '')}
                        customClass={{
                          height: '56px',
                          width: '100%',
                          maxWidth: '100%',
                          border: `${item.field == 'gua_pan' ? panBorder : ''}`,
                        }}
                        options={item.isDrawdown ? (item.title === 'State' ? states : item.field === 'gua_city' ? currCity : item.field === 'gua_per_city' ? perCity : item.options) : []}
                        isBoxType={department === 'Guarantor PAN Details' || department === 'Guarantor Aadhar Details' || department === 'Guarantor KYC Documents' || item.field === 'gua_pan' || item.field === 'aadhaar_front_image_value' || item.field === 'aadhaar_back_image_value' || item.field === 'aadhaar_xml_image_value' ? panButtonState : ''}
                        Buttonlabel={guarantorStatus[guarantorIndex - 1] || props.type == 'view' ? '' : department === 'Guarantor PAN Details' || department === 'Guarantor Aadhar Details' || department === 'Guarantor KYC Documents' || item.field === 'aadhaar_front_image_value' || item.field === 'aadhaar_back_image_value' || item.field === 'aadhaar_xml_image_value' ? 'Upload' : item.field == 'gua_pan' ? 'Verify' : ''}
                      />
                      <p className="book-loan-helper-text">
                        {(selectedPANFileType['Response XML/JSON'] && department === 'Guarantor PAN Details') || (selectedAadharFileType['Response XML/JSON'] && department === 'Guarantor Aadhar Details') || item.field === 'aadhaar_xml_image_value'
                          ? ' XML or JSON upto 5MB'
                          : department === 'Guarantor KYC Documents' || department === 'Guarantor PAN Details' || department === 'Guarantor Aadhar Details' || item.field === 'aadhaar_back_image_value' || item.field === 'aadhaar_front_image_value'
                            ? ' JPG, JPEG, PNG, PDF upto 5MB'
                            : ''}
                      </p>
                    </div>
                  )
                ) : null}
              </>
            );
          })}
        </div>
      </>
    );
  };

  const handleAddData = () => {
    if(isLeadRejected){
      return showAlert(`Your lead has been rejected`,"error");
    }

    let postData = {};
    let formValidated = true;
    setSectionStatusCheck('inProgress');
    bookLoansFormJsonFields().map((item, idx) => {
      if (item.field == 'gua_aadhaar' && item.isOptional == false) {
        const field = `${item.type}_vl_${item.field}`;
        if (stateData[field]?.length > 0 && !validateData(field.substring(0, field.indexOf('_vl_')).toLowerCase(), stateData[field])) {
          setValidationData((prevState) => ({
            ...prevState,
            [`${field}State`]: 'has-danger',
          }));
          formValidated = false;
        }
        if (!stateData[field]) {
          setValidationData((prevState) => ({
            ...prevState,
            [`${field}State`]: 'has-danger',
          }));
          formValidated = false;
        }
      }
    });
    if (formValidated && documentStateData.Applicant_Selfie_1 && (documentStateData.aadhar_front || documentStateData.Aadhar_Front_1 || documentStateData.Aadhar_XML) && (documentStateData.Pan_1 || documentStateData.Pan_XML)) {
      const bookLoanPayload = {
        user_id: user._id,
        companyId: MSMECompanyId,
        productId: MSMEProductId,
        loan_app_id: loanAppId,
        user: JSON.stringify(user),
      };

      new Promise((resolve, reject) => {
        dispatch(getBookLoanDetailsWatcher(bookLoanPayload, resolve, reject));
      })
        .then((response) => {
          let id = -1;

          id = response?.guarantor_details[parseInt(item[item.length - 1]) - 1]?._id ?? -1;

          if (stateData['_id']) {
            id = stateData['_id'];
          }

          const payload = {
            loan_app_id: loanAppId,
            section: 'guarantors',
            msme_company_id: MSMECompanyId,
            msme_product_id: MSMEProductId,
            user_id: user._id,
            address_same: viewPerAddress ? 0 : 1,
            gua_fname: stateData[`string_vl_gua_fname`],
            gua_mname: stateData[`string_vl_gua_mname`] ?? ' ',
            gua_lname: stateData[`string_vl_gua_lname`],
            gua_father_name: stateData[`string_vl_gua_father_name`],
            gua_mobile: stateData[`mobile_vl_gua_mobile`],
            gua_email: stateData['email_vl_guarantor_email'],
            gua_father_mname: 'Achhaibar',
            gua_father_lname: 'Dubey',
            gua_resi_addr_ln1: stateData[`string_vl_gua_resi_addr_ln1`],
            gua_resi_addr_ln2: stateData[`string_vl_gua_resi_addr_ln2`] ?? ' ',
            gua_city: stateData[`string_vl_gua_city`],
            gua_state: stateData[`string_vl_gua_state`],
            gua_pincode: stateData[`pincode_vl_gua_pincode`],
            gua_per_addr_ln1: stateData[`string_vl_gua_per_addr_ln1`],
            gua_per_addr_ln2: stateData[`string_vl_gua_per_addr_ln2`] ?? ' ',
            gua_per_city: stateData[`string_vl_gua_per_city`],
            gua_per_state: stateData[`string_vl_gua_per_state`],
            gua_per_pincode: stateData[`pincode_vl_gua_per_pincode`],
            gua_pan: stateData[`pan_vl_gua_pan`],
            gua_aadhaar: stateData[`aadhaar_vl_gua_aadhaar`],
            gua_age: stateData[`number_vl_gua_age`],
            gua_dob: stateData[`date_vl_gua_dob`],
            gua_gender: stateData[`string_vl_gua_gender`],
            gua_relation_entity: ' ',
            gua_monthly_income: ' ',
            gua_is_guar: ' ',
            _id: id,
            section_code: SectionData.guarantor.section_code,
            sub_section_code: SectionData.guarantor.guarantor_section_submit.sub_section_code,
            section_sequence_no: SectionData.guarantor.section_sequence_no,
            section_name: SectionData.guarantor.section_name,
            sub_section_name: SectionData.guarantor.guarantor_section_submit.sub_section_name,
            sub_section_sequence_no: SectionData.guarantor.guarantor_section_submit.sub_section_sequence_no,
          };
          dispatch(
            patchMsmeDetailsWatcher(
              payload,
              async (result) => {
                setStatusCheckApi(loanAppId, SectionData.guarantor.section_code, SectionData.guarantor.guarantor_section_submit.sub_section_code, dispatch, 0);
              },
              (error) => { },
            ),
          );
        })
        .catch((error) => {
          showAlert('Error in fetch load details', 'error');
        });
    } else {
      showAlert('Kindly check for errors in fields', 'error');
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
    }
  };

  const handleSkipButton = () => {
    const bookLoanPayload = {
      user_id: user._id,
      companyId: MSMECompanyId,
      productId: MSMEProductId,
      loan_app_id: loanAppId,
      user: JSON.stringify(user),
    };

    new Promise((resolve, reject) => {
      dispatch(getBookLoanDetailsWatcher(bookLoanPayload, resolve, reject));
    })
      .then((response) => {
        let id = -1;

        if (response?.guarantor_details.length == parseInt(item[item.length - 1])) {
          id = response?.guarantor_details[parseInt(item[item.length - 1]) - 1]?._id ?? -1;
        }
      
    
        if (id!=-1) {
          const payload = {
            loan_app_id: loanAppId,
            section: 'guarantors',
            msme_company_id: MSMECompanyId,
            msme_product_id: MSMEProductId,
            user_id: user._id,
            _id: id,
            delete: true,
          };
          dispatch(
            patchMsmeDetailsWatcher(
              payload,
              async (result) => {
                const guaData = [...guarantorsData];
                guaData.splice(guarantorIndex - 1, 1);
                guaData.push({});
                setGuarantorsData(guaData);
                if (guarantorArray.length > 1) {
                  setGuarantorCount(GuarantorCount - 1);
                  let guaArr = [...guarantorArray];
                  guaArr.splice(guarantorArray.length - 1, 1);
                  setGuarantorArray(guaArr);
                }
                fetchLoanDetails(0);
                setNavIconPrefixState((prevState) => ({
                  ...prevState,
                  'Guarantor Details': 'success',
                }));
                if (showShareHolding) {
                  setNavState('Shareholding');
                } else {
                  setNavState('Financial Docs');
                }
              },
              (error) => { },
            ),
          );
        } else {
          const guaData = [...guarantorsData];
          guaData.splice(guarantorIndex - 1, 1);
          guaData.push({});
          setGuarantorsData(guaData);
          if (guarantorArray.length > 1) {
            setGuarantorCount(GuarantorCount - 1);
            let guaArr = [...guarantorArray];
            guaArr.splice(guarantorArray.length - 1, 1);
            setGuarantorArray(guaArr);
          }
          fetchLoanDetails(0);
          setNavIconPrefixState((prevState) => ({
            ...prevState,
            'Guarantor Details': 'success',
          }));
          if (showShareHolding) {
            setNavState('Shareholding');
          } else {
                        setNavState('Financial Docs');
          }
        }
       })
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '98%',
        justifyContent: 'space-around',
      }}
    >
      {props.type == 'edit' && props.leadComment[`guarantor_details_${code - 399}`] && <LogViewer head="Credit Manager Comment" body={props.leadComment[`guarantor_details_${code - 399}`]} />}
      <div
        style={{
          display: 'flex',
          position: 'sticky',
          top: '0',
          paddingTop: '1rem',
          marginBottom: '1rem',
          background: '#fff',
          zIndex: '5',
          justifyContent: 'space-between',
        }}
      >
        <div style={CustomTitleStyle}>{item} Details</div>
        {leadStatus != 'new' && leadStatus != 'offer_generated' && leadStatus != 'approved' && leadStatus != 'pending' && props.type != 'view' ? (
          <>
            {navIconPrefixState['Additional Docs'] != 'success' ? (
              guarantorStatus[guarantorIndex - 1] ? (
                <Button
                  id="delete"
                  label="Delete"
                  buttonType="link-button"
                  onClick={handleDeleteButton}
                  isDisabled={false}
                  customStyle={{
                    height: '32px',
                    width: '64px',
                    fontSize: '14px',
                    color: '#CC0000',
                  }}
                />
              ) : (
                <Button
                  id="skip"
                  label="Skip"
                  buttonType="link-button"
                  onClick={handleSkipButton}
                  customStyle={{
                    fontFamily: 'Montserrat-Regular',
                    height: '32px',
                    width: '64px',
                    fontSize: '14px',
                    lineHeight: '21px',
                    color: '#134CDE',
                  }}
                />
              )
            ) : null}
          </>
        ) : null}
      </div>
      <div>{renderFields('Guarantor Details')}</div>
      <div style={customSubHeaderStyle}>Current Address</div>
      <div>{renderFields('Guarantor Current Address')}</div>
      <div style={{ display: 'flex' }}>
        <div style={customSubHeaderStyle}>Permanent Address</div>

        <>
          <input
            style={{
              marginLeft: '16px',
              marginTop: '32px',
              width: '1rem',
              height: '1rem',
            }}
            type="checkbox"
            onClick={handlePermanentAddress}
            checked={!viewPerAddress}
            disabled={panButtonState === 'icon' ? true : false}
          />
          <div
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: '0.9vw',
              marginTop: '32px',
              marginLeft: '0.5%',
              color: '#767888',
            }}
          >
            {' '}
            Same as current address
          </div>
        </>
      </div>
      <div>{renderFields('Guarantor Permanent Address')}</div>
      <div style={CustomHeaderStyle}>Guarantor KYC</div>
      <div>{renderFields('Guarantor KYC')}</div>
      <div style={customSubHeaderStyle}>KYC Documents</div>
      {/* <div>{renderFields("Guarantor KYC Documents")}</div> */}

      <div style={{ marginLeft: '2%' }}>
        <UploadFileInput
          borrowerIndex={guarantorIndex}
          uploadFileName={uploadFileName}
          items={guarantorSelfieState}
          title=""
          backgroundColorBlur={props.type == 'view' || (props.type == 'edit' && panVerify == true) ? false : backgroundColorBlur}
          backgroundColorChange={true}
          isSubmit={props.type == 'view' ? false : guarantorStatus[guarantorIndex - 1]}
          isXML={false}
          loanAppId={loanAppId}
          setDocumentStateData={setDocumentStateData}
          sectionName={sectionName}
          data={{ company_id: MSMECompanyId, product_id: MSMEProductId }}
          showAlert={showAlert}
          MSMECompanyId={MSMECompanyId}
          MSMEProductId={MSMEProductId}
          isChange={sectionStatus.includes(statusObject?.section_status) ? false : true}
          type={props.type}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', columnGap: '5%' }}>
        <div style={CustomHeader}>Select PAN Document Type</div>
        <label
          style={{
            ...radioCss,
            color: guarantorStatus[guarantorIndex - 1] ? '#C0C1C8' : panButtonState === 'icon' ? 'var(--neutrals-neutral-100, #161719)' : '#C0C1C8',
          }}
        >
          <input type="checkbox" value="Image & PDF" checked={selectedPANFileType['Image & PDF']} onChange={handlePANRadioButton} style={radioInputCss} disabled={guarantorStatus[guarantorIndex - 1] || props.type == 'view'} />
          Image & PDF
        </label>
        <label
          style={{
            ...radioCss,
            color: guarantorStatus[guarantorIndex - 1] ? '#C0C1C8' : panButtonState === 'icon' ? 'var(--neutrals-neutral-100, #161719)' : '#C0C1C8',
          }}
        >
          <input type="checkbox" value="Response XML/JSON" checked={selectedPANFileType['Response XML/JSON']} onChange={handlePANRadioButton} style={radioInputCss} disabled={guarantorStatus[guarantorIndex - 1] || props.type == 'view' ? true : guarantorStatus[guarantorIndex - 1] ? true : panButtonState === 'icon' ? false : true} />
          Response XML/JSON
        </label>
      </div>
      {/* <div>{renderFields("Guarantor PAN Details")}</div> */}

      <div style={{display:'flex'}}>
      {selectedPANFileType['Image & PDF'] ? (
        <div style={{ marginLeft: '2%' }}>
          <UploadFileInput
            key={selectedPANFileType['Image & PDF']}
            borrowerIndex={guarantorIndex}
            uploadFileName={uploadFileName}
            items={guarantorPanState}
            title=""
            backgroundColorBlur={props.type == 'view' || (props.type == 'edit' && panVerify == true) ? false : backgroundColorBlur}
            backgroundColorChange={true}
            isSubmit={props.type == 'view' ? false : guarantorStatus[guarantorIndex - 1]}
            isXML={false}
            loanAppId={loanAppId}
            setDocumentStateData={setDocumentStateData}
            sectionName={sectionName}
            // shouldDelete={true}
            data={{ company_id: MSMECompanyId, product_id: MSMEProductId }}
            showAlert={showAlert}
            borrowerId={stateData?.borrower_id}
            MSMECompanyId={MSMECompanyId}
            MSMEProductId={MSMEProductId}
            isChange={sectionStatus.includes(statusObject?.section_status) ? false : true}
            type={props.type}
          />
        </div>
      ) :null}
      { selectedPANFileType['Response XML/JSON'] ? (
        <div style={{ marginLeft: '2%' }}>
          <UploadFileInput
            key={selectedPANFileType['Response XML/JSON']}
            borrowerIndex={guarantorIndex}
            uploadFileName={uploadFileName}
            items={guarantorPanXMLState}
            title=""
            backgroundColorBlur={props.type == 'view' || (props.type == 'edit' && panVerify == true) ? false : backgroundColorBlur}
            backgroundColorChange={true}
            isSubmit={props.type == 'view' ? false : guarantorStatus[guarantorIndex - 1]}
            isXML={true}
            loanAppId={loanAppId}
            setDocumentStateData={setDocumentStateData}
            sectionName={sectionName}
            data={{ company_id: MSMECompanyId, product_id: MSMEProductId }}
            showAlert={showAlert}
            borrowerId={stateData?.borrower_id}
            // shouldDelete={true}
            MSMECompanyId={MSMECompanyId}
            MSMEProductId={MSMEProductId}
            isChange={sectionStatus.includes(statusObject?.section_status) ? false : true}
            type={props.type}
          />
        </div>
      ):null}
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', columnGap: '5%' }}>
        <div style={CustomHeader}>Select Aadhaar Document Type</div>
        <label
          style={{
            ...radioCss,
            color: guarantorStatus[guarantorIndex - 1] ? '#C0C1C8' : panButtonState === 'icon' ? 'var(--neutrals-neutral-100, #161719)' : '#C0C1C8',
          }}
        >
          <input type="checkbox" value="Image & PDF" checked={selectedAadharFileType['Image & PDF']} onChange={handleAadharRadioButton} style={radioInputCss} disabled={guarantorStatus[guarantorIndex - 1] || props.type == 'view'} />
          Image & PDF
        </label>
        <label
          style={{
            ...radioCss,
            color: guarantorStatus[guarantorIndex - 1] ? '#C0C1C8' : panButtonState === 'icon' ? 'var(--neutrals-neutral-100, #161719)' : '#C0C1C8',
          }}
        >
          <input type="checkbox" value="Response XML/JSON" checked={selectedAadharFileType['Response XML/JSON']} onChange={handleAadharRadioButton} style={radioInputCss} disabled={guarantorStatus[guarantorIndex - 1] || props.type == 'view' ? true : guarantorStatus[guarantorIndex - 1] ? true : panButtonState === 'icon' ? false : true} />
          Response XML/JSON
        </label>
      </div>

      <div style={{display:'flex'}}>
        {selectedAadharFileType['Image & PDF'] ? (
        <div style={{ marginLeft: '2%' }}>
          <UploadFileInput
            key={selectedAadharFileType['Image & PDF']}
            borrowerIndex={guarantorIndex}
            uploadFileName={uploadFileName}
            items={guarantorAadharState}
            title=""
            backgroundColorBlur={statusObject?.section_status == 'approved' ? true : props.type == 'view' || (props.type == 'edit' && panVerify == true) ? false : backgroundColorBlur}
            backgroundColorChange={true}
            isSubmit={props.type == 'view' ? false : guarantorStatus[guarantorIndex - 1]}
            isXML={false}
            loanAppId={loanAppId}
            setDocumentStateData={setDocumentStateData}
            sectionName={sectionName}
            data={{ company_id: MSMECompanyId, product_id: MSMEProductId }}
            showAlert={showAlert}
            borrowerId={stateData?.borrower_id}
            MSMECompanyId={MSMECompanyId}
            // shouldDelete={true}
            MSMEProductId={MSMEProductId}
            isChange={sectionStatus.includes(statusObject?.section_status) ? false : true}
            type={props.type}
          />
        </div>
      ) : null}
      {selectedAadharFileType['Response XML/JSON'] ? (
        <div style={{ marginLeft: '2%' }}>
          <UploadFileInput
            key={selectedAadharFileType['Response XML/JSON']}
            borrowerIndex={guarantorIndex}
            uploadFileName={uploadFileName}
            items={guarantorAadharXMLState}
            title=""
            backgroundColorBlur={props.type == 'view' || (props.type == 'edit' && panVerify == true) ? false : backgroundColorBlur}
            backgroundColorChange={true}
            isSubmit={props.type == 'view' ? false : guarantorStatus[guarantorIndex - 1]}
            isXML={true}
            loanAppId={loanAppId}
            setDocumentStateData={setDocumentStateData}
            sectionName={sectionName}
            data={{ company_id: MSMECompanyId, product_id: MSMEProductId }}
            showAlert={showAlert}
            borrowerId={stateData?.borrower_id}
            // shouldDelete={true}
            MSMECompanyId={MSMECompanyId}
            MSMEProductId={MSMEProductId}
            isChange={sectionStatus.includes(statusObject?.section_status) ? false : true}
            type={props.type}
          />
        </div>
      ):null}
      </div>
      {props.type == 'view' || navIconPrefixState['Guarantor Details'] == 'success' ? null : !guarantorStatus[guarantorIndex - 1] ? (
        <>
          {item != 'Guarantor 2' ? (
            <div
              style={{
                display: 'flex',
                marginTop: '2%',
                marginBottom: '2%',
                justifyContent: 'space-between',
              }}
              className="book-loan-button-container book-loan-button-alignment-triple-button"
            >
              <Button id="verifyGuarantor" label="Verify & Add Guarantor" buttonType="secondary" isLoading={addGuarantorLoader === 'inProgress' ? true : false} isDisabled={!validForm || !documentStateData.Applicant_Selfie_1 || ((!documentStateData.aadhar_front && !documentStateData.Aadhar_Front_1) && !documentStateData.Aadhar_XML) || (!documentStateData.Pan_1 && !documentStateData.Pan_XML) || sectionStatusCheck == 'inProgress'} onClick={handleGuarantorNumber} customStyle={customButtonStyle} />
              <div className="book-loan-button-alignment-double-button">
                <Button
                  id="validate"
                  label="Verify & Next"
                  buttonType="linkssss"
                  isLoading={sectionStatusCheck === 'inProgress' ? true : false}
                  isDisabled={statusObject?.section_status === LeadNewStatus.InProgress && leadStatus === LeadNewStatus.Pending ? false : !validForm || !documentStateData.Applicant_Selfie_1 || ((!documentStateData.aadhar_front && !documentStateData.Aadhar_Front_1) && !documentStateData.Aadhar_XML) || (!documentStateData.Pan_1 && !documentStateData.Pan_XML)|| addGuarantorLoader == 'inProgress'}
                  onClick={handleAddData}
                  customStyle={customValidateButton}
                  customLoaderClass={{
                    borderTop: '4px solid #fff',
                  }}
                />
                {leadStatus == "draft" && <Button id="saveDraft" label="Save as Draft" buttonType="secondary" customStyle={customSaveButton} onClick={handleGuarrantorDraft} isDisabled={disableDraftButton} />}
              </div>
            </div>
          ) : (
            <div className="book-loan-button-container book-loan-button-alignment-double-button">
              <Button
                id="validate"
                label="Verify & Next"
                buttonType="linkssss"
                isLoading={sectionStatusCheck === 'inProgress' ? true : false}
                onClick={handleAddData}
                isDisabled={statusObject?.section_status === LeadNewStatus.InProgress && leadStatus === LeadNewStatus.Pending ? false : !validForm || !documentStateData.Applicant_Selfie_1 || ((!documentStateData.aadhar_front && !documentStateData.Aadhar_Front_1) && !documentStateData.Aadhar_XML) || (!documentStateData.Pan_1 && !documentStateData.Pan_XML) || addGuarantorLoader == 'inProgress'}
                customStyle={customValidateButton}
                customLoaderClass={{
                  borderTop: '4px solid #fff',
                }}
              />
              {leadStatus == "draft" && <Button id="saveDraft" label="Save as Draft" buttonType="secondary" customStyle={customSaveButton} onClick={handleGuarrantorDraft} isDisabled={disableDraftButton} />}
            </div>
          )}
        </>
      ) : null}
      {alert ? <Alert severity={severity} message={alertMessage} handleClose={handleAlertClose} /> : null}
    </div>
  );
}
