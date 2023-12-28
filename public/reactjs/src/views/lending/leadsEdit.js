import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { validateData } from "../../util/validation";
import {
  fetchLoanSchemaCustomWatcher,
  getAllLoanBookingTemplateWatcher,
} from "../../actions/loanBooking";
import {
  loanRequestFormPutWatcher,
  getLeadDataByLoanAppIdWatcher,
} from "../../actions/loanRequest";
import { stateCityWatcher } from "../../actions/stateCity";
import {
  getStatesData,
  getPincodeData,
  Cities,
  States,
} from "../../constants/country-state-city-data";
import { useSelector } from "react-redux";
import AlertDialog from "../../components/DialogBox/alertDialog.js";
import { AlertBox } from "../../components/AlertBox";
import EditableAccordian from "react-sdk/dist/components/EditableAccordian";
import Button from "react-sdk/dist/components/Button";

export default function LoanRequest(props) {
  const history = useHistory();
  const location = useLocation();
  const locationData = location?.state?.selectedRow;
  const { text, ...other } = props;
  const [loanTemplate, setLoanTemplate] = useState([]);
  const [fieldMapper, setFieldMapper] = useState({});
  const [loan_custom_templates_id, setLoan_custom_templates_id] = useState("");
  const [loanRequest, setLoanRequest] = useState({});
  const [stateData, setStateData] = useState({});
  const [validationData, setValidationData] = useState({});
  const [loanId, setLoanId] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [stateCityData, setStateCityDataStates] = useState([]);
  const [states, setStatesState] = useState(States ?? []);
  const [city, setCityState] = useState([]);
  const [pincode, setPincodeState] = useState([]);
  const [expanded, setExpanded] = useState("panel0");
  const stateCity = useSelector((state) => state?.stateCity?.stateCityData);
  const { loan_app_id, company_id, product_id, loan_schema_id } = useParams();
  const dispatch = useDispatch();
  //Alert Dialog
  const [alertTitle, setAlertTitle] = useState("");
  const [alertContent, setAlertContent] = useState("");
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [isDisabledSubmitBtn, setIsDisabledSubmitBtn] = useState(false);
  const [structuredArray, setStructuredArray] = useState([]);

  let mappingFieldsTobeDisabled =
    "partner_loan_app_id partner_borrower_id loan_app_id borrower_id";
  let mappingFieldsAutoFill =
    "partner_loan_app_id partner_borrower_id loan_app_id borrower_id";

  const handleChange = (panel) => {
    expanded !== panel ? setExpanded(panel) : setExpanded(false);
  };

  useEffect(() => {
    if (company_id && product_id && loan_app_id) {
      dispatch(
        getLeadDataByLoanAppIdWatcher(
          {
            company_id,
            product_id,
            loan_app_id,
          },
          (response) => {
            setLoanRequest(response);
          },
          (error) => {
            showAlert(error.response.data.message, "error");
            setTimeout(() => {
              handleAlertClose();
            }, 4000);
          }
        )
      );
    } else {
      showAlert("Something went wrong", "error");
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
    }
  }, []);

  useEffect(() => {
    if (loan_custom_templates_id && loanRequest) {
      getTemplate("lead");
    }
  }, [loan_custom_templates_id, loanRequest]);

  useEffect(() => {
    if (loan_schema_id) {
      dispatch(
        fetchLoanSchemaCustomWatcher(
          {
            loan_schema_id: loan_schema_id,
          },
          (result) => {
            setLoan_custom_templates_id(result.loan_custom_templates_id);
          },
          (error) => {}
        )
      );
    } else {
      setLoan_custom_templates_id("");
      setLoanTemplate([]);
      setStateData({});
      setValidationData({});
    }
  }, [loan_schema_id]);

  const moveArryElement = (arr, old_index, new_index) => {
    while (old_index < 0) {
      old_index += arr.length;
    }

    while (new_index < 0) {
      new_index += arr.length;
    }

    if (new_index >= arr.length) {
      let k = new_index - arr.length;
      while (k-- + 1) {
        arr.push(undefined);
      }
    }

    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  };

  const getTemplate = (templatName) => {
    dispatch(
      getAllLoanBookingTemplateWatcher(
        {
          loan_custom_templates_id,
          templatName,
        },
        (response) => {
          const dataObj = {};
          const dataValidationObj = {};
          const data = response.filter((item) => item.checked === "TRUE");
          const stateIndex = data.findIndex((x) => x.field === "state");
          const cityIndex = data.findIndex((x) => x.field === "city");
          const perCityIndex = data.findIndex((x) => x.field === "per_city");
          const perStateIndex = data.findIndex((x) => x.field === "per_state");
          moveArryElement(
            data,
            cityIndex,
            stateIndex,
            perCityIndex,
            perStateIndex
          );
          const pinecodeeIndex = data.findIndex((x) => x.field === "pincode");

          let fieldDepartmentMapper = {};
          const stateDataMapped = data
            .filter((item) => item.checked === "TRUE")
            .forEach((item) => {
              // get data as departments
              if (!fieldDepartmentMapper[item.dept]) {
                fieldDepartmentMapper[item.dept] = {};
                fieldDepartmentMapper[item.dept] = [];
              }
              fieldDepartmentMapper[item.dept].push(item);

              let value = "";
              if (mappingFieldsAutoFill.indexOf(item.field) > -1) {
                value = loanRequest[item.field];
              }

              value = loanRequest[item.field];

              dataObj[`${item.type}_vl_${item.field}`] = value;
              dataValidationObj[`${item.type}_vl_${item.field}State`] = "";
            });
          const modifiedResponse = response.map((item) => {
            if (item.title === "Date Of Birth") {
              return { ...item, title: "Date Of Birth (YYYY-MM-DD)" };
            }
            return item;
          });
          setStructuredArray(convertToStructuredArray(modifiedResponse));
          setFieldMapper(fieldDepartmentMapper);
          setLoanTemplate(data);
          setStateData(dataObj);
          setValidationData(dataValidationObj);
        },
        (error) => {
          setLoanTemplate([]);
          setStateData({});
          setValidationData({});
        }
      )
    );
  };

  const convertToStructuredArray = (inputArray) => {
    const outputArray = [];
    inputArray.forEach((item) => {
      if (item.checked === "TRUE") {
        if (item.field === "per_pincode") {
          item.title = "Per Pincode";
        }
        const { dept, ...rest } = item;
        const existingDeptObject = outputArray.find(
          (obj) => obj.title === dept
        );

        if (existingDeptObject) {
          // Find the index of the "city" field if it exists
          const cityIndex = existingDeptObject.data.findIndex(
            (obj) => obj.field === "city"
          );

          if (cityIndex !== -1) {
            // Insert the "state" field before the "city" field
            existingDeptObject.data.splice(cityIndex, 0, rest);
          } else {
            existingDeptObject.data.push(rest);
          }
        } else {
          outputArray.push({ title: dept, data: [rest] });
        }
      }
    });
    return outputArray;
  };
  const change = (e) => {
    const { name, value } = e.target;
    const isValid = validateData(
      name.substring(0, name.indexOf("_vl_")).toLowerCase(),
      value
    );
    setStateData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setValidationData((prevState) => ({
      ...prevState,
      [`${name}State`]: !isValid ? "has-danger" : "",
    }));
  };

  const handleNextStage = (url) => {
    url.length > 0 ? (url = url) : (url = "/admin/lending/leads");
    history.push(url);
  };

  const submitLoanRequest = () => {
    let formValidated = true;
    Object.keys(stateData).forEach((item) => {
      if (
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
      setIsDisabledSubmitBtn(true);
      const options = {
        company_id: company_id,
        product_id: product_id,
        loan_schema_id: loan_schema_id,
      };
      const postData = {};
      Object.keys(stateData).forEach((item) => {
        postData[item.substring(item.indexOf("_vl_") + 4, item.length)] =
          stateData[item];
      });
      dispatch(
        loanRequestFormPutWatcher(
          {
            options,
            postData,
          },
          (response) => {
            setIsDisabledSubmitBtn(false);
            handleAlertDilogOpen(
              "Leads data Updated Successfully!",
              response.message
            );
          },
          (error) => {
            setIsDisabledSubmitBtn(false);
            showAlert(error.response.data.message, "error");
            setTimeout(() => {
              handleAlertClose();
            }, 4000);
          }
        )
      );
    } else {
      showAlert("Kindly check for errors in fields", "error");
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
    }
  };

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
  };
  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleGetCities = async (value) => {
    setCityState(Cities(value));
  };

  const handleGetPincodes = async (value) => {
    const pincodesData = await getPincodeData(stateCityData, value);
    setPincodeState(pincodesData);
  };

  const handleAlertDilogOpen = (title, content) => {
    setAlertTitle(title);
    setAlertContent(content);
    setAlertDialogOpen(true);
  };
  const handleAlertDilogClose = () => {
    setAlertDialogOpen(false);
    handleNextStage("/admin/lending/leads");
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
      handleGetCities(value);
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

  const getStatseData = async (data) => {
    const statesData = await getStatesData(data);
    setStatesState(statesData);
  };

  const handleGetStateCity = async () => {
    dispatch(
      stateCityWatcher(
        {},
        (response) => {
          setStateCityDataStates(response);
          getStatseData(response);
        },
        (error) => {}
      )
    );
  };

  React.useEffect(() => {
    if (states?.length) {
      const tempState = states.filter(
        (obj) => obj.name === loanRequest["state"]
      )[0];
      handleGetCities(tempState);
    }
  }, [states]);

  const getDataByType = (type) => {
    if (type === "state") return states ?? [];
    if (type === "city") return city ?? [];
    if (type === "pincode") return pincode ?? [];
    return [];
  };

  // const renderFields = (title, fields, panelId) => (
  //   <Grid
  //     item
  //     xs={12}
  //     sx={{
  //       m: "0.5rem"
  //     }}
  //     key={panelId}
  //   >
  //     <Accordion
  //       expanded={expanded === "panel" + panelId}
  //       onChange={() => {
  //         handleChange("panel" + panelId);
  //       }}
  //     >
  //       <AccordionSummary
  //         expandIcon={<ExpandMoreIcon />}
  //         aria-controls="pane{index}bh-content"
  //         id="panel{index}bh-header"
  //       >
  //         <Typography variant="h6" component="h2" style={{ fontSize: "18px" }}>

  //           {`${title || "NA"}`}
  //         </Typography>
  //       </AccordionSummary>
  //       <AccordionDetails>
  //         <Grid xs={12} container>

  //           {fields &&
  //             fields.map((row, index) => {
  //               return (
  //                 <Grid xs={12} md={4} item key={`${row.type}_vl_${row.field}`}>
  //                   <FormControl
  //                     sx={{
  //                       m: 1,
  //                       width: "100%"
  //                     }}
  //                     variant="standard"
  //                   >

  //                     {row.field === "state" || row.field === "city" ? (
  //                       <CustomDropdown
  //                         placeholder={row.title}
  //                         data={getDataByType(row.field)}
  //                         value={String(
  //                           stateData[`${row.type}_vl_${row.field}`] ?? ""
  //                         )}
  //                         id={row.id}
  //                         handleDropdownChange={value =>
  //                           dropDownChange(value, row.field)
  //                         }
  //                         helperText={
  //                           validationData[
  //                             `${row.type}_vl_${row.field}State`
  //                           ] === "has-danger"
  //                             ? row.validationmsg
  //                             : ""
  //                         }
  //                         error={
  //                           validationData[
  //                           `${row.type}_vl_${row.field}State`
  //                           ] === "has-danger"
  //                         }
  //                       />
  //                     ) : (
  //                       <TextField
  //                         variant="standard"
  //                         label={row.title}
  //                         type="text"
  //                         name={`${row.type}_vl_${row.field}`}
  //                         error={
  //                           validationData[
  //                           `${row.type}_vl_${row.field}State`
  //                           ] === "has-danger"
  //                         }
  //                         helperText={
  //                           validationData[
  //                             `${row.type}_vl_${row.field}State`
  //                           ] === "has-danger"
  //                             ? row.validationmsg
  //                             : ""
  //                         }
  //                         placeholder={row.title}
  //                         value={stateData[`${row.type}_vl_${row.field}`]}
  //                         onChange={change}
  //                         disabled={
  //                           mappingFieldsTobeDisabled.indexOf(
  //                             `${row.type}_vl_${row.field}`
  //                           ) > -1
  //                         }
  //                       />
  //                     )}
  //                   </FormControl>
  //                 </Grid>
  //               );
  //             })}
  //         </Grid>
  //       </AccordionDetails>
  //     </Accordion>
  //   </Grid>
  // );

  return (
    <>
      {alert ? (
        <AlertBox
          severity={severity}
          msg={alertMessage}
          onClose={handleAlertClose}
        />
      ) : null}
      {alertDialogOpen ? (
        <AlertDialog
          open={alertDialogOpen}
          title={alertTitle}
          content={alertContent}
          handleAlertDilogClose={handleAlertDilogClose}
        />
      ) : null}
      <div style={{ margin: "24px 24px 24px -10px" }}>
        <div>
          <EditableAccordian
            accordionData={structuredArray}
            onChange={change}
            stateData={stateData}
            customClass={{
              width: "98%",
              marginLeft: "2%",
              alignSelf: "center",
            }}
            validationData={validationData}
            dropDownChange={dropDownChange}
            states={states}
            city={city}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1.5rem",
          }}
        >
          <Button
            buttonType="secondary"
            customStyle={{
              height: "48px",
              width: "90px",
              borderRadius: "1.625rem",
              color: "#475BD8",
              padding: "0.75rem 1.5rem",
              fontWeight: "600",
              border: "1px solid #475BD8",
              boxShadow: "none",
            }}
            label="Back"
            onClick={(e) => handleNextStage(e)}
          />
          {loanTemplate.length ? (
            <Button
              buttonType="primary"
              customStyle={{
                height: "48px",
                width: "109px",
                borderRadius: "1.625rem",
                backgroundColor: "#475BD8",
                padding: "0.75rem 1.5rem",
                fontWeight: "600",
              }}
              disabled={isDisabledSubmitBtn}
              label="Submit"
              onClick={(e) => submitLoanRequest(e)}
            />
          ) : null}
        </div>
      </div>
    </>
  );
}
