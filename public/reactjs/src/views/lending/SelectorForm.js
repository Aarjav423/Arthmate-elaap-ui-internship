import React from "react";
import { selectorFormJsonFields } from "./selectorFormJson";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
//import { ConfirmationPopup } from "./ConfirmationPopup";
import ConfirmationPopup from "react-sdk/dist/components/Popup/ConfirmationPopup";
import { useDispatch } from "react-redux";
import {
  getSelectorDetailsWatcher,
  submitSelectorDetailsWatcher,
  submitSelectorColenderDetailsWatcher,
  getSelectorDataByLoanAppIdWatcher
} from "../../actions/camsDetails";
import { getProductByIdWatcher } from "../../actions/product";
import { storedList } from "../../util/localstorage";
import { AlertBox } from "../../components/AlertBox";
import { checkAccessTags } from "../../util/uam";
import { validateData } from "../../util/validation";
import OfferDetails from "../../views/lending/offerDetails";
import moment from "moment";
import EditableAccordian from "react-sdk/dist/components/EditableAccordian"
import Button from "react-sdk/dist/components/Button"
import { getOfferDetailsWatcher } from "../../actions/offerDetails";
import Accordion from "react-sdk/dist/components/Accordion/Accordion"
import { Link } from "@material-ui/core";
import RejectionReasons from "./RejectionReasons";

export const SelectorForm = () => {
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [errors, setErrors] = useState([]);
  const [payloadData, setPayloadData] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const dispatch = useDispatch();
  const user = storedList("user");
  const { loan_app_id, company_id, product_id } = useParams();
  const [isCamsDetailsAvailable, setIsCamsDetailsAvailable] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editable, setEditable] = useState(true);
  const [showEditButton, setShowEditButton] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("Submit");
  const history = useHistory();
  const [product, setProduct] = useState([]);
  const [selectorDetails, setSelectorDetails] = useState([]);
  const [openLog, setOpenLog] = useState(false);
  const [openOfferDetails, setOpenOfferDetails] = useState(false);
  const [offerDetails, setOfferDetails] = useState(null);
  const [accordionData, setAccordianData] = useState([]);
  const [stateData, setStateData] = useState({});
  const [validationData, setValidationData] = useState({});
  const [rejectionReasonData, setRejectionReasonData] = useState([]);
  let product_code = "";
  let selector_data = [];
  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const headers = {
    "Basic Details": [0, 13],
    "Bureau Details": [13, 19],
    "Score Card Details": [19, 22],
    "Loan Details": [22, 26],
    "Colender Details": [26, 29]
  };

  function generateFormattedArray(response) {
    const formattedArray = [];
    const tempStateArray = {};
    const tempErrorArray = {};
    for (const item of selectorFormJsonFields()) {
      const stateKey = `${item.Type}_vl_${item.name}`;
      const errorKey = `${item.Type}_vl_${item.name}State`;
      if (response[`${item.name}`] && String(response[`${item.name}`]).length > 0) {
        tempStateArray[stateKey] = response[`${item.name}`]
      } else {
        tempStateArray[stateKey] = "";
      }
      tempErrorArray[errorKey] = "";
    }
    setStateData(tempStateArray);
    setValidationData(tempErrorArray);
    for (const key in headers) {
      const [start, end] = headers[key];
      const sectionFields = selectorFormJsonFields().slice(start, end);

      const sectionData = {
        title: key,
        data: sectionFields.map(item => ({
          field: item.name,
          title: item.title,
          type: item.Type,
          presentInLoanApi: item.presentInLoanApi,
          readOnly: item?.Readonly || false
        }))
      };
      formattedArray.push(sectionData);
    }
    return formattedArray;
  }
  
  function handleRejectionReason(response)  {
	  setOpenLog(true);
  }
  
  const handleCloseLog = () => {
    setOpenLog(false);
  };
  
  const fetchOfferDetails = () => {
    dispatch(
      getOfferDetailsWatcher(
        { loan_app_id, company_id, product_id },
        async response => {
          const details=[{
            title:"Offer Details",
            data:[{
              head:"OFFERED AMOUNT",
              body:(response.data?.offered_amount||response.data?.offered_amount==0?Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(response.data?.offered_amount):"NA")
            },
            {
              head:"OFFERED INTEREST RATE",
              body:(response.data?.offered_int_rate+"%"||"NA")
            },
            response.data?.rejection_reasons != null && response.data?.rejection_reasons.length > 0 ?{
              head:"REJECTION REASONS",
              body:(<Link style={{ cursor: 'pointer' }} onClick={(e)=>handleRejectionReason()}>View Rejection Reasons</Link>)
            }:{},
          ]
          }]
          setOfferDetails(details);
          setRejectionReasonData(response.data?.rejection_reasons);

        },
        error => {
        }
      )
    );
  };
  const fetchSelectorDetails = selector => {
    const payload = {
      loan_app_id: loan_app_id,
      company_id: company_id,
      product_id: product_id,
      user_id: user._id
    };
    new Promise((resolve, reject) => {
      dispatch(getSelectorDetailsWatcher(payload, resolve, reject));
    })
      .then(response => {
        let customData = {
          ...response,
          product_type_code: product_code,
          bureau_type: selector.bureau_type,
          is_submitted: selector.is_submitted,
          enquiry_purpose: selector.enquiry_purpose,
          enquiry_stage: selector.enquiry_stage,
          dscr: selector.dscr,
          consent: selector.consent,
          consent_timestamp: selector.consent_timestamp
            ? moment(selector.consent_timestamp).format("YYYY-MM-DD HH:mm:ss")
            : "",
          request_id_a_score: selector.request_id_a_score,
          request_id_b_score: selector.request_id_b_score,
          ceplr_cust_id: selector.ceplr_cust_id,
          sanction_amount: selector.sanction_amount,
          tenure: selector.tenure,
          co_lender_shortcode: selector.co_lender_shortcode
            ? selector.co_lender_shortcode
            : "",
          co_lender_assignment_id: selector.co_lender_assignment_id
            ? selector.co_lender_assignment_id
            : "",
          co_lender_name: selector.co_lender_name
            ? selector.co_lender_name
            : "",
          monthly_income: selector.monthly_income
            ? selector.monthly_income
            : "",
          interest_rate: selector.interest_rate ? selector.interest_rate : ""
        };
        setAccordianData(generateFormattedArray(customData));
        setPayloadData(customData);
        setIsLoaded(true);
        setShowEditButton(true);
        setEditable(false);
        if (selector.is_submitted === true) {
          setEditable(false);
          setShowEditButton(false);
        }
        if (selector.is_submitted === false) {
          setShowEditButton(true);
          setEditable(false);
        }
      })
      .catch(error => {
        setAccordianData(generateFormattedArray({}));
        setIsLoaded(true);
        setEditable(true);
      });
  };

  const handleAlertClose = () => {
    setAlert(false);
  };

  // const handleClear = () => {
  //   const payload = {};
  //   setErrors([]);
  //   selectorFormJsonFields().map(field => {
  //     if (field.Readonly == true) {
  //       payload[field.name] = payloadData[field.name];
  //     } else {
  //       payload[field.name] = "";
  //     }
  //   });
  //   setPayloadData(payload);
  //   setButtonTitle("Save");
  //   setShowEditButton(false);
  //   setEditable(true);
  //   setIsCamsDetailsAvailable(true);
  // };

  const handleClear = () => {
    const clearedStateData = {};
    selectorFormJsonFields().forEach(item => {
      if (item.Readonly == undefined) {
        clearedStateData[`${item.Type}_vl_${item.name}`] = "";
      } else {
        clearedStateData[`${item.Type}_vl_${item.name}`] = stateData[`${item.Type}_vl_${item.name}`]
      }
    });
    setStateData(clearedStateData);
    setValidationData({})
    setButtonTitle("Save");
    setShowEditButton(false);
    setEditable(true);
    //setIsCamsDetailsAvailable(true);
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

  const handleClose=() =>{
     setOpenPopup(false);
   }

  const handleConfirmed = () => {
    if (buttonTitle === "Submit") {
      const postData = {};
      let formValidated = true;

      Object.keys(stateData).forEach(item => {
        if ((stateData[item]).length > 0 && !validateData(item.substring(0, item.indexOf("_vl_")).toLowerCase(), stateData[item])) {
          setValidationData(prevState => ({
            ...prevState,
            [`${item}State`]: "has-danger"
          }));
          formValidated = false;
        }
      });
      if (formValidated) {
        Object.keys(stateData).forEach(item => {
          if ((stateData[item]).length > 0) {
            postData[item.substring(item.indexOf("_vl_") + 4, item.length)] = stateData[item];
          }
        });
        postData.loan_app_id = loan_app_id;
        postData.company_id = company_id;
        postData.product_id = product_id;
        postData.user_id = user._id;
        postData.pincode=payloadData.pincode;

        new Promise((resolve, reject) => {
          dispatch(
            submitSelectorColenderDetailsWatcher(postData, resolve, reject)
          );
        })
          .then(response => {
            if (buttonTitle === "Submit") {
              setTimeout(() => {
                history.push("/admin/lending/leads");
              }, 3000);
              showAlert(response?.message, "success");
            } else showAlert("Saved", "success");
          })
          .catch(error => {
            showAlert(error?.response?.data?.message, "error");
          });
      } else {
        showAlert("Kindly check for errors in fields", "error");
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      }
    } else {
      const postData = {};
      let formValidated = true;

      Object.keys(stateData).forEach(item => {
        if ((stateData[item]).length > 0 && !validateData(item.substring(0, item.indexOf("_vl_")).toLowerCase(), stateData[item])) {
          setValidationData(prevState => ({
            ...prevState,
            [`${item}State`]: "has-danger"
          }));
          formValidated = false;
        }
      });
      if (formValidated) {
        Object.keys(stateData).forEach(item => {
          if ((stateData[item]).length > 0) {
            postData[item.substring(item.indexOf("_vl_") + 4, item.length)] = stateData[item];
          }
        });
        postData.loan_app_id = loan_app_id;
        postData.company_id = company_id;
        postData.product_id = product_id;
        postData.user_id = user._id;

        new Promise((resolve, reject) => {
          dispatch(submitSelectorDetailsWatcher(postData, resolve, reject));
        })
          .then(response => {
            if (buttonTitle === "Submit") {
              setTimeout(() => {
                history.push("/admin/lending/leads");
              }, 3000);
              showAlert(response?.message, "success");
            } else showAlert("Saved", "success");
          })
          .catch(error => {
            showAlert(error?.response?.data?.message, "error");
          });
      } else {
        showAlert("Kindly check for errors in fields", "error");
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
      }
    }
  };

  useEffect(() => {
    if (
      isTagged &&
      checkAccessTags([
        "tag_selector_details_read",
        "tag_selector_details_read_write",
        "tag_lead_list_read_write"
      ])
    ) {
      fetchSelectorDetails();
    }
    dispatch(
      getProductByIdWatcher(
        product_id,
        response => {
          setProduct(response);
          product_code = response.product_type_code;
        },
        error => {
          showAlert(error.response.data.message, "error");
          setTimeout(() => {
            handleAlertClose();
          }, 4000);
        }
      )
    );
    dispatch(
      getSelectorDataByLoanAppIdWatcher(
        { loan_app_id },
        response => {
          setSelectorDetails(response);
          fetchSelectorDetails(response);
        },
        error => {
          showAlert(error.response.data.message, "error");
          setTimeout(() => {
            handleAlertClose();
          }, 4000);
        }
      )
    );
    if (!isTagged) fetchSelectorDetails();
    if (loan_app_id&&accordionData) fetchOfferDetails();
  }, []);
  const handleOffer=()=>{
    if (openOfferDetails==false)
    {
      setOpenOfferDetails(true);
    }
  }

  const handleSubmitAndSave = () => {
    if (buttonTitle === "Save") {
      setButtonTitle("Submit");
      setShowEditButton(true);
      setEditable(false);
      handleConfirmed();
    }
    if (buttonTitle === "Submit") setOpenPopup(true);
  };

  const handleEdit = () => {
    setEditable(true);
    setButtonTitle("Save");
    setShowEditButton(false);
  };

  const change = e => {

    const { name, value } = e.target;
    setStateData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (String(value).length == 0) {
      setValidationData(prevState => ({
        ...prevState,
        [`${name}State`]: ""
      }));
    } else {
      const isValid = validateData(
        name.substring(0, name.indexOf("_vl_")).toLowerCase(),
        value
      );
      setValidationData(prevState => ({
        ...prevState,
        [`${name}State`]: !isValid ? "has-danger" : ""
      }));
    }
  };

  const [expanded, setExpanded] = useState(0);
  const handleChange = panel => {
    expanded !== panel ? setExpanded(panel) : setExpanded(false);
    setOpenOfferDetails(false);
  };
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
          <Button
            buttonType="links"
            customStyle={{ height: "30px", color: "#475BD8", fontSize: "14px", paddingRight : "0px",paddingLeft:"0px", fontFamily: 'Montserrat-SemiBold' }}
            label={`Edit Details`}
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
          customStyles={{width:"400px"}}
          customYesButtonStyle={{color:"white",backgroundColor:"#475BD8",borderRadius:"26px",width:"45%",fontFamily:"Montserrat-Bold",border:"1px solid rgb(71, 91, 216)",marginTop:"5px"}}
          customNoButtonStyle={{color:"#475BD8",backgroundColor:"white",borderRadius:"26px",width:"45%",marginLeft:"3%",fontFamily:"Montserrat-Bold",border:"1px solid rgb(71, 91, 216)",marginTop:"5px"}}
          handleConfirmed={handleConfirmed}
          yes={"Yes"}
          no={"No"}
        />
      ) : null}
      <div

      >
        {isLoaded
          ?
          <>
            <EditableAccordian
              accordionData={accordionData}
              customClass={{ width: "97.3%", marginLeft: "1.25%", alignSelf: "center" }}
              stateData={stateData}
              validationData={validationData}
              onChange={change}
              isEditable={editable}
              key={"Selector"}
            />
          </>
          : null}
        {accordionData&&offerDetails?
        <div onClick={handleOffer}>
          <Accordion accordionData={offerDetails} customClass={{width: "97.5%", marginLeft: "1.4%",marginRight: "0.4%", alignSelf: "center",fontSize:"2%"}} openDrawdown={openOfferDetails}/>
          </div>
          :null
        }
        <RejectionReasons
           openLog={openLog}
           data={rejectionReasonData}
           handleCloseLog={() => handleCloseLog()}
        />
        
      </div>
      <div>
        {(
          payloadData.is_submitted ? payloadData.is_submitted === false : true
        ) ? (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem", width: "98.4%", marginBottom: "50px" }}>
            <Button
              buttonType="primarys"
              customStyle={{ height: "40px", width: "111px", borderRadius: "1.625rem", backgroundColor: "#fff", color: "#475BD8", padding: "0px", fontWeight: "600", border: "1px solid #475BD8" }}
              label="Discard"
              disabled={
                isTagged
                  ? !checkAccessTags([
                    "tag_selector_details_read_write",
                    "tag_lead_list_read_write"
                  ])
                  : false
              }
              onClick={handleClear}
            />
            <Button
              buttonType="primarys"
              customStyle={{ height: "40px", width: "109px", borderRadius: "1.625rem", backgroundColor: "#475BD8", padding: "0px", fontWeight: "600", color:"#fff" }}
              disabled={
                isTagged
                  ? !checkAccessTags([
                    "tag_selector_details_read_write",
                    "tag_lead_list_read_write"
                  ])
                  : false
              }
              label={buttonTitle}
              onClick={(e) => handleSubmitAndSave(e)}
            />
          </div>
        ) : null}
      </div>
    </>
  );
};
