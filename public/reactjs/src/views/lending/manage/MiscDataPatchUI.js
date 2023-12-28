import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import { LoanPatchFields } from "./loanPatchFields";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import { validateData } from "../../../util/validation";
import {
  getStatesData,
  getCitiesData,
  getPincodeData,
  States,
  Cities
} from "../../../constants/country-state-city-data";
import {
  getAllLoanBookingTemplateWatcher,
  fetchLoanSchemaCustomWatcher
} from "../../../actions/loanBooking.js";
import { updateMiscDetailsWatcher } from "../../../actions/borrowerInfo.js";
import { storedList } from "../../../util/localstorage";
import { verifyDate, verifyFloat } from "../../../util/helper";
import moment from "moment";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CustomDropdown from "../../../components/custom/customSelect";
import { Typography } from "@material-ui/core";
import CustomInputBox from "react-sdk/dist/components/InputBox/InputBox";
import CustomFormPopup from "react-sdk/dist/components/Popup/FormPopup";
import CustomButton from "react-sdk/dist/components/Button/Button";


const inputBoxCss = {
  marginTop: "10px",
  width: "252px",
  marginLeft: "-5px",
  zIndex: 1,
}
const inputCssBankDetail = {
  height: "56px", 
  width: "273.5px",
 padding: "5px 15px 10px 10px", 
 maxWidth : "none"
}


const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}

      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",

            right: 8,

            top: 8,

            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export function MiscDataPatchUI(props) {
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

  const { handleClose, open, data, showAlert } = props;
  const [loanCustomTemplatesId, setLoanCustomTemplatesId] = useState("");
  const [loanSchemaId, setLoanSchemaId] = useState("");
  const [loanTemplate, setLoanTemplate] = useState([]);
  const [fieldsToDisplayOnUI, setFieldsToDisplayOnUI] = useState([]);
  const [stateData, setStateData] = useState({});
  const [validationData, setValidationData] = useState({});
  const [isDisabledSubmitBtn, setIsDisabledSubmitBtn] = useState(true);
  const [formValidated, setFormValidated] = useAsyncState(true);
  const [finalFields, setFinalFields] = useState([]);
  const [stateCityData, setStateCityDataStates] = useState([]);
  const [states, setStatesState] = useState(States);
  const [city, setCityState] = useState([]);
  const [pincode, setPincodeState] = useState([]);
  const stateCity = useSelector((state) => state?.stateCity?.stateCityData);
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dataChanged, setDataChanged] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [dataAfterUpdate, setDataAfterUpdate] = useState({});
  const dispatch = useDispatch();
  const user = storedList("user");
  const displayOnUIFieldsArray = [
    "father_or_spouse_name",
    "business_name",
    "business_address",
    "business_state",
    "business_city",
    "business_pin_code",
    "business_establishment_proof_type",
    "udyam_reg_no",
    "gst_number",
    "other_business_reg_no",
    "business_pan",
    "dealer_name",
    "dealer_email"
  ];

  // Set loan schema id

  useEffect(() => {
    setLoanSchemaId(data.loan_schema_id);
  }, []);

  useEffect(() => {}, [fieldsToDisplayOnUI]);

  // On change of loan schema id fetch loan schema.

  useEffect(() => {
    if (loanSchemaId) {
      dispatch(
        fetchLoanSchemaCustomWatcher(
          {
            loan_schema_id: loanSchemaId
          },

          (result) => {
            setLoanCustomTemplatesId(result.loan_custom_templates_id);
          },

          (error) => {}
        )
      );
    } else {
      setLoanCustomTemplatesId("");
    }
  }, [loanSchemaId]);

  const getLoanTemplate = () => {
    const payload = {
      loan_custom_templates_id: loanCustomTemplatesId,

      templatName: "loan"
    };

    dispatch(
      getAllLoanBookingTemplateWatcher(
        payload,

        (response) => {
          setLoanTemplate(response);
        },

        (error) => {}
      )
    );
  };

  // On set of loan_custom_templates_id fetch loan template

  useEffect(() => {
    getLoanTemplate();
  }, [loanCustomTemplatesId]);

  //Prepare fields array on load of template.

  useEffect(() => {
    setInitialData();
  }, [loanTemplate]);

  const setInitialData = () => {
    var dataCached = {};

    if (!dataUpdated) {
      dataCached = data;
    } else {
      dataCached = dataAfterUpdate;
    }

    const finalFieldsFiltered = loanTemplate.filter(
      (item) => displayOnUIFieldsArray.indexOf(item.field) > -1
    );

    //get the existing state recorded by default it wil be {}

    let stateDataMapper = stateData;

    let validationDataMapper = validationData;

    finalFieldsFiltered.forEach((item) => {
      stateDataMapper[`${item.type}_vl_${item.field}`] =
        dataCached[item.field] || "";

      validationDataMapper[`${item.type}_vl_${item.field}State`] = "";
    });
    setFinalFields(finalFieldsFiltered);
    setStateData(stateDataMapper);
    setValidationData(validationDataMapper);
    setFieldsToDisplayOnUI(finalFieldsFiltered);
    setResponseMessage("");
    setErrorMessage("");
  };

  const validateStateData = async () => {
    await setFormValidated(true);

    Object.keys(stateData).forEach((item) => {
      const currentField = finalFields.filter((ltItem) => {
        return ltItem.field === item.substring(item.indexOf("_vl_") + 4);
      });

      if (
        currentField[0]?.checked.toLowerCase() === "true" ||
        (currentField[0]?.checked.toLowerCase() === "false" &&
          stateData[item] !== "")
      ) {
        changeStateError(item, stateData[item]);
      }
    });
  };

  const changeStateError = (item, value) => {
    if (
      !validateData(
        item.substring(0, item.indexOf("_vl_")).toLowerCase(),

        value
      )
    ) {
      if (`${item}State` !== "has-danger")
        setValidationData((prevState) => ({
          ...prevState,

          [`${item}State`]: "has-danger"
        }));

      setFormValidated(false);
      setIsDisabledSubmitBtn(false);
    } else {
      if (`${item}State` !== "")
        setValidationData((prevState) => ({
          ...prevState,

          [`${item}State`]: ""
        }));
    }
  };


  const change = async (e , nameOfField) => {
    let value = e.value;
    let name = nameOfField;
    setDataChanged(true);
    setResponseMessage("");
    setErrorMessage("");

    const currentField = finalFields.filter((x) => {
      return name.indexOf(x.field) > -1;
    });

    setFormValidated(true);

    if (
      currentField[0]?.checked.toLowerCase() === "true" ||
      (currentField[0]?.checked.toLowerCase() === "false" && value !== "")
    ) {
      changeStateError(name, value);
    }

    setStateData((prevState) => ({
      ...prevState,

      [name]: value
    }));
  };
  useEffect(() => {
    if (dataChanged) setIsDisabledSubmitBtn(!validationData);
  }, [validationData]);

  const getDataByType = (type) => {
    if (type === "state" || type === "business_state") return states ?? [];

    if (type === "city" || type === "business_city") return city ?? [];

    if (type === "pincode" || type === "business_pin_code")
      return pincode ?? [];

    return [];
  };

  const submitMiscellaneousData = () => {
    validateStateData();

    if (formValidated) {
      let postData = {};

      Object.keys(stateData).forEach((item) => {
        // Check if optional fields have data if not ommit the field

        if (stateData[item] !== "")
          postData[item.substring(item.indexOf("_vl_") + 4, item.length)] =
            stateData[item];
      });

      postData["loan_id"] = data.loan_id;

      postData["product_id"] = data.product_id;

      postData["company_id"] = data.company_id;

      dispatch(
        updateMiscDetailsWatcher(
          postData,
          (result) => {
            setDataAfterUpdate(postData);
            setDataUpdated(true);
            setResponseMessage(result.message);
            setErrorMessage("");
          },

          (error) => {
            setResponseMessage("");
            setErrorMessage(error.response.data.message);
          }
        )
      );
    }
  };

  const handleGetPincodes = async (value) => {
    const pincodesData = await getPincodeData(stateCityData, value);

    setPincodeState(pincodesData);
  };

  const handleGetCities = async (value) => {
    setCityState(Cities(value));
  };

  const dropDownChange = (value, name, type) => {
    setDataChanged(true);
    setResponseMessage("");
    setErrorMessage("");

    if (value === null || value === undefined) value = "";

    const stateDataElements = Object.keys(stateData);

    const stateName = stateDataElements.filter(
      (item) => item.indexOf("business_state") > -1
    )[0];

    const cityName = stateDataElements.filter(
      (item) => item.indexOf("business_city") > -1
    )[0];

    const pincodeName = stateDataElements.filter(
      (item) => item.indexOf("business_pin_code") > -1
    )[0];

    if (name === "business_state" && value !== undefined && value !== null) {
      setStateData((prevState) => ({
        ...prevState,

        [`${pincodeName}`]: "",

        [`${cityName}`]: ""
      }));

      setCityState([]);
      setPincodeState([]);
      handleGetCities(value);
    }

    if (name === "business_city" && value !== undefined && value !== null) {
      setStateData((prevState) => ({
        ...prevState,
        [`${pincodeName}`]: ""
      }));
      handleGetCities(value);
      handleGetPincodes(value);
    }

    setStateData((prevState) => ({
      ...prevState,

      [`${type}_vl_${name}`]: value.label
    }));

    const isValid = validateData(type, value?.value);

    setValidationData((prevState) => ({
      ...prevState,

      [`${type}_vl_${name}State`]: !isValid ? "has-danger" : ""
    }));
  };

  return (
    <>
      <div>
        <CustomFormPopup customHeaderStyle = {{marginBottom :"10px"}} onClose={handleClose} heading="Miscellaneous Data" isOpen={open} customStyles={{ width: "fit-content", display :"flex", flexDirection : "column" }}>
        <div style={{          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          width:"fit-content",
          marginLeft:"-0.625rem",
          marginTop:"14px"
}}>
           {fieldsToDisplayOnUI.length &&
              fieldsToDisplayOnUI.map((row , index) => {
                return (
                  <div key= {index} style={{display: "flex" , margin: "10px 10px 16px 10px"}}>
                    {row.title === "business_state" ||
                      row.title === "business_city" ? (
                      <>
                        <Typography style={{ fontSize: "12px" }}>
                          {`${row.title}`}{" "}
                          <span style={{ color: "red" }}>
                            {row.checked.toLowerCase() === "true" ? ` *` : ""}
                          </span>
                        </Typography>
                        <CustomDropdown
                          data={getDataByType(row.field)}
                          value={String(
                            stateData[`${row.type}_vl_${row.field}`] ?? ""
                          )}
                          id={row.id}
                          handleDropdownChange={(value) =>
                            dropDownChange(value, row.field, row.type)
                          }
                          helperText={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationmsg
                                : ""
                              : stateData[`${row.type}_vl_${row.field}`] !==
                              "" &&
                              (validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationmsg
                                : "")
                          }
                          error={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                              : stateData[`${row.type}_vl_${row.field}`] !==
                              "" &&
                              validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                          }
                        />
                      </>
                    ) : (
                      <>


                        <CustomInputBox
                          initialValue={stateData[`${row.type}_vl_${row.field}`]}
                          label={row.title}
                          error={row.checked.toLowerCase() === "true"
                          ? validationData[
                          `${row.type}_vl_${row.field}State`
                          ] === "has-danger"
                          : stateData[`${row.type}_vl_${row.field}`] !==
                          "" &&
                          validationData[
                          `${row.type}_vl_${row.field}State`
                          ] === "has-danger"
                             }
                          helperText={row.checked.toLowerCase() === "true"
                          ? validationData[
                            `${row.type}_vl_${row.field}State`
                          ] === "has-danger"
                            ? row.validationmsg
                            : ""
                          : stateData[`${row.type}_vl_${row.field}`] !==
                          "" &&
                          (validationData[
                            `${row.type}_vl_${row.field}State`
                          ] === "has-danger"
                            ? row.validationmsg
                            : "")}
                          onClick={(event) => { change(event ,`${row.type}_vl_${row.field}`) }}
                          isDrawdown={false}
                          customDropdownClass={inputBoxCss}
                          customClass= {inputCssBankDetail}
                        />


                      </>
                    )}
                  </div>
                );
              })}
          </div>
          <div style={{ display: "flex", marginLeft: "-2px", marginTop: "30px", justifyContent:"flex-end", width: "100%" }}>
               <div style={{flexDirection: "row", display: "flex"}}>
              <CustomButton label="Update" buttonType="primary" customStyle={{ height: "42px", fontSize: "14px", padding: "8px", width: "85px" }} onClick={submitMiscellaneousData} />
              <CustomButton label="Reset" buttonType="secondary" customStyle={{ color: "red", border: "1px solid red", height: "42px", fontSize: "14px", fontWeight: "600", padding: "8px", width: "85px" }} onClick={setInitialData} />
              <Typography
                style={{
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <span style={{ color: "green" }}>{responseMessage}</span>


                <span style={{ color: "red" }}>{errorMessage}</span>
              </Typography>
            </div>
            </div>
        </CustomFormPopup>
      </div>
    </>
  );
}
