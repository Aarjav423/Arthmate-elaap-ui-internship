import { storedList } from "util/localstorage";
import ReactBSAlert from "react-bootstrap-sweetalert";
import CloseIcon from "@mui/icons-material/Close";
import { b64ToBlob } from "util/helper";
import { viewDocsWatcher } from "actions/loanDocuments";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

export default function ViewDocumentCustom({ awsurl, doctype, company_id, product_id, loan_app_id, dispatch, isOpen, setIsOpen, title,isXML = false,isExcel,showAlert }) {
  const user = storedList("user");
  const [popupContent, setPopupContent] = useState("");
  const [blobUrl, setBlobUrl] = useState("");

  const handleDocumentPopUp = (pdf, fileType, setPopupContent) => {
    if (pdf.indexOf("data:application/pdf;base64,") >= 0) {
      pdf = pdf.replace("data:application/pdf;base64,", "");
    }
    let contentType = "application/pdf";
    if(isXML){
      contentType = "application/json";
    }
    const blob = b64ToBlob(pdf, contentType);
    setBlobUrl(URL.createObjectURL(blob));
    setIsOpen(true)
  };

  useEffect(() => {
    if (isOpen) {
      handleViewDoc()
    }
  }, [isOpen]);

  useEffect(() => {
    if (isExcel) {
      handleDownloadExcel()
    }
  }, [isExcel]);

  const handleDownloadExcel = async () => {
    let data = {
      company_id: company_id,
      product_id: product_id,
      loan_app_id: loan_app_id,
      awsurl: awsurl,
      user_id: user._id 
    };
    new Promise((resolve, reject) => {
      dispatch(viewDocsWatcher(data, resolve, reject));
    })
      .then((response) => {
        const buffer = Buffer.from(response.buffer.data, 'utf-8');
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `${title}.xlsx`);
        setIsOpen(false)
        showAlert("File Downloaded Successfully", "success");
      })
      .catch((error) => {
        showAlert("Error While Downloading File", "error");
      });
    }
  

  const handleViewDoc = () => {
    let data = {
      company_id: company_id,
      product_id: product_id,
      loan_app_id: loan_app_id,
      awsurl: awsurl,
      user_id: user._id 
    };
    new Promise((resolve, reject) => {
      dispatch(viewDocsWatcher(data, resolve, reject));
    })
      .then((response) => {
        handleDocumentPopUp(response, doctype, setPopupContent);
        // showAlert(response?.message || "Something went wrong", "success");
      })
      .catch((error) => {
        // showAlert(error?.response?.data?.message, "error");
      });
  }

  return (isOpen&&!isExcel)  && <ReactBSAlert
    style={{
      display: "block",
      marginTop: "-350px",
      width: "900px",
      padding: "15px 4px 3px 3px",
      position: "relative"
    }}
    title={title}
    confirmBtnBsStyle="success"
    btnSize="md"
    showConfirm={false}
  >
    <div>
      <button
        type="button"
        className="close"
        style={{
          position: "absolute",
          top: "21px",
          right: "20px",
          zIndex: "999"
        }}
        onClick={() => setIsOpen(false)}
      >
        <CloseIcon />
      </button>
      <iframe
        src={blobUrl}
        // type="application/pdf"
        width="100%"
        height="450px"
      />
    </div>
  </ReactBSAlert>
}