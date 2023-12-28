import * as React from 'react';
import { useState, useEffect } from 'react';
import { bookLoansFormJsonFields } from '../../../bookLoans/bookLoansFormJson';
import { primaryApplicantMapping } from '../../../bookLoans/bookLoanMapData';
import 'react-sdk/dist/styles/_fonts.scss';
import Alert from 'react-sdk/dist/components/Alert/Alert';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import useDimensions from 'hooks/useDimensions';
import { storedList } from '../../../../../util/localstorage';
import '../leadReview.style.css';
import { formatLeadSectionValidationStatusAndRemarks, handleAge, handleFormComplete, keyValuePairs } from '../../../../../util/msme/helper';
import InputWrapper from '../../../../components/InputWrapper/InputWrapper.component';
import Button from 'react-sdk/dist/components/Button';
import { Cities, States } from '../../../../../constants/country-state-city-data';
import { applicantDetailSanitizer } from './sanitizeFormData';
import { patchMsmeDetailsWatcher } from '../../../../actions/msme.action';
import { useDispatch } from 'react-redux';
import { ValidationChecklist } from '../../../../components/msme.component';
import { createMsmeActivityLogWatcher } from '../../../../actions/lead.action';

const STATES_OBJECT = keyValuePairs(States, 'name');
const BOOK_LOAN_FORM_JSON = keyValuePairs(bookLoansFormJsonFields(), 'field');

const user = storedList('user');

export default function LeadReviewApplicantDetailsForm(props) {
  const { loanDetailsData, leadStatusObject, loanDetailsSubsectionStatus, setShouldFetch,createMsmeActivityLog } = props;
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

  useEffect(() => {
    if (loanDetailsData && Object.keys(loanDetailsData).length) {
      setInitialData();
    }
  }, [loanDetailsData]);

  useEffect(() => {
    if (loanDetailsSubsectionStatus && loanDetailsSubsectionStatus[100]) {
      if (loanDetailsSubsectionStatus[100]['primary_pan'] == 'approved') {
        setPanIcon('icon');
      }
    }
  }, [loanDetailsSubsectionStatus]);

  useEffect(() => {
    if (stateData['date_vl_date_of_birth']) {
      populateAge();
    }
  }, [stateData['date_vl_date_of_birth']]);

  useEffect(() => {
    populateGetCities(stateData['string_vl_curr_addr_state'], 'current');
  }, [stateData['string_vl_curr_addr_state']]);

  useEffect(() => {
    populateGetCities(stateData['string_vl_per_addr_state'], 'permanent');
  }, [stateData['string_vl_per_addr_state']]);

  useEffect(() => {
    if (stateData['address_same'] && isChanged) {
      setStateData((prev) => ({
        ...prev,
        string_vl_per_addr_ln1: prev?.string_vl_curr_addr_ln1,
        string_vl_per_addr_ln2: prev?.string_vl_curr_addr_ln2,
        string_vl_per_addr_city: prev?.string_vl_curr_addr_city,
        string_vl_per_addr_state: prev?.string_vl_curr_addr_state,
        pincode_vl_per_addr_pincode: prev?.pincode_vl_curr_addr_pincode,
      }));
    }
  }, [stateData['address_same'], stateData['string_vl_curr_addr_ln1'], stateData['string_vl_curr_addr_ln2'], stateData['string_vl_curr_addr_city'], stateData['string_vl_curr_addr_state'], stateData['pincode_vl_curr_addr_pincode']]);

  useEffect(() => {
    let tempValidation = handleFormComplete(stateData);

    if (Object.keys(tempValidation).length) {
      setIsFormDisabled(true);
    } else {
      setIsFormDisabled(false);
    }
  }, [stateData]);

  const setInitialData = () => {
    const data = primaryApplicantMapping(loanDetailsData);
    setStateData(data);
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
        if (city.label == stateData['string_vl_curr_addr_city']) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        setStateData((prev) => ({
          ...prev,
          string_vl_curr_addr_city: '',
        }));
      }
    } else {
      setPermanentCitiesDropdown(cities);
      var flag = false;
      for (let city of cities) {
        if (city.label == stateData['string_vl_per_addr_city']) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        setStateData((prev) => ({
          ...prev,
          string_vl_per_addr_city: '',
        }));
      }
    }
  };

  const populateAge = () => {
    const age = handleAge(stateData['date_vl_date_of_birth']);
    let ageField = 'number_vl_age';

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
    let value = applicantDetailSanitizer(e, type, name);

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
      section: 'primary-applicants',
      type: 'credit',
      msme_company_id: loanDetailsData.company_id,
      msme_product_id: loanDetailsData.product_id,
      user_id: user._id,
      loan_app_id: loanDetailsData.loan_app_id,
      appl_pan: stateData.pan_vl_pan_value,
      dob: stateData.date_vl_date_of_birth,
      first_name: stateData.string_vl_first_name,
      last_name: stateData.string_vl_last_name,
      father_fname: stateData.string_vl_father_full_name,
      type_of_addr: 'Permanent',
      email_id: stateData.email_vl_email,
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
      address_same: stateData['address_same'] ? 1 : 0,
    };

    if (isAadhaarEdit) {
      payload = {
        ...payload,
        aadhar_card_num: stateData.aadhaar_vl_aadhaar_value,
      };
    }

    new Promise((resolve, reject) => {
      dispatch(patchMsmeDetailsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        showAlert('Lead has been successfully updated', 'success');
        setIsAadhaarEdit(false);
        setShouldFetch((prev) => prev + 1);
        createMsmeActivityLog('primary');
      })
      .catch((error) => {
        console.log('Error', error);
        showAlert(error?.response?.data?.message, 'error');
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.inputFlex}>
        <InputWrapper object={BOOK_LOAN_FORM_JSON['first_name']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['middle_name']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['last_name']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} />
      </div>
      <div style={styles.inputFlex}>
        <InputWrapper object={BOOK_LOAN_FORM_JSON['date_of_birth']} type={'date'} onChange={onChange} data={stateData} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['age']} type={'number'} onChange={onChange} data={stateData} disabled={true} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['gender']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} />
      </div>
      <div style={styles.inputFlex}>
        <InputWrapper object={BOOK_LOAN_FORM_JSON['mobile_number']} type={'number'} onChange={onChange} data={stateData} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['email']} type={'email'} onChange={onChange} data={stateData} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['father_full_name']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} />
      </div>
      <div style={styles.inputFlex}>
        <InputWrapper object={BOOK_LOAN_FORM_JSON['pan_value']} type={'text'} onChange={onChange} data={stateData} isBoxType={panIcon} disabled={true} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['aadhaar_value']} type={isAadhaarEdit ? 'number' : 'text'} onChange={onChange} data={stateData} disabled={!isAadhaarEdit} validationData={stateValidationData} />
        {!isAadhaarEdit ? (
          <div
            style={{ width: '66px', alignSelf: 'center', fontSize: '14px', fontFamily: 'Montserrat-Medium', color: '#134CDE' }}
            onClick={() => {
              setStateData((prev) => ({
                ...prev,
                aadhaar_vl_aadhaar_value: '',
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
        <InputWrapper object={BOOK_LOAN_FORM_JSON['curr_addr_ln1']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['curr_addr_ln2']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} />
        <InputWrapper
          object={BOOK_LOAN_FORM_JSON['curr_addr_state']}
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
        <InputWrapper object={BOOK_LOAN_FORM_JSON['curr_addr_city']} type={'text'} onChange={onChange} data={stateData} dropdown={currentCitiesDropdown} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['curr_addr_pincode']} type={'number'} onChange={onChange} data={stateData} validationData={stateValidationData} />
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
        <InputWrapper object={BOOK_LOAN_FORM_JSON['per_addr_ln1']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} disabled={stateData['address_same'] ? true : false} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['per_addr_ln2']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} disabled={stateData['address_same'] ? true : false} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['per_addr_state']} type={'text'} onChange={onChange} data={stateData} dropdown={statesDropdown} validationData={stateValidationData} disabled={stateData['address_same'] ? true : false} />
      </div>

      <div style={styles.inputFlex}>
        <InputWrapper object={BOOK_LOAN_FORM_JSON['per_addr_city']} type={'text'} onChange={onChange} data={stateData} dropdown={permanentCitiesDropdown} validationData={stateValidationData} disabled={stateData['address_same'] ? true : false} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['per_addr_pincode']} type={'number'} onChange={onChange} data={stateData} validationData={stateValidationData} disabled={stateData['address_same'] ? true : false} />
      </div>

      <ValidationChecklist leadSectionObject={leadStatusObject['primary']} />

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
