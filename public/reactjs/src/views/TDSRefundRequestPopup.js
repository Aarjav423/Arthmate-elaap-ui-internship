import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { validateData } from '../util/validation';
import FormPopUp from 'react-sdk/dist/components/Popup/FormPopup';
import Button from 'react-sdk/dist/components/Button';
import InputBox from 'react-sdk/dist/components/InputBox/InputBox';
import TextField from '@mui/material/TextField';
import { storedList } from '../util/localstorage';
import { TdsRefundRequestWatcher } from '../actions/TdsRefundRequestWatcher';
import { AlertBox } from '../components/AlertBox';
import {constant} from '../constants/constant';

export default function TdsRefundRequest({ handleClose, company, product, finanicalyearData,doc_ext }) {
  const user = storedList('user');
  const dispatch = useDispatch();
  const [isopen, setIsOpen] = useState(true);
  const [loanId, setLoanId] = useState('');
  const [tdsCertificateNumber, setTdsCertificateNumber] = useState('');
  const [tdsAmount, setTdsAmount] = useState('');
  const [validationData, setValidationData] = useState({});
  const [financialYear, setFinancialYear] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [base64FileContent, setBase64FileContent] = useState('');
  const fileInputRef = useRef(null);
  useEffect(() => {
    if (financialYear) {
      const selectedYear = parseInt(financialYear.split('-')[0]);
      const selectedQuarter = parseInt(financialYear.split('Q')[1]);

      const generatedOptions = [];

      for (let i = 1; i <= 4; i++) {
        generatedOptions.push({
          label: `${selectedYear - 1}-${selectedYear}Q${i}`,
          value: `${selectedYear - 1}-${selectedYear}Q${i}`,
        });
      }

      for (let i = 1; i <= selectedQuarter; i++) {
        generatedOptions.push({
          label: `${selectedYear}-${selectedYear + 1}Q${i}`,
          value: `${selectedYear}-${selectedYear + 1}Q${i}`,
        });
      }

      finanicalyearData.current = generatedOptions;
    }
  }, [financialYear]);
  const handleAlertClose = () => {
    setAlert(false);
    setSeverity('');
    setAlertMessage('');
  };

 
  const dataValidation = (type, value, name) => {
    let isValid = validateData(type, value);
    if (!isValid) {
      setValidationData((prevState) => ({
        ...prevState,
        [name]: true,
      }));
    } else {
      setValidationData((prevState) => ({
        ...prevState,
        [name]: false,
      }));
    }
  };

  useEffect(() => {
    const isFormFilled = loanId !== '' && tdsCertificateNumber !== '' && tdsAmount !== '' && financialYear !== '' && remarks !== '' && selectedFileName !== '';

    setIsDisabled(!isFormFilled);
  }, [loanId, tdsCertificateNumber, tdsAmount, financialYear, selectedFileName, remarks]);

  const handleFileInputChange = (event, docCode) => {
    const file = event.target.files;
    if (file) {
      const selectedFile = file[0];
      if (selectedFile.size > constant.size) {
        showAlert('File size should not be greater than 5 MB', 'error');
        return;
      } 
      const fileType = selectedFile.name;
      const fileExtension = `.${fileType.split('.').pop()}`;
      if (!doc_ext.includes(fileExtension.toLowerCase())) {
        const extensions = doc_ext.map(ext => `'${ext}'`).join(', ');
        showAlert(`${extensions} files are allowed`, 'error');
        return;
      }
  
      setSelectedFileName(fileType);
      setIsFileUploaded(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target.result.split(',')[1];
        setBase64FileContent(base64Data);
      };
      reader.readAsDataURL(selectedFile);
    }
  }; 
  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  
  const handleSubmit = () => {
    const fileInput = fileInputRef.current;
  
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      showAlert('Please upload a TDS certificate file', 'error');
      return;
    }
    const selectedFile = fileInput.files[0];
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const payload = {
        company_id: company,
        product_id: product,
        amount: tdsAmount,
        certificate_number: tdsCertificateNumber,
        loan_id: loanId,
        file_url: base64FileContent,
        financial_year: financialYear,
        comment: remarks,
      };
  
      new Promise((resolve, reject) => {
        dispatch(TdsRefundRequestWatcher(payload, resolve, reject));
      })
      .then((response)=> {
        showAlert(response?.message|| 'Refund Created successfully', "success");
        setTimeout(() => {
            handleClose();
        }, 1000);
      })
        .catch((error) => {
          showAlert(error?.response?.data?.message || 'Error while requesting refund', 'error');
        });
    };
    reader.readAsDataURL(selectedFile);
  };
  
  const handleInputBoxClick = (field) => {
    if (fileInputRef.current) {
      fileInputRef.current.click(field);
    }
  };

  return (
    <>
  {alert ? <AlertBox severity={severity} msg={alertMessage} onClose={handleAlertClose} /> : null}
      <FormPopUp
        heading={'Create New Request'}
        isOpen={isopen}
        onClose={handleClose}
        customStyles={{
          position: 'fixed',
          width: '30%',
          height: '100%',
          maxHeight: '100%',
          marginLeft: '35%',
          paddingTop: '2%',
          display: 'flex',
          flexDirection: 'column',
          float: 'right',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            fontFamily: 'Montserrat-Regular',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '100%',
          }}
        >
          <InputBox
            label="Loan ID*"
            id={'Loan ID'}
            helperText={'Enter valid loan ID'}
            error={validationData['Loan ID']}
            customClass={{
              height: '50px',
              width: '100%',
              maxWidth: '100%',
              marginTop: '6%',
            }}
            customInputClass={{
              height: '50px',
              width: '100%',
              maxWidth: '100%',
            }}
            customErrorClass={{ marginTop: '12px' }}
            onClick={(e) => {
              setLoanId(e.value);
              dataValidation('string', e.value, 'Loan ID');
            }}
          />
          <InputBox
            label="TDS Certificate Number*"
            id={'TDS Certificate Number'}
            error={validationData['TDS Certificate Number']}
            helperText={'Enter valid amount greater than 0'}
            customClass={{
              height: '50px',
              width: '100%',
              maxWidth: '100%',
              marginTop: '6%',
            }}
            customInputClass={{
              height: '50px',
              width: '100%',
              maxWidth: '100%',
            }}
            onClick={(e) => {
              setTdsCertificateNumber(e.value);
              dataValidation('text', e.value, 'TDS Certificate Number');
            }}
          />
          <InputBox
            label="TDS Amount*"
            id={'TDS Amount'}
            error={validationData['TDS Amount']}
            helperText={'Enter valid amount greater than 0'}
            customClass={{
              height: '50px',
              width: '100%',
              maxWidth: '100%',
              marginTop: '6%',
            }}
            customInputClass={{
              height: '100%',
              width: '100%',
              maxWidth: '100%',
            }}
            onClick={(e) => {
              setTdsAmount(e.value);
              dataValidation('float', e.value, 'TDS Amount');
            }}
          />
          <InputBox
            isDrawdown={true}
            label="Financial Year*"
            id={'Financial Year'}
            customClass={{
              height: '50px',
              width: '100%',
              maxWidth: '100%',
              marginTop: '6%',
            }}
            error={validationData['Financial Year']}
            helperText={'Enter valid amount greater than 0'}
            options={finanicalyearData}
            customInputClass={{
              height: '100%',
              width: '100%',
              maxWidth: '100%',
            }}
            customDropdownClass={{ zIndex: 10000, height: '800px', marginTop: '5px' }}
            onClick={(e) => {
              setFinancialYear(e.value);
              dataValidation('string', e.value, 'Financial Year');
            }}
          />
          <InputBox
            initialValue={selectedFileName}
            label="Upload TDS Certificate*"
            id={'Upload TDS certificate'}
            isBoxType={'button'}
            Buttonlabel={isFileUploaded ? 'Change' : 'Upload'}
            helperText={isFileUploaded ? 'Change file in .png ,.pdf, .jpg, or .jpeg format up to 5 MB' : 'Enter file in .png ,.pdf, .jpg, or .jpeg format up to 5 MB'}
            customClass={{
              height: '50px',
              width: '100%',
              maxWidth: '100%',
              marginTop: '6%',
              border: isFileUploaded ? '1px solid #008042' : '1px solid #BBBFCC',
            }}
            onClick={(event) => {
              handleInputBoxClick(event, 'Upload TDS Certificate');
            }}
          />
          <p style={{ color: '#767888', fontFamily: 'Montserrat-Regular', marginLeft: '10px', fontSize: '13px' }}>JPG, JPEG, PNG, PDF upto 5MB</p>
          <input type="file" ref={fileInputRef} id={'TDS Certificate Upload'} style={{ display: 'none' }} onChange={(e) => handleFileInputChange(e, 233)} />
          <TextField
            fullWidth
            id="outlined-basic"
            label="Comment"
            placeholder="Please Add Comment"
            size="string"
            rows={15}
            disabled={tdsAmount=="" ? true : false}
            multiline
            required
            autoFocus
            value={remarks}
            onChange={(event) => {
              setRemarks(event.target.value);
              dataValidation('string', event.target.value, 'Comment');
            }}
            inputProps={{
              style: {
                height: '7vh',
                marginTop: '3%',
                fontFamily: 'Montserrat-Regular',
                fontSize: '0.87vw',
              },
            }}
            InputLabelProps={{
              style: {
                fontSize: '92%',
                fontFamily: 'Montserrat-Regular',
              },
            }}
            error={validationData['Comment']}
          />
          <div
            style={{
              width: '90%',
              display: 'flex',
              bottom: '4vh',
              position: 'absolute',
            }}
          >
            <Button
              id="cancel"
              label="Cancel"
              buttonType="secondary"
              onClick={handleClose}
              customStyle={{
                width: '49%',
                marginRight: '2%',
                color: 'rgb(71, 91, 216)',
                fontSize: '16px',
                borderRadius: '8px',
                border: '1px solid #475BD8',
                backgroundColor: 'white',
                boxShadow: 'none',
              }}
            />
            <Button
              id="submit"
              label="Submit"
              buttonType="secondary"
              onClick={handleSubmit}
              isDisabled={isDisabled}
              customStyle={{
                borderRadius: '8px',
                width: '49%',
                fontSize: '16px',
                backgroundColor: isDisabled ? '#E5E5E8' : '#475BD8',
                color: isDisabled ? '#C0C1C8' : '#FFFFFF',
              }}
            />
          </div>
        </div>
      </FormPopUp>
    </>
  );
}
