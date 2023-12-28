import * as React from 'react';
import { useState, useEffect } from 'react';
import { coApplicantsMapping, financialDocumentsMapping } from '../../../bookLoans/bookLoanMapData';
import 'react-sdk/dist/styles/_fonts.scss';
import Alert from 'react-sdk/dist/components/Alert/Alert';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import useDimensions from 'hooks/useDimensions';
import { storedList } from '../../../../../util/localstorage';
import '../leadReview.style.css';
import { handleAge, handleFormComplete, keyValuePairs } from '../../../../../util/msme/helper';
import InputWrapper from '../../../../components/InputWrapper/InputWrapper.component';
import Button from 'react-sdk/dist/components/Button';
import { coApplicantSanitizer } from './sanitizeFormData';
import { patchMsmeDetailsWatcher } from '../../../../actions/msme.action';
import { useDispatch } from 'react-redux';
import { BankList, BankType } from '../../../financialDocument/data';
import { ValidationChecklist } from '../../../../components/msme.component';

const BANK_LIST_JSON = keyValuePairs(BankList, 'value');
const user = { _id: storedList('user')?._id, id: storedList('user')?.id };
const financialDocs = [
  {
    title: 'Bank Name',
    dept: 'Financial Documents',
    type: 'string',
    isDrawdown: true,
    options: BankList,
    field: `borro_bank_name`,
    isOptional: false,
    validationMsg: 'Bank Name is required',
  },
  {
    title: 'Bank A/C No.',
    dept: 'Financial Documents',
    type: 'number',
    isDrawdown: false,
    field: `borro_bank_acc_num`,
    isOptional: false,
    validationMsg: 'Bank Account Number is required',
  },
  {
    title: 'Bank A/C Type',
    dept: 'Financial Documents',
    type: 'string',
    isDrawdown: true,
    options: BankType,
    field: `borro_bank_type`,
    isOptional: false,
    validationMsg: 'Bank Account Type is required',
  },
];

const BOOK_LOAN_FORM_JSON = keyValuePairs(financialDocs, 'field');

export default function LeadReviewFinancialDocumentsForm(props) {
  const { loanDetailsData, leadStatusObject, loanDetailsSubsectionStatus, setShouldFetch, createMsmeActivityLog } = props;
  const [stateData, setStateData] = useState({});
  const [stateValidationData, setStateValidationData] = useState({});
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
    let tempValidation = {};

    if (Object.keys(tempValidation).length) {
      setIsFormDisabled(true);
    } else {
      setIsFormDisabled(false);
    }
  }, [stateData]);

  const setInitialData = () => {
    const data = financialDocumentsMapping(loanDetailsData);
    setStateData(data);
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

  const onChange = (e, type, name) => {
    let value = coApplicantSanitizer(e, type, name);

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
    let tempValidation = {};

    if (Object.values(tempValidation).length) {
      return setStateValidationData((prevState) => ({
        ...prevState,
        ...tempValidation,
      }));
    }

    let payload = {
      section: 'financial-documents',
      type: 'credit',
      msme_company_id: loanDetailsData.company_id,
      msme_product_id: loanDetailsData.product_id,
      user_id: user._id,
      loan_app_id: loanDetailsData.loan_app_id,
      borro_bank_name: stateData.string_vl_borro_bank_name,
      borro_bank_acc_num: stateData.number_vl_borro_bank_acc_num,
      borro_bank_type: stateData.string_vl_borro_bank_type,
    };

    new Promise((resolve, reject) => {
      dispatch(patchMsmeDetailsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        showAlert('Lead has been successfully updated', 'success');
        setShouldFetch((prev) => prev + 1);
        createMsmeActivityLog("financial_doc");
      })
      .catch((error) => {
        console.log('Error', error);
        showAlert(error?.response?.data?.message, 'error');
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.inputFlex}>
        <InputWrapper object={BOOK_LOAN_FORM_JSON['borro_bank_name']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} value={stateData['string_vl_borro_bank_name'] && BANK_LIST_JSON[stateData['string_vl_borro_bank_name']] ? BANK_LIST_JSON[stateData['string_vl_borro_bank_name']].label : stateData['string_vl_borro_bank_name']} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['borro_bank_acc_num']} type={'number'} onChange={onChange} data={stateData} validationData={stateValidationData} />
        <InputWrapper object={BOOK_LOAN_FORM_JSON['borro_bank_type']} type={'text'} onChange={onChange} data={stateData} validationData={stateValidationData} value={stateData['number_vl_borro_bank_type'] && BANK_LIST_JSON[stateData['number_vl_borro_bank_type']] ? BANK_LIST_JSON[stateData['number_vl_borro_bank_type']].label : stateData['number_vl_borro_bank_type']} />
      </div>

      <ValidationChecklist leadSectionObject={leadStatusObject[`financial_doc`]} />

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
