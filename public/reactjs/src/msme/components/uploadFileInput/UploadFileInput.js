import React, { useState, useEffect, useRef } from 'react';
import './UploadFileInput.css';
import InputBox from 'react-sdk/dist/components/InputBox/InputBox';
import { useDispatch, useSelector } from 'react-redux';
import { getBookLoanDetailsWatcher } from 'msme/actions/bookLoan.action';
import { uploadLoanDocumentsWatcher } from 'actions/loanDocuments';
import { storedList, saveToStorage } from '../../../util/localstorage';
import ViewDocumentCustom from '../document/ViewDocumentCustom';
import { patchMsmeDocDeleteWatcher } from '../../actions/msme.action';
import { convertImagesToPdf } from '../../../util/helper';

const FileUploadComponent = ({ title, items, backgroundColorChange = false, backgroundColorBlur, showAlert, isSubmit = false, isXML = false, setState = null, onDataCallback = () => true, setDocumentStateData = () => true, removeItem, shouldDelete = false, loanAppId, MSMECompanyId, MSMEProductId, file, setFile, customWidth = false, customMaxWidth= false, sectionName, onFileUpload = (e) => {}, data, isChange, type, borrowerIndex, uploadFileName, hideRemove = false , borrowerId=''}) => {
  let { company_id, product_id } = data;
  const user = storedList('user');
  let fileInputRefs = {};
  const dispatch = useDispatch();

  const initialItemStates = {};
  items.forEach((item) => {
    initialItemStates[item.id] = {
      reuploadFile: false,
      uploadFileName: '',
      uploadFileBase64: '',
      buttonState: 'button',
      documentCode: item.documentCode,
    };
  });

  const [itemStates, setItemStates] = useState(initialItemStates);
  const handleInputBoxClick = (id) => {
    fileInputRefs[id].click();
  };

  const [currentDocType, setCurrentDocType] = useState('');
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [currentDocUrl, setCurrentDocUrl] = useState('');
  const [fileTitle, setFileTitle] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  async function docUpload(fileData, loanAppId, sectionName) {
    let payload = {
      loan_app_id: loanAppId,
      section: sectionName,
      user: JSON.stringify(user),
      companyId: company_id,
      productId: product_id,
    };
    const response = await new Promise((resolve, reject) => {
      dispatch(getBookLoanDetailsWatcher(payload, resolve, reject));
    });

    const dataForUpload = {
      submitData: {
        base64pdfencodedfile: fileData['uploadFileBase64'],
        fileType: fileData['uploadFileName'],
        code: fileData['code'],
        loan_app_id: loanAppId,
        borrower_id: response?.[uploadFileName]?.[borrowerIndex - 1]?.borrower_id ?? response['borrower_id'],
        partner_loan_app_id: response['partner_loan_app_id'],
        partner_borrower_id: response['partner_borrower_id'],
      },
      userData: {
        company_id: response['company_id'],
        product_id: response['product_id'],
        user_id: user._id,
       
      },
    };

    if (fileData.doc_index != null) {
      dataForUpload['submitData']['doc_index'] = fileData.doc_index;
    }

    try {
      await dispatch(
        uploadLoanDocumentsWatcher(
          dataForUpload,
          (response) => {},
          (error) => {
            showAlert(error?.response?.data?.message, 'error');
          },
        ),
      );
    } catch (error) {}
  }
  const handleFileInputChange = (event, id, docCode, docIndex) => {
    const file = event.target.files[0];
    setItemStates((prevState) => ({
      ...prevState,
      [id]: {
        reuploadFile: false,
        uploadFileName: '',
        uploadFileBase64: '',
        buttonState: 'button',
        documentCode: prevState[id]?.documentCode,
      },
    }));

    if (file) {
      const selectedFile = event?.target?.files;
      if (selectedFile[0]['size'] > 5e6) {
        showAlert('File size should not be greater than 5 MB', 'error');
        setItemStates((prevState) => ({
          ...prevState,
          [id]: {
            reuploadFile: false,
            uploadFileName: '',
            uploadFileBase64: '',
            buttonState: 'button',
            documentCode: prevState[id].documentCode,
          },
        }));
        return;
      }
      const fileType = selectedFile[0]['name'];
      const fileExtension = fileType.split('.').pop();
      if ((isXML && fileExtension.toLowerCase() != 'xml' && fileExtension.toLowerCase() != 'json') || (!isXML && fileExtension.toLowerCase() != 'pdf' && fileExtension.toLowerCase() != 'png' && fileExtension.toLowerCase() != 'jpg' && fileExtension.toLowerCase() != 'jpeg')) {
        showAlert(`${isXML ? 'Only XML file is allowed ' : 'Only JPG,JPEG,PDF & PNG file is allowed'}`, 'error');
        setItemStates((prevState) => ({
          ...prevState,
          [id]: {
            reuploadFile: false,
            uploadFileName: '',
            uploadFileBase64: '',
            buttonState: 'button',
            documentCode: prevState[id].documentCode,
          },
        }));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        let base64Data = reader.result.split(',')[1];
        if (['png', 'jpeg', 'jpg'].includes(fileExtension)) {
          base64Data = convertImagesToPdf(base64Data);
        }
        const uploadFileName = file.name.length <= 20 ? file.name : file.name.slice(0, 20) + '...';
        setItemStates((prevState) => ({
          ...prevState,
          [id]: {
            reuploadFile: true,
            uploadFileName,
            uploadFileBase64: base64Data,
            buttonState: 'button',
            documentCode: prevState[id].documentCode,
          },
        }));
        if (id === 'Document_Selfie') {
          setDocumentStateData((prevState) => ({
            ...prevState,
            applicant_image_value: true,
          }));
        }
        if (id === 'pan1') {
          setDocumentStateData((prevState) => ({
            ...prevState,
            pan_image_value: true,
          }));
        }
        if (id === 'panXML1') {
          setDocumentStateData((prevState) => ({
            ...prevState,
            pan_xml_image_value: true,
          }));
        }
        if (id === 'Aadhar_front1') {
          setDocumentStateData((prevState) => ({
            ...prevState,
            aadhaar_front_image_value: true,
          }));
        }
        if (id === 'Aadhar_Back1') {
          setDocumentStateData((prevState) => ({
            ...prevState,
            aadhaar_back_image_value: true,
          }));
        }
        if (id === 'Aadhar_XML') {
          setDocumentStateData((prevState) => ({
            ...prevState,
            aadhaar_xml_image_value: true,
          }));
        }
        if (id === 'udhyam_certificalte_value' || id === 'gst_certificate_value') {
          setDocumentStateData((prevState) => ({
            ...prevState,
            [id]: true,
          }));
        }
        if (id === 'entity_kyc_partnerShip_moa' || id === 'entity_kyc_partnerShip_aoa' || id === 'entity_kyc_partnerShip_by_laws' || id === 'entity_kyc_partnerShip_llom' || id === 'entity_kyc_partnerShip_rc' || id === 'entity_kyc_partnerShip_al') {
          setDocumentStateData((prevState) => ({
            ...prevState,
            [id]: true,
          }));
        } else {
          setDocumentStateData((prevState) => ({
            ...prevState,
            [id]: true,
          }));
        }
        const uploadedData = {
          id,
          uploadFileName,
          uploadFileBase64: base64Data,
          code: docCode,
        };
        if (docIndex != null) {
          uploadedData['doc_index'] = docIndex;
        }
        loanAppId != null && docCode != null && sectionName && docUpload(uploadedData, loanAppId, sectionName);
      };
      reader.readAsDataURL(file);
      onDataCallback(id, { itemStates });

      onFileUpload(event);
      setUploadedDocuments((prevState) => [...prevState, id]);
    }
    setState && typeof setState == 'function' ? setState(itemStates) : null;
  };

  const deleteFile = async (item_ids) => {
    if (item_ids.length === 0) {
      return;
    }
    let codes = item_ids.map((id) => itemStates[id].documentCode);
    const payload = {
      company_id: company_id,
      product_id: product_id,
      user: user,
      loanAppId: loanAppId,
      code: codes
    };
    if (borrowerId)
    {
      payload.borrowerId = borrowerId;
    }
    try {
      dispatch(patchMsmeDocDeleteWatcher(payload));
      item_ids.forEach((id) => {
        setItemStates((prevState) => ({
          ...prevState,
          [id]: {
            reuploadFile: false,
            uploadFileName: '',
            uploadFileBase64: '',
            buttonState: 'button',
            documentCode: prevState[id].documentCode,
          },
        }));
      });
      setUploadedDocuments([]);
      item_ids.forEach((id) => {
        delete fileInputRefs[id];
      });
    } catch (error) {
      showAlert('Error deleting file', 'error');
    }
  };

  useEffect(() => {
    if (shouldDelete && type!='view') {
      deleteFile(uploadedDocuments);
      items.forEach((item) => {
        setItemStates((prevState) => ({
          ...prevState,
          [item.id]: {
            reuploadFile: false,
            uploadFileName: '',
            uploadFileBase64: '',
            buttonState: 'button',
            documentCode: item.documentCode,
          },
        }));
      });
    }
  }, [shouldDelete, isXML, items]);

  const removeBtnStyle = {
    border: 'none',
    outLine: 'none',
    color: 'red',
    backgroundColor: 'transparent',
    padding: '0px',
  };

  const parentButtonStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '320px',
  };

  return (
    <div>
      <h2 className="headingStyle">{title}</h2>
      <div className="parentContainer">
        {items.map((item, itemIndex) => (
          <div className="checkBoxParent" key={item.id}>
            <InputBox
              isReadOnly={true}
              label={item.name}
              customClass={{
                height: '58px',
                minWidth: customWidth,
                maxWidth: customMaxWidth,
                width:customMaxWidth,
                border: itemStates[item.id]?.reuploadFile ? '1px solid green' : '1px solid #BBBFCC',
                backgroundColor: backgroundColorBlur && backgroundColorChange ? 'rgb(244, 244, 244)' : '',
              }}
              initialValue={itemStates[item.id] ? itemStates[item.id].uploadFileName : ''}
              customInputClass={{ maxWidth: '720px', backgroundColor: backgroundColorBlur && backgroundColorChange ? 'rgb(244, 244, 244)' : '' }}
              id={item.id}
              isBoxType={(() => {
                if (itemStates[item.id] && itemStates[item.id].buttonState && itemStates[item.id].buttonState) {
                  return itemStates[item.id].buttonState;
                } else {
                  return 'button';
                }
              })()}
              Buttonlabel={(() => {
                if (isSubmit) {
                  return '';
                } else if (item?.s3_url && !isChange) {
                  return 'View';
                } else if (type && type == 'view') {
                  return '';
                } else {
                  if ((itemStates[item.id] && itemStates[item.id].uploadFileName) || (item?.s3_url && isChange)) {
                    return 'Change';
                  } else {
                    return 'Upload';
                  }
                }
              })()}
              isDisabled={backgroundColorBlur && !item.s3_url ? true : false}
              onClick={() => {
                if (item?.s3_url && !isChange) {
                  setCurrentDocType(item?.doc.file_type);
                  setCurrentDocUrl(item?.s3_url);
                  setFileTitle(item?.name);
                  setIsOpen(true);
                } else {
                  handleInputBoxClick(item.id);
                }
              }}
              customButtonStyle={{
                marginTop: '4px',
                color: 'green',
              }}
            />
            <input type="file" ref={(ref) => (fileInputRefs[item.id] = ref)} id={item.id} style={{ display: 'none' }} onChange={(e) => handleFileInputChange(e, item.id, item.documentCode, item.docIndex)} accept={item.acceptFileType} />

            <div style={parentButtonStyle}>
              <p className="paraStyle">{item.fileSize}</p>

              {!hideRemove && item?.name === 'Add Statement' && itemIndex + 1 === items.length ? (
                <button style={removeBtnStyle} onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              ) : null}
            </div>
            {isOpen ? <ViewDocumentCustom loan_app_id={loanAppId} company_id={MSMECompanyId} product_id={MSMEProductId} doctype={currentDocType} awsurl={currentDocUrl} dispatch={dispatch} setIsOpen={setIsOpen} isOpen={isOpen} title={fileTitle} isXML={isXML} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploadComponent;
