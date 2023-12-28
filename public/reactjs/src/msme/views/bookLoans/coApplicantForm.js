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
import moment from 'moment';
import 'react-sdk/dist/styles/_fonts.scss';
import { getStatesData, getPincodeData, States, Cities } from '../../../constants/country-state-city-data';
import { patchMsmeDetailsWatcher, patchMsmeDocDeleteWatcher, putMsmeDraftSaverWatcher } from '../../actions/msme.action';
import { getBookLoanDetailsWatcher, getMsmeLoanDocumentsWatcher } from './../../actions/bookLoan.action';
import Alert from 'react-sdk/dist/components/Alert/Alert';

import UploadFileInput from '../../components/uploadFileInput/UploadFileInput';
import getSectionStatus from './GetLeadSectionStatus/GetLeadSectionStatus';
import AadharVerifyInputbox from './reusableComponents/aadharVerifyInputbox';
import { getLeadSectionStatusWatcher } from './../../actions/status.action';

import { ApplicantSelfie, PanInputTittle, AadharInputTittle, AadharInputTittleXML, PanInputTittleXML } from './uploadKycData';
import { uploadLoanDocumentsWatcher } from 'actions/loanDocuments';
import { getMsmeSubmissionStatusWatcher } from '../../actions/msme.action';
import { SectionData } from '../../config/sectionData';
import { getLeadStatusWatcher } from 'msme/actions/lead.action';
import { LeadNewStatus } from '../../config/LeadStatus';
import { LogViewer } from 'msme/components/LogViewer/LogViewer';
import getSubSectionRemarks from "./GetLeadSectionStatus/GetLeadSubSectionRemarks"

import {documentCode} from 'msme/config/docCode'
const BOOK_LOAN_FORM_JSON = bookLoansFormJsonFields();
const user = { _id: storedList('user')?._id, id: storedList('user')?.id };

const fetchObjectFieldsByDept = (deptName) => {
  const matchingObjects = [];
  for (let object of BOOK_LOAN_FORM_JSON) {
    if (object.dept === deptName) {
      matchingObjects.push(object.field);
    }
  }

  return matchingObjects; // Return the array of matching objects
};

const uploadFileName = 'co_applicant_details';

const disabledFields = {
  view: ['cb_resi_addr_ln1', 'cb_resi_addr_ln2', 'cb_city', 'cb_state', 'cb_pincode', 'cb_aadhaar', 'cb_mobile', 'cb_father_name', ...fetchObjectFieldsByDept('Co-Applicant Details'), ...fetchObjectFieldsByDept('Co-Applicant Permanent Address'), ...fetchObjectFieldsByDept('Co-Applicant Current Address'), ...fetchObjectFieldsByDept('Co-Applicant KYC'), ...fetchObjectFieldsByDept('Co-Applicant Aadhar Details')],
  edit: ['company_id', 'product_id', 'loan_app_id', 'partner_borrower_id', 'pan_value', 'aadhaar_value'],
};

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

export default function CoApplicantForm(props) {
  const { item, setNavIconPrefixState, navIconPrefixState, setNavState, coApplicantsData, setCoApplicantsData, coApplicantArray, setCoApplicantArray, CoApplicantCount, setCoApplicantCount, coAppStatus, setCoAppStatus, loanAppId, MSMECompanyId, MSMEProductId, documents, leadStatus, loanDetailsSubsectionStatus, setLeadStatus, setShouldFetch, loanSectionObject, setLoanSectionObject, setShouldFetchDocument} = props;
  const dispatch = useDispatch();
  const [coAppIndex, setCoAppIndex] = useState(parseInt(item[item.length - 1]));
  const store = useSelector((state) => state);
  const [viewPerAddress, setViewPerAddress] = useState(coApplicantsData[coAppIndex - 1] && coApplicantsData[coAppIndex - 1]['address_same'] ? false : true);
  const [stateData, setStateData] = useState(coApplicantsData[coAppIndex - 1]);
  const [validationData, setValidationData] = useState({});
  const [selectedPANFileType, setSelectedPANFileType] = useState({'Image & PDF':true,'Response XML/JSON':false});
  const [selectedAadharFileType, setAadharFileType] = useState({'Image & PDF':true,'Response XML/JSON':false});
  const [states, setStatesState] = useState(States);
  const [currCity, setCurrCityState] = useState([]);
  const [perCity, setPerCityState] = useState([]);
  const [backgroundColorBlur, setBackgroundColorBlur] = useState(true);
  const [panButtonState, setPanButtonState] = useState('button');
  const [panVerify, setPanVerify] = useState(false);
  const [statusData, setStatusData] = useState();
  const [validForm, setValidForm] = useState(true);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [panBorder, setPanBorder] = useState('border: 1px solid #BBBFCC');
  const [sectionStatusCheck, setSectionStatusCheck] = useState('');
  const [addCoApplicantLoader, setAddCoApplicantLoader] = useState('');
  const [disableDraftButton, setDisableDraftButton] = useState(false);
  const [statusObject, setStatusObject] = useState('');
  const [documentStateData, setDocumentStateData] = useState({
    Applicant_Selfie_1: false,
    Pan_1: false,
    Pan_XML: false,
    Aadhar_XML: false,
    Aadhar_Front_1: false,
    Aadhar_Back_1: false,
  });
  let interval;
  let intervalId;
  const [leadsStatus, setLeadsStatus] = useState('');
  const [subSectionStatus, setSubsectionStatus] = useState('');
  const [isLeadRejected,setIsLeadRejected] = useState(false);

  const [applicantSelfieState, setApplicantSelfieState] = useState(ApplicantSelfie);
  // Pan view
  const [panView, setPanView] = useState(PanInputTittle);

  // aadharXML
  const [panXMLView, setPanXMLView] = useState(PanInputTittleXML);

  //aadhaar
  const [aadharFrontView, setAadharFrontView] = useState(AadharInputTittle);

  // aadharXML
  const [aadharfrontXML, setAadharfrontXML] = useState(AadharInputTittleXML);
  let code = 299 + parseInt(item[item.length - 1]);

  useEffect(() => {
    if (loanDetailsSubsectionStatus && loanDetailsSubsectionStatus[code]) {
      if (loanDetailsSubsectionStatus[code]['co_borrower_pan'] == 'approved') {
        setBackgroundColorBlur(false);
        setPanButtonState('icon');
        fetchLoanDetails(0);
        setPanBorder('1px solid green');
        setPanVerify(true);
      }
    }
    if(props.loanDetailsStatus &&  props.loanDetailsStatus[`co-applicant_details_${parseInt(item[item.length - 1])}`]=="rejected"){
      setIsLeadRejected(true);
    }
  }, [loanDetailsSubsectionStatus, statusObject]);

  useEffect(() => {
    handleCoApplicantArray();

    fetchLoanDetails(1);

  }, [CoApplicantCount]);

  useEffect(() => {
    let vlForm = 1;
    bookLoansFormJsonFields().map((item, idx) => {
      if (item.field != 'cb_age' && item.field != 'cb_father_name' && (item.dept == 'Co-Applicant Details' || item.dept == 'Co-Applicant Current Address' || item.dept == 'Co-Applicant Permanent Address' || item.dept == 'Co-Applicant KYC')) {
        if (item.isOptional == false) {
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
    if (coAppStatus[coAppIndex - 1] == false) {
      const coAppData = [...coApplicantsData];
      coAppData[coAppIndex - 1] = stateData;
      setCoApplicantsData(coAppData);
    }
    if (stateData && stateData['string_vl_cb_state']){
      const stateInfoObject = states.filter(item => item.name === stateData['string_vl_cb_state'])
      handleGetCurrCities(stateInfoObject[0], "");
    }
    if (stateData && stateData['string_vl_cb_per_state']){
      const stateInfoObject = states.filter(item => item.name === stateData['string_vl_cb_per_state'])
      handleGetPerCities(stateInfoObject[0], "");
    }
  }, [stateData]);

  useEffect(() => {
    if (!viewPerAddress) {
      bookLoansFormJsonFields().map((item, idx) => {
        if (item.dept == 'Co-Applicant Permanent Address') {
          let addressField = `${item.type}_vl_${item.field}`;
          setStateData((prevState) => ({
            ...prevState,
            [addressField]: null,
          }));
          const str = item.field == 'cb_per_state' || item.field == 'cb_per_city' || item.field == 'cb_per_pincode' ? '' : 'resi_';
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
      if (!coAppStatus[coAppIndex - 1]) {
        bookLoansFormJsonFields().map((item, idx) => {
          if (item.dept == 'Co-Applicant Permanent Address') {
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

  useEffect(() => {
    if (stateData && stateData['date_vl_cb_dob']) {
      handleAge();
    }
  }, [stateData?.date_vl_cb_dob]);

  const handleAge = () => {
    const dob = stateData['date_vl_cb_dob'];
    const yyyyMmDdRegExp = /^\d{4}-\d{2}-\d{2}$/.test(dob);
    if (yyyyMmDdRegExp) {
      const age = calculateAge(dob.substring(5, 2), dob.substring(8, 2), dob.substring(0, 4));

      setStateData((prevState) => ({
        ...prevState,
        number_vl_cb_age: age,
      }));
      let field = `number_vl_cb_age`;
      let isValid = validateData(field.substring(0, field.indexOf('_vl_')).toLowerCase(), age);
      setValidationData((prevState) => ({
        ...prevState,
        [`${field}State`]: !isValid ? 'has-danger' : '',
      }));
      return age;
    } else {
      setStateData((prevState) => ({
        ...prevState,
        number_vl_cb_age: ' ',
      }));
      return ' ';
    }
  };

  useEffect(() => {
    let data = {
      ...stateData,
    };
    if (stateData && stateData['date_vl_cb_dob']) {
      data = {
        ...data,
        number_vl_cb_age: handleAge(),
      };
    }

    setStateData({ ...data, ...coApplicantsData[coAppIndex - 1] });
    if (coAppStatus[coAppIndex - 1]) {
      setBackgroundColorBlur(true);
    }
  }, [coAppStatus]);

  useEffect(() => {
    if (stateData?.borrower_id&& documents){
      fetchLoanDocuments();
    }
  }, [documents]);

  useEffect(() => {
    getLeadStatus();
  }, [loanSectionObject, coAppIndex]);

  const fetchSectionStatus = () => {
    loanDetailsSubsectionStatus && loanDetailsSubsectionStatus[code] && loanDetailsSubsectionStatus[code]?.applicant_okyc && setSubsectionStatus(loanDetailsSubsectionStatus[code]?.applicant_okyc);
  };

  useEffect(() => {
    if (loanAppId && MSMECompanyId && MSMEProductId) {
      fetchSectionStatus();
    }
  }, []);

  const fetchLoanDocuments = () => {
    const borrowerId = stateData?.borrower_id;
        const response = documents.filter(item=> item.borrower_id==borrowerId);
    let stateDoc = {
      Applicant_Selfie_1: false,
      Pan_1: false,
      Pan_XML: false,
          Aadhar_XML:false,
      Aadhar_Front_1: false,
      Aadhar_Back_1: false,
    };

    let data = setDocumentView(ApplicantSelfie, response);
    setApplicantSelfieState(data);
    stateDoc['Applicant_Selfie_1'] = checkDocStatus(data);

    data = setDocumentView(PanInputTittle, response);
    stateDoc['Pan_1'] = checkDocStatus(data);
    setPanView(data);

    data = setDocumentView(PanInputTittleXML, response);
    stateDoc['Pan_XML'] = checkDocStatus(data);
    setPanXMLView(data);

    data = setDocumentView(AadharInputTittle, response);
    stateDoc['Aadhar_Front_1'] = checkDocStatus(data);
    setAadharFrontView(data);

    data = setDocumentView(AadharInputTittleXML, response);
    stateDoc['Aadhar_XML'] = checkDocStatus(data);
    setAadharfrontXML(data);

    for (let obj of response) {
      if (obj.code == '195') {
            setSelectedPANFileType((prevState)=> ({
          ...prevState,
              ['Response XML/JSON']:true}));
      }
      if (obj.code == '196') {
            setAadharFileType((prevSate)=> ({
          ...prevSate,
              ['Response XML/JSON']:true}));
      }
    }
    setDocumentStateData(stateDoc);

  };

  const getLeadStatus = () => {
    if (loanSectionObject && loanSectionObject[`co-applicant_details_${coAppIndex}`]){
      setStatusObject(loanSectionObject[`co-applicant_details_${coAppIndex}`]);
    }
  };

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

  const InputBoxStyle = {
    marginTop: '8px',
    maxHeight: '500px',
    zIndex: 1,
    width: '105%',
  };

  const customButtonStyle = {
    fontSize: '16px',
    color: '#134CDE',
    border: '1px solid #134CDE',
    marginLeft: '2%',
    width: '20vw',
    height: '48px',
    paddingLeft: '1%',
    paddingRight: '1%',
    borderRadius: '32px',
  };

  const customInputBoxStyle = {
    height: '100%',
    width: '100%',
    maxWidth: '100%',
    paddingTop: '0.8%',
    fontSize: '130%',
    fontFamily: 'Montserrat-Regular',
  };

  const customDropdownStyle = {
    marginTop: '8px',
    zIndex: '1',
    width: '105.1%',
  };

  const CustomHeaderStyle = {
    fontFamily: 'Montserrat-Bold',
    marginLeft: '2%',
    marginTop: '2%',
    marginBottom: '20px',
    color: '#161719',
    fontSize: '1.3vw',
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
    marginTop: '2%',
    color: '#161719',
    fontSize: '1.2vw',
    marginRight: '1%',
    marginBottom: '15px',
  };

  const customSaveButton = {
    fontSize: '16px',
    color: '#134CDE',
    border: '1px solid #134CDE',
    height: '48px',
    width: 'max-content',
    padding: '10px 24px',
    borderRadius: '40px',
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
    background: statusObject?.section_status === LeadNewStatus.InProgress && leadStatus === LeadNewStatus.Pending ? 'var(--primary-blue-button-gradient, linear-gradient(180deg, #134CDE 0%, #163FB7 100%, #163FB7 100%))' : validForm && documentStateData.Applicant_Selfie_1 && (documentStateData.Aadhar_Front_1 || documentStateData.Aadhar_XML )&& (documentStateData.Pan_1 || documentStateData.Pan_XML) ? 'var(--primary-blue-button-gradient, linear-gradient(180deg, #134CDE 0%, #163FB7 100%, #163FB7 100%))' : 'var(--neutrals-neutral-30, #CCCDD3)',
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
    if(event.target.value === "Response XML/JSON" && documentStateData.Pan_XML){
      deleteFile([documentCode.cb_pan_XML]);
      setDocumentStateData({...documentStateData, Pan_XML:false})
    }else if(event.target.value === "Image & PDF" && documentStateData.Pan_1){
      setDocumentStateData({...documentStateData, Pan_1:false})
      deleteFile([documentCode.cb_pan]);
    }

  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity('');
    setAlertMessage('');
  };
  const sectionName = 'co-applicants';

  const setStatusCheckApi = async (loanAppID, sectionCode, subSectionCode, dispatch, addCoApp) => {
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
          if (subSectionCode == 'co_borrower_pan') {
            setBackgroundColorBlur(false);
            setPanButtonState('icon');
            showAlert('PAN verified successfully', 'success');
            setPanBorder('1px solid green');
            setPanVerify(true);
          } else {
            let statusObj = {...loanSectionObject[`co-applicant_details_${coAppIndex}`]}
            statusObj.section_status = "approved"
              setLoanSectionObject((prevState)=>({
              ...prevState,
                [`co-applicant_details_${coAppIndex}`]:statusObj
            }))

            if (addCoApp == 1) {
              showAlert('Co-applicant details added successfully', 'success');
              setCoApplicantCount(coAppIndex + 1);
              setAddCoApplicantLoader('completed');
              setShouldFetchDocument(prev=>prev+1);
            } else {
              setNavIconPrefixState((prevState) => ({
                ...prevState,
                'Co-Applicant Details': 'success',
              }));
              // setNavState('Guarantor Details');
              showAlert('Co-applicant details added successfully', 'success');
              setSectionStatusCheck('completed');
              setTimeout(() => {
                if (props?.setShouldFetch) {
                  setShouldFetch((prev) => prev + 1)
                }
              }, 1000)
            }
          }
          clearInterval(intervalId);
        } else if (status == 'deviation') {
          if (subSectionCode == 'co_borrower_pan') {
            setBackgroundColorBlur(false);
            setPanButtonState('icon');
            showAlert('There is deviation in PAN validation, but you can still proceed further.', 'info');
            setPanBorder('1px solid yellow');
            setPanVerify(true);
          } else {
            let statusObj = {...loanSectionObject[`co-applicant_details_${coAppIndex}`]}
            statusObj.section_status = "deviation"
            setLoanSectionObject((prevState)=>({
              ...prevState,
              [`co-applicant_details_${coAppIndex}`]:statusObj
            }))
            if (addCoApp == 1) {
              showAlert('Co-applicant details added successfully', 'success');
              setCoApplicantCount(coAppIndex + 1);
              setAddCoApplicantLoader('completed');
              setShouldFetchDocument(prev=>prev+1)
            } else {
              setNavIconPrefixState((prevState) => ({
                ...prevState,
                'Co-Applicant Details': 'deviation',
              }));
              // setNavState('Guarantor Details');
              showAlert('Co-applicant details added successfully.', 'success');
              setSectionStatusCheck('completed');
              setTimeout(() => {
                if (props?.setShouldFetch) {
                  setShouldFetch((prev) => prev + 1)
                }
              }, 1000)
            }
          }
          clearInterval(intervalId);
        } else if (status == 'rejected') {
          if (subSectionCode == 'co_borrower_pan') {
            setPanVerify(false);
            setPanButtonState('button');
            setBackgroundColorBlur(true);
            fetchLoanDetails(0);
            showAlert(subSectionRemarks || 'Pan Rejected', 'error');
          } else {
            showAlert(subSectionRemarks || 'Bureau Rejected.', 'error');
            setSectionStatusCheck('');
            setAddCoApplicantLoader('');
            setIsLeadRejected(true);
          }
          clearInterval(intervalId);
        }
      } catch (error) {
        showAlert('Technical error, please try again.', 'error');
        clearInterval(intervalId);
      }
    }, 3000);
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

    if(event.target.value === "Response XML/JSON" && documentStateData.Aadhar_XML){
      setDocumentStateData({...documentStateData, Aadhar_XML:false})
      deleteFile([documentCode.cb_aadhaar_XML]);
    }else if(event.target.value === "Image & PDF" && documentStateData.Aadhar_Front_1){
      setDocumentStateData({...documentStateData, Aadhar_Front_1:false, Aadhar_Back_1:false})
      deleteFile([documentCode.cb_aadhaar_front, documentCode.cb_aadhaar_back]);
    }
  };

  const saveCoApplicantDraft = () => {
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
          if (response?.co_applicant_details[coAppIndex-1]?._id)
          {
            id = response?.co_applicant_details[coAppIndex-1][`_id`];
          }
          else
          {
            id =-1;
          }
          if (id) {
            setDisableDraftButton(true);
            let data = {
              section: 'co-applicants',
              cb_fname: stateData ?  stateData[`string_vl_cb_fname`] : ' ',
              cb_mname: stateData ?  stateData[`string_vl_cb_mname`] :' ',
              cb_lname: stateData ?  stateData[`string_vl_cb_lname`]: ' ',
              cb_father_name: stateData ?  stateData[`string_vl_cb_father_name`] : ' ',
              cb_mobile: stateData ?  stateData[`mobile_vl_cb_mobile`] : ' ',
              cb_father_mname: null,
              cb_email: stateData ?  stateData[`email_vl_cb_email`] : ' ',
              cb_father_lname: null,
              cb_resi_addr_ln1: stateData ?  stateData[`string_vl_cb_resi_addr_ln1`] : ' ',
              cb_resi_addr_ln2: stateData ?  stateData[`string_vl_cb_resi_addr_ln2`] : ' ',
              cb_city: stateData ?  stateData[`string_vl_cb_city`]: ' ',
              cb_state: stateData ?  stateData[`string_vl_cb_state`]: ' ',
              cb_pincode: stateData ?  stateData[`pincode_vl_cb_pincode`]: ' ',
              cb_per_addr_ln1: stateData ?  stateData[`string_vl_cb_per_addr_ln1`]: ' ',
              cb_per_addr_ln2: stateData ?  stateData[`string_vl_cb_per_addr_ln2`] : ' ',
              cb_per_city: stateData ?  stateData[`string_vl_cb_per_city`]: ' ',
              cb_per_state: stateData ?  stateData[`string_vl_cb_per_state`]: ' ',
              cb_per_pincode: stateData ?  stateData[`pincode_vl_cb_per_pincode`]: ' ',
              cb_pan: stateData ?  stateData[`pan_vl_cb_pan`]: ' ',
              cb_aadhaar: stateData ?  stateData[`aadhaar_vl_cb_aadhaar`]: ' ',
              cb_age: stateData ?  stateData[`number_vl_cb_age`]: ' ',
              cb_dob: stateData ?  stateData[`date_vl_cb_dob`]: ' ',
              cb_gender: stateData ?  stateData[`string_vl_cb_gender`]: ' ',
              cb_relation_entity: ' ',
              cb_is_guar: ' ',
            };
            if (id !== -1) {
              data._id = id;
            }
            else{
              data.sequence_no = 300 + coAppIndex -1;
            }
            let bodyObject = Object.fromEntries(Object.entries(data).filter(([key, value]) => value !== null && value !== ' '));

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
                if (props.type !== "view") {
                  showAlert('Draft saved successfully', 'success');
                }
              })
              .catch((error) => {
                showAlert(error?.message ?? 'Error while saving draft', 'error');
              });
          } else {
          }
        },
        (error) => {},
      ),
    );
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

        if (response?.co_applicant_details.length == parseInt(item[item.length - 1])) {
          id = response?.co_applicant_details[parseInt(item[item.length - 1]) - 1]?._id ?? -1;
        } else if (stateData[`_id`]) {
          id = stateData[`_id`];
        }

        const payload = {
          loan_app_id: loanAppId,
          section: 'co-applicants',
          msme_company_id: MSMECompanyId,
          msme_product_id: MSMEProductId,
          user_id: user._id,
          address_same: viewPerAddress ? 0 : 1,
          cb_fname: stateData[`string_vl_cb_fname`],
          cb_email:stateData['email_vl_cb_email'],
          cb_mname: stateData[`string_vl_cb_mname`] ?? ' ',
          cb_lname: stateData[`string_vl_cb_lname`],
          cb_father_name: stateData[`string_vl_cb_father_name`],
          cb_mobile: stateData[`mobile_vl_cb_mobile`],
          cb_father_mname: 'Achhaibar',
          cb_father_lname: 'Dubey',
          cb_resi_addr_ln1: stateData[`string_vl_cb_resi_addr_ln1`],
          cb_resi_addr_ln2: stateData[`string_vl_cb_resi_addr_ln2`] ?? ' ',
          cb_city: stateData[`string_vl_cb_city`],
          cb_state: stateData[`string_vl_cb_state`],
          cb_pincode: stateData[`pincode_vl_cb_pincode`],
          cb_per_addr_ln1: stateData[`string_vl_cb_per_addr_ln1`],
          cb_per_addr_ln2: stateData[`string_vl_cb_per_addr_ln2`] ?? ' ',
          cb_per_city: stateData[`string_vl_cb_per_city`],
          cb_per_state: stateData[`string_vl_cb_per_state`],
          cb_per_pincode: stateData[`pincode_vl_cb_per_pincode`],
          cb_pan: stateData[`pan_vl_cb_pan`],
          cb_dob: stateData[`date_vl_cb_dob`],
          cb_gender: stateData[`string_vl_cb_gender`],
          cb_relation_entity: ' ',
          cb_monthly_income: ' ',
          cb_is_guar: ' ',
          sub_section_code: SectionData.co_borrower.co_borrower_pan.sub_section_code,
          section_sequence_no: SectionData.co_borrower.section_sequence_no,
          section_name: SectionData.co_borrower.section_name + `${coAppIndex}`,
          sub_section_name: SectionData.co_borrower.co_borrower_pan.sub_section_name,
          sub_section_sequence_no: SectionData.co_borrower.co_borrower_pan.sub_section_sequence_no,
          section_code: SectionData.co_borrower.section_code,
        };

        if (id != -1) {
          payload._id = id;
        }

        dispatch(
          patchMsmeDetailsWatcher(
            payload,
            async (result) => {
              setPanButtonState('loader');
              setStatusCheckApi(loanAppId, SectionData.co_borrower.section_code, SectionData.co_borrower.co_borrower_pan.sub_section_code, dispatch, 0);
            },
            (error) => {
              showAlert('Error while adding details', 'error');
            },
          ),
        );
      })
      .catch((error) => {
        showAlert('Error while fetching Lead details', 'error');
      });
  };

  const handleCoApplicantArray = () => {
    let temp = [...coApplicantArray];

    for (let i = 1; i <= CoApplicantCount; i++) {
      if (i > coApplicantArray.length) {
        temp.push(`Co-Applicant ${i}`);
      }
    }
    setCoApplicantArray(temp);
    // saveCoApplicantDraft();
  };

  const fetchLoanDetails = (addCoApp) => {
    let coAppNumber = 0;
    const payload = {
      user_id: user._id,
      companyId: MSMECompanyId,
      productId: MSMEProductId,
      loan_app_id: loanAppId,
      user: JSON.stringify(user),
    };
    if (loanAppId) {
      dispatch(
        getBookLoanDetailsWatcher(
          payload,
          async (res) => {
            let arr = [...coApplicantsData];
            setLeadStatus(res.lead_status);
            if (res?.co_applicant_details) {
              let statusArr = Array.from({ length: 5 }, () => false);
              coAppNumber = res['co_applicant_details'].length >= 5 ? 5 : res['co_applicant_details'].length;
              for (let i = 0; i < (res['co_applicant_details'].length >= 5 ? 5 : res['co_applicant_details'].length); i++) {
                const result = res['co_applicant_details'][i];
                bookLoansFormJsonFields().map((item, idx) => {
                  if (item.dept == 'Co-Applicant Details' || item.dept === 'Co-Applicant Current Address' || item.dept === 'Co-Applicant Permanent Address' || item.dept === 'Co-Applicant KYC') {
                    if (result[`${item.field}`]) {
                      arr[i][`${item.type}_vl_${item.field}`] = result[`${item.field}`] ?? '';
                    } else if (result[`_id`]) {
                      addCoApp = 0;
                    }
                  }
                });
                arr[i][`_id`] = result[`_id`];
                if (result[`borrower_id`]){
                  arr[i][`borrower_id`] = result[`borrower_id`];
                }
              }
              setCoApplicantsData(arr);
              setStateData({ ...arr[coAppIndex - 1] });
              saveCoApplicantDraft();
            }
          },
          (error) => {},
        ),
      );
    }
  };

  const handleCoAppNumber = () => {
    let postData = {};
    let formValidated = true;
    bookLoansFormJsonFields().map((item, idx) => {
      if (item.field == 'cb_aadhaar' && item.isOptional == false) {
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
    if (formValidated && documentStateData.Applicant_Selfie_1 && (documentStateData.Aadhar_Front_1 || documentStateData.Aadhar_XML) && (documentStateData.Pan_1 || documentStateData.Pan_XML)) {
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

          if (response?.co_applicant_details.length == parseInt(item[item.length - 1])) {
            id = response?.co_applicant_details[parseInt(item[item.length - 1]) - 1]?._id ?? -1;
          } else if (stateData[`_id`]) {
            id = stateData[`_id`];
          }

          stateData.loanAppId = loanAppId;
          stateData.section = 'co-applicants';
          const payload = {
            _id: id,
            loan_app_id: loanAppId,
            section: 'co-applicants',
            company_id: MSMECompanyId,
            product_id: MSMEProductId,
            msme_company_id: MSMECompanyId,
            msme_product_id: MSMEProductId,
            user_id: user._id,
            cb_fname: stateData[`string_vl_cb_fname`],
            cb_email:stateData['email_vl_cb_email'],
            cb_mname: stateData[`string_vl_cb_mname`] ?? ' ',
            cb_lname: stateData[`string_vl_cb_lname`],
            cb_father_name: stateData[`string_vl_cb_father_name`],
            cb_mobile: stateData[`mobile_vl_cb_mobile`],
            cb_resi_addr_ln1: stateData[`string_vl_cb_resi_addr_ln1`],
            cb_resi_addr_ln2: stateData[`string_vl_cb_resi_addr_ln2`] ?? ' ',
            cb_city: stateData[`string_vl_cb_city`],
            cb_state: stateData[`string_vl_cb_state`],
            cb_pincode: stateData[`pincode_vl_cb_pincode`],
            cb_per_addr_ln1: stateData[`string_vl_cb_per_addr_ln1`],
            cb_per_addr_ln2: stateData[`string_vl_cb_per_addr_ln2`] ?? ' ',
            cb_per_city: stateData[`string_vl_cb_per_city`],
            cb_per_state: stateData[`string_vl_cb_per_state`],
            cb_per_pincode: stateData[`pincode_vl_cb_per_pincode`],
            cb_pan: stateData[`pan_vl_cb_pan`],
            cb_dob: stateData[`date_vl_cb_dob`],
            cb_gender: stateData[`string_vl_cb_gender`],
            cb_aadhaar: stateData[`aadhaar_vl_cb_aadhaar`],
            sub_section_code: SectionData.co_borrower.co_borrower_section_submit.sub_section_code,
            section_sequence_no: SectionData.co_borrower.section_sequence_no,
            section_name: SectionData.co_borrower.section_name + `${coAppIndex}`,
            sub_section_name: SectionData.co_borrower.co_borrower_section_submit.sub_section_name,
            sub_section_sequence_no: SectionData.co_borrower.co_borrower_section_submit.sub_section_sequence_no,
            section_code: SectionData.co_borrower.section_code,
          };
          setAddCoApplicantLoader('inProgress');
          dispatch(
            patchMsmeDetailsWatcher(
              payload,
              async (result) => {
                setStatusCheckApi(loanAppId, SectionData.co_borrower.section_code, SectionData.co_borrower.co_borrower_section_submit.sub_section_code, dispatch, 1);
              },
              (error) => {},
            ),
          );
        })
        .catch((error) => {
          showAlert('Error in fetching loan details', 'error');
          setSectionStatusCheck('');
        });
    } else {
      showAlert('Kindly check for errors in fields', 'error');
    }
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

  const handleGetCurrCities = async (value, name) => {
    setCurrCityState(Cities(value));
  };

  const handleGetPerCities = async (value, name) => {
    setPerCityState(Cities(value));
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
      if (stateData[`string_vl_cb_${section}`]) {
        currArr.map((item, idx) => {
          if (item.label == stateData[`string_vl_cb_${section}`]) {
            isCurrCityValid = true;
          }
        });
      }
      if (!isCurrCityValid) {
        setValidationData((prevState) => ({
          ...prevState,
          [`string_vl_cb_${section}State`]: 'has-danger',
        }));
      }
      return isCurrCityValid;
    } else {
      if (stateData[`string_vl_cb_${section}`]) {
        currArr.map((item, idx) => {
          if (item.label == stateData[`string_vl_cb_${section}`]) {
            isCurrCityValid = true;
          }
        });
        if (!isCurrCityValid) {
          setValidationData((prevState) => ({
            ...prevState,
            [`string_vl_cb_${section}State`]: 'has-danger',
          }));
          return isCurrCityValid;
        }
      }
      if (stateData[`string_vl_cb_per_${section}`]) {
        perArr.map((item, idx) => {
          if (item.label == stateData[`string_vl_cb_per_${section}`]) {
            isPerCityValid = true;
          }
        });
        if (!isPerCityValid) {
          setValidationData((prevState) => ({
            ...prevState,
            [`string_vl_cb_per_${section}State`]: 'has-danger',
          }));
        }
        return isCurrCityValid && isPerCityValid;
      }
    }
    return false;
  };

  const change = (e, type, name) => {
    const buttonText = e.target?.textContent;
    const valued = buttonText;
    if (valued === 'Verify') {
      let formValidated = true;
      bookLoansFormJsonFields().map((item, idx) => {
        if ((item.dept == 'Co-Applicant Details' || item.dept == 'Co-Applicant Current Address' || item.dept == 'Co-Applicant Permanent Address' || item.field == 'cb_pan') && item.isOptional == false) {
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
      }
    } else {
      let values;
      if (name === 'cb_pan') {
        values = e?.value?.toUpperCase();
        if (values?.length >= 10) {
          values = values.substring(0, 10);
        }
      } else if (name === 'cb_aadhaar') {
        values = e.value;
        if (values?.length >= 12) {
          values = values.substring(0, 12);
        }
        if (values && (values[values.length - 1] < '0' || values[values.length - 1] > '9')) {
          values = values.substring(0, values.length - 1);
        }
      } else if (name === 'cb_mobile') {
        values = e.value;
        if (values?.length >= 10) {
          values = values.substring(0, 10);
        }
      } else if (name === 'cb_pincode' || name === 'cb_per_pincode') {
        values = e.value;
        if (values?.length >= 6) {
          values = values.substring(0, 6);
        }
      } else if (name === "cb_resi_addr_ln1" || name === "cb_per_addr_ln1") {
        values = e.value;
        if (values?.length >= 40) {
          values = values.substring(0, 40);
        }
      }else {
        values = e.value;
      }
      const value = values;
      const field = `${type}_vl_${name}`;
      let isValid = validateData(field.substring(0, field.indexOf('_vl_')).toLowerCase(), value);

      if ((field.indexOf('resi') != -1 || field == 'string_vl_cb_city' || field == 'string_vl_cb_state' || field == 'pincode_vl_cb_pincode') && !viewPerAddress) {
        let perField;
        if (field == 'string_vl_cb_city') {
          perField = `string_vl_cb_per_city`;
        } else if (field == 'string_vl_cb_state') {
          perField = `string_vl_cb_per_state`;
        } else if (field == 'pincode_vl_cb_pincode') {
          perField = `pincode_vl_cb_per_pincode`;
        } else {
          perField = field.replace('resi', 'per');
        }
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
        [field]: value,
      }));

      setValidationData((prevState) => ({
        ...prevState,
        [`${field}State`]: !isValid ? 'has-danger' : '',
      }));
    }
    if (name === 'cb_state') {
      handleGetCurrCities(e, name);
      if (stateData.string_vl_cb_city) {
        setStateData((prevState) => ({
          ...prevState,
          [`string_vl_cb_city`]: '',
        }));
      }
    }
    if (name === 'cb_per_state') {
      handleGetPerCities(e, name);
      if (stateData.string_vl_cb_per_city) {
        setStateData((prevState) => ({
          ...prevState,
          [`string_vl_cb_per_city`]: '',
        }));
      }
    }
  };

  const renderFields = (department) => {
    return (
      <>
        <div
          style={{
            display: 'grid',
            rowGap: '28px',
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
                  item.field == 'cb_dob' ? (
                    <BasicDatePicker
                      disabled={navIconPrefixState['Co-Applicant Details'] == 'success' ? true : coAppStatus[coAppIndex - 1] || panVerify ? true : false}
                      placeholder={'Date of Birth'}
                      format="dd-MM-yyyy"
                      style={{ height: '56px' }}
                      value={(stateData && stateData[`${item.type}_vl_${item.field}`]) || null}
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
                      error={item.checked.toLowerCase() === 'true' ? validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' : stateData[`${item.type}_vl_${item.field}`] !== '' && validationData[`${item.type}_vl_${item.field}State`] === 'has-danger'}
                      helperText={item.checked.toLowerCase() === 'true' ? (validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' ? item.validationMsg : '') : stateData[`${item.type}_vl_${item.field}`] !== '' && (validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' ? item.validationMsg : '')}
                    />
                  ) : item.field === 'cb_aadhaar' ? (
                    <>
                      {subSectionStatus === 'in_progress' && leadStatus === 'follow_up_kyc' ? (
                        <AadharVerifyInputbox company_id={MSMECompanyId} product_id={MSMEProductId} row={item} stateData={stateData} props={props} disabledFields={disabledFields} loanAppId={loanAppId} viewPerAddress={viewPerAddress} validationData={validationData} setValidationData={setValidationData} validateData={validateData} setStateData={setStateData} sectionCode={'co_borrower'} sectionSequenceNumber={100} section={props?.item} showAlert={showAlert} setShouldFetch={setShouldFetch} />
                      ) : (
                        <InputBox
                          id={item.field}
                          label={item.title}
                          type={'text'}
                          isDrawdown={navIconPrefixState['Co-Applicant Details'] == 'success' ? false : item.field != 'cb_aadhaar' && panVerify ? false : coAppStatus[coAppIndex - 1] || (department == 'Co-Applicant Permanent Address' && !viewPerAddress) || item.field == 'cb_age' ? false : item?.isDrawdown ? true : false}
                          isDisabled={navIconPrefixState['Co-Applicant Details'] == 'success'|| props.type=="view" ? true : item.field == 'cb_aadhaar' && !panVerify ? true : panVerify && item.field != 'cb_aadhaar' ? true : coAppStatus[coAppIndex - 1] || (department == 'Co-Applicant Permanent Address' && !viewPerAddress) || item.field == 'cb_age' ? true : false}
                          initialValue={stateData && stateData[`${item.type}_vl_${item.field}`] ? stateData[`${item.type}_vl_${item.field}`] : ''}
                          onClick={(event) => change(event, item.type, item.field)}
                          customDropdownClass={InputBoxStyle}
                          customClass={{ height: '56px', width: '100%', maxWidth: '100%' }}
                          customInputClass={{
                            minWidth: '100%',
                            backgroundColor: '#fff',
                            marginTop: navIconPrefixState['Co-Applicant Details'] == 'success' ? '-3px' : item.field != 'cb_aadhaar' && panVerify ? '-3px' : coAppStatus[coAppIndex - 1] || (department == 'Co-Applicant Permanent Address' && !viewPerAddress) || item.field == 'cb_age' ? '-3px' : '0px',
                          }}
                          error={item.checked.toLowerCase() === 'true' ? validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' : stateData && stateData[`${item.type}_vl_${item.field}`] !== '' && validationData[`${item.type}_vl_${item.field}State`] === 'has-danger'}
                          helperText={item.checked.toLowerCase() === 'true' ? (validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' ? item.validationMsg : '') : stateData && stateData[`${item.type}_vl_${item.field}`] !== '' && (validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' ? item.validationMsg : '')}
                          options={item.isDrawdown ? (item.title === 'State' ? states : item.field === 'cb_city' ? currCity : item.field === 'cb_per_city' ? perCity : item.options) : []}
                        />
                      )}{' '}
                    </>
                  ) : item.field != 'cb_aadhar_front' && item.field != 'cb_aadhar_back' && item.field != 'cb_pan_doc' && item.field != 'cb_selfie' && item.field != 'cb_pan' ? (
                    <InputBox
                      id={item.field}
                      label={item.title}
                      type={item.field == 'cb_aadhaar' && props.type == 'view' ? 'text' : item.field === 'cb_aadhaar' || item.field === 'cb_mobile' || item.field === 'cb_pincode' || item.field === 'cb_per_pincode' ? 'number' : 'text'}
                      isDrawdown={navIconPrefixState['Co-Applicant Details'] == 'success' ? false : item.field != 'cb_aadhaar' && panVerify ? false : coAppStatus[coAppIndex - 1] || (department == 'Co-Applicant Permanent Address' && !viewPerAddress) || item.field == 'cb_age' ? false : item?.isDrawdown ? true : false}
                      isDisabled={navIconPrefixState['Co-Applicant Details'] == 'success' ? true : item.field == 'cb_aadhaar' && !panVerify ? true : panVerify && item.field != 'cb_aadhaar' ? true : coAppStatus[coAppIndex - 1] || (department == 'Co-Applicant Permanent Address' && !viewPerAddress) || item.field == 'cb_age' ? true : false}
                      initialValue={stateData && stateData[`${item.type}_vl_${item.field}`] ? stateData[`${item.type}_vl_${item.field}`] : ''}
                      onClick={(event) => change(event, item.type, item.field)}
                      customDropdownClass={InputBoxStyle}
                      customClass={{ height: '56px', width: '100%', maxWidth: '100%' }}
                      customInputClass={{
                        minWidth: '100%',
                        backgroundColor: '#fff',
                        marginTop: navIconPrefixState['Co-Applicant Details'] == 'success' ? '-3px' : item.field != 'cb_aadhaar' && panVerify ? '-3px' : coAppStatus[coAppIndex - 1] || (department == 'Co-Applicant Permanent Address' && !viewPerAddress) || item.field == 'cb_age' ? '-3px' : '0px',
                      }}
                      error={item.checked.toLowerCase() === 'true' ? validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' : stateData && stateData[`${item.type}_vl_${item.field}`] !== '' && validationData[`${item.type}_vl_${item.field}State`] === 'has-danger'}
                      helperText={item.checked.toLowerCase() === 'true' ? (validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' ? item.validationMsg : '') : stateData && stateData[`${item.type}_vl_${item.field}`] !== '' && (validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' ? item.validationMsg : '')}
                      options={item.isDrawdown ? (item.title === 'State' ? states : item.field === 'cb_city' ? currCity : item.field === 'cb_per_city' ? perCity : item.options) : []}
                    />
                  ) : item.field == 'cb_pan' ? (
                    <InputBox
                      isBoxType={panButtonState}
                      Buttonlabel={coAppStatus[coAppIndex - 1] || props.type == 'view' ? '' : 'Verify'}
                      id={item.field}
                      label={item.title}
                      isDisabled={navIconPrefixState['Co-Applicant Details'] == 'success' ? true : coAppStatus[coAppIndex - 1] || panVerify ? true : false}
                      initialValue={(stateData && stateData[`${item.type}_vl_${item.field}`] ? stateData[`${item.type}_vl_${item.field}`] : '').toUpperCase() ?? ''}
                      onClick={(event) => change(event, item.type, item.field)}
                      customDropdownClass={InputBoxStyle}
                      customClass={{ height: '56px', width: '100%', maxWidth: '100%', border: panBorder }}
                      customInputClass={{
                        minWidth: '100%',
                        backgroundColor: '#fff',
                        marginTop: `${navIconPrefixState['Co-Applicant Details'] == 'success' ? '-3px' : coAppStatus[coAppIndex - 1] || panVerify ? '-3px' : '0px'}`,
                      }}
                      error={item.checked.toLowerCase() === 'true' ? validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' : stateData[`${item.type}_vl_${item.field}`] !== '' && validationData[`${item.type}_vl_${item.field}State`] === 'has-danger'}
                      helperText={item.checked.toLowerCase() === 'true' ? (validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' ? item.validationMsg : '') : stateData[`${item.type}_vl_${item.field}`] !== '' && (validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' ? item.validationMsg : '')}
                      options={item.isDrawdown ? (item.title === 'State' ? states : item.field === 'cb_city' ? currCity : item.field === 'cb_per_city' ? perCity : item.options) : []}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <InputBox
                        id={item.field}
                        label={item.title}
                        isBoxType="button"
                        Buttonlabel={'Upload'}
                        isDrawdown={item?.isDrawdown ? true : false}
                        isDisabled={navIconPrefixState['Co-Applicant Details'] == 'success' ? true : coAppStatus[coAppIndex - 1] || (department == 'Co-Applicant Permanent Address' && !viewPerAddress) ? true : false}
                        initialValue={stateData[`${item.type}_vl_${item.field}`] ?? ''}
                        onClick={(event) => change(event, item.type, item.field)}
                        customDropdownClass={InputBoxStyle}
                        customInputClass={{
                          minWidth: '100%',
                          backgroundColor: '#fff',
                          marginTop: `${navIconPrefixState['Co-Applicant Details'] == 'success' ? '-3px' : coAppStatus[coAppIndex - 1] || (department == 'Co-Applicant Permanent Address' && !viewPerAddress) ? '-3px' : '0px'}`,
                        }}
                        error={item.checked.toLowerCase() === 'true' ? validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' : stateData[`${item.type}_vl_${item.field}`] !== '' && validationData[`${item.type}_vl_${item.field}State`] === 'has-danger'}
                        helperText={item.checked.toLowerCase() === 'true' ? (validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' ? item.validationMsg : '') : stateData[`${item.type}_vl_${item.field}`] !== '' && (validationData[`${item.type}_vl_${item.field}State`] === 'has-danger' ? item.validationMsg : '')}
                        customClass={{ height: '56px', width: '100%', maxWidth: '100%' }}
                        options={item.isDrawdown ? item.options : []}
                      />
                      <p className="book-loan-helper-text">{(selectedPANFileType['Response XML/JSON'] && item.field === 'cb_pan_doc') || (selectedAadharFileType['Response XML/JSON'] && (item.field === 'cb_aadhar_front' || item.field === 'cb_aadhar_back')) ? ' XML or JSON upto 5MB' : item.field !== 'cb_pan' ? ' JPG, JPEG, PNG, PDF upto 5MB' : ''}</p>
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

  const handlePermanentAddress = () => {
    setViewPerAddress(!viewPerAddress);
  };

  const handleAddData = () => {
    if(isLeadRejected){
      return showAlert(`Your lead has been rejected`,"error");
    }

    let postData = {};
    let formValidated = true;
    setSectionStatusCheck('inProgress');
    bookLoansFormJsonFields().map((item, idx) => {
      if (item.field == 'cb_aadhaar' && item.isOptional == false) {
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
    if (formValidated && documentStateData.Applicant_Selfie_1 && (documentStateData.Aadhar_Front_1|| documentStateData.Aadhar_XML) && (documentStateData.Pan_1|| documentStateData.Pan_XML)) {
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

          if (response?.co_applicant_details.length == parseInt(item[item.length - 1])) {
            id = response?.co_applicant_details[parseInt(item[item.length - 1]) - 1]?._id ?? -1;
          } else if (stateData[`_id`]) {
            id = stateData[`_id`];
          }

          stateData.loanAppId = loanAppId;
          stateData.section = 'co-applicants';
          const payload = {
            _id: id,
            loan_app_id: loanAppId,
            section: 'co-applicants',
            company_id: MSMECompanyId,
            product_id: MSMEProductId,
            msme_company_id: MSMECompanyId,
            msme_product_id: MSMEProductId,
            user_id: user._id,
            address_same: viewPerAddress ? 0 : 1,
            cb_fname: stateData?.string_vl_cb_fname,
            cb_email:stateData['email_vl_cb_email'],
            cb_mname: stateData[`string_vl_cb_mname`] ?? ' ',
            cb_lname: stateData[`string_vl_cb_lname`],
            cb_father_name: stateData[`string_vl_cb_father_name`],
            cb_mobile: stateData[`mobile_vl_cb_mobile`],
            cb_resi_addr_ln1: stateData[`string_vl_cb_resi_addr_ln1`],
            cb_resi_addr_ln2: stateData[`string_vl_cb_resi_addr_ln2`] ?? ' ',
            cb_city: stateData[`string_vl_cb_city`],
            cb_state: stateData[`string_vl_cb_state`],
            cb_pincode: stateData[`pincode_vl_cb_pincode`],
            cb_per_addr_ln1: stateData[`string_vl_cb_per_addr_ln1`],
            cb_per_addr_ln2: stateData[`string_vl_cb_per_addr_ln2`] ?? ' ',
            cb_per_city: stateData[`string_vl_cb_per_city`],
            cb_per_state: stateData[`string_vl_cb_per_state`],
            cb_per_pincode: stateData[`pincode_vl_cb_per_pincode`],
            cb_pan: stateData[`pan_vl_cb_pan`],
            cb_dob: stateData[`date_vl_cb_dob`],
            cb_gender: stateData[`string_vl_cb_gender`],
            cb_aadhaar: stateData[`aadhaar_vl_cb_aadhaar`],
            sub_section_code: SectionData.co_borrower.co_borrower_section_submit.sub_section_code,
            section_sequence_no: SectionData.co_borrower.section_sequence_no,
            section_name: SectionData.co_borrower.section_name + `${coAppIndex}`,
            sub_section_name: SectionData.co_borrower.co_borrower_section_submit.sub_section_name,
            sub_section_sequence_no: SectionData.co_borrower.co_borrower_section_submit.sub_section_sequence_no,
            section_code: SectionData.co_borrower.section_code,
          };
          dispatch(
            patchMsmeDetailsWatcher(
              payload,
              async (result) => {
                setStatusCheckApi(loanAppId, SectionData.co_borrower.section_code, SectionData.co_borrower.co_borrower_section_submit.sub_section_code, dispatch, 0);
              },
              (error) => {
                setSectionStatusCheck('');
              },
            ),
          );
        })
        .catch((error) => {
          showAlert('Error in fetching loan details', 'error');
          setSectionStatusCheck('');
        });
    } else {
      showAlert('Kindly check for errors in fields', 'error');
      setSectionStatusCheck('');
    }
  };

  const handleDeleteButton = () => {
    const payload = {
      loan_app_id: loanAppId,
      section: 'co-applicants',
      msme_company_id: MSMECompanyId,
      msme_product_id: MSMEProductId,
      user_id: user._id,
      _id: stateData[`_id`],
      cb_pan: stateData[`pan_vl_cb_pan`],
      delete: true,
    };
    dispatch(
      patchMsmeDetailsWatcher(
        payload,
        async (result) => {
          showAlert('Co-Applicant Deleted Successfully', 'success');
          const coAppData = [...coApplicantsData];
          coAppData.splice(coAppIndex - 1, 1);
          coAppData.push({});
          setCoApplicantsData(coAppData);
          if (CoApplicantCount > 1) {
            const coAppArr = [...coApplicantArray];
            coAppArr.splice(coApplicantArray.length - 1, 1);
            setCoApplicantArray(coAppArr);
            setCoApplicantCount(CoApplicantCount - 1);
          }
          setPanVerify(false);
          const coAppSt = [...coAppStatus];
          coAppSt.splice(coAppIndex - 1, 1);
          coAppSt.push(false);
          setCoAppStatus(coAppSt);
        },
        (error) => {},
      ),
    );
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

        if (response?.co_applicant_details.length == parseInt(item[item.length - 1])) {
          id = response?.co_applicant_details[parseInt(item[item.length - 1]) - 1]?._id ?? -1;
        } else if (stateData[`_id`]) {
          id = stateData[`_id`];
        }
          if (id!=-1) {
          const payload = {
            loan_app_id: loanAppId,
            section: 'co-applicants',
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
                const coAppData = [...coApplicantsData];
                coAppData.splice(coAppIndex - 1, 1);
                coAppData.push({});
                setCoApplicantsData(coAppData);
                fetchLoanDetails(0);
                setNavIconPrefixState((prevState) => ({
                  ...prevState,
                  'Co-Applicant Details': 'success',
                }));
                setNavState('Guarantor Details');
                if (coApplicantArray.length > 1) {
                  setCoApplicantCount(CoApplicantCount - 1);
                  let coAppArr = [...coApplicantArray];
                  coAppArr.splice(coApplicantArray.length - 1, 1);
                  setCoApplicantArray(coAppArr);
                }
              },
              (error) => {},
            ),
          );
        } else {
          const coAppData = [...coApplicantsData];
          coAppData.splice(coAppIndex - 1, 1);
          coAppData.push({});
          setCoApplicantsData(coAppData);
          fetchLoanDetails(0);
          setNavIconPrefixState((prevState) => ({
            ...prevState,
            'Co-Applicant Details': 'success',
          }));
          setNavState('Guarantor Details');
          if (coApplicantArray.length > 1) {
            setCoApplicantCount(CoApplicantCount - 1);
            let coAppArr = [...coApplicantArray];
            coAppArr.splice(coApplicantArray.length - 1, 1);
            setCoApplicantArray(coAppArr);
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
    {props.type == 'edit' && props.leadComment[`co-applicant_details_${code-299}`] && <LogViewer head="Credit Manager Comment" body={props.leadComment[`co-applicant_details_${code-299}`]} />}
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
              coAppStatus[coAppIndex - 1] ? (
                <Button
                  id="delete"
                  label="Delete"
                  buttonType="link-button"
                  onClick={handleDeleteButton}
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
                    height: '32px',
                    width: '64px',
                    fontSize: '14px',
                    color: '#134CDE',
                  }}
                />
              )
            ) : null}
          </>
        ) : null}
      </div>
      <div>{renderFields('Co-Applicant Details')}</div>
      <div style={customSubHeaderStyle}>Current Address</div>
      <div>{renderFields('Co-Applicant Current Address')}</div>
      <div style={{ display: 'flex' }}>
        <div style={customSubHeaderStyle}>Permanent Address</div>
        <input style={{ marginLeft: '16px', marginTop: '2.5%', width: '1rem', height: '1rem' }} type="checkbox" onClick={handlePermanentAddress} checked={!viewPerAddress} disabled={panButtonState === 'icon' ? true : false}></input>
        <div style={{ fontFamily: 'Montserrat-Regular', fontSize: '0.9vw', marginTop: '2.3%', marginLeft: '0.5%', color: '#767888' }}> Same as current address</div>
      </div>
      <div>{renderFields('Co-Applicant Permanent Address')}</div>

      <div style={CustomHeaderStyle}>Co-Applicant KYC</div>
      <div>{renderFields('Co-Applicant KYC')}</div>
      <div style={customSubHeaderStyle}>KYC Documents</div>
      {/* <div>{renderFields("Co-Applicant KYC Documents")}</div> */}

      <div style={{ marginLeft: '2%' }}>
        <UploadFileInput
          borrowerIndex={coAppIndex}
          uploadFileName={uploadFileName}
          items={applicantSelfieState}
          title=""
          backgroundColorBlur={props.type == 'view' || (props.type == 'edit' && panVerify == true) ? false : backgroundColorBlur}
          backgroundColorChange={true}
          isSubmit={props.type == 'view' ? false : coAppStatus[coAppIndex - 1]}
          isXML={false}
          loanAppId={loanAppId}
          setDocumentStateData={setDocumentStateData}
          data={{ company_id: MSMECompanyId, product_id: MSMEProductId }}
          showAlert={showAlert}
          sectionName={sectionName}
          MSMECompanyId={MSMECompanyId}
          MSMEProductId={MSMEProductId}
          isChange={sectionStatus.includes(statusObject?.section_status) ? false : true}
          type={props.type}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', columnGap: '5%' }}>
        <div style={CustomHeader}>Select PAN Document Type</div>
        <label style={{ ...radioCss, color: coAppStatus[coAppIndex - 1] ? '#C0C1C8' : panButtonState === 'icon' ? 'var(--neutrals-neutral-100, #161719)' : '#C0C1C8' }}>
          <input type="checkbox" value="Image & PDF" checked={selectedPANFileType['Image & PDF']} onChange={handlePANRadioButton} style={radioInputCss} disabled={coAppStatus[coAppIndex - 1] || props.type == 'view'} />
          Image & PDF
        </label>
        <label style={{ ...radioCss, color: coAppStatus[coAppIndex - 1] ? '#C0C1C8' : panButtonState === 'icon' ? 'var(--neutrals-neutral-100, #161719)' : '#C0C1C8' }}>
          <input type="checkbox" value="Response XML/JSON" checked={selectedPANFileType['Response XML/JSON']} onChange={handlePANRadioButton} style={radioInputCss} disabled={coAppStatus[coAppIndex - 1] || props.type == 'view' ? true : coAppStatus[coAppIndex - 1] ? true : panButtonState === 'icon' ? false : true} />
          Response XML/JSON
        </label>
      </div>
      {/* <div>{renderFields("Co-Applicant PAN Details")}</div> */}
    <div style={{display:'flex'}}>
        {selectedPANFileType['Image & PDF'] ? (
          <div style={{ marginLeft: '2%' }}>
            <UploadFileInput
              key={selectedPANFileType['Image & PDF']}
              borrowerIndex={coAppIndex}
              uploadFileName={uploadFileName}
              items={panView}
              title=""
              backgroundColorBlur={props.type == 'view' || (props.type == 'edit' && panVerify == true) ? false : backgroundColorBlur}
              backgroundColorChange={true}
              isSubmit={props.type == 'view' ? false : coAppStatus[coAppIndex - 1]}
              isXML={false}
              // shouldDelete={true}
              loanAppId={loanAppId}
              setDocumentStateData={setDocumentStateData}
              sectionName={sectionName}
              data={{ company_id: MSMECompanyId, product_id: MSMEProductId }}
              showAlert={showAlert}
              borrowerId={stateData?.borrower_id}
              MSMECompanyId={MSMECompanyId}
              MSMEProductId={MSMEProductId}
              isChange={sectionStatus.includes(statusObject?.section_status) ? false : true}
              type={props.type}
            />
          </div>
        ) : null}
      { selectedPANFileType['Response XML/JSON'] ? (
          <div style={{ marginLeft: '2%' }}>
            <UploadFileInput
              key={selectedPANFileType['Response XML/JSON']}
              borrowerIndex={coAppIndex}
              uploadFileName={uploadFileName}
              items={panXMLView}
              title=""
              backgroundColorBlur={props.type == 'view' || (props.type == 'edit' && panVerify == true) ? false : backgroundColorBlur}
              backgroundColorChange={true}
              isSubmit={props.type == 'view' ? false : coAppStatus[coAppIndex - 1]}
              isXML={true}
              // shouldDelete={true}
              loanAppId={loanAppId}
              setDocumentStateData={setDocumentStateData}
              sectionName={sectionName}
              data={{ company_id: MSMECompanyId, product_id: MSMEProductId }}
              borrowerId={stateData?.borrower_id}
              showAlert={showAlert}
              MSMECompanyId={MSMECompanyId}
              MSMEProductId={MSMEProductId}
              isChange={sectionStatus.includes(statusObject?.section_status) ? false : true}
              type={props.type}
            />
          </div>
      ): null}
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', columnGap: '5%' }}>
        <div style={CustomHeader}>Select Aadhaar Document Type</div>
        <label style={{ ...radioCss, color: coAppStatus[coAppIndex - 1] ? '#C0C1C8' : panButtonState === 'icon' ? 'var(--neutrals-neutral-100, #161719)' : '#C0C1C8' }}>
          <input type="checkbox" value="Image & PDF" checked={selectedAadharFileType['Image & PDF']} onChange={handleAadharRadioButton} style={radioInputCss} disabled={coAppStatus[coAppIndex - 1] || props.type == 'view'} />
          Image & PDF
        </label>
        <label style={{ ...radioCss, color: coAppStatus[coAppIndex - 1] ? '#C0C1C8' : panButtonState === 'icon' || coAppStatus[coAppIndex - 1] ? 'var(--neutrals-neutral-100, #161719)' : '#C0C1C8' }}>
          <input type="checkbox" value="Response XML/JSON" checked={selectedAadharFileType['Response XML/JSON']} onChange={handleAadharRadioButton} style={radioInputCss} disabled={coAppStatus[coAppIndex - 1] || props.type == 'view' ? true : coAppStatus[coAppIndex - 1] ? true : panButtonState === 'icon' ? false : true} />
          Response XML/JSON
        </label>
      </div>
      {/* <div>{renderFields("Co-Applicant Aadhar Details")}</div> */}

      <div style={{display:"flex"}}>
        {selectedAadharFileType['Image & PDF'] ? (
          <div style={{ marginLeft: '2%' }}>
            <UploadFileInput
              key={selectedAadharFileType['Image & PDF']}
              borrowerIndex={coAppIndex}
              uploadFileName={uploadFileName}
              items={aadharFrontView}
              title=""
              backgroundColorBlur={statusObject?.section_status == 'approved' ? true : props.type == 'view' || (props.type == 'edit' && panVerify == true) ? false : backgroundColorBlur}
              backgroundColorChange={true}
              isSubmit={props.type == 'view' ? false : coAppStatus[coAppIndex - 1]}
              isXML={false}
              loanAppId={loanAppId}
              setDocumentStateData={setDocumentStateData}
              sectionName={sectionName}
              data={{ company_id: MSMECompanyId, product_id: MSMEProductId }}
              borrowerId={stateData?.borrower_id}
              showAlert={showAlert}
              // shouldDelete={true}
              MSMECompanyId={MSMECompanyId}
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
              borrowerIndex={coAppIndex}
              uploadFileName={uploadFileName}
              items={aadharfrontXML}
              title=""
              backgroundColorBlur={props.type == 'view' || (props.type == 'edit' && panVerify == true) ? false : backgroundColorBlur}
              backgroundColorChange={true}
              isSubmit={props.type == 'view' ? false : coAppStatus[coAppIndex - 1]}
              isXML={true}
              loanAppId={loanAppId}
              // shouldDelete={true}
              setDocumentStateData={setDocumentStateData}
              sectionName={sectionName}
              data={{ company_id: MSMECompanyId, product_id: MSMEProductId }}
              borrowerId={stateData?.borrower_id}
              showAlert={showAlert}
              MSMECompanyId={MSMECompanyId}
              MSMEProductId={MSMEProductId}
              isChange={sectionStatus.includes(statusObject?.section_status) ? false : true}
              type={props.type}
            />
          </div>
        ):null}
      </div>

      {navIconPrefixState['Co-Applicant Details'] == 'success' ? null : !coAppStatus[coAppIndex - 1] && props.type == 'edit' ? (
        <>
          {item != 'Co-Applicant 5' ? (
            <div style={{ display: 'flex', marginTop: '2%', marginBottom: '2%', justifyContent: 'space-between' }} className="book-loan-button-container book-loan-button-alignment-triple-button">
              <Button id="verifyCoApp" label="Verify & Add Co-Applicant" buttonType="secondary" isLoading={addCoApplicantLoader === 'inProgress' ? true : false} isDisabled={!validForm || !documentStateData.Applicant_Selfie_1 || !(documentStateData.Aadhar_Front_1 || documentStateData.Aadhar_XML) || !(documentStateData.Pan_1 || documentStateData.Pan_XML) || sectionStatusCheck == 'inProgress'} onClick={handleCoAppNumber} customStyle={customButtonStyle} />
              <div className="book-loan-button-alignment-double-button">
                <Button
                  id="validate"
                  label="Verify & Next"
                  buttonType="linkssss"
                  onClick={handleAddData}
                  isLoading={sectionStatusCheck === 'inProgress' ? true : false}
                  isDisabled={statusObject?.section_status === LeadNewStatus.InProgress && leadStatus === LeadNewStatus.Pending ? false : !validForm || !documentStateData.Applicant_Selfie_1 || !(documentStateData.Aadhar_Front_1 || documentStateData.Aadhar_XML )|| !(documentStateData.Pan_1 || documentStateData.Pan_XML) || addCoApplicantLoader == 'inProgress'}
                  customStyle={customValidateButton}
                  customLoaderClass={{
                    borderTop: '4px solid #fff',
                  }}
                />
                {leadStatus =="draft" && <Button id="saveDraft" label="Save as Draft" buttonType="secondary" customStyle={customSaveButton} onClick={saveCoApplicantDraft} isDisabled={disableDraftButton} />}
              </div>
            </div>
          ) : (
            <div className="book-loan-button-alignment-double-button">
              <Button
                id="validate"
                label="Verify & Next"
                isLoading={sectionStatusCheck === 'inProgress' ? true : false}
                isDisabled={statusObject?.section_status === LeadNewStatus.InProgress && leadStatus === LeadNewStatus.Pending ? false : !validForm || !documentStateData.Applicant_Selfie_1 || !(documentStateData.Aadhar_Front_1 || documentStateData.Aadhar_XML) || !(documentStateData.Pan_1 || documentStateData.Pan_XML)}
                buttonType="linkssss"
                onClick={handleAddData}
                customStyle={customValidateButton}
                customLoaderClass={{
                  borderTop: '4px solid #fff',
                }}
              />
               {leadStatus == "draft" &&<Button id="saveDraft" label="Save as Draft" buttonType="secondary" customStyle={customSaveButton} onClick={saveCoApplicantDraft} isDisabled={disableDraftButton} />}
            </div>
          )}
        </>
      ) : null}
      {alert ? <Alert severity={severity} message={alertMessage} handleClose={handleAlertClose} /> : null}
    </div>
  );
}
