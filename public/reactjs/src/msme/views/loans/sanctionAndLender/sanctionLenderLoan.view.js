import React, { useEffect, useState } from "react";
import "./sanctionAndLenderLoan.style.css";
import Download from "./../../../assets/Download.svg";
import esign from "./../../../assets/esign.svg";
import Upload from "../../../assets/Upload.svg";
import viewDoc from "../../../assets/viewDoc.svg";
import DocumentViewPopup from "views/lending/DocumentViewPopup";
import base64String from "./base64String";
import { b64ToBlob } from "util/helper";
import { useParams } from 'react-router-dom';
import { useDispatch } from "react-redux";
import Alert from "react-sdk/dist/components/Alert/Alert";
import { storedList } from "./../../../../util/localstorage";
const user = { _id: storedList('user')?._id, id: storedList('user')?.id };
import { uploadLoanDocumentsWatcher } from "../../../../../src/actions/loanDocuments";
import { getBookLoanDetailsWatcher , getMsmeLoanDocumentsWatcher } from "../../../actions/bookLoan.action";
import ViewDocumentCustom from '../../../components/document/ViewDocumentCustom';

export default function SanctionLenderLoan() {
  const params = useParams()
  const dispatch = useDispatch();
  const [loanDatas, setLoanDatas] = useState();
  const [companyID, setCompanyID] = useState();
  const [productID, setProductID] = useState();
  const [uploadFile, setUploadFIle] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [viewFile, setViewFile] = useState([]);
  const [docExtCode, setDocExtCode] = useState(""); 
  const [allowedFileType, setAllowedFileType] = useState(".pdf");
  const [viewDocument, setViewDocument] = useState(false);
  const [blobURL, setBlobUrl] = useState("");
  const [doc_title, setDocTitle] = useState("");
  const [currentDoc, setCurrentDoc] = useState("");
  const [doc_key, setDocKey] = useState("");
  const pdf = base64String;

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
    setViewDocument(false);
    if(label === "UploadSL"){
      handleFileInputChange(event, false, '002')
    }else if(label === "UploadLBA"){
      handleFileInputChange(event,false, '001')
    }
  };

  const handleViewDocumentClose = () => {
    setViewDocument(false);
  }

  async function fetchDocView() {
    let payload = {
      loan_app_id: params.id,
      user: user,
    }
    const loanData = await new Promise((resolve, reject) => {
      dispatch(getBookLoanDetailsWatcher(payload, resolve, reject));
    });
    setCompanyID(loanData['company_id'])
    setProductID(loanData['product_id'])
    if(loanData){
    const payloadForDoc = {
      loanAppID: loanData.loan_app_id,
      companyId: loanData.company_id,
      productId: loanData.product_id,
      user: user,
    };
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

  useEffect(() => {
    fetchLoanDetails();
    fetchDocView();
  },[uploadFile])

  const fetchLoanDetails = () => {
    new Promise((resolve, reject) => {
      dispatch(
        getBookLoanDetailsWatcher(
          {
            loan_app_id: params.id,
            user: user
          },
          resolve,
          reject
        )
      );
    })
      .then(response => {
        setLoanDatas(response)
      })
      .catch(error => {
        showAlert("Error while Fetching Lead Details","error")
      });
  };

  async function docUpload(fileData, loanAppId) {
    let payload = {
      loan_app_id: loanAppId,
      user: user,
    }

    const response = await new Promise((resolve, reject) => {
      dispatch(getBookLoanDetailsWatcher(payload, resolve, reject));
    });
    const dataForUpload = {
      submitData: {
        base64pdfencodedfile: fileData["uploadFileBase64"],
        fileType: fileData["uploadFileName"],
        code: fileData["code"],
        loan_app_id: loanAppId,
        borrower_id: response['borrower_id'],
        partner_loan_app_id: response['partner_loan_app_id'],
        partner_borrower_id: response['partner_borrower_id'],
      },
      userData: {
        company_id: response['company_id'],
        product_id: response['product_id'],
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
        (params.id != null) && docUpload(uploadedData, params.id);
      };
      reader.readAsDataURL(file);
    }

  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
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

  const handleDocumentPopUp =(doc) => {    
    viewFile.forEach(element => {
      if(element.code == doc.code){
        setBlobUrl(element.file_url);
        setDocTitle(element.file_type);
        setDocExtCode(doc.code);
        setViewDocument(true);
      }
    });
    
  };

  return (
    <div>
    {viewDocument ? <ViewDocumentCustom 
    loan_app_id={params.id} 
    company_id={companyID} 
    product_id={productID} 
    doctype={doc_title} 
    awsurl={blobURL} 
    dispatch={dispatch} 
    setIsOpen={setViewDocument} 
    isOpen={viewDocument} 
    title={doc_title} 
    isXML={false} /> : null}
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
                  className="es_card_body-icon"
                  htmlFor="file"
                  // onClick={() => handleOnClick(icon.label, card.name, event)}
                >
                  <label htmlFor={icon.name}>
                    <img src={icon.icon} style={{height : "32px",width : "32px"}} className="es_card_body-each-icon" />
                    <p>{icon.label}</p>
                    <input
                    type="file"
                    id={icon.name}
                    style={{ display: "none" }}
                    onChange={(event) =>handleOnClick(icon.name, event)}
                  />
                  </label>
                  
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      {alert ? (
            <Alert
              severity={severity}
              message={alertMessage}
              handleClose={handleAlertClose}
            />
          ) : null}
    </div>
  </div>
  );
}
