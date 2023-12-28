import React, { useState, useEffect, useRef } from "react";
import UploadCard from "react-sdk/dist/components/UploadCard";
import { AlertBox } from "components/AlertBox";
import { b64ToBlob } from "util/helper";
import base64String from "./base64String";
import ViewDocumentCustom from "msme/components/document/ViewDocumentCustom";
import { useDispatch } from "react-redux";
import { documentCode as DocumentCodeList } from "msme/config/docCode";
import {documentAttributes} from "./documentAttributes";
import { convertImagesToPdf } from "util/helper";
import { storedList } from "util/localstorage";
import { uploadLoanDocumentsWatcher } from "actions/loanDocuments";

export const DocumentsList = ({ loanDocuments, companyId, productId, loanAppId, fetchLoanDocuments, isEdit }) => {
  const [doc_key, setDocKey] = useState("");
  const [viewDocument, setViewDocument] = useState(false);
  const [docExtCode, setDocExtCode] = useState("");
  const [doc_title, setDocTitle] = useState("");
  const [currentDoc, setCurrentDoc] = useState("");
  const [blobURL, setBlobUrl] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [currentDocType, setCurrentDocType] = useState("")
  const [currentDocUrl, setCurrentDocUrl] = useState("")
  const [fileTitle, setFileTitle] = useState("")
  const [isXML, setIsXML] = useState(false);
  const [isExcel, setIsExcel] = useState(false);
  const [disableDocUpload, setDisableDocUpload] = useState();
  const [currDoc, setCurrDoc] = useState(null)
  const dispatch = useDispatch();
  const user = storedList('user');
  const InputUseRef = useRef();

  const xmlDocumentCode = [
    DocumentCodeList.cb_pan_XML,
    DocumentCodeList.cb_aadhaar_XML,
    DocumentCodeList.guar_pan_XML,
    DocumentCodeList.guar_aadhaar_XML,
    DocumentCodeList.applicant_pan_XML,
    DocumentCodeList.applicant_aadhaar_XML,
  ]

  const excelDocumentCode = [
    DocumentCodeList.bank_statement_excel
  ]

  useEffect(()=>{
    if(currDoc){
      InputUseRef?.current?.click();
    }
  },[currDoc])

  const handleDocumentPopUp = (pdf) => {
    try {
      setCurrentDocType(pdf?.file_type)
      setCurrentDocUrl(pdf?.file_url)
      setFileTitle(pdf?.file_type)
      setViewDocument(true);
      if (xmlDocumentCode.includes(pdf.code)){
        setIsXML(true);
      }
      else if (excelDocumentCode.includes(pdf.code)){
        setIsExcel(true);
      }
      else{
        setIsXML(false);
        setIsExcel(false);
      }
    } catch (error) {
      setAlert(true);
      setSeverity("error");
      setAlertMessage("Error while viewing Document");
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
    }
  };


  const showAlert = (msg, type) => {
    const element = document.getElementById("TopNavBar");

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
    }

    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);

    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  const handleModalClose = () => {
    setViewDocument(false);
  };

  useEffect(()=>{
    setDisableDocUpload(!isEdit);
  },[isEdit])

  const handleClickUpload = (doc) => {
    setCurrDoc(doc);
  }

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const documentUploadToDb = async (fileData) =>{
    const dataForUpload = {
      submitData:{
        base64pdfencodedfile: fileData['uploadFileBase64'],
        fileType: fileData['uploadFileName'],
        code: currDoc.code,
        loan_app_id:currDoc.loan_app_id,
        borrower_id:currDoc.borrower_id,
        partner_loan_app_id:currDoc.partner_loan_app_id,
        partner_borrower_id:currDoc.partner_borrower_id,
      },
      userData:{
        company_id: companyId,
        product_id: productId,
        user_id: user._id,
      }
    };

    if(currDoc.doc_index!=null){
      dataForUpload['submitData']['doc_index'] = currDoc.doc_index;
    }

    new Promise((resolve, reject)=>{
      dispatch(uploadLoanDocumentsWatcher(dataForUpload, resolve, reject))
    }).then((response)=>{
      showAlert("uploaded", 'success');
      fetchLoanDocuments();

    })
    .catch((error)=>{
      console.log(error);
    })
  }

  const handleUploadDocument = (e)=>{
    const files = e.target.files;
    const file = files[0];
    if(file){
      const allowedFileSize = documentAttributes[currDoc.code]["fileSize"]*1e6;
      if(file['size']>allowedFileSize){
        showAlert(`File size should not be greater than ${documentAttributes[currDoc.code]["fileSize"]} MB`, 'error')
        return;
      }
      const isXML = xmlDocumentCode.includes(currDoc.code);
      const fileExtension = file['name'].split('.').pop();
      if ((isXML && fileExtension.toLowerCase() != 'xml' && fileExtension.toLowerCase() != 'json') || (!isXML && fileExtension.toLowerCase() != 'pdf' && fileExtension.toLowerCase() != 'png' && fileExtension.toLowerCase() != 'jpg' && fileExtension.toLowerCase() != 'jpeg')) {
        showAlert(`${isXML ? 'Only XML file is allowed ' : 'Only JPG,JPEG,PDF & PNG file is allowed'}`, 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = ()=>{
        let base64Data = reader.result.split(',')[1];
        if(['png', 'jpeg', 'jpg'].includes(fileExtension)){
          base64Data = convertImagesToPdf(base64Data);
        }
        const uploadFileName = file.name.length <= 20 ? file.name : file.name.slice(0, 20) + '...';
        const uploadedFileData = {
          uploadFileName,
          uploadFileBase64: base64Data,
          code: currDoc.code,
        }
  
        loanAppId && currDoc && currDoc.code && documentUploadToDb(uploadedFileData);
      }
      reader.readAsDataURL(file);
    }
  }

  const styles = useStyles({ innerWidth, innerHeight });

  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      <div style={styles["containerStyle"]}>
        <div>
          {viewDocument ?
            <ViewDocumentCustom
              loan_app_id={loanAppId}
              company_id={companyId}
              product_id={productId}
              doctype={currentDocType}
              awsurl={currentDocUrl}
              dispatch={dispatch}
              setIsOpen={setViewDocument}
              isOpen={viewDocument}
              title={fileTitle}
              isXML={isXML}
              isExcel={isExcel}
              showAlert={showAlert}
            />
            : null
          }
        </div>

        {currDoc &&
          <input
            key={currDoc ? currDoc.code : ""}
            style={{ display: 'none' }}
            type="file"
            ref={InputUseRef}
            onChange={e => handleUploadDocument(e)}
            accept={`${currDoc ? documentAttributes[currDoc.code]['fileType'] : "*/*"}`}
          />
        }

        <div>
          {loanDocuments &&
            loanDocuments.map((section, id) => {
              return (
                <div key={id}>
                  <h5 style={styles["sectionTitleStyle"]}>{section.title}</h5>
                  <div style={styles["rowStyle"]}>
                    {section.docs &&
                      section.docs.map((doc, docId) => {
                        return (
                          <UploadCard
                            key={docId}
                            hasDocument={doc.file_url ? true : false}
                            heading={(
                              doc.file_type[0].toUpperCase() +
                              doc.file_type.slice(1)
                            ).replace(/_/g, " ")}
                            viewOnClick={() => handleDocumentPopUp(doc)}
                            uploadOnClick={() => { handleClickUpload(doc) }}
                            uploadRevoke={disableDocUpload}
                          />
                        );
                      })}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

const useStyles = () => {
  return {
    containerStyle: {
      marginTop: "30px",
    },
    rowStyle: {
      display: "grid",
      gridColumnGap: 0,
      marginTop: "18px",
      marginBottom: "45px",
      gridTemplateColumns: "25% 25% 25% 25%",
      marginLeft: "12px",
    },
    sectionTitleStyle: {
      fontFamily: "Montserrat-Regular",
      fontSize: "18px",
      fontWeight: 600,
      lineHeight: "27px",
      letterSpacing: "0px",
      textAlign: "left",
      marginLeft: "12px",
    },
  };
};
