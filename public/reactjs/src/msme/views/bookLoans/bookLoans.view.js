import * as React from 'react';
import { bookLoansFormJsonFields } from './bookLoansFormJson';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { storedList } from '../../../util/localstorage';
import InputBox from 'react-sdk/dist/components/InputBox/InputBox';
import Button from 'react-sdk/dist/components/Button';
import GuarantorForm from './guarantorDetailsForm';
import CoApplicantForm from './coApplicantForm';
import ApplicantDetailsForm from './applicantDetailsForm';
import FinancialDocument from '../financialDocument/FinancialDocument';
import AdditionalDocument from './additionalDocuments';
import OfferPage from './bookLoansDocumentMapping/offerPage';
import EntityDetailsForm from './entityDetailsForm';
import ShareHoldingPattern from './shareHoldingPattern';
import 'react-sdk/dist/styles/_fonts.scss';
import SuccessIcon from '../../../assets/img/successIcon.svg';
import DeviationIcon from '../../../assets/img/DeviationIcon.svg';
import Alert from 'react-sdk/dist/components/Alert/Alert';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { getLeadSectionStatusWatcher } from './../../actions/status.action';
import Preloader from '../../../components/custom/preLoader';
import { LogViewer } from 'msme/components/LogViewer/LogViewer';
import { deepCopy } from 'util/msme/helper';
import { LeadStatus } from '../../config/LeadStatus';
import { LeadNewStatus } from '../../config/LeadStatus';

const user = { _id: storedList('user')?._id, id: storedList('user')?.id };

const sanitizedData = (data, keys = [], type = "view") => {
  const tempData = deepCopy(data);

  if (type == "edit") {
    if (Array.isArray(tempData)) {
      for (let i = 0; i < tempData.length; i++) {
        if (tempData[i]) {
          for (let key of keys) {
            if (tempData[i][key]) {
              delete tempData[i][key]
            }
          }
        }
      }
    } else {
      for (let key of keys) {
        if (tempData && tempData[key]) {
          delete tempData[key]
        }
      }
    }
  }

  return tempData;
}

export default function BookLoans(props) {
  const dispatch = useDispatch();
  const useAsyncState = (initialState) => {
    const [state, setState] = useState(initialState);
    const asyncSetState = (value) => {
      return new Promise((resolve) => {
        setState(value);

        setState((current) => {
          resolve(current);

          return current;
        });
      });
    };

    return [state, asyncSetState];
  };
  const location = useLocation();
  const type = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
  const store = useSelector((state) => state);

  const [coAppForm, setCoAppForm] = useState(true);
  const [guarantorForm, setGuarantorForm] = useState(false);
  const [navState, setNavState] = useState('Applicant Details');
  const isLoading = useSelector((state) => state.profile.loading);
  const [company, setCompany] = useAsyncState(null);
  const [product, setProduct] = useAsyncState(null);
  const [stateData, setStateData] = useState({});
  const [validationData, setValidationData] = useState({});
  const [CoApplicantCount, setCoApplicantCount] = useState(1);
  const [GuarantorCount, setGuarantorCount] = useState(1);
  const [flag, setFlag] = useState(true);
  const [coApplicantArray, setCoApplicantArray] = useState(['Co-Applicant 1']);
  const [guarantorArray, setGuarantorArray] = useState(['Guarantor 1']);
  const [applicantData, setApplicantData] = useState('');
  const [entityData, setEntityData] = useState(null);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [MSMECompanyId, setMSMECompanyId] = useState('');
  const [MSMEProductId, setMSMEProductID] = useState('');
  const [leadStatus, setLeadStatus] = useState('');
  const [statusCheck, setStatusCheck] = useState(false);
  const [navIconPrefixState, setNavIconPrefixState] = useState({
    'Applicant Details': null,
    'Entity Details': null,
    'Co-Applicant Details': null,
    'Guarantor Details': null,
    Shareholding: null,
    'Financial Docs': null,
    'Additional Docs': null,
    Offer: null,
  });
  const [navIconBottomState, setNavIconBottomState] = useState({
    'Applicant Details': null,
    'Entity Details': null,
    'Co-Applicant 1': null,
    'Guarantor 1': null,
    Shareholding: null,
    'Financial Docs': null,
    'Additional Docs': null,
  });
  const [coApplicantsData, setCoApplicantsData] = useState([{}, {}, {}, {}, {}]);
  const [guarantorsData, setGuarantorsData] = useState([{}, {}]);
  const [coAppStatus, setCoAppStatus] = useState(Array.from({ length: 5 }, () => false));
  const [guarantorStatus, setGuarantorStatus] = useState(Array.from({ length: 5 }, () => false));
  const [loanAppId, setLoanAppId] = useState('');

  const [showShareHolding, setShowShareHolding] = useState(false);
  const [additionalDocuments, setAdditionalDocuments] = useState(null);
  useEffect(() => {
    handleEditView();
  }, [props.fetchedApplicantDetails, props.fetchedEntityDetails, props.fetchedCoApplicantDetails, props.fetchedGuarantorDetails, props.navPrefixStateEdit, props.shouldFetch]);

  const handleEditView = () => {

    if (props.fetchedApplicantDetails) {
      setApplicantData(props.fetchedApplicantDetails);
      if (props.fetchedApplicantDetails.lead_status) {
        setLeadStatus(props.fetchedApplicantDetails.lead_status)
      }
      if (props.fetchedApplicantDetails.company_id) {
        setMSMECompanyId(props.fetchedApplicantDetails.company_id);
      }
      if (props.fetchedApplicantDetails.product_id) {
        setMSMEProductID(props.fetchedApplicantDetails.product_id);
      }
    }
    if (props.fetchedEntityDetails) {
      setEntityData(props.fetchedEntityDetails);
      if (props.fetchedEntityDetails.string_vl_select_entity_type && props.fetchedEntityDetails.string_vl_select_entity_type !== 'Proprietor') {
        setShowShareHolding(true);
      }
    }
    if (props.fetchedCoApplicantDetails) {
      var temp = [];
      for (var i = 0; i < props.fetchedCoApplicantDetails.length; i++) {
        temp.push(`Co-Applicant ${i + 1}`);
      }
      if (type == 'edit'  && temp.length == 0 && props.leadStatus === LeadNewStatus.Draft) {
        setCoApplicantArray(['Co-Applicant 1']);
        setCoApplicantsData([])
      } else {
        setCoApplicantArray(temp);
        setCoApplicantsData(props.fetchedCoApplicantDetails);
      }
    }
    if (props.fetchedGuarantorDetails) {
      var temp = [];
      for (let i = 0; i < props.fetchedGuarantorDetails.length; i++) {
        temp.push(`Guarantor ${i + 1}`);
      }
      if (type == 'edit' && temp.length == 0 && props.leadStatus === LeadNewStatus.Draft) {
        setGuarantorArray(['Guarantor 1']);
        setGuarantorsData([])
      } else {
        setGuarantorArray(temp);
        setGuarantorsData(props.fetchedGuarantorDetails);
      }
    }
    if (props.additionalDocumentsDetails) {
      setAdditionalDocuments(props.additionalDocumentsDetails);
    }
    if (props.navPrefixStateEdit) {
      setNavIconPrefixState(props.navPrefixStateEdit);
      for (let tempNavState of Object.keys(props.navPrefixStateEdit)) {
        if (props.navPrefixStateEdit[tempNavState] != 'success') {
          if(props.navPrefixStateEdit[tempNavState]=='deviation' && props.fetchedApplicantDetails && props.fetchedApplicantDetails.lead_status=="draft"){
            continue;
          }else{
            setNavState(tempNavState);
            break;
          }
        }
      }
    }
    if (props.leadStatus === LeadStatus.new.value)
    {
      setNavState('Offer');
    }
  };

  const getARDstatus = (status) => {
    if (status == 'approved') {
      return 'success';
    } else if (status == 'deviation') {
      return 'deviation';
    } else {
      return 'rejected';
    }
  };

  const getSectionStatus = (loanAppID) => {
    new Promise((resolve, reject) => {
      dispatch(getLeadSectionStatusWatcher(loanAppID, resolve, reject));
    })
      .then((response) => {
        let statusPerSection = response;
        statusPerSection.forEach((section) => {
          if (section.section_code == 'primary') {
            setNavIconPrefixState((prevState) => ({
              ...prevState,
              'Applicant Details': getARDstatus(section.section_status),
            }));
            setStatusCheck(false);
          } else if (section.section_code == 'entity') {
            setNavIconPrefixState((prevState) => ({
              ...prevState,
              'Entity Details': getARDstatus(section.section_status),
            }));
            setStatusCheck(false);
          } else if (section.section_code == 'co_applicant') {
            setNavIconPrefixState((prevState) => ({
              ...prevState,
              'Co-Applicant Details': getARDstatus(section.section_status),
            }));
            setStatusCheck(false);
          } else if (section.section_code == 'gurantor') {
            setNavIconPrefixState((prevState) => ({
              ...prevState,
              'Guarantor Details': getARDstatus(section.section_status),
            }));
            setStatusCheck(false);
          } else if (section.section_code == 'shareholding') {
            setNavIconPrefixState((prevState) => ({
              ...prevState,
              Shareholding: getARDstatus(section.section_status),
            }));
            setStatusCheck(false);
          } else if (section.section_code == 'financialdoc') {
            setNavIconPrefixState((prevState) => ({
              ...prevState,
              'Financial Docs': getARDstatus(section.section_status),
            }));
            setStatusCheck(false);
          } else if (section.section_code == 'additionalddoc') {
            setNavIconPrefixState((prevState) => ({
              ...prevState,
              'Additional Docs': getARDstatus(section.section_status),
            }));
            setStatusCheck(false);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // setInterval(() => {
  //   getSectionStatus(loanAppId);
  // }, 300000);

  // useEffect(() => {
  //   setInterval(() => {
  //   getSectionStatus(loanAppId);
  // }, 10000);
  // }, [statusCheck, loanAppId, applicantData, props.navPrefixStateEdit])

  useEffect(() => {
    if (props.loanAppId) {
      setLoanAppId(props.loanAppId);
    }
  }, [props.loanAppId]);

  const inputBoxCss = {
    marginTop: '8px',
    maxHeight: '500px',
    zIndex: 1,
    padding: '0px 16px',
    width: '290px',
  };

  const MenuCss = {
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
    color: '#767888',
    marginTop: '20px',
    marginRight: '10px',
  };

  const headingCss = {
    color: 'var(--neutrals-neutral-100, #161719)',
    fontFamily: 'Montserrat-semibold',
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: '150%',
    marginBottom: '24px',
    marginTop: '24px',
  };
  const navItemCss = {
    color: 'var(--neutrals-neutral-60, #767888)',
    fontFamily: 'Montserrat-Regular',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '21px',
    marginTop: '36px',
    cursor: 'pointer',
  };
  const selectedItemCss = {
    color: 'var(--neutrals-neutral-100, #161719)',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: '14px',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: '21px',
    marginTop: '36px',
    cursor: 'pointer',
  };
  const inputBoxDropdownCss = {
    marginTop: '8px',
    maxHeight: '500px',
    width: '485px',
    zIndex: 1,
    padding: '0px 16px',
  };

  const customInputBoxStyle = {
    height: '2.5vh',
    maxWidth: '100%',
    width: '100%',
  };

  const CustomHeaderStyle = {
    fontFamily: 'Montserrat-Bold',
    marginLeft: '2%',
    color: '#161719',
    fontSize: '1.3vw',
  };
  const customSubHeaderStyle = {
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: '2%',
    color: '#161719',
    fontSize: '1.2vw',
  };
  const changeActiveTab = (tabName) => {
    const tabClickHandlers = {
      'co applicant form': handleCoAppForm,
      'guarantor form': handleGuarantorForm,
    };
    const tabClickHandler = tabClickHandlers[tabName];

    if (tabClickHandler) {
      tabClickHandler();
    }
  };
  const handleGuarantorForm = () => {
    setGuarantorForm(true);
    setCoAppForm(false);
  };
  const handleCoAppForm = () => {
    setCoAppForm(true);
    setGuarantorForm(false);
  };
  const handleFormChange = (section_name) => {
    setNavState(section_name);
  };
  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setOpenPopup(false);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };
  const handleClose = () => {
    setOpenPopup(false);
  };

  const change = (e, type, name) => {
    const value = e.value;
    let field = `${type}_vl_${name}`;
    let isValid = validateData(field.substring(0, field.indexOf('_vl_')).toLowerCase(), value);
    if (field === 'string_vl_per_addr_ln1') {
      if (value.length <= 4) {
        isValid = false;
      }
    }
    setStateData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setValidationData((prevState) => ({
      ...prevState,
      [`${field}State`]: !isValid ? 'has-danger' : '',
    }));
  };
  const dropDownChange = (value, name) => {
    const pincodeVal = name === 'pincode' ? value?.value : stateData.pincode_vl_pincode;
    setStateData((prevState) => ({
      ...prevState,
      pincode_vl_pincode: pincodeVal ?? '',
      [`string_vl_${name}`]: value?.value ?? '',
    }));

    if (value === null || value === undefined) return handleClearDropdown(name);

    if (
      (name === 'state' ||
        name === 'bus_add_corr_state' ||
        name === 'co_borr_1_res_state' ||
        name === 'co_borr_2_res_state' ||
        name === 'co_borr_3_res_state' ||
        name === 'co_borr_1_res_city' ||
        name === 'co_borr_2_res_city' ||
        name === 'co_borr_3_res_city' ||
        name === 'co_borr_1_per_state' ||
        name === 'co_borr_2_per_state' ||
        name === 'co_borr_3_per_state' ||
        name === 'co_borr_1_per_city' ||
        name === 'co_borr_2_per_city' ||
        name === 'co_borr_3_per_city' ||
        name == 'guarantor_1_res_city' ||
        name == 'guarantor_1_per_city' ||
        name == 'guarantor_2_res_city' ||
        name == 'guarantor_2_per_city' ||
        name == 'guarantor_1_res_state' ||
        name == 'guarantor_1_per_state' ||
        name == 'guarantor_2_res_state' ||
        name == 'guarantor_2_per_state' ||
        name === 'per_state' ||
        name === 'bus_add_per_state') &&
      value !== undefined &&
      value !== null
    ) {
      setStateData((prevState) => ({
        ...prevState,
        pincode_vl_pincode: stateData.pincode_vl_pincode,
      }));
      //setCityState([]);
      setPincodeState([]);
      handleGetCities(value, name, name === 'state' || name === 'bus_add_corr_state' || name === 'per_state' || name === 'bus_add_per_state' ? false : true);
    }

    if (name === 'city' && value !== undefined && value !== null) {
      setPincodeState([]);
      handleGetPincodes(value);
    }

    const validatingType = name === 'pincode' ? 'pincode' : 'string';
    const isValid = validateData(validatingType, value?.value);

    setValidationData((prevState) => ({
      ...prevState,
      [`${validatingType}_vl_${name}State`]: !isValid ? 'has-danger' : '',
    }));
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

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity('');
    setAlertMessage('');
  };

  const handleNavChange = (section) => {
    if (type == 'view') {
      setNavState(section);
    } else {
      if (section == 'Applicant Details') {
        setNavState('Applicant Details');
      } else if (section == 'Entity Details') {
        if (navIconPrefixState['Applicant Details'] && (navIconPrefixState['Applicant Details'] === 'success' || navIconPrefixState['Applicant Details'] === 'deviation')) {
          setNavState(section);
        }
      } else if (section == 'Co-Applicant Details') {
        if (navIconPrefixState['Entity Details'] && (navIconPrefixState['Entity Details'] === 'success' || navIconPrefixState['Entity Details'] === 'deviation')) {
          setNavState(section);
        }
      } else if (section == 'Guarantor Details') {
        if (navIconPrefixState['Co-Applicant Details'] && (navIconPrefixState['Co-Applicant Details'] === 'success' || navIconPrefixState['Co-Applicant Details'] === 'deviation')) {
          setNavState(section);
        }
      } else if (section == 'Shareholding') {
        if (navIconPrefixState['Guarantor Details'] && (navIconPrefixState['Guarantor Details'] === 'success' || navIconPrefixState['Guarantor Details'] === 'deviation')) {
          setNavState(section);
        }
      } else if (section == 'Financial Docs') {
        if (showShareHolding) {
          if (navIconPrefixState['Shareholding'] && (navIconPrefixState['Shareholding'] === 'success' || navIconPrefixState['Shareholding'] === 'deviation')) {
            setNavState(section);
          }
        } else if (navIconPrefixState['Guarantor Details'] && (navIconPrefixState['Guarantor Details'] === 'success' || navIconPrefixState['Guarantor Details'] === 'deviation')) {
          setNavState(section);
        }
      } else {
        if (navIconPrefixState['Financial Docs']) {
          setNavState(section);
        }
      }
    }
  };

  const renderNavItem = (item) => {
    return (
      <span style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ display: 'flex', flexDirection: 'row' }}>
          {navIconPrefixState[`${item}`] == 'success' ? (
            <img style={{ marginTop: '16px',marginBottom: '16px', marginRight: '4px' }} src={SuccessIcon} alt="Icon" />
          ) : navIconPrefixState[`${item}`] == 'deviation' ? (
            <span style={{ display: 'flex' }}>
              <span>
                <img style={{ marginTop: '16px',marginBottom: '16px', marginRight: '4px' }} src={DeviationIcon} alt="Icon" />
              </span>
            </span>
          ) : null}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={
                navState === item
                  ? {
                    ...selectedItemCss,
                    marginTop: '16px',
                    marginBottom: '16px',
                    marginRight: '10px',
                  }
                  : { ...navItemCss, marginTop: '16px',marginBottom: '16px', marginRight: '10px', color: (navIconPrefixState[`${item}`] == 'success' || navIconPrefixState[`${item}`] == 'deviation'? '#161719' : '#767888')  }
              }
              onClick={() => handleNavChange(item)}
            >
              {item}
            </span>
            {navIconBottomState[`${item}`] === 'Deviation' ? (
              <span style={{ display: 'flex' }}>
                <span>
                  <img src={DeviationIcon} alt="Icon" />
                </span>
              </span>
            ) : null}
          </div>
        </span>
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', background: '#E5E5E8)' }}>
      <div style={{ paddingLeft: '22px', width: '14%' }}>
        <div>
          {renderNavItem('Applicant Details')}
          {renderNavItem('Entity Details')}
          {/* {renderNavItem("Co-Applicant")}
          {renderNavItem("Guarantor")} */}
          <div>{renderNavItem('Co-Applicant Details')}</div>
          {/* <button style={{ color: "var(--primary-blue-primary-blue-70, #134CDE)", fontFamily: "Montserrat-SemiBold", fontSize: "12px", fontStyle: "normal", fontWeight: "600", lineHeight: "150%", marginTop: "20px", border: "0px", backgroundColor: "transparent", paddingLeft: "inherit" }} onClick={() => handleCoApplicantArray()}>Add Co-Applicant</button> */}
          <div>{renderNavItem('Guarantor Details')}</div>
          {/* <button style={{ color: "var(--primary-blue-primary-blue-70, #134CDE)", fontFamily: "Montserrat-SemiBold", fontSize: "12px", fontStyle: "normal", fontWeight: "600", lineHeight: "150%", marginTop: "20px", border: "0px", backgroundColor: "transparent", paddingLeft: "inherit" }} onClick={() => handleGuarantorArray()}>Add Guarantor</button> */}
          {showShareHolding ? renderNavItem('Shareholding') : null}
          {renderNavItem('Financial Docs')}
          {renderNavItem('Additional Docs')}
          {renderNavItem('Offer')}
        </div>
      </div>
      <div
        style={{
          backgroundColor: 'var(--neutrals-neutral-10, #E5E5E8)',
          width: '1px',
          // height: `${navState == "Applicant Details" ? "200vh" : "160vh"}`,
          marginTop: '1%',
        }}
      ></div>
      <div style={{ width: '86%' }}>
        {type == 'edit' && props.leadComment[`${navState}`] && navState !== "Co-Applicant Details" && navState !== "Guarantor Details" && <LogViewer head="Credit Manager Comment" body={props.leadComment[`${navState}`]} />}
        <div style={{ display: 'flex' }}>
          <div style={{ marginTop: '15px', width: '100%' }}>
            {navState === 'Entity Details' ? (
              <EntityDetailsForm
                type={navIconPrefixState['Entity Details'] == 'success' || (navIconPrefixState['Entity Details'] == 'deviation' && leadStatus=="draft") ? 'view' : type}
                setNavState={setNavState}
                setNavIconPrefixState={setNavIconPrefixState}
                loanAppId={loanAppId}
                entityData={entityData}
                setEntityData={setEntityData}
                navIconPrefixState={navIconPrefixState}
                MSMECompanyId={MSMECompanyId}
                MSMEProductId={MSMEProductId}
                leadStatus={leadStatus}
                setLeadStatus={setLeadStatus}
                loanDetailsSubsectionStatus={props.loanDetailsSubsectionStatus}
                setShowShareHolding={(value) => {
                  setShowShareHolding(value);
                }}
                documents={props.customerDocs}
                loanDetailsStatus={props.loanDetailsStatus}
                setShouldFetch={props.setShouldFetch}
              />
            ) : null}

            {navState === 'Applicant Details' ? (
              <ApplicantDetailsForm
                type={navIconPrefixState['Applicant Details'] == 'success' || (navIconPrefixState['Applicant Details'] == 'deviation' && leadStatus=="draft") ? 'view' : type}
                setNavState={setNavState}
                setStatusCheck={setStatusCheck}
                statusCheck={statusCheck}
                setNavIconPrefixState={setNavIconPrefixState}
                loanAppId={loanAppId}
                setLoanAppId={setLoanAppId}
                applicantData={applicantData}
                setApplicantData={setApplicantData}
                navIconPrefixState={navIconPrefixState}
                setMSMECompanyId={setMSMECompanyId}
                setMSMEProductID={setMSMEProductID}
                MSMECompanyId={MSMECompanyId}
                MSMEProductId={MSMEProductId}
                documents={props.customerDocs}
                leadStatus={leadStatus}
                setLeadStatus={setLeadStatus}
                loanDetailsSubsectionStatus={props.loanDetailsSubsectionStatus}
                loanDetailsStatus={props.loanDetailsStatus}
                setShouldFetch={props.setShouldFetch}
              />
            ) : null}
            {navState === 'Co-Applicant Details'
              ? coApplicantArray.map((item, key) => {
                return (
                  <div key={key}>
                    <div>
                      <CoApplicantForm
                        item={item}
                        type={(navIconPrefixState['Co-Applicant Details'] == 'success' || (navIconPrefixState['Co-Applicant Details'] == 'deviation' && leadStatus=="draft"))||(props.loanSectionObject && props.loanSectionObject[`co-applicant_details_${parseInt(key)+1}`] && (props.loanSectionObject[`co-applicant_details_${parseInt(key)+1}`].section_status == 'approved'|| props.loanSectionObject[`co-applicant_details_${parseInt(key)+1}`].section_status == 'deviation') ) ? 'view' : type}
                        coApplicantsData={coApplicantsData}
                        setCoApplicantsData={setCoApplicantsData}
                        setNavIconPrefixState={setNavIconPrefixState}
                        setNavState={setNavState}
                        setCoApplicantArray={setCoApplicantArray}
                        coApplicantArray={coApplicantArray}
                        CoApplicantCount={CoApplicantCount}
                        setCoApplicantCount={setCoApplicantCount}
                        coAppStatus={coAppStatus}
                        loanAppId={loanAppId}
                        leadStatus={leadStatus}
                        setLeadStatus={setLeadStatus}
                        navIconPrefixState={navIconPrefixState}
                        setCoAppStatus={setCoAppStatus}
                        MSMECompanyId={MSMECompanyId}
                        MSMEProductId={MSMEProductId}
                        documents={props.customerDocs}
                        setLoanSectionObject={props.setLoanSectionObject}
                        loanDetailsSubsectionStatus={props.loanDetailsSubsectionStatus}
                        setShouldFetch={props.setShouldFetch}
                        loanSectionObject={props.loanSectionObject}
                        loanDetailsStatus={props.loanDetailsStatus}
                        leadComment = {props.leadComment}
                        setShouldFetchDocument={props.setShouldFetchDocument}
                      />
                    </div>
                    <div
                      style={{
                        height: '2px',
                        width: '96%',
                        backgroundColor: `#C0C1C8`,
                        marginBottom: '2%',
                        marginLeft: '2%',
                      }}
                    ></div>
                  </div>
                );
              })
              : null}
            {navState === 'Guarantor Details'
              ? guarantorArray.map((item, key) => {
                return (
                  <div key={key}>
                    <div>
                      <GuarantorForm
                        item={item}
                        type={(navIconPrefixState['Guarantor Details'] == 'success' || (navIconPrefixState['Guarantor Details'] == 'deviation' && leadStatus=="draft")) ||(props.loanSectionObject && props.loanSectionObject[`guarantor_details_${parseInt(key)+1}`] && (props.loanSectionObject[`guarantor_details_${parseInt(key)+1}`].section_status == 'approved'||props.loanSectionObject[`guarantor_details_${parseInt(key)+1}`].section_status == 'deviation') ) ? 'view' : type}
                        guarantorsData={guarantorsData}
                        setGuarantorsData={setGuarantorsData}
                        setNavIconPrefixState={setNavIconPrefixState}
                        setNavState={setNavState}
                        setGuarantorArray={setGuarantorArray}
                        guarantorArray={guarantorArray}
                        GuarantorCount={GuarantorCount}
                        setGuarantorCount={setGuarantorCount}
                        guarantorStatus={guarantorStatus}
                        setGuarantorStatus={setGuarantorStatus}
                        navIconPrefixState={navIconPrefixState}
                        loanAppId={loanAppId}
                        leadStatus={leadStatus}
                        setLeadStatus={setLeadStatus}
                        MSMECompanyId={MSMECompanyId}
                        MSMEProductId={MSMEProductId}
                        showShareHolding={showShareHolding}
                        documents={props.customerDocs}
                        loanDetailsSubsectionStatus={props.loanDetailsSubsectionStatus}
                        setShouldFetch={props.setShouldFetch}
                        loanSectionObject={props.loanSectionObject}
                        setLoanSectionObject={props.setLoanSectionObject}
                        loanDetailsStatus={props.loanDetailsStatus}
                        leadComment = {props.leadComment}
                        setShouldFetchDocument={props.setShouldFetchDocument}
                      />
                    </div>
                    <div
                      style={{
                        height: '2px',
                        width: '96%',
                        backgroundColor: `#C0C1C8`,
                        marginBottom: '2%',
                        marginLeft: '2%',
                      }}
                    ></div>
                  </div>
                );
              })
              : null}
            {navState === 'Shareholding' ? <ShareHoldingPattern type={navIconPrefixState['Shareholding'] == 'success' || (navIconPrefixState['Shareholding'] == 'deviation' && leadStatus=="draft") ? 'view' : type} setNavIconPrefixState={setNavIconPrefixState} setNavState={setNavState} loanAppId={loanAppId} MSMECompanyId={MSMECompanyId} MSMEProductId={MSMEProductId} navIconPrefixState={navIconPrefixState} documents={props.customerDocs} loanDetailsStatus={props.loanDetailsStatus} setShouldFetch={props.setShouldFetch}  /> : null}
            {navState === 'Financial Docs' ? <FinancialDocument type={navIconPrefixState['Financial Docs'] == 'success' || ((navIconPrefixState['Financial Docs'] == 'deviation' && leadStatus=="draft")) ? 'view' : type} setNavIconPrefixState={setNavIconPrefixState} setNavState={setNavState} loanAppId={loanAppId} MSMECompanyId={MSMECompanyId} MSMEProductId={MSMEProductId} navIconPrefixState={navIconPrefixState} documents={props.customerDocs} loanDetailsStatus={props.loanDetailsStatus} setShouldFetch={props.setShouldFetch} /> : null}
            {navState === 'Additional Docs' ? <AdditionalDocument type={navIconPrefixState['Additional Docs'] == 'success' || ((navIconPrefixState['Additional Docs'] == 'deviation' && leadStatus=="draft")) ? 'view' : type} rawType={type} setNavIconPrefixState={setNavIconPrefixState} setNavState={setNavState} loanAppId={props.loanAppId ?? loanAppId} MSMECompanyId={MSMECompanyId} MSMEProductId={MSMEProductId} navIconPrefixState={navIconPrefixState} additionalDocument={additionalDocuments} documents={props?.customerDocs} leadStatus={props?.leadStatus} loanDetailsStatus={props.loanDetailsStatus} setShouldFetch={props.setShouldFetch} /> : null}
            {navState === 'Offer' ? <OfferPage loanAppId={loanAppId} getSectionStatus={getSectionStatus} MSMECompanyId={MSMECompanyId} MSMEProductId={MSMEProductId} setNavState={setNavState} setShouldFetch={props.setShouldFetch}/> : null}
          </div>
        </div>
      </div>
      {alert ? <Alert severity={severity} message={alertMessage} handleClose={handleAlertClose} /> : null}
      {/* {isLoading && <Preloader />} */}
    </div>
  );
}
