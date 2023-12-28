import React, { useState, useRef, useEffect } from 'react';
import './OTPInputPopup.style.css';
import { useDispatch } from 'react-redux';
import { storedList } from 'util/localstorage';
import Button from 'react-sdk/dist/components/Button';

export const OTPInputPopup = ({ length = 6, onChange, isOpen, onClose, error, setError, handleSubmit, errorMessage, verifyingOTP, sendOTP, sendingOTP, OTPSent, setOTPSent }) => {
  const [inputValues, setInputValues] = useState(Array(length).fill(''));
  const [resendTimer, setResendTimer] = useState(0);
  const [submitCount, setSubmitCount] = useState(0);
  const intervalIdRef = useRef(null);
  const dispatch = useDispatch();
  const styles = useStyles({ innerWidth, innerHeight });

  useEffect(() => {
    if (OTPSent) {
      startResendTimer();
    }
  }, [OTPSent]);

  useEffect(() => {
    const lastFilledIndex = inputValues.findIndex((value) => !value);
    if (lastFilledIndex !== -1) {
      inputRefs.current[lastFilledIndex].current.focus();
    } else {
      inputRefs.current[length - 1].current.focus();
    }
  }, [submitCount]);

  const handleSubmitClick = () => {
    setSubmitCount(submitCount + 1);
    handleSubmit();
  };

  const decrementTimer = () => {
    setResendTimer((prevTime) => {
      if (prevTime === 1) {
        clearInterval(intervalIdRef.current);
        setOTPSent(false);
      }
      return prevTime - 1;
    });
  };

  const handleClick = (index) => {
    const inputRef = inputRefs.current[index];
    const inputValue = inputValues[index];
    inputRef.current.setSelectionRange(inputValue.length, inputValue.length);
  };

  const clearInputValues = () => {
    const newValues = Array(length).fill('');
    setInputValues(newValues);
    onChange(newValues.join(''));
  };

  const startResendTimer = () => {
    setResendTimer(59);
    setError(false);
    clearInputValues();

    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    intervalIdRef.current = setInterval(decrementTimer, 1000);
  };

  const inputRefs = useRef(
    Array(length)
      .fill(null)
      .map(() => React.createRef()),
  );

  const handleInputChange = (index, value) => {
    if (/^\d*$/.test(value)) {
      const newValues = [...inputValues];
      newValues[index] = value;
      setInputValues(newValues);
      onChange(newValues.join(''));

      const prevEmptyIndex = findPreviousEmptyIndex(index);
      if (prevEmptyIndex !== null) {
        newValues[prevEmptyIndex] = value;
        setInputValues(newValues);

        newValues[index] = '';
        setInputValues(newValues);

        const nextIndex = getNextIndex(prevEmptyIndex);
        if (nextIndex !== null) {
          inputRefs.current[nextIndex].current.focus();
        }
      }
    }
    setError(false);
  };

  const findPreviousEmptyIndex = (currentIndex) => {
    for (let i = 0; i < currentIndex; i++) {
      if (!inputValues[i]) {
        return i;
      }
    }
    return null;
  };

  const getNextIndex = (currentIndex) => {
    for (let i = currentIndex + 1; i < length; i++) {
      if (!inputValues[i]) {
        return i;
      }
    }
    return null;
  };

  const handleFocus = (index) => {
    inputRefs.current.forEach((ref, i) => {
      if (i === index) {
        ref.current.style.borderColor = error ? 'red' : 'black';
      } else {
        const borderColor = error ? 'red' : '#CCCDD3';
        ref.current.style.borderColor = borderColor;
      }
    });
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && !inputValues[index]) {
      inputRefs.current[index - 1].current.focus();
    } else if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1].current.focus();
    } else if (e.key === 'ArrowLeft') {
      const prevInputRef = inputRefs.current[index - 1];

      if (index > 0) {
        const prevInputValue = inputValues[index - 1];

        setTimeout(() => {
          prevInputRef.current.focus();
          prevInputRef.current.setSelectionRange(prevInputValue.length, prevInputValue.length);
        }, 0);
      } else {
        const currentInputRef = inputRefs.current[index];
        const currentValue = inputValues[index];

        setTimeout(() => {
          currentInputRef.current.setSelectionRange(currentValue.length, currentValue.length);
        }, 0);
      }
    }
  };

  useEffect(() => {
    const firstEmptyIndex = inputValues.findIndex((value) => !value);
    if (firstEmptyIndex !== -1) {
      inputRefs.current[firstEmptyIndex].current.focus();
    }
  }, [inputValues]);

  return (
    <>
      {isOpen && <div className={`modal-container_4 ${isOpen ? 'open' : ''}`} />}
      <div className="modal_4" style={styles.modalStyle}>
        <h1 style={styles.titleStyle}>Aadhaar Verification</h1>
        <p style={styles.descriptionStyle}>{`Please enter ${length} digit OTP sent to the mobile number linked with the provided Aadhaar Number.`}</p>
        <div>
          <div style={styles.inputContainerStyle}>
            {inputValues.map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onClick={() => handleClick(index)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onFocus={() => handleFocus(index)}
                ref={inputRefs.current[index]}
                autoComplete="off"
                style={{
                  ...styles.inputStyle,
                  border: error ? '1px solid red' : styles.inputStyle.border,
                }}
              />
            ))}
          </div>
          {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '5px', position: 'absolute', width: '100%', top: '54%', right: '0%' }}>{errorMessage}</p>}
          <div style={styles.resendContainerStyle}>
            {sendingOTP ? (
              <p>Resending OTP...</p>
            ) : resendTimer > 0 && OTPSent ? (
              <p>Resend in {resendTimer} sec</p>
            ) : (
              <p onClick={sendOTP} style={styles.resendText}>
                Resend
              </p>
            )}
          </div>
        </div>
        <div style={styles.buttonContainerStyle}>
          <Button label="Cancel" onClick={onClose} buttonType="primarys" customStyle={styles.cancelButton}></Button>

          <Button
            label="Submit"
            onClick={handleSubmitClick}
            buttonType="primarys"
            isLoading={verifyingOTP ? true : false}
            customStyle={styles.submitButton}
            customLoaderClass={{
              borderTop: '4px solid #fff',
            }}
          ></Button>
        </div>
      </div>
    </>
  );
};

const useStyles = () => {
  return {
    modalStyle: {
      width: '450px',
      height: '460px',
      border: '1px solid #E3E3E3',
      marginLeft: '120px',
      borderRadius: '8px',
      boxShadow: '0px 6px 21px 1px #00000040',
      backgroundColor: '#FFFFFF',
      padding: '50px',
    },
    titleStyle: {
      fontFamily: 'Montserrat-Regular',
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: '30px',
      letterSpacing: '0px',
      textAlign: 'center',
    },
    descriptionStyle: {
      fontFamily: 'Montserrat-Regular',
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: '24px',
      letterSpacing: '0px',
      textAlign: 'center',
      marginLeft: '3px',
      marginRight: '3px',
      marginTop: '20px',
    },
    inputContainerStyle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '30px',
    },
    inputStyle: {
      width: '50px',
      height: '50px',
      borderRadius: '8px',
      background: 'linear-gradient(0deg, #FFFFFF, #FFFFFF)',
      border: '1px solid #CCCDD3',
      margin: '0 0.5em',
      textAlign: 'center',
    },
    errorStyle: {
      position: 'absolute',
      color: 'red',
      fontFamily: 'Montserrat-Regular',
      fontSize: '12px',
      fontWeight: 500,
      lineHeight: '18px',
      letterSpacing: '0px',
      textAlign: 'center',
      marginTop: '5px',
      width: '100%',
      top: '54%',
      right: '0%',
    },
    resendContainerStyle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Montserrat-Regular',
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: '24px',
      letterSpacing: '0px',
      textAlign: 'center',
      marginTop: '48px',
    },
    resendText: {
      fontFamily: 'Montserrat-Regular',
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: '24px',
      letterSpacing: '0px',
      textAlign: 'center',
      color: '#134CDE',
      cursor: 'pointer',
    },
    buttonContainerStyle: {
      marginTop: '1em',
      display: 'flex',
      justifyContent: 'center',
    },
    cancelButton: {
      width: '167px',
      height: '48px',
      padding: '12px 24px',
      borderRadius: '40px',
      border: '1px solid #134CDE',
      gap: '10px',
      cursor: 'pointer',
      marginRight: '1em',
      backgroundColor: '#fff',
      fontFamily: 'Montserrat-Regular',
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '24px',
      letterSpacing: '0px',
      textAlign: 'center',
      color: '#134CDE',
      marginTop: '15px',
    },
    submitButton: {
      width: '167px',
      height: '48px',
      padding: '12px 24px',
      borderRadius: '40px',
      border: '1px solid #134CDE',
      gap: '10px',
      cursor: 'pointer',
      backgroundColor: '#134CDE',
      fontFamily: 'Montserrat-Regular',
      fontSize: '16px',
      fontWeight: 600,
      lineHeight: '24px',
      letterSpacing: '0px',
      textAlign: 'center',
      color: '#fff',
      marginTop: '15px',
    },
  };
};
