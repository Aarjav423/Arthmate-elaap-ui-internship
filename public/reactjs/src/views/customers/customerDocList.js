import React, { useState, useEffect } from "react";
import DocumentViewPopup from "../lending/DocumentViewPopup";
import { b64ToBlob } from "../../util/helper";
import { storedList } from "../../util/localstorage";
import { AlertBox } from "../../components/AlertBox";
import { document } from "../../config/borrower";
import UploadCard from "react-sdk/dist/components/UploadCard";
import { viewCustomerDocsWatcher } from "../../actions/customer";
import { useDispatch } from "react-redux";

const CustomerDocList = (props) => {
  const { customerDocs } = props;
  const [custDocs, setCustomerDocs] = useState(customerDocs);
  const dispatch = useDispatch();
  const [fileData, setFileData] = useState("");
  const [showButton, setShowButton] = useState(true);
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [doc_key, setDocKey] = useState("");
  const [viewDocument, setViewDocument] = useState(false);
  const [viewDocumentUpload, setViewDocumentUpload] = useState(false);
  const [docExtCode, setDocExtCode] = useState("");
  const [doc_title, setDocTitle] = useState("");
  const [currentDoc, setCurrentDoc] = useState("");
  const [passwordProtectedPDF, setPasswordProtectedPDF] = useState(false);
  const [popupContent, setPopupContent] = useState(false);
  const [blobURL, setBlobUrl] = useState("");
  const user = storedList("user");
  const URLdata = window.location.href;
  const [payload, setPayload] = useState({
    customer_id: URLdata.split("/").slice(-1)[0],
    user_id: user._id
  });
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");





  const handleDocumentPopUp = (pdf, fileType, field, doc, isDrawDown = false) => {

    try {
      let contentType = "application/pdf";

      if (document["xmlJsonType"]["get"].includes(field)) {
        contentType = "text/*";
        pdf = pdf.replace(/^data:(.*,)?/, "");
      }

      if (pdf.indexOf(`data:${contentType};base64,`) >= 0) {
        pdf = pdf.replace(`data:${contentType};base64,`, "");
      }

      const blob = b64ToBlob(pdf, contentType);
      const blobUrl = URL.createObjectURL(blob);
      var file_name = doc.file_type;
      file_name = file_name[0].toUpperCase() + file_name.slice(1);
      file_name = file_name.replace(/_/g, " ");
      setBlobUrl(blobUrl);
      setDocKey("");
      setDocTitle(file_name);
      setCurrentDoc(doc);
      setDocExtCode(doc.code);
      setViewDocument(true);
    } catch (error) {
      setAlert(true);
      setSeverity("error");
      setAlertMessage("Error while viewing Document");
      setTimeout(() => {
        handleAlertClose();
      }, 4000);

    }
  };

  const handleModalClose = () => {
    setViewDocument(false);
  }

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleViewDoc = (awsurl, doctype, field, code, doc, isDrawDown = false) => {
    const user = storedList("user");
    let data = {
      awsurl,
      user_id: user._id
    };
    dispatch(viewCustomerDocsWatcher(
      data,
      async (result) => {
        if (code === "130") {
          try {
            const buffer = Buffer.from(result.buffer);
            const blob = await new Blob([buffer], {
              type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
            });
            const url = window.URL.createObjectURL(blob);
            this.setState({ fileUrl: url }, () => {
              const node = this.dowloadFileLinkRef.current;
              node.download = result["originalname"];
              node.click();
            });

          } catch (error) { }
        } else {
          handleDocumentPopUp(result, doctype, field, doc);
        }
      },
      (error) => {

        setAlert(true);
        setSeverity("error");
        setAlertMessage("Unable to View Document");
        setTimeout(() => {
          handleAlertClose();
        }, 4000);


      }
    ))



  };


  return (<>
    {alert ? <AlertBox severity={severity}
      msg={alertMessage}
      onClose={handleAlertClose} /> : null}
    <div >
      <div>
        {viewDocument ? (
          <DocumentViewPopup
            title={doc_title}
            handleClose={handleModalClose}
            blobUrl={blobURL}
            openDialog={viewDocument}
            doc_key={doc_key}
            doc={currentDoc}
          />
        ) : null}
      </div>

      <div >


        <div style={{
          display: "grid",
          gridColumnGap: 0,
          marginTop: "30px",
          gridTemplateColumns: "25% 25% 25% 25%",
          marginLeft: "1.5%"
        }}>
          {custDocs &&
            custDocs.map((doc, id) => {
              return (
                <UploadCard
                  key={id}
                  hasDocument={doc.file_url ? true : false}
                  heading={(doc.file_type[0].toUpperCase() + doc.file_type.slice(1)).replace(/_/g, " ")}
                  viewOnClick={() =>
                    handleViewDoc(
                      doc.file_url,
                      doc.file_type,
                      doc.file_type,
                      doc.code,
                      doc
                    )
                  }
                  uploadRevoke={true}
                // }
                />
              );
            })}
        </div>


      </div>

    </div>
  </>

  )

}

export default CustomerDocList;