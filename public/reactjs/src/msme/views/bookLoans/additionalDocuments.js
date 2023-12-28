import React, { useState, ref, useEffect } from "react";
import Button from "react-sdk/dist/components/Button/Button";
import PlusIcon from "../../../views/lending/images/add-icon.svg";
import DeleteIcon from "../../../views/lending/images/trash.svg";
import TextField from "@mui/material/TextField";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import ReveiwIcon from "../../../views/lending/images/Appication-under-review-icon.svg";
import ClockIcon from "../../../views/lending/images/clock-icon.svg";
import "./bookLoans.style.css";
import { AdditionalDocumentData } from "./AdditionalDocumentData";
import {
  patchMsmeDetailsWatcher,
  putMsmeDraftSaverWatcher,
  patchMsmeDocDeleteWatcher,
} from "../../actions/msme.action";
import { storedList } from "../../../util/localstorage";
import { useDispatch, useSelector } from "react-redux";
import { getBookLoanDetailsWatcher , getMsmeLoanDocumentsWatcher } from "../../../msme/actions/bookLoan.action";
import Alert from "react-sdk/dist/components/Alert/Alert";
import FileUploadComponent from "msme/components/uploadFileInput/UploadFileInput";
import { uploadLoanDocumentsWatcher } from "../../../../src/actions/loanDocuments";
import { getLeadSectionStatusWatcher } from "./../../actions/status.action";
import ViewDocumentCustom from "../../components/document/ViewDocumentCustom"
import { SectionData } from "msme/config/sectionData";
import getSectionStatus from "./GetLeadSectionStatus/GetLeadSectionStatus";
import { documentCode as documentCodeList } from "msme/config/docCode";
import { convertImagesToPdf} from "../../../util/helper";
import { useHistory } from "react-router-dom";
import { LeadStatus,LeadNewStatus,LeadMapping } from "../../config/LeadStatus";
import { getLeadStatusWatcher } from '../../actions/lead.action';
import Preloader from '../../../components/custom/preLoader';

const AdditionalDocuments = (props) => {
  const {
    setNavState,
    setNavIconPrefixState,
    MSMECompanyId,
    MSMEProductId,
    loanAppId,
    navIconPrefixState,
    additionalDocument,
    loanDetailsSubsectionStatus
  } = props;
  const initialItemStates = {};


  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectFile, setSelectFile] = useState("");
  const [uploadFile, setUploadFIle] = useState(false);
  const [options, setOptions] = useState(AdditionalDocumentData);
  const [selectedDocumentList, setSelectedDocumentList] = useState(AdditionalDocumentData);
  const [updateDocumentList, setUpdateDocumentList] = useState([]);
  const [clickedOkayButton, setClickedOkayButton] = useState(false);
  const [selectReasonComment, setSelectReasonComment] = useState('');
  const [buttonState, setButtonState] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [comment, setComment] = useState("")
  const [documentsData, setDocumentsData] = useState([])
  const [itemStates, setItemStates] = useState(initialItemStates);
  const [documentCode, setDocumentCode] = useState();
  const [sectionStatusCheck, setSectionStatusCheck] = useState("");
  const user = { _id: storedList('user')?._id, id: storedList('user')?.id };
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.profile.loading);
  const [documentUploadList, setDocumentUploadList] = useState([]);
  const [disableButton,setDisableButton] = useState(true);
  const [addDocument ,setAddDocument] = useState([]);
  const [isOpen,setIsOpen] = useState(false);
  const [currentDocType,setCurrentDocType] = useState("");
  const [currentDocUrl,setCurrentDocUrl] = useState("");
  const [fileTitle,setFileTitle] = useState("");
  const [onlyView ,setOnlyView] = useState(false);
  const [addDocCompany , setAddDocCompany] = useState("");
  const [addDocProduct  ,setAddDocProduct] = useState("");
  const [disableDraftButton , setDisableDraftButton] = useState(false);
  const [isDisabled , setIsDisabled] = useState(false)
  const [disableSubmit,setDisableSubmit] = useState(false);
  const sectionName = "additional-documents";
  const fileInputRefs = {};
  const navigate = useHistory()

  useEffect(() => {
    if(loanAppId && MSMECompanyId && MSMEProductId )
    fetchLeadStatus();
  }, []);

  const handleClose = () => {
    setOpenDialog(false);
  };
  const handleOkay = () => {
    setOpenDialog(false);
    setClickedOkayButton(true);
    setNavState("Offer");
    setNavIconPrefixState((prevState) => ({
      ...prevState,
      "Additional Docs": "success"
    }));
  };


  const handleDelete = async (id,row) => {
    const payload = {
      loanAppId: loanAppId,
      code:[row.code],
      tokenData: {
        user_id: user._id,
        product_id: MSMEProductId,
        company_id: MSMECompanyId,
      },
    };
    new Promise((resolve, reject) => {
      dispatch(patchMsmeDocDeleteWatcher(payload, resolve, reject));
    })
      .then((response) => {
        if(row.code){
          const deletedRow = AdditionalDocumentData.filter(item => item.documentCode === row.code);
          setOptions(previousOptions=>[...deletedRow, ...previousOptions])
        }
        let updatedRow = [];
        updatedRow = rows.reduce((accumulator, row)=>{
          if(row.id!== id){
            accumulator.push({
              ...row,
              id: accumulator.length+1,
            })
          }
          return accumulator;
        }, updatedRow)
        setRows(updatedRow);
        setDisableButton(false);
        showAlert(response?.message || "Document deleted successfully", "success");
      })
      .catch((error) => {
        console.error("An error occurred:", error);
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const handleAddDocument = () => {
    const newRow = {
      id: rows.length + 1,
      document: "New Document",
      action: "Upload"
    };
    setRows((prevRows) => [...prevRows, newRow]);
    setDisableButton(true);
  };
  const handleAdditionalDocumentDraft = () => {
    setDisableDraftButton(true);
    let data = {
      section: "additional-documents",
      addi_docs_comment: selectReasonComment,
    };
    let bodyObject = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) => value !== null && value !== " " && value !== ""
      )
    );
    const payload = {
      loan_app_id: loanAppId,
      tokenData: {
        user_id: user._id,
        product_id: MSMEProductId,
        company_id: MSMECompanyId,
        loan_app_id: loanAppId
      },
      bodyData: bodyObject
    };
    new Promise((resolve, reject) => {
      dispatch(putMsmeDraftSaverWatcher(payload, resolve, reject));
    })
      .then(response => {
        setDisableDraftButton(false);
        showAlert("Draft saved successfully", "success");
      })
      .catch(error => {
        showAlert(error?.message ?? "Error while saving draft", "error");
      });
  };
  async function docUpload(fileData, loanAppId, sectionName) {
    let payload = {
      loan_app_id: loanAppId,
      section: sectionName,
      user: user,
      companyId: MSMECompanyId,
      productId: MSMEProductId,
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
    try {
      await dispatch(
        uploadLoanDocumentsWatcher(
          dataForUpload,
          (response) => {
            setUploadFIle(true);
            setDisableButton(false);
            showAlert(response?.uploadDocumentData?.message, "success");
            setDocumentUploadList((prevState) => [
              ...prevState,
              {
                "doc_name": selectFile,
                "doc_code": fileData["code"],
              },
            ]);
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



  const handleFileInputChange = (event, id, isXML = false,) => {
    const newAction = "Change";
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, action: newAction };
      }
      return row;
    });
    setRows(updatedRows);

    const file = event.target.files[0];
    setItemStates((prevState) => ({
      ...prevState,
      [id]: {
        reuploadFile: false,
        uploadFileName: "",
        uploadFileBase64: "",
        buttonState: "loader",
      },
    }));

    if (file) {
      const selectedFile = event?.target?.files;
      if (selectedFile[0]["size"] > 5e6) {
        showAlert("File size should not be greater than 5 MB", "error");
        setItemStates((prevState) => ({
          ...prevState,
          [id]: {
            reuploadFile: false,
            uploadFileName: "",
            uploadFileBase64: "",
            buttonState: "button",
          },
        }));
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
        setItemStates((prevState) => ({
          ...prevState,
          [id]: {
            reuploadFile: false,
            uploadFileName: "",
            uploadFileBase64: "",
            buttonState: "button",
          },
        }));
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
        setItemStates((prevState) => ({
          ...prevState,
          [id]: {
            reuploadFile: true,
            uploadFileName,
            uploadFileBase64: base64Data,
            buttonState: "button",
          },
        }));

        const uploadedData = {
          id,
          uploadFileName,
          uploadFileBase64: base64Data,
          code: documentCode,
        };
        (loanAppId != null && documentCode != null && sectionName) && docUpload(uploadedData, loanAppId, sectionName);
      };
      reader.readAsDataURL(file);
    }

  };

  const customSaveButton = {
    fontSize: "16px",
    color: "#134CDE",
    border: "1px solid #134CDE",
    width: "max-content",
    padding: "10px 24px",
    borderRadius: "40px"
  };

  const customSubmitButton = {
    display: "inline - flex",
    height: "48px",
    width:"max-content",
    padding: "10px 24px",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    color: "#FFF",
    fontFamily: "Montserrat-Regular",
    fontSize: "16px",
    fontWeight: "600",
    lineHeight: "150%",
    flexShrink: "0",
    borderRadius: "40px",
    background: disableSubmit ? '#CCCDD3' : 'linear-gradient(180deg, #134CDE 0%, #163FB7 100%)'
  };
  const customOkayButton = {
    height: "48px",
    padding: "10px 24px",
    width:"max-content",
    gap: "16px",
    color: "#FFF",
    fontFamily: "Montserrat-Regular",
    fontSize: "16px",
    borderRadius: "40px",
    background: "linear-gradient(180deg, #134CDE 0%, #163FB7 100%)"
  };

  const shouldDisplayHeaders = rows.length >= 1;

  const handleDropdownChange = (event, row) => {
    row.code = event.documentCode;
    setDocumentCode(event.documentCode);
    setSelectFile(event.value);
    const updatedOptions = options.filter(
      (option) => option.value == event.value
    );
    setUpdateDocumentList([...updateDocumentList, ...updatedOptions]);

  };

  const triggerFileInput = (itemId , docCode) => {
    docCode ? setDocumentCode(docCode) : null;
    fileInputRefs[itemId].click();
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

  const handleFinalSubmit = () => {
    setSectionStatusCheck("inProgress");
    const postData = {
      user_id: user._id,
      section: sectionName,
      loan_app_id: loanAppId,
      msme_company_id: MSMECompanyId,
      msme_product_id: MSMEProductId,
      status: "in_progress",
      addi_docs_comment: selectReasonComment,
      section_sequence_no: SectionData.additional_docs.section_sequence_no,
      section_name: SectionData.additional_docs.section_name,
      sub_section_code:
        SectionData.additional_docs.additional_doc_section_submit.sub_section_code,
      sub_section_name:
        SectionData.additional_docs.additional_doc_section_submit.sub_section_name,
      sub_section_sequence_no:
        SectionData.additional_docs.additional_doc_section_submit.sub_section_sequence_no,
      section_code: SectionData.additional_docs.section_code
    };
    new Promise((resolve, reject) => {
      dispatch(patchMsmeDetailsWatcher(postData, resolve, reject));
    })
      .then((response) => {
        if(props.leadStatus == LeadStatus.draft.value){
          showAlert("Lead created successfully", "success");
        }
        setSectionStatusCheck("completed");
        setOpenDialog(true);
        if(props.leadStatus == LeadStatus.follow_up_doc.value){
          navigate.push(`/admin/msme/lead/${loanAppId}/view`)

        }
        setIsDisabled(true);
      })
      .catch((error) => {
        console.log(error, error?.message);
        showAlert(error?.message ?? "Error while creating lead", "error");
      });
  };

  const fetchLoanDetails = () => {
    let payload = {
      loan_app_id: loanAppId,
      section: "additional-documents",
      user: user,
      companyId: MSMECompanyId,
      productId: MSMEProductId,
    }
    new Promise((resolve, reject) => {
      dispatch(getBookLoanDetailsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setComment(response?.additional_documents?.addi_docs_comment)
        setSelectReasonComment(response?.additional_documents?.addi_docs_comment)
      })
      .catch((error) => {
        console.log(error, error?.message);
      });
  };
  useEffect(() => {
    if(loanAppId && MSMEProductId && MSMECompanyId){
    const payloadForDoc = {
      loanAppID: loanAppId,
      companyId: MSMECompanyId ?? "",
      productId: MSMEProductId ?? "",
      user: user,
    };
   let FetchedLoanDocuments;
    new Promise((resolve, reject) => {
      dispatch(getMsmeLoanDocumentsWatcher(payloadForDoc, resolve, reject));
    })
      .then((response) => {
        FetchedLoanDocuments = response;
        let payload = {
          loanAppID :loanAppId,
          user: user,
          company_id :MSMECompanyId ?? "",
          product_id :MSMEProductId ?? ""
        }
        new Promise((resolve, reject) => {
          dispatch(getLeadSectionStatusWatcher( payload, resolve, reject));
        })
          .then((response) => {
            const object= response?.find(obj=>obj["section_code"]=="additional_doc");
            /*
            if(object && object?.section_status === "approved"){
              setIsDisabled(true)
            }
            */
            if(object && (object?.section_status !== "in_progress" && props.leadStatus != 'pending')){
              let newArr = [];
              FetchedLoanDocuments.map((item) => {
                if ((parseInt(item?.code) >= documentCodeList.affidavit && parseInt(item?.code) <= documentCodeList.loan_statement) || (item?.code == documentCodeList.commercial_bureau_report) || (item?.code == documentCodeList.entity_udhyam_certificate) || (item?.code == documentCodeList.entity_board_resolution)) {
                  newArr.push({ ...item, id: item._id });
                  setOnlyView(true);
                }
              })
              setAddDocument(newArr);
            }else{
              let arr =[];
              FetchedLoanDocuments.map((item) => {
                if (parseInt(item?.code) >= documentCodeList.affidavit && parseInt(item?.code) <= documentCodeList.loan_statement) {
                  arr.push({ ...item, id: item._id });
                }
              })
              setRows(arr);
              if(arr.length > 0){
                setDisableButton(false);
              }
              let newOption = [];
              options.map((object) => {
                arr.map(item => {
                  item.code === object.documentCode ?  newOption.push(object): null ;
                })
              })
              const modifiedOption = AdditionalDocumentData.filter(item => !newOption.includes(item));
              setOptions(modifiedOption);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        showAlert(error.response?.data?.message, "error");
      });
    fetchLoanDetails();
   }
  }, [])

  useEffect(() => {
    setOptions((prevOptions) => prevOptions.filter(option => !documentUploadList.some(upload => upload.doc_code === option.documentCode)))
  }, [documentCode, documentUploadList]);

  const fetchLeadStatus = () => {
    const payload = {
      loan_app_id: loanAppId,
      companyId: MSMECompanyId,
      productId: MSMEProductId,
      user: user,
    };
    new Promise((resolve, reject) => {
      dispatch(getLeadStatusWatcher(payload, resolve, reject));
    })
      .then((response) => {
        const filteredArray = response.filter(obj => obj.section_code !== LeadMapping[600]);
        const allApproved = filteredArray.every(obj => obj.section_status === LeadNewStatus.Approved||obj.section_status === LeadNewStatus.Deviation);
        setDisableSubmit(!allApproved)
      })
      .catch((error) => {
          showAlert(error?.response?.data?.message, 'error');
      });
  };

  return (
    <>
      {openDialog && (
        <FormPopup
          open={openDialog}
          isOpen={openDialog}
          onClose={handleClose}
          customHeaderStyle={{ padding: "0px 16px 0px 16px" }}
          isCancel={true}
        >
          <div>
            <div style={{}}>
              <div style={{ textAlign: "center" }}>
                <img src={ReveiwIcon} alt="search gif" />
                <div
                  style={{
                    fontFamily: "Montserrat-Bold",
                    fontSize: "24px",
                    color: "#161719",
                    marginTop: "35px"
                  }}
                >
                  Your application is under review
                </div>
                <div
                  style={{
                    fontFamily: "Montserrat-Medium",
                    fontSize: "18px",
                    color: "#767888",
                    marginTop: "5px"
                  }}
                >
                  {" "}
                  We will notify you once your offer gets <br /> generated.
                </div>
              </div>
            </div>
            <div
              style={{
                marginTop: "30px",
                display: "flex",
                justifyContent: "center"
              }}
            >
              {" "}
              <Button
                customStyle={customOkayButton}
                label="Okay"
                buttonType="primary"
                onClick={handleOkay}
              />{" "}
            </div>
          </div>
        </FormPopup>
      )}
      {clickedOkayButton ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "17%"
          }}
        >
          {/* <div style={{ textAlign: "center" }}>
            <div><img src={ClockIcon} alt="clock icon" /></div>
            <div style={{ fontFamily: "Montserrat-SemiBold", fontSize: "18px", color: "#008042", marginTop: "35px", fontWeight: 600 }}>Application submitted successfully</div>
            <div style={{ fontFamily: "Montserrat-Medium", fontSize: "16px", color: "#161719", marginTop: "15px" }}>
              We&rsquo;re currently reviewing your application. Please check back <br /> later for the status update. Thank you!
            </div>
          </div> */}
        </div>
      ) : (
        <div style={{ marginLeft: "20px" }}>
          <h2 style={{ fontFamily: "Montserrat-Bold", fontSize: "24px" }}>
            Upload Additional Documents
          </h2>
          {!onlyView &&
            <div style={{ fontFamily: "Montserrat-Medium", fontSize: "16px" }}>
              Upload any other supporting document.
            </div>}
          {(!onlyView && rows.length == 0 && navIconPrefixState["Additional Docs"] !== "success")?  (
            <div style={{ marginTop: "25px" }}>
              <Button
                customStyle={{
                  height: "48px",
                  fontSize: "16px",
                  display: "flex",
                  justifyContent: "center",
                  boxShadow: "none",
                  backgroundColor: "white",
                  fontFamily: "Montserrat-Regular",
                  padding: "22px",
                  border: "1px solid #134CDE",
                  color: "rgba(19, 76, 222, 1)"
                }}
                label="Add Document"
                buttonType="secondary"
                imageButton={PlusIcon}
                imageButtonHover={PlusIcon}
                iconButton="btn-secondary-download-button"
                onClick={handleAddDocument}
              />
            </div>
          ): null}

          {onlyView && (
            <div
              style={{
                width: "98%",
                display: "flex",
                flexDirection: "column",
                color: "black",
                fontSize: "16px",
                marginTop: "25px",
                borderRadius: "10px",
                // padding: "10px" ,
                border: "1px solid #E5E5E8"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  height: "75px",
                  alignItems: "center",
                  backgroundColor: "#E5E5E8",
                  padding: "30px",
                  borderTopRightRadius: "10px",
                  borderTopLeftRadius: "10px",
                  fontFamily: "Montserrat-SemiBold"
                }}
              >
                <div style={{ width: "78%" }}>DOCUMENT</div>
                <div style={{ width: "20%" }}>ACTION</div>
              </div>

              {addDocument.map((row) => (
                <div
                  key={row._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    height: "80px",
                    backgroundColor: "white",
                    color: "black",
                    fontSize: "16px",
                    marginTop: "10px",
                    // borderRadius: "10px",
                    padding: "30px",
                    alignItems: "center",
                    borderBottom: "1px solid #ccc"
                  }}
                >
                  <div
                    style={{
                      width: "78%",
                      display: "flex",
                      height: "25px",
                      alignItems: "center"
                    }}
                  >
                    <span style={{ marginLeft: "0px" }}>
                      <InputBox
                        label="Select Document"
                        isDrawdown={true}
                        isBoxType={"icon"}
                        isDisabled={true}
                        initialValue={AdditionalDocumentData.find(doc => doc.documentCode === row.code)?.label || ""}
                        customClass={{
                          height: "58px",
                          maxWidth: "45vw",
                          width: "45vw",
                          border:"2px solid green"
                        }}
                        id={row?._id}
                        customDropdownClass={{ marginTop: "7px", zIndex: 5 }}
                      />
                    </span>
                  </div>
                  <div
                    onClick={() => {
                      if(onlyView){
                        setCurrentDocType(row?.file_type);
                        setCurrentDocUrl(row?.file_url);
                        setFileTitle(row?.file_type);
                        setIsOpen(true);
                      }
                      else {
                        triggerFileInput(row.id);
                      }
                    }}
                    style={{
                      width: "20%",
                      color: "rgba(19, 76, 222, 1)",
                      cursor: "pointer",
                      fontFamily: "Montserrat-SemiBold",
                      fontSize: "16px"
                    }}
                  >
                    {onlyView ? "View" : "Change"}
                  </div>
                  <input
                    type="file"
                    ref={(ref) => (fileInputRefs[row.id] = ref)}
                    id={row._id}
                    style={{ display: "none" }}
                    onChange={(event) => handleFileInputChange(event, row._id)}
                  />
                </div>
              ))}
              <div style={{ marginTop: "25px" }}>
                <Button
                  customStyle={{
                    height: "48px",
                    fontSize: "16px",
                    display: "flex",
                    justifyContent: "center",
                    boxShadow: "none",
                    backgroundColor: "white",
                    border: "none",
                    fontFamily: "Montserrat-SemiBold",
                    marginBottom: "15px",
                    padding: "25px",
                    marginLeft: "10px",
                    color: "#134CDE"
                  }}
                  label="Add Document"
                  buttonType="secondary"
                  imageButton={PlusIcon}
                  imageButtonHover={PlusIcon}
                  iconButton="btn-secondary-download-button"
                  // onClick={handleAddDocument}
                  isDisabled = {disableButton}
                />
              </div>
            </div>
          )}

          {shouldDisplayHeaders && (
            <div
              style={{
                width: "98%",
                display: "flex",
                flexDirection: "column",
                color: "black",
                fontSize: "16px",
                marginTop: "25px",
                borderRadius: "10px",
                // padding: "10px" ,
                border: "1px solid #E5E5E8"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  height: "75px",
                  alignItems: "center",
                  backgroundColor: "#E5E5E8",
                  padding: "30px",
                  borderTopRightRadius: "10px",
                  borderTopLeftRadius: "10px",
                  fontFamily: "Montserrat-SemiBold"
                }}
              >
                <div style={{ width: "78%" }}>DOCUMENT</div>
                <div style={{ width: "20%" }}>ACTION</div>
              </div>

              {rows.map((row) => (
                <div
                  key={row.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    height: "80px",
                    backgroundColor: "white",
                    color: "black",
                    fontSize: "16px",
                    marginTop: "10px",
                    // borderRadius: "10px",
                    padding: "30px",
                    alignItems: "center",
                    borderBottom: "1px solid #ccc"
                  }}
                >
                  <div
                    style={{
                      width: "78%",
                      display: "flex",
                      height: "25px",
                      alignItems: "center"
                    }}
                  >
                    <img
                      src={DeleteIcon}
                      alt="icon"
                      style={{ cursor: "pointer" }}
                      onClick={(event) => handleDelete(row.id, row)}
                    />
                    <span style={{ marginLeft: "20px" }}>
                      <InputBox
                        initialValue={AdditionalDocumentData.find(doc => doc.documentCode === row.code)?.label || ""}
                        label="Select Document"
                        isDrawdown={true}
                        isBoxType={row.action === "Change" ? "icon" : ""}
                        isDisabled={row.action === "Change"}
                        customClass={{
                          height: "58px",
                          maxWidth: "45vw",
                          width: "45vw",
                          border:
                            row.action === "Change"
                              ? "2px solid green"
                              : "1px solid grey"
                        }}
                        id={row?.id}
                        customDropdownClass={{ marginTop: "7px", zIndex: 5 }}
                        options={options}
                        onClick={(value) =>
                          handleDropdownChange(value, row)
                        }
                      // value={selectFile}
                      />
                    </span>
                  </div>
                  <div
                    onClick={() => (AdditionalDocumentData.find(doc => doc.documentCode === row.code)?.label) && triggerFileInput(row.id , row.code ?? "")}
                    style={{
                      width: "20%",
                      color: "rgba(19, 76, 222, 1)",
                      cursor: "pointer",
                      fontFamily: "Montserrat-SemiBold",
                      fontSize: "16px"
                    }}
                  >
                    {row?.action ? row?.action : "Change" }
                  </div>
                  <input
                    type="file"
                    ref={(ref) => (fileInputRefs[row.id] = ref)}
                    id={row.id}
                    style={{ display: "none" }}
                    onChange={(event) => handleFileInputChange(event, row.id)}
                  />
                </div>
              ))}
              <div style={{ marginTop: "25px" }}>
                <Button
                  customStyle={{
                    height: "48px",
                    fontSize: "16px",
                    display: "flex",
                    justifyContent: "center",
                    boxShadow: "none",
                    backgroundColor: "white",
                    border: "none",
                    fontFamily: "Montserrat-SemiBold",
                    marginBottom: "15px",
                    padding: "25px",
                    marginLeft: "10px",
                    color: "#134CDE"
                  }}
                  label="Add Document"
                  buttonType="secondary"
                  imageButton={PlusIcon}
                  imageButtonHover={PlusIcon}
                  iconButton="btn-secondary-download-button"
                  onClick={handleAddDocument}
                  isDisabled = {disableButton}
                />
              </div>
            </div>
          )}

          <div style={{ marginTop: rows?.length ? "50px" : "90px" }}>
            <h3 style={{ fontFamily: "Montserrat-SemiBold", fontSize: "20px" }}>
              Please provide any relevant information here
            </h3>
            <div style={{ marginTop: "15px" }}>
              <TextField
                sx={{
                  width: "98%",
                  color: "pink",
                  fontFamily: "Montserrat-Regular",
                  fontSize: "16px",
                  fontWeight: "400",
                  lineHeight: "150%"
                }}
                id="outlined-basic"
                label="Comment"
                disabled ={navIconPrefixState["Additional Docs"] == "success" ? true : onlyView ? true : false}
                value={selectReasonComment}
                variant="outlined"
                type="text"
                placeholder="Comment"
                multiline={true}
                minRows={4}
                size="medium"
                InputLabelProps = {{shrink : true}}
                InputProps={{ sx: { borderRadius: "8px" } }}
                onChange={(event) => setSelectReasonComment(event.target.value)}
              />
            </div>
          </div>
            {props.rawType == "view" || isDisabled || (navIconPrefixState["Additional Docs"] === "success") ? null :
            <div className="book-loan-button-container book-loan-button-alignment-double-button">
              <React.Fragment>
              <Button
                onClick={() => {
                  handleFinalSubmit();
                }}
                isLoading={sectionStatusCheck=="inProgress"?true:false}
                label={
                  uploadFile && rows?.length ? props.leadStatus !== LeadStatus.draft?"Save & Submit": "Submit & Next" : "Skip & Submit"
                }
                buttonType="linksss"
                customStyle={customSubmitButton}
                customLoaderClass={{
                  borderTop: '4px solid #fff',
                }}
                isDisabled={disableSubmit}
              />
              {props.leadStatus === LeadStatus.draft && <Button
                label="Save as Draft"
                buttonType="secondary"
                customStyle={customSaveButton}
                onClick={handleAdditionalDocumentDraft}
                isDisabled ={disableDraftButton}
              />}
              </React.Fragment>
            </div>}
          {alert ? (
            <Alert
              severity={severity}
              message={alertMessage}
              handleClose={handleAlertClose}
            />
          ) : null}
        </div>
      )}
      {isOpen ?
        <ViewDocumentCustom
          loan_app_id={loanAppId}
          company_id={MSMECompanyId}
          product_id={MSMEProductId}
          doctype={currentDocType}
          awsurl={currentDocUrl}
          dispatch={dispatch}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          title={fileTitle}
        />
        : null
      }
      {isLoading && <Preloader />}
    </>
  );
};

export default AdditionalDocuments;
