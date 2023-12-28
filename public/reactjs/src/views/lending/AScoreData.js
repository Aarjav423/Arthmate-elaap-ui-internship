import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { aScoreFields } from "./aScoreJson";
import EditableAccordian from "react-sdk/dist/components/EditableAccordian"
import Typography from "@mui/material/Typography";
import { getLeadDetailsByIdWatcher } from "../../actions/loanRequest";
import { AlertBox } from "../../components/AlertBox";
import { storedList } from "../../util/localstorage";
import { checkAccessTags } from "../../util/uam";
import { validateData } from "../../util/validation";
import Preloader from "../../components/custom/preLoader";
import {
  getAScoreDataWatcher,
  updateAScoreDataWatcher
} from "../../actions/aScoreData";
import ConfirmationPopup from "react-sdk/dist/components/Popup/ConfirmationPopup";
import { getProductByIdWatcher } from "../../actions/product";
import Buttons from "react-sdk/dist/components/Button"

export const AScore = () => {
  const { loan_app_id, company_id, product_id } = useParams();
  const dispatch = useDispatch();
  const user = storedList("user");
  const isLoading = useSelector(state => state.profile.loading);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [errors, setErrors] = useState([]);
  const [payloadData, setPayloadData] = useState({});
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupSuccess, setOpenPopupSuccess] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("Save");
  const [leadData, setLeadData] = useState(null);
  const [stateData, setStateData] = useState({});
  const [stateDataValidation, setStateDataValidation] = useState({});
  const [accordianData, setAccordianData] = useState([]);
  const [sectionFields, setSectionFields] = useState({});
  const [validationChanged, setValidationChanged] = useState(false);
  const [expanded, setExpanded] = useState(0);
  const [aScoreData, setAScoreData] = useState(null);
  const [product, setProduct] = useState(null);
  const [headers, setHeaders] = useState([
    "Basic Details",
    "Bureau Details",
    "Loan Details",
    "A-Score Details"
  ]);
  const bureuPartnerOptions = [
    {
      value: "CRIF",
      label: "CRIF"
    },
    {
      value: "CIBIL",
      label: "CIBIL"
    },
    {
      value: "EXPERIAN",
      label: "EXPERIAN"
    }
  ];
  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags([
        "tag_leads_ascore_read",
        "tag_leads_ascore_read_write",
        "tag_lead_list_read_write"
      ])
    ) {
      fetchLeadDetails();
    }

    if (!isTagged) {
      fetchLeadDetails();
    }

    // Create dynamic state variables
    let stateDataObj = stateData;
    let stateDataValidationObj = stateDataValidation;
    aScoreFields().forEach(item => {
      stateDataObj[`${item.type}_vl_${item.name}`] = "";
      stateDataValidationObj[`${item.type}_vl_${item.name}State`] = "";
    });
    setStateData(stateDataObj);
    // Create dynamic validation state validation state
    setStateDataValidation(stateDataValidationObj);
    let headerFields = {};
    headers.forEach(item => {
      headerFields[item] = aScoreFields().filter(field => {
        if (field.section === item) {
          field.field = field.name;
          field.validationmsg = field.errorMsg
          if (field.disabled === true) {
            field.readOnly = true;
          }
          if (field.required === true) {
            field.isRequired = true;
          } else {
            field.isRequired = false;
          }
          return true;
        }
        return false;
      });
    });

    const newDataArray = [];
    for (const section in headerFields) {
      newDataArray.push({
        title: section,
        data: headerFields[section]
      });
    }
    setAccordianData(newDataArray);
    setSectionFields(headerFields);
  }, []);

  function findObjectByName(innerArray, name) {
    return innerArray.find(obj => obj.name === name);
  }

  useEffect(() => {
    if (aScoreData?.status) {
      let stateDataCached = JSON.parse(JSON.stringify(stateData));
      stateDataCached["string_vl_enquiry_purpose"] = aScoreData.enquiry_purpose;
      stateDataCached["float_vl_enquiry_amount"] = aScoreData.enquiry_amount;
      stateDataCached["string_vl_enquiry_stage"] = aScoreData.enquiry_stage;
      stateDataCached["string_vl_en_acc_account_number_1"] = aScoreData.en_acc_account_number_1;
      stateDataCached["string_vl_consent"] = aScoreData.consent;
      stateDataCached["dateTime_vl_consent_timestamp"] = aScoreData.consent_timestamp;
      stateDataCached["string_vl_bureau_type"] = aScoreData.bureau_type;
      stateDataCached["float_vl_tenure"] = aScoreData.tenure;
      stateDataCached["string_vl_a_score_request_id"] = aScoreData.a_score_request_id;
      stateDataCached["string_vl_a_score"] = aScoreData.a_score;
      setStateData(stateDataCached);
    }
  }, [aScoreData]);

  const fetchLeadDetails = () => {
    const params = {
      loan_app_id: loan_app_id,
      company_id: company_id,
      product_id: product_id
    };

    dispatch(
      getLeadDetailsByIdWatcher(
        params,
        result => {
          setLeadData(result.data);
          let stateDataObj = JSON.parse(JSON.stringify(stateData));
          Object.keys(stateDataObj).forEach(key => {
            const currentItemField = aScoreFields().filter(item => {
              return item.name === key.replace(/.*_vl_/, "") && item.section === "Basic Details";
            })[0];
            if (currentItemField) stateDataObj[key] = result.data[key.replace(/.*_vl_/, "")] || "";
          });
          dispatch(
            getProductByIdWatcher(
              result.data.product_id,
              response => {
                stateDataObj["string_vl_product_type"] =
                  response.product_type_code || "STPL";
                setProduct(response);
                setStateData(stateDataObj);
                fetchAScoreDetails();
              },
              error => {
              }
            )
          );
        },
        error => {
          return showAlert(error.response.data.message, "error");
        }
      )
    );
  };

  const fetchAScoreDetails = () => {
    const params = {
      loan_app_id: loan_app_id,
      user_id: user._id,
      company_id: company_id,
      product_id: product_id
    };
    dispatch(
      getAScoreDataWatcher(
        params,
        result => {
          setAScoreData(result.data);
        },
        error => {
        }
      )
    );
  };

  const handleAlertClose = () => {
    setAlert(false);
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setOpenPopup(false);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  const handleSubmitAndSave = type => {
    const allFields = aScoreFields();
    let tempStateDataValidation = JSON.parse(
      JSON.stringify(stateDataValidation)
    );
    let stateDataObj = JSON.parse(JSON.stringify(stateData));
    let formValidation = true;
    allFields.forEach(field => {
      let validation = validateData(field.type, stateDataObj[`${field.type}_vl_${field.name}`]);
      if (!validation && field.required) {
        formValidation = false;
        tempStateDataValidation[`${field.name}State`] = "has-danger";
      }
    });
    setStateDataValidation(tempStateDataValidation);
    if (!formValidation) {
      showAlert("Please provide valid data", "error");
      return;
    }
    let postData = {}
    Object.keys(stateDataObj).forEach(item => {
      if (String((stateDataObj[item])).length > 0) {
        if(item.substring(item.indexOf("_vl_") + 4, item.length) == "resi_addr_ln1" ){
          postData["address"] = stateDataObj[item];
        }
        else if(item.substring(item.indexOf("_vl_") + 4, item.length) ==  "appl_phone"){
          postData["mobile_number"] = stateDataObj[item];
        }
        else if(item.substring(item.indexOf("_vl_") + 4, item.length) == "appl_pan"){
          postData["pan"] = stateDataObj[item];
        }
        else if(item.substring(item.indexOf("_vl_") + 4, item.length) == "pincode"){
          postData["pin_code"] = stateDataObj[item];
        }
        else{
          postData[item.substring(item.indexOf("_vl_") + 4, item.length)] = stateDataObj[item];
        }
      }
    });
    // validate all fields in state
    postData.status = type
    const params = {
      submitData: postData,
      userData: {
        company_id,
        product_id,
        user_id: user._id
      }
    };
    dispatch(
      updateAScoreDataWatcher(
        params,
        result => {
          if (type === "open") {
            setAScoreData(result);
            showAlert("aScore details saved successfully.", "success");
          }
          if (type === "confirmed") setOpenPopupSuccess(true);
        },
        error => {
          return showAlert(error.response.data.message, "error");
        }
      )
    );
  };

  const handleConfirmed = () => {
    setOpenPopup(false);
    handleSubmitAndSave("confirmed");
  };
  const handleConfirmedSuccess = () => {
    setOpenPopupSuccess(false);
    fetchAScoreDetails();
  };
  const handleEdit = () => {
    setEditable(true);
    setButtonTitle("Save");
    setShowEditButton(false);
  };

  const change = (event) => {
    let tempStateData = JSON.parse(JSON.stringify(stateData));
    tempStateData[event.target.name] = event.target.value;
    setStateData(tempStateData);

    let validation = validateData(event.target.name.replace(/_vl_.*$/, ""), event.target.value);
    let tempStateDataValidation = JSON.parse(
      JSON.stringify(stateDataValidation)
    );
    tempStateDataValidation[`${event.target.name}State`] = validation
      ? ""
      : "has-danger";
    setStateDataValidation(tempStateDataValidation);
  };

  const handleDropdownChange = (value, stateName) => {
    let stateDataObj = stateData;
    stateDataObj.stateName = value;
  };

  const handleChange = panel => {
    expanded !== panel ? setExpanded(panel) : setExpanded(false);
  };
  const handleClose=() =>{
    setOpenPopup(false);
    setOpenPopupSuccess(false)
  }

  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      {showEditButton ? (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem", width: "98.3%" }}>
          <Buttons
            buttonType="link-button"
            customStyle={{ height: "30px" ,color: "#475BD8", fontSize: "14px" , display:"flex" , justifyContent:"center"}}
            label="Edit Details"
            onClick={handleEdit}
          />
        </div>
      ) : null}
      {openPopup ? (
         <ConfirmationPopup
         isOpen={openPopup}
         onClose={handleClose}
         heading={"Submit details"}
         confirmationMessage={"After submit you cannot edit the details."}
         customYesButtonStyle={{color:"white",backgroundColor:"#475BD8",borderRadius:"26px",width:"48%",marginLeft:"1%",fontFamily:"Montserrat-Bold",border:"1px solid rgb(71, 91, 216)"}}
         customNoButtonStyle={{color:"#475BD8",backgroundColor:"white",borderRadius:"26px",width:"48%",marginLeft:"1%",fontFamily:"Montserrat-Bold",border:"1px solid rgb(71, 91, 216)"}}
         handleConfirmed={handleConfirmed}
         yes={"Yes"}
         no={"No"}
       />
        // <ConfirmationPopup
        //   openPopup={openPopup}
        //   setOpenPopup={setOpenPopup}
        //   header={"Submit details"}
        //   confirmationMessage={"After submit you cannot edit the details."}
        //   handleConfirmed={handleConfirmed}
        //   yes={"Yes"}
        //   no={"No"}
        // />
      ) : null}
      {openPopupSuccess ? (
        <ConfirmationPopup
          isOpen={openPopupSuccess}
          onClose={handleClose}
          heading={"Request submitted successfully"}
          confirmationMessage={
            "Please check after 5 minutes to get the A score"
          }
          customYesButtonStyle={{color:"white",backgroundColor:"#475BD8",borderRadius:"26px",width:"48%",marginLeft:"1%",fontFamily:"Montserrat-Bold",border:"1px solid rgb(71, 91, 216)"}}
          customNoButtonStyle={{color:"#475BD8",backgroundColor:"white",borderRadius:"26px",width:"48%",marginLeft:"1%",fontFamily:"Montserrat-Bold",border:"1px solid rgb(71, 91, 216)"}}
          handleConfirmed={handleConfirmedSuccess}
          yes={"Yes"}
          no={"No"}
          //showOkay={true}
        />
      ) : null}

      <div>
        <EditableAccordian
          accordionData={accordianData}
          customClass={{ width: "97.3%", marginLeft: "1.25%", alignSelf: "center" }}
          stateData={stateData}
          validationData={stateDataValidation}
          onChange={change}
          key={"Ascore"}
          sideButton = {true}
          ButtonName = {"Refresh"}
          buttonOnclick = {event => {
            event.stopPropagation();
            if (aScoreData?.a_score) return;
            fetchAScoreDetails();
          }}
          buttonCss = {{color: aScoreData?.a_score ? "#848799" : "#475BD8", fontFamily: "Montserrat-SemiBold'" ,fontSize: "14px", fontStyle: "normal", fontWeight: "600", lineHeight: "150%", border:"0", backgroundColor:"#fff"}}
          buttonDivCss = {{display:"flex", justifyContent:"end", width:"75%", marginRight:"-7%"}}
        />
      </div>
      {/* <Grid
        className="mt-5"
        style={{ justifyContent: "center", cursor: "pointer" }}
        xs={12}
        container
        spacing={2}
        sx={{ margin: 0 }}
      >
        {leadData &&
          headers.map((item, key) => {
            return (
              <Grid item xs={12} key={key}>
                <Accordion
                  expanded={expanded === key}
                  onChange={() => {
                    handleChange(key);
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="pane{index}bh-content"
                    id="panel{index}bh-header"
                  >
                    <Grid
                      xs={12}
                      style={{
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h2"
                        style={{ fontSize: "18px" }}
                      >{`${item}`}</Typography>
                      {item === "A-Score Details" && (
                        <Typography
                          variant="h6"
                          component="h2"
                          style={{
                            fontSize: "18px",
                            color: aScoreData?.a_score ? "#ccc" : "#5e72e4",
                            marginRight: "15px",
                            cursor: aScoreData?.a_score ? "default" : "pointer"
                          }}
                          onClick={event => {
                            event.stopPropagation();
                            if (aScoreData?.a_score) return;
                            fetchAScoreDetails();
                          }}
                        >{`Refresh`}</Typography>
                      )}
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid xs={12} container>
                      {sectionFields[item].map((field, index) => {
                        return (
                          <Grid
                            key={`${field.name}${index}`}
                            xs={4}
                            md={4}
                            item
                          >
                            <FormControl
                              sx={{ m: 1, width: "100%" }}
                              variant="standard"
                            >
                              {
                                <>
                                  <Typography
                                    variant="h6"
                                    component="h2"
                                    style={{ fontSize: "18px" }}
                                  >
                                    {`${field.title} `}
                                    {field.required && (
                                      <span
                                        style={{
                                          fontSize: "12px",
                                          color: "red"
                                        }}
                                      >
                                        {"*"}
                                      </span>
                                    )}
                                  </Typography>
                                  {field.component === "select" ? (
                                    <CustomDropdown
                                      placeholder={field.placeholder}
                                      data={bureuPartnerOptions}
                                      value={stateData?.bureau_type}
                                      disabled={false}
                                      id={field.name}
                                      handleDropdownChange={value => {
                                        handleDropdownChange(value, field.name);
                                      }}
                                      error={
                                        stateDataValidation[
                                          `${field.name}State`
                                        ] === "has-danger"
                                      }
                                      helperText={
                                        stateDataValidation[
                                          `${field.name}State`
                                        ] === "has-danger"
                                          ? field.errorMsg
                                          : ""
                                      }
                                    />
                                  ) : (
                                    <>
                                      <TextField
                                        variant="standard"
                                        name={field.name}
                                        value={stateData[field.name]}
                                        onChange={event => change(event, field)}
                                        disabled={
                                          field.disabled ||
                                          aScoreData?.status === "confirmed"
                                        }
                                        error={
                                          stateDataValidation[
                                            `${field.name}State`
                                          ] === "has-danger"
                                        }
                                        helperText={
                                          stateDataValidation[
                                            `${field.name}State`
                                          ] === "has-danger"
                                            ? field.errorMsg
                                            : ""
                                        }
                                      />
                                      {field?.infoText ? (
                                        <Tooltip title={field.infoText}>
                                          <InfoIcon
                                            style={{
                                              color: "#5e72e4",
                                              marginLeft: "20px",
                                              cursor: "pointer",
                                              position: "absolute",
                                              right: "0",
                                              top: "30px"
                                            }}
                                          />
                                        </Tooltip>
                                      ) : null}
                                    </>
                                  )}
                                </>
                              }
                            </FormControl>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            );
          })}
      </Grid> */}
      {aScoreData?.status !== "confirmed" && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem", width: "98.4%", marginBottom: "50px" }}>
            <Buttons
              buttonType="primary"
              customStyle={{ width:"109px" , height:"40px"  , borderRadius:"26px" , fontSize:"12px" , display:"flex",justifyContent: "center" , boxShadow:"none" ,backgroundColor:"white" }}
              disabled={
                isTagged
                  ? !checkAccessTags([
                    "tag_leads_ascore_read_write",
                    "tag_lead_list_read_write"
                  ])
                  : false
              }
              label="Save"
              onClick={() => {
                handleSubmitAndSave("open");
              }}
            />
            {aScoreData && (
              <Buttons
              buttonType="primary"
              customStyle={{ width:"109px" , height:"40px"  , borderRadius:"26px" , fontSize:"12px" , display:"flex",justifyContent: "center" , boxShadow:"none" ,backgroundColor:"white" }}
                disabled={
                  isTagged
                    ? !checkAccessTags([
                      "tag_leads_ascore_read_write",
                      "tag_lead_list_read_write"
                    ])
                    : false
                }
                label="Submit"
                onClick={() => {
                  setOpenPopup(true);
                }}
              />
             
            )}
          </div>
      )}
      {isLoading && <Preloader />}
    </>
  );
};
