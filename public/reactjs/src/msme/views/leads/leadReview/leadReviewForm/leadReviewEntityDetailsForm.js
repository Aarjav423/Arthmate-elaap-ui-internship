import * as React from 'react';
import { useState, useEffect } from 'react';
import { bookLoansFormJsonFields } from '../../../bookLoans/bookLoansFormJson';
import { entityDetailsMapping } from '../../../bookLoans/bookLoanMapData';
import 'react-sdk/dist/styles/_fonts.scss';
import Alert from 'react-sdk/dist/components/Alert/Alert';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import useDimensions from 'hooks/useDimensions';
import { storedList } from '../../../../../util/localstorage';
import '../leadReview.style.css';
import { changeIntoDropdown, handleAge, handleFormComplete, keyValuePairs } from '../../../../../util/msme/helper';
import InputWrapper from '../../../../components/InputWrapper/InputWrapper.component';
import Button from 'react-sdk/dist/components/Button';
import { Cities, States } from '../../../../../constants/country-state-city-data';
import { applicantDetailSanitizer, entityDetailSanitizer } from './sanitizeFormData';
import { patchMsmeDetailsWatcher } from '../../../../actions/msme.action';
import { useDispatch } from 'react-redux';
import { ValidationChecklist } from '../../../../components/msme.component';
import { entityType } from '../../../../config/entityType';

const STATES_OBJECT = keyValuePairs(States, 'name');
const BOOK_LOAN_FORM_JSON = keyValuePairs(bookLoansFormJsonFields(), 'field');
const entityTypeDropdown = changeIntoDropdown(entityType, 'label', 'key');

const user = { _id: storedList('user')?._id, id: storedList('user')?.id };

export default function LeadReviewEntityDetailsForm(props) {
  const { loanDetailsData, leadStatusObject, loanDetailsSubsectionStatus, setShouldFetch, createMsmeActivityLog} = props;
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
    if (stateData['date_vl_date_of_birth']) {
      populateAge();
    }
  }, [stateData['date_vl_date_of_birth']]);

  useEffect(() => {
    populateGetCities(stateData['string_vl_comm_addr_state'], 'current');
  }, [stateData['string_vl_comm_addr_state']]);

  useEffect(() => {
    populateGetCities(stateData['string_vl_reg_addr_state'], 'permanent');
  }, [stateData['string_vl_reg_addr_state']]);

  useEffect(() => {
    if (stateData['address_same'] && isChanged) {
      setStateData((prev) => ({
        ...prev,
        string_vl_reg_addr_ln1: prev?.string_vl_comm_addr_ln1,
        string_vl_reg_addr_ln2: prev?.string_vl_comm_addr_ln2,
        string_vl_reg_addr_city: prev?.string_vl_comm_addr_city,
        string_vl_reg_addr_state: prev?.string_vl_comm_addr_state,
        pincode_vl_reg_addr_pincode: prev?.pincode_vl_comm_addr_pincode,
      }));
    }
  }, [stateData['address_same'], stateData['string_vl_comm_addr_ln1'], stateData['string_vl_comm_addr_ln2'], stateData['string_vl_comm_addr_city'], stateData['string_vl_comm_addr_state'], stateData['pincode_vl_comm_addr_pincode']]);

  useEffect(() => {
    let tempValidation = handleFormComplete(stateData);

    if (Object.keys(tempValidation).length) {
      setIsFormDisabled(true);
    } else {
      setIsFormDisabled(false);
    }
  }, [stateData]);

  const setInitialData = () => {
    const data = entityDetailsMapping(loanDetailsData);
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
        if (city.label == stateData['string_vl_comm_addr_city']) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        setStateData((prev) => ({
          ...prev,
          string_vl_comm_addr_city: '',
        }));
      }
    } else {
      setPermanentCitiesDropdown(cities);
      var flag = false;
      for (let city of cities) {
        if (city.label == stateData['string_vl_reg_addr_city']) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        setStateData((prev) => ({
          ...prev,
          string_vl_reg_addr_city: '',
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
    let value = entityDetailSanitizer(e, type, name);

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
      section: 'entity-details',
      type: 'credit',
      msme_company_id: loanDetailsData.company_id,
      msme_product_id: loanDetailsData.product_id,
      user_id: user._id,
      loan_app_id: loanDetailsData.loan_app_id,
      entity_name: stateData[`string_vl_entity_name_value`] ?? " ",
      date_of_incorporation: stateData[`date_vl_doi_value`] ?? " ",
      com_addr_ln1: stateData[`string_vl_comm_addr_ln1`] ?? " ",
      com_addr_ln2: stateData[`string_vl_comm_addr_ln2`] ?? " ",
      com_city: stateData[`string_vl_comm_addr_city`] ?? " ",
      com_state: stateData[`string_vl_comm_addr_state`] ?? " ",
      com_pincode: stateData[`pincode_vl_comm_addr_pincode`] ?? " ",
      res_addr_ln1: stateData[`string_vl_reg_addr_ln1`] ?? " ",
      res_addr_ln2: stateData[`string_vl_reg_addr_ln2`] ?? " ",
      res_city: stateData[`string_vl_reg_addr_city`] ?? " ",
      res_state: stateData[`string_vl_reg_addr_state`] ?? " ",
      res_pincode: stateData[`pincode_vl_reg_addr_pincode`] ?? " ",
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
        createMsmeActivityLog('entity');
      })
      .catch((error) => {
        console.log('Error', error);
        showAlert(error?.response?.data?.message, 'error');
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.inputFlex}>
        <InputWrapper
          object={BOOK_LOAN_FORM_JSON['select_entity_type']}
          isDrawdown={true}
          type={'text'}
          onChange={onChange}
          data={stateData}
          validationData={stateValidationData}
          dropdown={entityTypeDropdown}
          disabled={true}
          onDrawdownSelect={(value) => {
            populateGetCities(value);
          }}
        />
      </div>

      <div style={styles.inputFlex}>
        <InputWrapper object={BOOK_LOAN_FORM_JSON['entity_name_value']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['doi_value']} type={'date'} onChange={onChange} data={stateData} validationData={stateValidationData} disabledAge={0}/>
      </div>

      <div style={styles.customHeading}>Communication Address</div>

      <div style={styles.inputFlex}>
        <InputWrapper object={BOOK_LOAN_FORM_JSON['comm_addr_ln1']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['comm_addr_ln2']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} />
        <InputWrapper
          object={BOOK_LOAN_FORM_JSON['comm_addr_state']}
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
        <InputWrapper object={BOOK_LOAN_FORM_JSON['comm_addr_city']} type={'text'} onChange={onChange} data={stateData} dropdown={currentCitiesDropdown} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['comm_addr_pincode']} type={'number'} onChange={onChange} data={stateData} validationData={stateValidationData} />
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
        <div style={styles.customCheckboxText}> Same as Communication Address</div>
      </div>

      <div style={styles.customHeading}>Registered Address</div>

      <div style={styles.inputFlex}>
        <InputWrapper object={BOOK_LOAN_FORM_JSON['reg_addr_ln1']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} disabled={stateData['address_same'] ? true : false} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['reg_addr_ln2']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} disabled={stateData['address_same'] ? true : false} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['reg_addr_state']} type={'text'} onChange={onChange} data={stateData} dropdown={statesDropdown} validationData={stateValidationData} disabled={stateData['address_same'] ? true : false} />
      </div>

      <div style={styles.inputFlex}>
        <InputWrapper object={BOOK_LOAN_FORM_JSON['reg_addr_city']} type={'text'} onChange={onChange} data={stateData} dropdown={permanentCitiesDropdown} validationData={stateValidationData} disabled={stateData['address_same'] ? true : false} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['reg_addr_pincode']} type={'number'} onChange={onChange} data={stateData} validationData={stateValidationData} disabled={stateData['address_same'] ? true : false} />
      </div>

      <ValidationChecklist leadSectionObject={leadStatusObject['entity']} />

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
