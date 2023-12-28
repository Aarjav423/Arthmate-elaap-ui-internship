import React, { useState,useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useDispatch } from "react-redux";
import "./sanctionAndLenderLead.style.css";
import Download from "./../../../assets/Download.svg";
import esign from "./../../../assets/esign.svg";
import Upload from "./../../../assets/Upload.svg";
import viewDoc from "./../../../assets/viewDoc.svg";
import UploadPopup from "react-sdk/dist/components/Popup/UploadPopup";
import {getBorrowerDetailsByIdWatcher} from "../../../../actions/borrowerInfo"
import { AlertBox } from "../../../../components/CustomAlertbox";
import { storedList } from "../../../../util/localstorage";
import {postEsignRequestWatcher} from "../../../actions/msme.action"
import { documentCode } from "../../../config/docCode";
import Alert from "react-sdk/dist/components/Alert/Alert";
import { uploadLoanDocumentsWatcher } from "../../../../actions/loanDocuments";
import { getBookLoanDetailsWatcher , getMsmeLoanDocumentsWatcher } from "../../../actions/bookLoan.action";
import ViewDocumentCustom from '../../../components/document/ViewDocumentCustom';

export default function SanctionLenderLead() {
  const [isUploadFile, setIsUploadFile] = useState(false);
  const [viewDocument, setViewDocument] = useState(false);
  const [blobURL, setBlobUrl] = useState("");
  const [doc_title, setDocTitle] = useState("");
  const [currentDoc, setCurrentDoc] = useState("");
  const [doc_key, setDocKey] = useState("");
  const params = useParams()
  const dispatch = useDispatch();
  const [isSl,setIsSl] = useState(false)
  const [isLba,setIsLba] = useState(false)
  const [loanAppID,setLoanAppID] = useState("")
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const user = { _id: storedList('user')?._id, id: storedList('user')?.id };
  const [loanDatas, setLoanDatas] = useState();
  const [companyID, setCompanyID] = useState();
  const [productID, setProductID] = useState();
  const [uploadFile, setUploadFIle] = useState(false);
  const [viewFile, setViewFile] = useState([]);
  const [docExtCode, setDocExtCode] = useState(""); 
  const [allowedFileType, setAllowedFileType] = useState(".pdf");

  useEffect(() => {
    fetchLoandetails();
  }, []);

  useEffect(() => {
    fetchDocView();
  },[uploadFile])

  let cards = [
    {
      name: "Sanction Letter",
      isDisabled: false,
      code: '002',
      icons: [
        {
          name: "eSignSL",
          icon: esign,
          label: "eSign",
          isShow: true,
        },
        {
          name: "UploadSL",
          icon: Upload,
          label: "Upload",
          isShow: true,
        },
      ],
      doc: {
        "_id": {
          "code": '002'
        },
        "file_url": "",
        "code": '002',
        "file_type": "Sanction Letter"
      },
    },
    {
      name: "Lender Borrower Agreement",
      isDisabled: false,
      code: '001',
      icons: [
        {
          name: "eSignLBA",
          icon: esign,
          label: "eSign",
          isShow: true,
        },
        {
          name: "UploadLBA",
          icon: Upload,
          label: "Upload",
          isShow: true,
        },
      ],
      doc: {
        "_id": {
          "code": '001'
        },
        "file_url": "",
        "code": '001',
        "file_type": "Lender Borrower Agreement"
      },
    },
  ];

  const handleOnClick = (label, event) => {
    debugger;
    setViewDocument(false);
    if(label === "UploadSL"){
      handleFileInputChange(event, false, '002')
    }
    else if(label === "UploadLBA"){
      handleFileInputChange(event,false, '001')
    }
    else if(label === "eSignSL"){
      if(isSl){
        showAlert("eSign request already sent","error")
      }
      else {
         postEsignRequest(documentCode.sanction_letter)
      }
    }
    else if(label === "eSignLBA"){
      if(isLba){
        showAlert("eSign request already sent","error")
      }
      else {
         postEsignRequest(documentCode.lender_borrower_aggrement)
      }
    }
  };

  async function fetchDocView() {
    const data = {
      company_id: params.company_id,
      product_id: params.product_id,
      loan_id: params.loan_id,
  };
  const response = await new Promise((resolve, reject) => {
    dispatch(getBorrowerDetailsByIdWatcher(data, resolve, reject));
  })
    setLoanAppID(response.data.loan_app_id)
    setIsSl(response?.data?.sl_req_sent ? response?.data?.sl_req_sent : false)
    setIsLba(response?.data.lba_req_sent ? response?.data?.lba_req_sent : false)
    const payloadForDoc = {
      loanAppID: response.data.loan_app_id,
      companyId: response.data.companyID,
      productId: response.data.productID,
      user: user,
    };
    if(response.data.loan_app_id){
     let FetchedLoanDocuments;
      new Promise((resolve, reject) => {
        dispatch(getMsmeLoanDocumentsWatcher(payloadForDoc, resolve, reject));
      })
        .then((response) => {
          setViewFile([]);
          FetchedLoanDocuments = response;
          cards.forEach(element => {
            response.forEach(doc => {
              if(element.code == doc.code){
                element.doc = {...element.doc, ...doc};
                setViewFile((previous) => [...previous, doc])
              }
            })
          });
        })
        .catch((error) => {
          showAlert(error.response?.data?.message, "error");
        });
    }
  }

  async function docUpload(fileData) {
    const data = {
      company_id: params.company_id,
      product_id: params.product_id,
      loan_id: params.loan_id,
  };
  const response = await new Promise((resolve, reject) => {
    dispatch(getBorrowerDetailsByIdWatcher(data, resolve, reject));
  })
    const dataForUpload = {
      submitData: {
        base64pdfencodedfile: fileData["uploadFileBase64"],
        fileType: fileData["uploadFileName"],
        code: fileData["code"],
        loan_app_id: response.data.loan_app_id,
        borrower_id: response.data.borrower_id,
        partner_loan_app_id: response.data.partner_loan_app_id,
        partner_borrower_id: response.data.partner_borrower_id,
      },
      userData: {
        company_id: response.data.company_id,
        product_id: response.data.product_id,
        user_id: user._id,
      },
    };
    setUploadFIle(true)
    try {
      await dispatch(
        uploadLoanDocumentsWatcher(
          dataForUpload,
          (response) => {
            showAlert("Document Uploaded", "success");
            setUploadFIle(false);
            // setDisableButton(false);
            (error) => {
              showAlert(error?.response?.data?.message, "error");
            }
          }
        )
      );
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  const handleFileInputChange = (event, isXML, docCode) => {
    const file = event.target.files[0];
    if (file) {
      const selectedFile = event?.target?.files;
      if (selectedFile[0]["size"] > 5e6) {
        showAlert("File size should not be greater than 5 MB", "error");
        return;
      }
      const fileType = selectedFile[0]["name"];
      const fileExtension = fileType.split(".").pop();
      if ((isXML && fileExtension.toLowerCase() != "xml" && fileExtension.toLowerCase() != "json") ||
        (!isXML &&
          (fileExtension.toLowerCase() != "pdf" &&
            fileExtension.toLowerCase() != "png" &&
            fileExtension.toLowerCase() != "jpg" &&
            fileExtension.toLowerCase() != "jpeg"
          ))) {
        showAlert(
          `${isXML ? "Only XML file is allowed " : "Only JPG,JPEG,PDF & PNG file is allowed"}`,
          "error"
        );
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        let base64Data = reader.result.split(",")[1]; // Extract the base64 data part
        if (["png", "jpeg", "jpg"].includes(fileExtension)){
           base64Data =  convertImagesToPdf(base64Data);
        }
        const uploadFileName =
          file.name.length <= 20 ? file.name : file.name.slice(0, 20) + "...";
        const uploadedData = {
          uploadFileName,
          uploadFileBase64: base64Data,
          code: docCode,
        };
        docUpload(uploadedData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentPopUp =(doc) => {  
    viewFile.forEach(element => {
      if(element.code == doc.code){
        setBlobUrl(element.file_url);
        setDocTitle(element.file_type);
        setDocKey(element.loan_app_id)
        setDocExtCode(doc.code);
        setViewDocument(true);
      }
    });
  };

  const handleUploadPopupClose = () => {
    setIsUploadFile(!isUploadFile)
  }

  const handleFileUpload = () => {
    console.log("file is uploaded");
  }

  const handleFileChange = () => {
    console.log("new file is uploaded");
  }

  const handleViewDocumentClose = () => {
    setViewDocument(false);
  }

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  const postEsignRequest = (code) => {
    const data = {
        company_id: params.company_id,
        product_id: params.product_id,
        loan_app_id: loanAppID,
        user_id: user._id,
        doc_code:code
    };
    new Promise((resolve, reject) => {
      dispatch(postEsignRequestWatcher(data, resolve, reject));
    })
      .then((response) => {
         if(response){
            if(code === documentCode.sanction_letter){
              setIsSl(true)
              showAlert("Esign request sent successfully","success")
            }
            if(code === documentCode.lender_borrower_aggrement){
              setIsLba(true)
              showAlert("Esign request sent successfully","success")
            }
         }
      })
      .catch((error) => {
        showAlert("Esign request failed","error")
      });
  }

  const fetchLoandetails = () => {
    const data = {
        company_id: params.company_id,
        product_id: params.product_id,
        loan_id: params.loan_id,
    };
      new Promise((resolve, reject) => {
        dispatch(getBorrowerDetailsByIdWatcher(data, resolve, reject));
      })
      .then((result) => {
        setIsSl(result?.data?.sl_req_sent ? result?.data?.sl_req_sent : false)
        setIsLba(result?.data.lba_req_sent ? result?.data?.lba_req_sent : false);
        setLoanAppID(result?.data?.loan_app_id)
        setCompanyID(result?.data?.company_id)
        setProductID(result?.data?.product_id)
      })
      .catch((error) => {
         showAlert(error?.response?.data?.data?.message, "error");
      });
};

  return (
    <div>
       {alert ? (
          <AlertBox
            severity={severity}
            msg={alertMessage}
            onClose={handleAlertClose}
          />
        ) : null}
      {viewDocument ? <ViewDocumentCustom 
          loan_app_id={doc_key} 
          company_id={params.company_id} 
          product_id={params.product_id} 
          doctype={doc_title} 
          awsurl={blobURL} 
          dispatch={dispatch} 
          setIsOpen={setViewDocument} 
          isOpen={viewDocument} 
          title={doc_title} 
          isXML={false} /> : null}
      {isUploadFile ? <UploadPopup
        heading="Upload File"
        isOpen={isUploadFile}
        onClose={handleUploadPopupClose}
        customStyles={{
          position: "absolute",
          top: "10rem",
          left: "30rem",
          width: "35rem"
        }}
        accept={allowedFileType}
        onUpload={handleFileUpload}
        onFileSelect={handleFileChange}
      /> : null}
      <div className="es_container">
        {cards.map((card) => (
          <div className="es_card" key={card.name}>
            <div className="es_card_header">
              <h3>{card.name}</h3>
              <img src={viewDoc} className="es_card_body-viewIcon" onClick={() => handleDocumentPopUp(card.doc)} />
            </div>
            <div>
              <h4 className="es_card_body-header">Choose option</h4>
              <hr className="es_card-hr" />
              <div className="es_lead_card_body-icons">
              {card.icons.map((icon) => (
                  <div
                    key={icon.label}
                    onClick={icon.label == "eSign" ? () => handleOnClick(icon.name, null) : null}
                  >
                    <label className="es_card_body-icon" htmlFor={icon.label == "Upload" ? icon.name : ''}>
                      <img src={icon.icon} style={{height : "32px",width : "32px"}} className="es_card_body-each-icon" />
                      <p>{icon.label}</p>
                    </label>
                    <input
                      type="file"
                      id={icon.name}
                      style={{ display: "none" }}
                      onChange={(event) =>handleOnClick(icon.name, event)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
