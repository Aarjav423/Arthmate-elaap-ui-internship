import * as React from 'react';
import { useState, useEffect } from 'react';
import { bookLoansFormJsonFields } from '../../../bookLoans/bookLoansFormJson';
import { coApplicantsMapping, guarantorDetailsMapping } from '../../../bookLoans/bookLoanMapData';
import 'react-sdk/dist/styles/_fonts.scss';
import Alert from 'react-sdk/dist/components/Alert/Alert';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import useDimensions from 'hooks/useDimensions';
import { storedList } from '../../../../../util/localstorage';
import '../leadReview.style.css';
import { handleAge, handleFormComplete, keyValuePairs } from '../../../../../util/msme/helper';
import InputWrapper from '../../../../components/InputWrapper/InputWrapper.component';
import Button from 'react-sdk/dist/components/Button';
import { Cities, States } from '../../../../../constants/country-state-city-data';
import { coApplicantSanitizer, guarantorSanitizer } from './sanitizeFormData';
import { patchMsmeDetailsWatcher } from '../../../../actions/msme.action';
import { useDispatch } from 'react-redux';
import { ValidationChecklist } from '../../../../components/msme.component';

const STATES_OBJECT = keyValuePairs(States, 'name');
const BOOK_LOAN_FORM_JSON = keyValuePairs(bookLoansFormJsonFields(), 'field');

const user = { _id: storedList('user')?._id, id: storedList('user')?.id };

export default function LeadReviewGuarantorDetailsForm(props) {
  const { loanDetailsData, leadStatusObject, loanDetailsSubsectionStatus, setShouldFetch, index,createMsmeActivityLog  } = props;
  const [stateData, setStateData] = useState({});
  const [stateValidationData, setStateValidationData] = useState({});
  const [statesDropdown, setStatesDropdown] = useState(States ?? []);
  const [currentCitiesDropdown, setCurrentCitiesDropdown] = useState([]);
  const [permanentCitiesDropdown, setPermanentCitiesDropdown] = useState([]);
  const [panIcon, setPanIcon] = useState('button');
  const [isAadhaarEdit, setIsAadhaarEdit] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [isFormDisabled, setIsFormDisabled] = useState(true);
  const [isChanged, setIsChanged] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();
  const { innerWidth, innerHeight } = useDimensions();
  const styles = useStyles({ innerWidth, innerHeight });

  let code = 400 + parseInt(index);

  useEffect(() => {
    if (loanDetailsData && Object.keys(loanDetailsData).length) {
      setInitialData();
    }
  }, [loanDetailsData]);

  useEffect(() => {
    if (loanDetailsSubsectionStatus && loanDetailsSubsectionStatus[code]) {
      if (loanDetailsSubsectionStatus[code]['guarantor_pan'] == 'approved') {
        setPanIcon('icon');
      }
    }
  }, [loanDetailsSubsectionStatus]);

  useEffect(() => {
    if (stateData['date_vl_gua_dob']) {
      populateAge();
    }
  }, [stateData['date_vl_gua_dob']]);

  useEffect(() => {
    populateGetCities(stateData['string_vl_gua_state'], 'current');
  }, [stateData['string_vl_gua_state']]);

  useEffect(() => {
    populateGetCities(stateData['string_vl_gua_per_state'], 'permanent');
  }, [stateData['string_vl_gua_per_state']]);

  useEffect(() => {
    if (stateData['address_same'] && isChanged) {
      setStateData((prev) => ({
        ...prev,
        string_vl_gua_per_addr_ln1: prev?.string_vl_gua_resi_addr_ln1,
        string_vl_gua_per_addr_ln2: prev?.string_vl_gua_resi_addr_ln2,
        string_vl_gua_per_city: prev?.string_vl_gua_city,
        string_vl_gua_per_state: prev?.string_vl_gua_state,
        pincode_vl_gua_per_pincode: prev?.pincode_vl_gua_pincode,
      }));
    }
  }, [stateData['address_same'], stateData['string_vl_gua_resi_addr_ln1'], stateData['string_vl_gua_resi_addr_ln2'], stateData['string_vl_gua_city'], stateData['string_vl_gua_state'], stateData['pincode_vl_gua_pincode']]);

  useEffect(() => {
    let tempValidation = handleFormComplete(stateData);

    if (Object.keys(tempValidation).length) {
      setIsFormDisabled(true);
    } else {
      setIsFormDisabled(false);
    }
  }, [stateData]);

  const setInitialData = () => {
    const data = guarantorDetailsMapping(loanDetailsData);
    setStateData(data[index]);
    setIsAadhaarEdit(false);
    setIsChanged(false);
    setIsFormDisabled(true);
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

  const populateGetCities = async (value, type = 'current') => {
    const cities = value ? Cities(STATES_OBJECT[value]) : [];

    if (cities.length == 0) {
      setCurrentCitiesDropdown([]);
      setPermanentCitiesDropdown([]);
      return;
    }

    if (type == 'current') {
      setCurrentCitiesDropdown(cities);
      var flag = false;
      for (let city of cities) {
        if (city.label == stateData['string_vl_gua_city']) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        setStateData((prev) => ({
          ...prev,
          string_vl_gua_city: '',
        }));
      }
    } else {
      setPermanentCitiesDropdown(cities);
      var flag = false;
      for (let city of cities) {
        if (city.label == stateData['string_vl_gua_per_city']) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        setStateData((prev) => ({
          ...prev,
          string_vl_gua_per_city: '',
        }));
      }
    }
  };

  const populateAge = () => {
    const age = handleAge(stateData['date_vl_gua_dob']);
    let ageField = 'number_vl_gua_age';

    if (age != -1) {
      setStateData((prevState) => ({
        ...prevState,
        [ageField]: age,
      }));
    } else {
      setStateData((prevState) => ({
        ...prevState,
        [ageField]: ' ',
      }));
    }
  };

  const onChange = (e, type, name) => {
    let value = guarantorSanitizer(e, type, name);

    setStateData((prevState) => ({
      ...prevState,
      [`${type}_vl_${name}`]: value,
    }));

    setStateValidationData((prevState) => ({
      ...prevState,
      [`${type}_vl_${name}`]: false,
    }));

    setIsChanged(true);
  };

  const handleSubmit = () => {
    let tempValidation = handleFormComplete(stateData);

    if (Object.values(tempValidation).length) {
      return setStateValidationData((prevState) => ({
        ...prevState,
        ...tempValidation,
      }));
    }

    let payload = {
      section: 'guarantors',
      type: 'credit',
      msme_company_id: loanDetailsData.company_id,
      msme_product_id: loanDetailsData.product_id,
      user_id: user._id,
      loan_app_id: loanDetailsData.loan_app_id,
      _id: stateData['_id'],
      gua_fname: stateData[`string_vl_gua_fname`],
      gua_email: stateData['email_vl_guarantor_email'],
      gua_mname: stateData[`string_vl_gua_mname`] ?? ' ',
      gua_lname: stateData[`string_vl_gua_lname`],
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
      gua_dob: stateData[`date_vl_gua_dob`],
      gua_gender: stateData[`string_vl_gua_gender`],
      address_same: stateData['address_same'] ? 1 : 0,
    };

    if (isAadhaarEdit) {
      payload = {
        ...payload,
        gua_aadhaar: stateData[`aadhaar_vl_gua_aadhaar`],
      };
    }

    new Promise((resolve, reject) => {
      dispatch(patchMsmeDetailsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        showAlert('Lead has been successfully updated', 'success');
        setIsAadhaarEdit(false);
        setShouldFetch((prev) => prev + 1);
        createMsmeActivityLog('guarantor',index)
      })
      .catch((error) => {
        console.log('Error', error);
        showAlert(error?.response?.data?.message, 'error');
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.inputFlex}>
        <InputWrapper object={BOOK_LOAN_FORM_JSON['gua_fname']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['gua_mname']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['gua_lname']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} />
      </div>
      <div style={styles.inputFlex}>
        <InputWrapper object={BOOK_LOAN_FORM_JSON['gua_dob']} type={'date'} onChange={onChange} data={stateData} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['gua_age']} type={'number'} onChange={onChange} data={stateData} disabled={true} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['gua_gender']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} />
      </div>
      <div style={styles.inputFlex}>
        <InputWrapper object={BOOK_LOAN_FORM_JSON['gua_mobile']} type={'number'} onChange={onChange} data={stateData} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['guarantor_email']} type={'email'} onChange={onChange} data={stateData} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['gua_father_name']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} />
      </div>
      <div style={styles.inputFlex}>
        <InputWrapper object={BOOK_LOAN_FORM_JSON['gua_pan']} type={'text'} onChange={onChange} data={stateData} isBoxType={panIcon} disabled={true} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['gua_aadhaar']} type={isAadhaarEdit ? 'number' : 'text'} onChange={onChange} data={stateData} disabled={!isAadhaarEdit} validationData={stateValidationData} />
        {!isAadhaarEdit ? (
          <div
            style={{ width: '66px', alignSelf: 'center', fontSize: '14px', fontFamily: 'Montserrat-Medium', color: '#134CDE' }}
            onClick={() => {
              setStateData((prev) => ({
                ...prev,
                aadhaar_vl_gua_aadhaar: '',
              }));
              setIsAadhaarEdit(!isAadhaarEdit);
              setIsChanged(true);
            }}
          >
            Edit
          </div>
        ) : (
          <div />
        )}
      </div>

      <div style={styles.customHeading}>Current Address</div>

      <div style={styles.inputFlex}>
        <InputWrapper object={BOOK_LOAN_FORM_JSON['gua_resi_addr_ln1']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['gua_resi_addr_ln2']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} />
        <InputWrapper
          object={BOOK_LOAN_FORM_JSON['gua_state']}
          type={'text'}
          onChange={onChange}
          data={stateData}
          dropdown={statesDropdown}
          onDrawdownSelect={(value) => {
            populateGetCities(value);
          }}
          validationData={stateValidationData}
        />
      </div>

      <div style={styles.inputFlex}>
        <InputWrapper object={BOOK_LOAN_FORM_JSON['gua_city']} type={'text'} onChange={onChange} data={stateData} dropdown={currentCitiesDropdown} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['gua_pincode']} type={'number'} onChange={onChange} data={stateData} validationData={stateValidationData} />
      </div>

      <div style={{ ...styles.inputFlex, columnGap: '10px' }}>
        <input
          style={styles.customCheckboxContainer}
          type="checkbox"
          checked={stateData['address_same'] ? true : false}
          onClick={() => {
            setIsChanged(true);
            setStateData((prev) => ({
              ...prev,
              address_same: stateData['address_same'] ? false : true,
            }));
          }}
          disabled={false}
        ></input>
        <div style={styles.customCheckboxText}> Same as Current Address</div>
      </div>

      <div style={styles.customHeading}>Permanent Address</div>

      <div style={styles.inputFlex}>
        <InputWrapper object={BOOK_LOAN_FORM_JSON['gua_per_addr_ln1']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} disabled={stateData['address_same']} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['gua_per_addr_ln2']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} disabled={stateData['address_same']} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['gua_per_state']} type={'text'} onChange={onChange} data={stateData} dropdown={statesDropdown} validationData={stateValidationData} disabled={stateData['address_same']} />
      </div>

      <div style={styles.inputFlex}>
        <InputWrapper object={BOOK_LOAN_FORM_JSON['gua_per_city']} type={'text'} onChange={onChange} data={stateData} dropdown={permanentCitiesDropdown} validationData={stateValidationData} disabled={stateData['address_same']} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['gua_per_pincode']} type={'number'} onChange={onChange} data={stateData} validationData={stateValidationData} disabled={stateData['address_same']} />
      </div>

      <ValidationChecklist leadSectionObject={leadStatusObject[`guarantor_details_${parseInt(index)+1}`]} />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '20px' }}>
        <div style={styles.leadReviewButtonContainer}>
          <Button
            buttonType="custom"
            label={'Discard'}
            onClick={() => setInitialData()}
            isDisabled={!isChanged}
            customStyle={{
              ...styles['customStyleButtonComment'],
              ...(!isChanged ? { backgroundColor: 'var(--neutrals-neutral-30, #CCCDD3)', color: 'var(--base-white, #FFF)', borderColor: 'var(--neutrals-neutral-30, #CCCDD3)' } : { backgroundColor: '#FFF', color: '#134CDE', borderColor: '#134CDE' }),
            }}
            validationData={stateValidationData}
          />
          <Button buttonType="custom" label="Save" onClick={handleSubmit} isDisabled={isFormDisabled || !isChanged} customStyle={{ ...styles['customStyleButton'], ...(isFormDisabled || !isChanged ? { backgroundColor: 'var(--neutrals-neutral-30, #CCCDD3)', color: 'var(--base-white, #FFF)' } : { backgroundColor: '#134CDE', color: 'white' }) }} validationData={stateValidationData} />
        </div>
      </div>
      {alert ? <Alert severity={severity} message={alertMessage} handleClose={handleAlertClose} /> : null}
    </div>
  );
}

const useStyles = ({ innerWidth, innerHeight }) => {
  return {
    container: {
      marginLeft: '20px',
    },
    inputFlex: {
      display: 'flex',
      marginBottom: '30px',
      columnGap: innerWidth > 1500 ? '3%' : innerWidth > 1300 ? '20px' : '10px',
    },
    leadReviewBottomComponent: {
      paddingBottom: '20px',
      display: 'flex',
      justifyContent: 'flex-end',
      marginRight: '20px',
    },
    leadReviewButtonContainer: {
      paddingBottom: '20px',
      display: 'flex',
      justifyContent: 'flex-end',
      marginRight: '20px',
    },
    customHeading: {
      width: '100%',
      fontSize: '18px',
      fontWeight: '600',
      lineHeight: '18px',
      color: '#1C1C1C',
      fontFamily: 'Montserrat-Regular',
      marginBottom: '20px',
    },
    customCheckboxContainer: {
      marginLeft: '10px',
      marginTop: '18px',
      width: '1rem',
      height: '1rem',
    },
    customCheckboxText: {
      fontFamily: 'Montserrat-Regular',
      fontSize: '0.9vw',
      color: '#767888',
      marginTop: '16px',
    },
    customStyleButton: {
      backgroundColor: '#134CDE',
      color: 'white',
      fontFamily: 'Montserrat-Regular',
      fontWeight: 600,
      height: '40px',
      width: 'max-content',
      fontSize: '14px',
      lineHeight: '21px',
      padding: '8px 24px',
      borderRadius: '40px',
      gap: '10px',
    },
    customStyleButtonComment: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: 600,
      backgroundColor: '#FFF',
      borderColor: '#134CDE',
      color: '#134CDE',
      height: '40px',
      width: 'max-content',
      fontSize: '14px',
      lineHeight: '21px',
      padding: '8px 24px',
      borderRadius: '40px',
      gap: '10px',
    },
  };
};
