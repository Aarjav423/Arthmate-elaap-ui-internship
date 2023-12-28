import { camsFormJsonFields } from "./camsFormJson";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getCamsDetailsWatcher,
  submitCamsDetailsWatcher,
  getUdhyamRegistrationDetailsWatcher,
} from "../../actions/camsDetails";
import {
  getStatesData,
  getPincodeData,
  States,
  Cities,
} from "../../constants/country-state-city-data";
import { storedList } from "../../util/localstorage";
import { AlertBox } from "../../components/AlertBox";
import { checkAccessTags } from "../../util/uam";
import { validateData } from "../../util/validation";
import EditableAccordian from "react-sdk/dist/components/EditableAccordian";
import Button from "react-sdk/dist/components/Button";
import ConfirmationPopup from "react-sdk/dist/components/Popup/ConfirmationPopup";
import { loadTemplateEnumsWatcher } from "../../actions/loanSchema";

const user = storedList("user");

export const CamsForm = () => {
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [payloadData, setPayloadData] = useState({});
  const [openPopup, setOpenPopup] = useState(false);
  const dispatch = useDispatch();
  const user = storedList("user");
  const { loan_app_id, company_id, product_id } = useParams();
  const [validationData, setValidationData] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [editable, setEditable] = useState(true);
  const [showEditButton, setShowEditButton] = useState(false);
  const [buttonTitle, setButtonTitle] = useState("Save");
  const [accordionData, setAccordianData] = useState([]);
  const [stateData, setStateData] = useState({});
  const [enumFields, setEnumFields] = useState({});
  const [states, setStatesState] = useState(States);
  const [city, setCityState] = useState([]);
  const [pincode, setPincodeState] = useState([]);
  const [stateCityData, setStateCityDataStates] = useState([]);
  const [inputBoxHavingDropdown, setInputBoxHavingDropdown] = useState([]);

  const history = useHistory();

  const isTagged =
    process.env.REACT_APP_BUILD_VERSION > 1
      ? user?.access_metrix_tags?.length
      : false;

  const headers = {
    "P&L": [0, 10],
    "Balance Sheet": [10, 29],
    "Bank Statement": [29, 56],
    Bureau: [56, 77],
    GST: [77, 106],
    ITR: [106, 115],
    "Business Document/Loan Application": [115, 131],
    "Transaction Data": [131, 139],
    "FSA/Banking": [139, 147],
    Derived: [147, 149],
    "Other Details": [149, 159],
    "Udhyam Registration": [159, 183],
  };
  const handleGetCities = async (value, name) => {
    if (name === "state") setCityState(Cities(value));
  };
  const handleGetPincodes = async (value) => {
    const pincodesData = await getPincodeData(stateCityData, value);
    setPincodeState(pincodesData);
  };
  const handleClearDropdown = (name) => {
    if (name === "state") {
      setStateData((prevState) => ({
        ...prevState,
        pincode_vl_pincode: "",
        string_vl_city: "",
      }));
      setCityState([]);
      setPincodeState([]);
    }
    if (name === "city") {
      setStateData((prevState) => ({
        ...prevState,
        pincode_vl_pincode: "",
      }));
      setPincodeState([]);
    }
  };

  const fetchCamsDetails = (enumData) => {
    dispatch(
      getCamsDetailsWatcher(
        { loan_app_id },
        (response) => {
          setPayloadData(response.data);
          setAccordianData(generateFormattedArray(response.data));
          let tempArray = [];
          let urcArray = generateFormattedArray(response.data).find(
            (item) => item.title === "Udhyam Registration"
          );
          urcArray?.data.map((singleItem) => {
            const key = singleItem.field;
            if (enumData?.loan?.hasOwnProperty(key)) {
              tempArray.push({ [key]: "string_vl_" + key });
            }
            if (enumData.lead.hasOwnProperty(key)) {
              tempArray.push({ [key]: "string_vl_" + key });
            }
          });
          setInputBoxHavingDropdown(tempArray);
          setIsLoaded(true);
          if (response.data?.status === "confirmed") {
            setEditable(false);
          }
          if (response.data?.status === "open") {
            setShowEditButton(true);
            setEditable(false);
          }
        },
        (error) => {
          setAccordianData(generateFormattedArray({}));
          setIsLoaded(true);
          setEditable(true);
        }
      )
    );
  };

  const handleAlertClose = () => {
    setAlert(false);
  };

  const handleClear = () => {
    const stateData = {};
    camsFormJsonFields().map((item) => {
      stateData[`${item.Type}_vl_${item.name}`] = "";
    });
    setValidationData({});
    setStateData(stateData);
    setButtonTitle("Save");
    setShowEditButton(false);
    setEditable(true);
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
  const handleClose = () => {
    setOpenPopup(false);
  };

  const handleConfirmed = () => {
    const postData = {};
    let formValidated = true;

    Object.keys(stateData).forEach((item) => {
      if (
        stateData[item].length > 0 &&
        !validateData(
          item.substring(0, item.indexOf("_vl_")).toLowerCase(),
          stateData[item]
        )
      ) {
        setValidationData((prevState) => ({
          ...prevState,
          [`${item}State`]: "has-danger",
        }));
        formValidated = false;
      }
    });
    if (formValidated) {
      Object.keys(stateData).forEach((item) => {
        if (stateData[item].length > 0) {
          postData[item.substring(item.indexOf("_vl_") + 4, item.length)] =
            stateData[item];
        }
      });
      postData.loan_app_id = loan_app_id;
      postData.company_id = company_id;
      postData.product_id = product_id;
      postData.user_id = user._id;
      postData.status = buttonTitle === "Save" ? "open" : "confirmed";

      new Promise((resolve, reject) => {
        dispatch(submitCamsDetailsWatcher(postData, resolve, reject));
      })
        .then((response) => {
          if (buttonTitle === "Submit") {
            setTimeout(() => {
              history.push("/admin/lending/leads");
            }, 3000);
            showAlert(response?.message, "success");
          } else showAlert("Saved", "success");
        })
        .catch((error) => {
          showAlert(error?.response?.data?.message, "error");
        });
    } else {
      showAlert("Kindly check for errors in fields", "error");
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
    }
  };

  useEffect(() => {
    dispatch(
      loadTemplateEnumsWatcher(
        {
          templates: ["lead", "loan", "loandocument"],
        },
        (result) => {
          setEnumFields(result.data);
          if (
            isTagged &&
            checkAccessTags([
              "tag_cams_details_read",
              "tag_cams_details_read_write",
              "tag_lead_list_read_write",
            ])
          ) {
            fetchCamsDetails(result.data);
          }
        },
        (error) => { }
      )
    );
    if (!isTagged) {
      fetchCamsDetails();
    }
  }, []);

  function generateFormattedArray(response) {
    const formattedArray = [];
    const tempStateArray = {};
    const tempErrorArray = {};
    for (const item of camsFormJsonFields()) {
      const stateKey = `${item.Type}_vl_${item.name}`;
      const errorKey = `${item.Type}_vl_${item.name}State`;
      if (
        response[`${item.name}`] != undefined &&
        String(response[`${item.name}`]).length > 0
      ) {
        tempStateArray[stateKey] = response[`${item.name}`] + "";
      } else {
        tempStateArray[stateKey] = "";
      }
      tempErrorArray[errorKey] = "";
    }
    setStateData(tempStateArray);



    setValidationData(tempErrorArray);
    for (const key in headers) {
      const [start, end] = headers[key];
      const sectionFields = camsFormJsonFields().slice(start, end);

      const sectionData = {
        title: key,
        data: sectionFields.map((field) => ({
          field:
            field.name.split("urc_").length > 1
              ? field.name.split("urc_")[1]
              : field.name,
          title:
            field.title === "State"
              ? "State Name"
              : field.title === "City"
                ? "City Name"
                : field.title,
          type: field.Type,
          presentInLoanApi: field.presentInLoanApi,
        })),
      };

      formattedArray.push(sectionData);
    }

    return formattedArray;
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

  const change = (e) => {
    const { name, value } = e.target;
    setStateData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (String(value).length == 0) {
      setValidationData((prevState) => ({
        ...prevState,
        [`${name}State`]: "",
      }));
    } else {
      const isValid = validateData(
        name.substring(0, name.indexOf("_vl_")).toLowerCase(),
        value
      );
      setValidationData((prevState) => ({
        ...prevState,
        [`${name}State`]: !isValid ? "has-danger" : "",
      }));
    }
  };
  const dropDownChange = (value, name) => {
    const pincodeVal = name === "pincode" ? value?.value : "";
    setStateData((prevState) => ({
      ...prevState,
      pincode_vl_pincode: pincodeVal ?? "",
      [`string_vl_${name}`]: value?.name || "",
    }));

    if (value === null || value === undefined) return handleClearDropdown(name);

    if (name === "state" && value !== undefined && value !== null) {
      setStateData((prevState) => ({
        ...prevState,
        pincode_vl_pincode: "",
        string_vl_city: "",
      }));
      setCityState([]);
      setPincodeState([]);
      handleGetCities(value, name);
    }

    if (name === "city" && value !== undefined && value !== null) {
      setPincodeState([]);
      handleGetPincodes(value);
    }

    const validatingType = name === "pincode" ? "pincode" : "string";

    const isValid = validateData(validatingType, value?.value);

    setValidationData((prevState) => ({
      ...prevState,
      [`${validatingType}_vl_${name}State`]: !isValid ? "has-danger" : "",
    }));
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
      {showEditButton ? (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1.5rem",
            width: "98.3%",
          }}
        >
          <Button
            buttonType="link-button"
            customStyle={{
              height: "30px",
              color: "#475BD8",
              fontSize: "14px",
              display: "flex",
              justifyContent: "center",
            }}
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
          customYesButtonStyle={{
            color: "white",
            backgroundColor: "#475BD8",
            borderRadius: "26px",
            width: "48%",
            marginLeft: "1%",
            fontFamily: "Montserrat-Bold",
            border: "1px solid rgb(71, 91, 216)",
          }}
          customNoButtonStyle={{
            color: "#475BD8",
            backgroundColor: "white",
            borderRadius: "26px",
            width: "48%",
            marginLeft: "1%",
            fontFamily: "Montserrat-Bold",
            border: "1px solid rgb(71, 91, 216)",
          }}
          handleConfirmed={handleConfirmed}
          yes={"Yes"}
          no={"No"}
        />
      ) : null}

      <div>
        {isLoaded ? (
          <>
            <EditableAccordian
              accordionData={accordionData}
              customClass={{
                width: "97.3%",
                marginLeft: "1.25%",
                alignSelf: "center",
              }}
              stateData={stateData}
              validationData={validationData}
              onChange={change}
              isEditable={editable}
              key={"cam"}
              dropDownChange={dropDownChange}
              enumData={enumFields}
              dropdownInputList={inputBoxHavingDropdown}
              states={states}
              city={city}
            />
          </>
        ) : null}
      </div>
      <div style={{ marginBottom: "40px" }}>
        {(
          payloadData.status && payloadData.status === "open"
            ? payloadData.status === "open"
            : true
        ) ? (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1.5rem",
              width: "98.4%",
              marginBottom: "50px",
            }}
          >
            <Button
              buttonType="secondary"
              customStyle={{
                width: "109px",
                height: "40px",
                border: "1px solid #475BD8",
                color: "#475BD8",
                borderRadius: "26px",
                color: "rgb(71, 91, 216)",
                fontSize: "12px",
                display: "flex",
                justifyContent: "center",
                boxShadow: "none",
                backgroundColor: "white",
              }}
              label="Discard"
              disabled={
                isTagged
                  ? !checkAccessTags([
                    "tag_cams_details_read_write",
                    "tag_lead_list_read_write",
                  ])
                  : false
              }
              onClick={handleClear}
            />
            <Button
              buttonType="primary"
              customStyle={{
                width: "109px",
                height: "40px",
                borderRadius: "26px",
                fontSize: "12px",
                display: "flex",
                justifyContent: "center",
                boxShadow: "none",
                backgroundColor: "white",
              }}
              isDisabled={
                isTagged
                  ? (buttonTitle === "Submit" &&
                    checkAccessTags(["tag_cams_save_btn_read_write"])) ||
                  !checkAccessTags([
                    "tag_cams_details_read_write",
                    "tag_lead_list_read_write",
                  ])
                  : false
              }
              label={buttonTitle}
              onClick={(e) => handleSubmitAndSave(e)}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
