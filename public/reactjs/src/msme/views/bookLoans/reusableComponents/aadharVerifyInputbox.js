import React, { useState } from 'react';
import InputBox from 'react-sdk/dist/components/InputBox/InputBox';
import { postAadhaarOtpWcher } from '../../../actions/lead.action';
import { storedList } from '../../../../util/localstorage';
import { useDispatch } from 'react-redux';
import { OTPInputPopup } from 'msme/components/msme.component';
import { verifyAadhaarOtpWatcher } from 'msme/actions/msme.action';

const aadharVerifyInputbox = ({ loanAppId, company_id, product_id, row, stateData, props, disabledFields, viewPerAddress, isFormDisabled = null, validationData, statusCheck = null, validateData, setStateData, setValidationData, sectionCode, sectionSequenceNumber, section = null, showAlert, setShouldFetch }) => {
  const dispatch = useDispatch();
  const [aadhaarVal, setAadhaarVal] = useState('');
  const [otp, setOtp] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [OTPSent, setOTPsent] = useState(false);
  const [aadhaarOTPError, setAadhaarOTPError] = useState(false);
  const [aadhaarOTPErrorMessage, setAadhaarOTPErrorMessage] = useState('');
  const [sendOTPButtonState, setSendOTPButtonState] = useState('button');
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [sendOTPCount, setSendOTPCount] = useState(0);

  const user = { _id: storedList('user')?._id, id: storedList('user')?.id };
  const inputBoxCss = {
    marginTop: '8px',
    maxHeight: '500px',
    zIndex: 1,
    width: '105%',
  };

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const handleClose = () => {
    setOpenPopup(false);
    setAadhaarOTPError(false);
  };

  const verifyAadhaarOTP = () => {
    let payload = {
      user: user,
      company_id: company_id,
      product_id: product_id,
      user_id: user._id,
      loan_app_id: loanAppId,
      aadhaar_no: aadhaarVal,
      section_code: sectionCode,
      otp: otp,
    };
    if (section) {
      let index = 300 + parseInt(section[section.length - 1]) - 1;
      payload.section_sequence_no = index;
    } else {
      payload.section_sequence_no = sectionSequenceNumber;
    }
    new Promise((resolve, reject) => {
      dispatch(verifyAadhaarOtpWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setAadhaarOTPError(false);
        setOpenPopup(false);
        showAlert(response?.message ?? 'Otp verified successfully!', 'success');
        setVerifyingOTP(false);
        if (setShouldFetch) {
          setShouldFetch((prev) => prev + 1);
        }
      })
      .catch((error) => {
        setAadhaarOTPError(true);
        setAadhaarOTPErrorMessage('Incorrect OTP. Please try again.');
        showAlert('OTP not verified', 'error');
        setVerifyingOTP(false);
      });
  };

  const handleOTPSubmit = () => {
    if (otp.length < 6) {
      setAadhaarOTPError(true);
      setAadhaarOTPErrorMessage('Please enter complete OTP.');
      return;
    }
    setVerifyingOTP(true);
    verifyAadhaarOTP();
  };

  const sendAadhaarOtpFunction = () => {
    if (sendOTPCount >= 3) {
      showAlert('Maximum number of OTP send attempts reached.', 'error');
      setAadhaarVal('');
      setSendOTPCount(0);
      handleClose();
      return;
    }
    setSendingOTP(true);
    setSendOTPButtonState('loader');
    let payload = {
      company_id: company_id,
      product_id: product_id,
      user_id: user._id,
      loan_app_id: loanAppId,
      aadhaar_no: aadhaarVal,
      section_code: sectionCode,
    };
    if (section) {
      let index = 300 + parseInt(section[section.length - 1]) - 1;
      payload.section_sequence_no = index;
    } else {
      payload.section_sequence_no = sectionSequenceNumber;
    }
    new Promise((resolve, reject) => {
      dispatch(postAadhaarOtpWcher(payload, resolve, reject));
    })
      .then((response) => {
        showAlert(sendOTPCount >= 1 ? 'Otp resent successfully to your mobile' : response?.message ?? 'Otp sent successfully to your mobile', 'success');
        setOTPsent(true);
        setOpenPopup(true);
        setSendingOTP(false);
        setSendOTPButtonState('button');
        setSendOTPCount(sendOTPCount + 1);
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message, 'error');
        setOTPsent(false);
        setSendingOTP(false);
        setSendOTPButtonState('button');
      });
  };

  const change = (e, type, name) => {
    const buttonText = e.target?.textContent;
    const valued = buttonText;
    if (valued === 'Send OTP' && aadhaarVal.length == 12) {
      sendAadhaarOtpFunction();
    } else {
      if (/^\d*$/.test(e.value)) {
        let values = e.value;
        if (values?.length >= 12) {
          values = values.substring(0, 12);
        }
        setAadhaarVal(values);
        const value = values;
        let field = `${type}_vl_${name}`;
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
    }
  };

  return (
    <>
      <div>
        <InputBox
          initialValue={aadhaarVal}
          isBoxType={sendOTPButtonState}
          Buttonlabel="Send OTP"
          id={row.field}
          label={row.title}
          isDrawdown={false}
          onClick={(event) => change(event, row.type, row.field)}
          isDisabled={false}
          customDropdownClass={inputBoxCss}
          customClass={{
            height: '56px',
            width: '100%',
            maxWidth: '100%',
          }}
          customButtonStyle={{ width: '86px', right: '0%' }}
          customInputClass={{
            minWidth: '100%',
            backgroundColor: '#fff',
          }}
          error={row.checked.toLowerCase() === 'true' ? validationData[`${row.type}_vl_${row.field}State`] === 'has-danger' : stateData[`${row.type}_vl_${row.field}`] !== '' && validationData[`${row.type}_vl_${row.field}State`] === 'has-danger'}
          helperText={row.checked.toLowerCase() === 'true' ? (validationData[`${row.type}_vl_${row.field}State`] === 'has-danger' ? row.validationMsg : '') : stateData[`${row.type}_vl_${row.field}`] !== '' && (validationData[`${row.type}_vl_${row.field}State`] === 'has-danger' ? row.validationMsg : '')}
        />
      </div>
      {openPopup ? <OTPInputPopup isOpen={openPopup} length={6} onChange={handleOtpChange} onClose={handleClose} error={aadhaarOTPError} setError={setAadhaarOTPError} handleSubmit={handleOTPSubmit} errorMessage={aadhaarOTPErrorMessage} verifyingOTP={verifyingOTP} sendOTP={sendAadhaarOtpFunction} sendingOTP={sendingOTP} OTPSent={OTPSent} setOTPSent={setOTPsent} /> : null}
    </>
  );
};

export default aadharVerifyInputbox;
