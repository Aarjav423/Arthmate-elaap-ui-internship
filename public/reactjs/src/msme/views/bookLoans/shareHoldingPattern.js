import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storedList } from "../../../util/localstorage";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Button from "react-sdk/dist/components/Button";
import "react-sdk/dist/styles/_fonts.scss";
import { validateData } from "../../../util/validation";
import { patchMsmeDetailsWatcher } from "../../actions/msme.action";
import Alert from "react-sdk/dist/components/Alert/Alert";
import Table from "react-sdk/dist/components/Table/Table";
import "./bookLoans.style.css";
import UploadFileInput from "../../components/uploadFileInput/UploadFileInput";
const user = { _id: storedList('user')?._id, id: storedList('user')?.id };
import { getLeadStatusWatcher } from "../../actions/lead.action";
import {
  getBookLoanDetailsWatcher,
  getMsmeLoanDocumentsWatcher,
} from "msme/actions/bookLoan.action";
import getSectionStatus from "./GetLeadSectionStatus/GetLeadSectionStatus";
import { SectionData } from "msme/config/sectionData";
import { SHAREHOLDING } from "./uploadKycData";

export default function ShareHoldingPattern(props) {
  const { MSMECompanyId, MSMEProductId, documents } = props;
  const dispatch = useDispatch();
  const useAsyncState = (initialState) => {
    const [state, setState] = useState(initialState);

    const asyncSetState = (value) => {
      return new Promise((resolve) => {
        setState(value);

        setState((current) => {
          resolve(current);

          return current;
        });
      });
    };

    return [state, asyncSetState];
  };
  const { setNavIconPrefixState, setNavState, loanAppId, navIconPrefixState } =
    props;
  const store = useSelector((state) => state);
  const [rowData, setRowData] = useState([]);
  let intervalId;
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [company, setCompany] = useAsyncState(null);
  const [product, setProduct] = useAsyncState(null);
  const [stateData, setStateData] = useState({});
  const [sectionStatusCheck, setSectionStatusCheck] = useState("");
  const [validationData, setValidationData] = useState({});
  const [formComplete, setFormComplete] = useState(false);
  const [fileState, setFileState] = useState("Upload");
  const fileInputRef = useRef(null);
  const [newFile, setNewFile] = useState();
  const [totalPercent, setTotalPercent] = useState(0);
  const [showButton, setShowButton] = useState(true);
  const [backgroundColorBlur, setBackgroundColorBlur] = useState(false);
  const [statusObject, setStatusObject] = useState("");
  const sectionName = "share_holding_details";

  const [uploadSelectedFile, setUploadSelectedFile] = useState({
    share_holding_certificate_value: "",
  });

  const [documentStateData, setDocumentStateData] = useState({
    share_holding_certificate_value: false,
  });
  const sectionStatus = ["deviation", "approved", "rejected", "failed"];

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
        setStatusObject(
          response.find((item) => item.section_code === "primary")
        );
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  useEffect(() => {
    if (MSMEProductId || MSMECompanyId) {
      fetchLeadStatus();
      getLoanDocuments();
    }
  }, []);

  const getLoanDocuments = () => {
    const payload = {
      loanAppID: loanAppId,
      companyId: MSMECompanyId,
      productId: MSMEProductId,
      user: user,
    };
    new Promise((resolve, reject) => {
      dispatch(getMsmeLoanDocumentsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        if (response) {
          setShareHoldingItem(
            SHAREHOLDING.map((givenObj) => {
              const matchingObj = response?.find(
                (otherObj) => otherObj.code === givenObj.documentCode
              );
              if (matchingObj) {
                return {
                  ...givenObj,
                  s3_url: matchingObj.file_url,
                  doc: matchingObj,
                };
              }
              return givenObj;
            })
          );
        }
      })
      .catch((error) => {
        showAlert(error.response?.data?.message, "error");
      });
  };

  const formateShareHoldingRowData = (response) => {
    const rowData = [];
    if (response.primary_applicant) {
      rowData.push({
        id: response.borrower_id,
        name: response.primary_applicant.middle_name
          ? `${response.primary_applicant.first_name} ${response.primary_applicant.middle_name} ${response.primary_applicant.last_name}`
          : `${response.primary_applicant.first_name} ${response.primary_applicant.last_name}`,
        value: 0,
      });
    }
    if (response.co_applicant_details.length > 0) {
      response.co_applicant_details.map((item) => {
        rowData.push({
          id: item.borrower_id,
          name: item.middle_name
            ? `${item.cb_fname} ${item.cb_mname} ${item.cb_lname}`
            : `${item.cb_fname} ${item.cb_lname}`,
          value: 0,
        });
      });
    }
    if (response.guarantor_details.length > 0) {
      response.guarantor_details.map((item) => {
        rowData.push({
          id: item.borrower_id,
          name: item.middle_name
            ? `${item.gua_fname} ${item.gua_mname} ${item.gua_lname}`
            : `${item.gua_fname} ${item.gua_lname}`,
          value: 0,
        });
      });
    }
    rowData.push({
      id: rowData.length + 1,
      name: "Total Percentage",
      value: 0,
    });
    setRowData(rowData);
  };

  const fetchLoanDetails = () => {
    new Promise((resolve, reject) => {
      dispatch(
        getBookLoanDetailsWatcher(
          {
            loan_app_id: loanAppId,
            user: user,
          },
          resolve,
          reject
        )
      );
    })
      .then((response) => {
        if (navIconPrefixState["Shareholding"]) {
          if (response.lead_status && response.lead_status === "draft")
            setShowButton(false);
          let shareHolderData = response.share_holding_details;
          let rowData = [];
          shareHolderData.forEach((item) => {
            rowData.push({
              id: item.borrower_id,
              name: item.share_holder_name,
              value: item.share_holder_perc,
            });
          });
          const totalPercentage = rowData.reduce((accumulator, item) => {
            return accumulator + Number(item.value);
          }, 0);
          rowData.push({
            id: rowData.length + 1,
            name: "Total Percentage",
            value: Number(totalPercentage),
          });
          setTotalPercent(Number(totalPercentage));
          setRowData(rowData);
        } else {
          formateShareHoldingRowData(response);
        }
      })
      .catch((error) => {
        showAlert("Something went wrong.", "error");
      });
  };

  const postShareHoldingDetails = (payload) => {
    payload.user_id = user._id;
    payload.msme_company_id = MSMECompanyId;
    payload.msme_product_id = MSMEProductId;
    payload.share_holders = payload.data.map((item) => {
      return {
        borrower_id: item.id,
        share_holder_name: item.name,
        share_holder_perc: item.value,
      };
    });
    delete payload.data;
    payload.loan_app_id = loanAppId;
    (payload.sub_section_code =
      SectionData.shareholding_pattern.share_holding_section_submit.sub_section_code),
      (payload.section_code = SectionData.shareholding_pattern.section_code),
      (payload.section_sequence_no =
        SectionData.shareholding_pattern.section_sequence_no),
      (payload.section_name = SectionData.shareholding_pattern.section_name),
      (payload.sub_section_name =
        SectionData.shareholding_pattern.share_holding_section_submit.sub_section_name),
      (payload.sub_section_sequence_no =
        SectionData.shareholding_pattern.share_holding_section_submit.sub_section_sequence_no);
    new Promise((resolve, reject) => {
      dispatch(patchMsmeDetailsWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setSectionStatusCheck("inProgress");
        setStatusCheckApi(
          loanAppId,
          SectionData.shareholding_pattern.section_code,
          SectionData.shareholding_pattern.share_holding_section_submit
            .sub_section_code,
          dispatch
        );
        showAlert(response?.message || "Success", "success");
      })
      .catch((error) => {
        showAlert(error?.response?.data?.message, "error");
      });
  };

  const [shareHoldingItem, setShareHoldingItem] = useState(
    SHAREHOLDING.map((givenObj) => {
      const matchingObj = documents?.find(
        (otherObj) => otherObj.code === givenObj.documentCode
      );

      if (matchingObj) {
        return {
          ...givenObj,
          s3_url: matchingObj.file_url,
          doc: matchingObj,
        };
      } else {
        return givenObj;
      }
    })
  );

  useEffect(() => {
    fetchLoanDetails();
  }, [navIconPrefixState["Shareholding"]]);

  const setStatusCheckApi = async (
    loanAppID,
    sectionCode,
    subSectionCode,
    dispatch
  ) => {
    intervalId = setInterval(async () => {
      try {
        const status = await getSectionStatus(
          loanAppID,
          user,
          MSMECompanyId,
          MSMEProductId,
          sectionCode,
          subSectionCode,
          dispatch
        );
        if (status == "approved") {
          if (
            subSectionCode ===
            SectionData.shareholding_pattern.share_holding_section_submit
              .sub_section_code
          ) {
            setSectionStatusCheck("completed");
            setNavState("Financial Docs");
          }
          clearInterval(intervalId);
        } else if (status == "deviation") {
          if (
            subSectionCode ===
            SectionData.shareholding_pattern.share_holding_section_submit
              .sub_section_code
          ) {
            setSectionStatusCheck("completed");
            setNavState("Financial Docs");
          }
          clearInterval(intervalId);
        } else if (status == "rejected") {
          setSectionStatusCheck("");
          clearInterval(intervalId);
        }
      } catch (error) {
        clearInterval(intervalId);
      }
    }, 4000);
  };

  const handleFileInputChange = (field, event) => {
    setFileState("Change");
    const selectedFile = event?.target?.files;
    if (selectedFile[0]["size"] > 5e6) {
      showAlert("File size should not be greater than 5 MB", "error");
      return;
    }
    const fileType = selectedFile[0]["name"];
    const fileExtension = fileType.split(".").pop();
    if (
      fileExtension.toLowerCase() != "pdf" &&
      fileExtension.toLowerCase() != "png" &&
      fileExtension.toLowerCase() != "jpg" &&
      fileExtension.toLowerCase() != "jpeg"
    ) {
      showAlert("Only JPG,JPEG,PDF & PNG file is allowed", "error");
      return;
    }
    if (selectedFile.length > 0) {
      let fileToLoad = selectedFile[0];
      let fileReader = new FileReader();
      fileReader.onload = async (fileLoadedEvent) => {
        setUploadSelectedFile((prevState) => ({
          ...prevState,
          [field]: {
            name: fileType,
            data: fileLoadedEvent.target.result,
          },
        }));
      };
      fileReader.readAsDataURL(fileToLoad);
    } else {
      setTimeout(() => {
        setFileState("button");
      }, 2000);
    }

    if (selectedFile.length > 0 && totalPercent >= 50) {
      setFormComplete(true);
    }
  };

  const inputBoxCss = {
    marginTop: "8px",
    maxHeight: "500px",
    zIndex: 1,
    padding: "0px 16px",
    width: "100%",
  };
  const headingCss = {
    color: "var(--neutrals-neutral-100, #161719)",
    fontFamily: "Montserrat-semibold",
    fontSize: "24px",
    fontWeight: 700,
    lineHeight: "150%",
    marginBottom: "20px",
    marginTop: "30px",
  };
  const subHeadingCss = {
    color: "var(--neutrals-neutral-100, #161719)",
    fontFamily: "Montserrat-semibold",
    fontSize: "20px",
    fontWeight: 600,
    lineHeight: "150%",
    marginBottom: "20px",
    marginTop: "30px",
  };
  const customSaveButton = {
    fontSize: "16px",
    color: "#134CDE",
    border: "1px solid #134CDE",
    width: "max-content",
    padding: "10px 24px",
    borderRadius: "40px",
  };

  const showAlert = (msg, type) => {
    const element = document.getElementById("TopNavBar");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  const change = (e, type, data) => {
    const value = Number(e.value);

    let field = `${type}_vl_${data.id}`;
    let isValid = validateData(
      field.substring(0, field.indexOf("_vl_")).toLowerCase(),
      value
    );
    setValidationData((prevState) => ({
      ...prevState,
      [`${field}State`]: !isValid ? "has-danger" : "",
    }));
    let newSum = 0;
    if (value >= 0) {
      let tempSum = 0;
      let itemSum = 0;
      rowData.forEach((item) => {
        if (item.name !== "Total Percentage") {
          tempSum += Number(item.value);
          if (item.id === data.id) {
            itemSum = item.value;
          }
        }
      });
      newSum = tempSum - itemSum + value;
      let tempRowData = JSON.parse(JSON.stringify(rowData));
      tempRowData.forEach((item) => {
        if (item.id === data.id) {
          item.value = value;
        }
      });
      setRowData(tempRowData);
      setTotalPercent(newSum);
      if (
        uploadSelectedFile.share_holding_certificate_value !== "" &&
        uploadSelectedFile.share_holding_certificate_value !== null &&
        Math.max(newSum, totalPercent) >= 50
      ) {
        setFormComplete(true);
      } else {
        setFormComplete(false);
      }
    }
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleSubmit = (event) => {
    const postData = {};
    let sectionDataArr = [];

    let formValidated = true;

    if (totalPercent > 100 || totalPercent < 50) {
      showAlert("Invalid Total Percentage", "error");
      return;
    }

    if (uploadSelectedFile.share_holding_certificate_value == "") {
      showAlert("Invalid Total Percentage", "error");
      return;
    }
    rowData.forEach((item) => {
      if (item.name !== "Total Percentage") {
        if (Number(item.value) < 100 && Number(item.value) >= 0) {
          sectionDataArr.push({
            id: item.id,
            name: item.name,
            value: item.value,
          });
        } else {
          formValidated = false;
        }
      }
    });
    if (Object.keys(validationData).includes("has-danger")) {
      formValidated = false;
    }
    postData["section"] = "share-holding-details";
    postData.data = sectionDataArr;
    if (uploadSelectedFile.share_holding_certificate_value !== "") {
      postData.document = uploadSelectedFile.share_holding_certificate_value;
    } else {
      formValidated = false;
    }
    if (formValidated) {
      setNavIconPrefixState((prevState) => ({
        ...prevState,
        Shareholding: "success",
      }));
      postShareHoldingDetails(postData);
    } else {
      showAlert("Invalid Data", "error");
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
    }
  };

  const handleInputBoxClick = (event, field) => {
    setNewFile("share_holding_certificate_value");
    if (totalPercent >= 50) {
      setFormComplete(true);
    }
    setUploadSelectedFile({ share_holding_certificate_value: "hii" });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "98%",
        marginLeft: "1.7%",
        justifyContent: "space-around",
      }}
    >
      <h4
        style={{
          color: "var(--neutrals-neutral-100, #161719)",
          fontFamily: "Montserrat-semibold",
          fontSize: "24px",
          fontWeight: 700,
          lineHeight: "150%",
        }}
      >
        Shareholding Pattern
      </h4>
      <div>
        <div style={{ maxWidth: "100%", marginTop: "20px" }}>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#E5E5E8",
              color: "black",
              fontSize: "16px",
              borderRadius: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                height: "64px",
                alignItems: "center",
              }}
            >
              <div style={{ width: "50%" }}>
                <span
                  style={{
                    color: "var(--neutrals-neutral-100, #161719)",
                    fontFamily: "Montserrat-SemiBold",
                    marginLeft: "24px",
                  }}
                >
                  NAME
                </span>
              </div>
              <div style={{ width: "50%" }}>
                <span
                  style={{
                    color: "var(--neutrals-neutral-100, #161719)",
                    fontFamily: "Montserrat-SemiBold",
                  }}
                >
                  SHAREHOLDING PERCENTAGE
                </span>
              </div>
            </div>

            {rowData.map((row) => (
              <div
                key={row.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  height: "75px",
                  backgroundColor: "white",
                  color: "black",
                  fontSize: "16px",
                  alignItems: "center",
                  width: "100%",
                  borderBottom: "1px solid var(--neutrals-neutral-10, #E5E5E8)",
                  borderLeft: "1px solid var(--neutrals-neutral-10, #E5E5E8)",
                  borderRight: "1px solid var(--neutrals-neutral-10, #E5E5E8)",
                  borderBottomLeftRadius:
                    row.name === "Total Percentage" ? "15px" : "0px",
                  borderBottomRightRadius:
                    row.name === "Total Percentage" ? "15px" : "0px",
                }}
              >
                <div
                  style={{
                    width: "50%",
                    display: "flex",
                  }}
                >
                  <span style={{ marginLeft: "24px" }}>{row.name}</span>
                </div>
                <div
                  style={{
                    width: "50%",
                    display: "flex",
                    height: "25px",
                    alignItems: "center",
                    marginRight: "24px",
                    marginLeft: "20px",
                  }}
                >
                  {row.name === "Total Percentage" ? (
                    <>
                      <span
                        style={{
                          color:
                            totalPercent > 100
                              ? "red"
                              : "var(--neutrals-neutral-100, #161719)",
                          fontFamily: "Montserrat-Regular",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: "500",
                          lineHeight: "150%",
                        }}
                      >
                        {totalPercent}%
                      </span>
                    </>
                  ) : (
                    <>
                      <InputBox
                        id={`${row.id}_box`}
                        label={"Enter Value"}
                        type={"number"}
                        isDrawdown={false}
                        initialValue={
                          navIconPrefixState["Shareholding"] === "success"
                            ? row.value
                            : null
                        }
                        isDisabled={
                          navIconPrefixState["Shareholding"] ? true : false
                        }
                        onClick={(event) => change(event, "number", row)}
                        customClass={{
                          height: "56px",
                          width: "100%",
                          maxWidth: "100%",
                        }}
                        customInputClass={{
                          minWidth: "100%",
                          backgroundColor: "#fff",
                        }}
                        error={(() => {
                          return validationData[`number_vl_${row.id}State`] ===
                            "has-danger"
                            ? true
                            : false;
                        })()}
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <h5
        style={{
          color: "var(--neutrals-neutral-100, #161719)",
          fontFamily: "Montserrat-semibold",
          fontSize: "20px",
          marginBottom: "16px",
          marginTop: "40px",
        }}
      >
        Upload Shareholding Pattern Certificate
      </h5>
      <div
        style={{ display: "flex", maxWidth: "20rem", flexDirection: "column" }}
      >
        {/* <InputBox
          isBoxType="button"
          Buttonlabel={fileState}
          id={'certificate'}
          label={'Shareholding Certificate'}
          isDrawdown={false}
          initialValue={uploadSelectedFile['share_holding_certificate_value']['name'] ?? ''}
          onClick={(event) => {
            handleInputBoxClick(event, 'share_holding_certificate_value');
          }}
          isDisabled={navIconPrefixState['Shareholding'] ? true : false}
          customClass={{ height: '56px', width: '100%', maxWidth: '100%' }}
          customInputClass={{
            maxWidth: '82%',
            backgroundColor: '#fff',
            pointerEvents: 'none',
          }}
        /> */}
        <div>
          <UploadFileInput
            onDataCallback={handleInputBoxClick}
            backgroundColorChange={true}
            backgroundColorBlur={
              props.type && (props.type == "view" || props.type === "edit")
                ? false
                : backgroundColorBlur
            }
            items={shareHoldingItem}
            title=""
            showAlert={showAlert}
            isXML={false}
            setDocumentStateData={setDocumentStateData}
            loanAppId={loanAppId}
            sectionName={sectionName}
            data={{ company_id: MSMECompanyId, product_id: MSMEProductId }}
            MSMECompanyId={MSMECompanyId}
            MSMEProductId={MSMEProductId}
            isChange={
              sectionStatus.includes(statusObject?.section_status)
                ? false
                : true
            }
          />
        </div>
      </div>
      {showButton && (
        <div className="book-loan-button-containe book-loan-button-alignment-double-button">
          <Button
            label="Verify & Next"
            onClick={handleSubmit}
            isDisabled={!formComplete}
            buttonType="primarys"
            isLoading={sectionStatusCheck == "inProgress" ? true : false}
            customStyle={{
              display: "inline - flex",
              height: "48px",
              width: "max-content",
              padding: "10px 24px",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px",
              color: "#FFF",
              fontFamily: "Montserrat-Regular",
              fontSize: "16px",
              fontWeight: "800",
              lineHeight: "150%",
              flexShrink: "0",
              borderRadius: "40px",
              background: formComplete
                ? "var(--primary-blue-button-gradient, linear-gradient(180deg, #134CDE 0%, #163FB7 100%, #163FB7 100%))"
                : "var(--neutrals-neutral-30, #CCCDD3)",
            }}
            customLoaderClass={{
              borderTop: "4px solid #fff",
            }}
          ></Button>
          <Button
            id="saveDraft"
            label="Save as Draft"
            buttonType="secondary"
            customStyle={customSaveButton}
          />
        </div>
      )}
      {alert ? (
        <Alert
          severity={severity}
          message={alertMessage}
          handleClose={handleAlertClose}
        />
      ) : null}
    </div>
  );
}
