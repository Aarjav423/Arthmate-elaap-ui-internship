import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Grid,
  CardContent,
  Typography,
  FormControl,
  TextField,
  Box,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import { validateData } from "../../util/validation";
import SelectCompany from "../../components/Company/SelectCompany";
import SelectProduct from "components/Product/SelectProduct";
import BasicDatePicker from "../../components/DatePicker/basicDatePicker";
import {
  fetchLoanSchemaCustomWatcher,
  getAllLoanBookingTemplateWatcher
} from "../../actions/loanBooking";
import { loadTemplateEnumsWatcher } from "../../actions/loanSchema";
import { loanRequestFormPostWatcher } from "../../actions/loanRequest";
import CustomDropdown from "../../components/custom/customSelect";
import EnumDropdown from "../../components/Dropdowns/EnumDropdown";
import { stateCityWatcher } from "../../actions/stateCity";
import {
  getStatesData,
  getPincodeData,
  States,
  Cities
} from "../../constants/country-state-city-data";
import { useSelector } from "react-redux";
import { AlertBox } from "../../components/AlertBox";
import moment from "moment";
import { verifyDateAfter1800 } from "../../util/helper";
import Button from "react-sdk/dist/components/Button/Button"
import InputBox from "react-sdk/dist/components/InputBox/InputBox"
import "react-sdk/dist/styles/_fonts.scss";
import TRASH from "./images/trash.svg"

export default function LoanRequest(props) {
  const history = useHistory();
  const { text, ...other } = props;
  const [partner, setPartner] = useState({});
  const [company, setCompany] = useState("");
  const [product, setProduct] = useState("");
  const [loanTemplate, setLoanTemplate] = useState([]);
  const [productData, setProductData] = useState({});
  const [loan_custom_templates_id, setLoan_custom_templates_id] = useState("");
  const [stateData, setStateData] = useState({});
  const [validationData, setValidationData] = useState({});
  const [loanId, setLoanId] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [stateCityData, setStateCityDataStates] = useState([]);
  const [states, setStatesState] = useState(States);
  const [city, setCityState] = useState([]);
  const [busAddCorrCity, setBusAddCorrCity] = useState([]);
  const [busPerCity, setBusPerCity] = useState([]);
  const [perCity, setPerCity] = useState([]);
  const [pincode, setPincodeState] = useState([]);
  const [isDisabledSubmitBtn, setIsDisabledSubmitBtn] = useState(false);
  const [enumFields, setEnumFields] = useState([]);
  const stateCity = useSelector(state => state?.stateCity?.stateCityData);
  const [stateDataDisabled, setStateDataDisabled] = useState({});
  const [forms, setForms] = useState([]);
  const [coBorrCount, setCoBorrCount] = useState(0);
  const [guaranterCount, setGuaranterCount] = useState(0);
  const [generalCity, setGeneralCity] = useState([]);
  const [checkboxStates, setCheckboxStates] = useState(forms.map(() => false));
  const [checkObjectArr, setCheckObjectArr] = useState([]);
  const dispatch = useDispatch();

  const [copyDataMapping, setCopyDataMapping] = useState({
    same_as_corr: {
      bus_add_corr_line1: "bus_add_per_line1",
      bus_add_corr_line2: "bus_add_per_line2",
      bus_add_corr_state: "bus_add_per_state",
      bus_add_corr_city: "bus_add_per_city",
      bus_add_corr_pincode: "bus_add_per_pincode"
    },
    same_as_bus: {
      bus_pan: "appl_pan",
      bus_add_corr_line1: "resi_addr_ln1",
      bus_add_corr_line2: "resi_addr_ln2",
      bus_add_corr_state: "state",
      bus_add_corr_city: "city",
      bus_add_corr_pincode: "pincode",
      bus_add_per_line1: "per_addr_ln1",
      bus_add_per_line2: "per_addr_ln2",
      bus_add_per_state: "per_state",
      bus_add_per_city: "per_city",
      bus_add_per_pincode: "per_pincode"
    },
    same_as_res: {
      resi_addr_ln1: "per_addr_ln1",
      resi_addr_ln2: "per_addr_ln2",
      state: "per_state",
      city: "per_city",
      pincode: "per_pincode"
    }
  });

  const UIFieldMapping = {
    'co_borr_1_DOB': "cb1_dob",
    'co_borr_1_aadhaar': "cb1_aadhaar",
    'co_borr_1_father_first_name': "cb1_father_fname",
    'co_borr_1_father_last_name': "cb1_father_lname",
    'co_borr_1_father_middle_name': "cb1_father_mname",
    'co_borr_1_first_name': "cb1_fname",
    'co_borr_1_gender': "cb1_gender",
    'co_borr_1_is_guarantor_check': "cb1_is_guar",
    'co_borr_1_last_name': "cb1_lname",
    'co_borr_1_middle_name': "cb1_mname",
    'co_borr_1_monthly_income': "cb1_monthly_income",
    'co_borr_1_pan': "cb1_pan",
    'co_borr_1_per_add_line1': "cb1_per_addr_ln1",
    'co_borr_1_per_add_line2': "cb1_per_addr_ln2",
    'co_borr_1_per_city': "cb1_per_city",
    'co_borr_1_per_pincode': "cb1_per_pincode",
    'co_borr_1_per_state': "cb1_per_state",
    'co_borr_1_phone': "cb1_phone",
    'co_borr_1_res_add_line1': "cb1_resi_addr_ln1",
    'co_borr_1_res_add_line2': "cb1_resi_addr_ln2",
    'co_borr_1_res_city': "cb1_city",
    'co_borr_1_res_pincode': "cb1_pincode",
    'co_borr_1_res_state': "cb1_state",
    'co_borr_2_DOB': "cb2_pan",
    'co_borr_2_aadhaar': "cb2_aadhaar",
    'co_borr_2_father_first_name': "cb2_father_fname",
    'co_borr_2_father_last_name': "cb2_father_lname",
    'co_borr_2_father_middle_name': "cb2_father_mname",
    'co_borr_2_first_name': "cb2_fname",
    'co_borr_2_gender': "cb2_gender",
    'co_borr_2_is_guarantor_check': "cb2_is_guar",
    'co_borr_2_last_name': "cb2_lname",
    'co_borr_2_middle_name': "cb2_mname",
    'co_borr_2_monthly_income': "cb2_monthly_income",
    'co_borr_2_pan': "cb2_pan",
    'co_borr_2_per_add_line1': "cb2_per_addr_ln1",
    'co_borr_2_per_add_line2': "cb2_per_addr_ln2",
    'co_borr_2_per_city': "cb2_per_city",
    'co_borr_2_per_pincode': "cb2_per_pincode",
    'co_borr_2_per_state': "cb2_per_state",
    'co_borr_2_phone': "cb2_phone",
    'co_borr_2_res_add_line1': "cb2_resi_addr_ln1",
    'co_borr_2_res_add_line2': "cb2_resi_addr_ln2",
    'co_borr_2_res_city': "cb2_city",
    'co_borr_2_res_pincode': "cb2_pincode",
    'co_borr_2_res_state': "cb2_state",
    'co_borr_2_per_add_line1': "cb2_per_addr_ln1",
    'co_borr_2_per_add_line2': "cb2_per_addr_ln2",
    'co_borr_2_per_city': "cb2_per_city",
    'co_borr_2_per_pincode': "cb2_per_pincode",
    'co_borr_2_per_state': "cb2_per_state",
    'co_borr_3_DOB': "cb3_dob",
    'co_borr_3_aadhaar': "cb3_aadhaar",
    'co_borr_3_father_first_name': "cb3_father_fname",
    'co_borr_3_father_last_name': "cb3_father_lname",
    'co_borr_3_father_middle_name': "cb3_father_mname",
    'co_borr_3_first_name': "cb3_fname",
    'co_borr_3_gender': "cb3_gender",
    'co_borr_3_is_guarantor_check': "cb3_is_guar",
    'co_borr_3_last_name': "cb3_lname",
    'co_borr_3_middle_name': "cb3_mname",
    'co_borr_3_monthly_income': "cb3_monthly_income",
    'co_borr_3_pan': "cb3_pan",
    'co_borr_3_per_add_line1': "cb3_per_addr_ln1",
    'co_borr_3_per_add_line2': "cb3_per_addr_ln2",
    'co_borr_3_per_city': "cb3_per_city",
    'co_borr_3_per_pincode': "cb3_per_pincode",
    'co_borr_3_per_state': "cb3_per_state",
    'co_borr_3_phone': "cb3_phone",
    'co_borr_3_res_add_line1': "cb3_resi_addr_ln1",
    'co_borr_3_res_add_line2': "cb3_resi_addr_ln2",
    'co_borr_3_res_city': "cb3_city",
    'co_borr_3_res_pincode': "cb3_pincode",
    'co_borr_3_res_state': "cb3_state",
    'co_borr_3_per_add_line1': "cb3_per_addr_ln1",
    'co_borr_3_per_add_line2': "cb3_per_addr_ln2",
    'co_borr_3_per_city': "cb3_per_city",
    'co_borr_3_per_pincode': "cb3_per_pincode",
    'co_borr_3_per_state': "cb3_per_state",
    'guarantor_1_DOB': "gua1_gender",
    'guarantor_1_aadhaar': "gua1_aadhaar",
    'guarantor_1_father_first_name': "gua1_father_fname",
    'guarantor_1_father_last_name': "gua1_father_lname",
    'guarantor_1_father_middle_name': "gua1_father_mname",
    'guarantor_1_first_name': "gua1_fname",
    'guarantor_1_gender': "gua1_gender",
    'guarantor_1_last_name': "gua1_lname",
    'guarantor_1_middle_name': "gua1_mname",
    'guarantor_1_monthly_income': "gua1_monthly_income",
    'guarantor_1_pan': "gua1_pan",
    'guarantor_1_per_add_line1': "gua1_per_addr_ln1",
    'guarantor_1_per_add_line2': "gua1_per_addr_ln2",
    'guarantor_1_per_city': "gua1_per_city",
    'guarantor_1_per_pincode': "gua1_per_pincode",
    'guarantor_1_per_state': "gua1_per_state",
    'guarantor_1_phone': "gua1_phone",
    'guarantor_2_DOB': "gua2_dob",
    'guarantor_2_aadhaar': "gua2_aadhaar",
    'guarantor_2_father_first_name': "gua2__father_fname",
    'guarantor_2_father_last_name': "gua2_father_lname",
    'guarantor_2_father_middle_name': "gua2_father_mname",
    'guarantor_2_first_name': "gua2_fname",
    'guarantor_2_gender': "gua2_gender",
    'guarantor_2_last_name': "gua2_lname",
    'guarantor_2_middle_name': "gua2_mname",
    'guarantor_2_monthly_income': "gua2_monthly_income",
    'guarantor_2_pan': "gua2_pan",
    'guarantor_2_per_add_line1': "gua2_per_addr_ln1",
    'guarantor_2_per_add_line2': "gua2_per_addr_ln2",
    'guarantor_2_per_city': "gua2_per_city",
    'guarantor_2_per_pincode': "gua2_per_pincode",
    'guarantor_2_per_state': "gua2_per_state",
    'guarantor_2_phone': "gua2_phone",
    'guarantor_2_res_add_line1': "gua2_resi_addr_ln1",
    'guarantor_2_res_add_line2': "gua2_resi_addr_ln2",
    'guarantor_2_res_city': "gua2_city",
    'guarantor_2_res_pincode': "gua2_pincode",
    'guarantor_2_res_state': "gua2_state"
  }

  const addBorrowerGuaranteerCount = (type) => {
    if (type === "co_borr") {
      if (coBorrCount === 3) {
        setAlert(true);
        setSeverity("error");
        setAlertMessage("Maximum 3 Co-Borrowers are allowed");
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
        return
      }
    }
    if (type === "guarantor") {
      if (guaranterCount === 2) {
        setAlert(true);
        setSeverity("error");
        setAlertMessage("Maximum 2 Guarantors are allowed");
        setTimeout(() => {
          handleAlertClose();
        }, 4000);
        return;
      }
    }
    let iteration_number = type === "co_borr" ? coBorrCount : guaranterCount
    const newFormObject = {
      [`${type}_${iteration_number + 1}_first_name`]: '',
      [`${type}_${iteration_number + 1}_middle_name`]: '',
      [`${type}_${iteration_number + 1}_last_name`]: '',
      [`${type}_${iteration_number + 1}_father_first_name`]: '',
      [`${type}_${iteration_number + 1}_father_middle_name`]: '',
      [`${type}_${iteration_number + 1}_father_last_name`]: '',
      [`${type}_${iteration_number + 1}_res_add_line1`]: '',
      [`${type}_${iteration_number + 1}_res_add_line2`]: '',
      [`${type}_${iteration_number + 1}_res_state`]: '',
      [`${type}_${iteration_number + 1}_res_city`]: '',
      [`${type}_${iteration_number + 1}_res_pincode`]: '',
      [`${type}_${iteration_number + 1}_per_add_line1`]: '',
      [`${type}_${iteration_number + 1}_per_add_line2`]: '',
      [`${type}_${iteration_number + 1}_per_state`]: '',
      [`${type}_${iteration_number + 1}_per_city`]: '',
      [`${type}_${iteration_number + 1}_per_pincode`]: '',
      [`${type}_${iteration_number + 1}_aadhaar`]: '',
      [`${type}_${iteration_number + 1}_pan`]: '',
      [`${type}_${iteration_number + 1}_phone`]: '',
      [`${type}_${iteration_number + 1}_gender`]: '',
      [`${type}_${iteration_number + 1}_DOB`]: '',
      [`${type}_${iteration_number + 1}_monthly_income`]: '',
      [`${type}_${iteration_number + 1}_is_guarantor_check`]: '',
      "type": type,
      "count": (type === "co_borr" ? coBorrCount + 1 : guaranterCount + 1)
    };
    Object.keys(newFormObject).forEach(item => {
      if (item === "type" || item === "count") return
      setStateData(prevState => ({
        ...prevState,
        [`${keyToReturn(item)}`]: ""
      }));
      setValidationData(prevState => ({
        ...prevState,
        [`${keyToReturn(item)}State`]: ""
      }));
    })
    if (type === "co_borr") {
      setCoBorrCount(coBorrCount + 1);
    } else if (type === "guarantor") {
      setGuaranterCount(guaranterCount + 1);
    }
    setForms([...forms, newFormObject]);
  };
  const keyToReturn = (item) => {
    if (
      item.split("_").pop() === "line1" ||
      item.split("_").pop() === "line2" ||
      item.split("_").pop() === "name" ||
      item.split("_").pop() === "state" ||
      item.split("_").pop() === "gender" ||
      item.split("_").pop() === "is_guarantor_check" ||
      item.split("_").pop() === "city") {
      return `string_vl_${item}`;
    }
    if (
      item.split("_").pop() === "phone") {
      return `mobile_vl_${item}`;
    }
    if (
      item.split("_").pop() === "pincode") {
      return `pincode_vl_${item}`;
    }
    if (
      item.split("_").pop() === "pan") {
      return `pan_vl_${item}`;
    }
    if (
      item.split("_").pop() === "DOB") {
      return `date_vl_${item}`;
    }
    if (
      item.split("_").pop() === "aadhaar") {
      return `aadhaar_vl_${item}`;
    }
    if (
      item.split("_").pop() === "monthly_income") {
      return `number_vl_${item}`;
    }



  }
  const deleteLastFormOfType = (typeToDelete) => {
    const formsCopy = [...forms];
    let count;
    for (let i = formsCopy.length - 1; i >= 0; i--) {
      if (formsCopy[i].type === typeToDelete) {
        count = formsCopy[i].count
        formsCopy.splice(i, 1);
        setForms(formsCopy);
        break;
      }
    }
    if (typeToDelete === "co_borr") {
      let tempBorrCount = coBorrCount - 1
      setCoBorrCount(tempBorrCount);
    } else if (typeToDelete === "guarantor") {
      let tempCount = guaranterCount - 1
      setGuaranterCount(tempCount);
    }
    const newFormObject = {
      [`${typeToDelete}_${count}_first_name`]: '',
      [`${typeToDelete}_${count}_middle_name`]: '',
      [`${typeToDelete}_${count}_last_name`]: '',
      [`${typeToDelete}_${count}_father_first_name`]: '',
      [`${typeToDelete}_${count}_father_middle_name`]: '',
      [`${typeToDelete}_${count}_father_last_name`]: '',
      [`${typeToDelete}_${count}_res_add_line1`]: '',
      [`${typeToDelete}_${count}_res_add_line2`]: '',
      [`${typeToDelete}_${count}_res_state`]: '',
      [`${typeToDelete}_${count}_res_city`]: '',
      [`${typeToDelete}_${count}_res_pincode`]: '',
      [`${typeToDelete}_${count}_per_add_line1`]: '',
      [`${typeToDelete}_${count}_per_add_line2`]: '',
      [`${typeToDelete}_${count}_per_state`]: '',
      [`${typeToDelete}_${count}_per_city`]: '',
      [`${typeToDelete}_${count}_per_pincode`]: '',
      [`${typeToDelete}_${count}_aadhaar`]: '',
      [`${typeToDelete}_${count}_pan`]: '',
      [`${typeToDelete}_${count}_phone`]: '',
      [`${typeToDelete}_${count}_gender`]: '',
      [`${typeToDelete}_${count}_DOB`]: '',
      [`${typeToDelete}_${count}_monthly_income`]: '',
      [`${typeToDelete}_${count}_is_guarantor_check`]: ''
    };
    const stateDataCopy = { ...stateData };
    const validationDataCopy = { ...validateData };
    Object.keys(newFormObject).forEach(item => {
      delete stateDataCopy[keyToReturn(item)];
      delete validationDataCopy[`${keyToReturn(item)}State`];
    })
    setStateData(stateDataCopy)
    setValidationData(validationDataCopy)
  };

  const copyResFieldsToPerFields = (event, type, countNumber) => {
    const fieldsToCopy = [
      'add_line1',
      'add_line2',
      'state',
      'city',
      'pincode',
    ];
    if (!event.target.checked) {//making uncheck
      let stateDataCopy = { ...stateData };
      let validationDataCopy = { ...validateData };
      fieldsToCopy.forEach(item => {
        stateDataCopy[keyToReturn(`${type}_${countNumber}_per_${item}`)] = ""
        validationDataCopy[`${keyToReturn(`${type}_${countNumber}_per_${item}`)}State`] = ""
      })
      setStateData(stateDataCopy)
      setValidationData(validationDataCopy)
    } else { //checked
      let stateDataCopy = { ...stateData };
      fieldsToCopy.forEach(item => {
        stateDataCopy[keyToReturn(`${type}_${countNumber}_per_${item}`)] = stateDataCopy[keyToReturn(`${type}_${countNumber}_res_${item}`)]
      })
      setStateData(stateDataCopy)
    }
  };


  useEffect(() => {
    dispatch(
      loadTemplateEnumsWatcher(
        {
          templates: ["lead", "loan", "loandocument"]
        },
        result => {
          setEnumFields(result.data);
        },
        error => { }
      )
    );
  }, []);

  useEffect(() => {
    if (loan_custom_templates_id) getTemplate("lead");
  }, [loan_custom_templates_id]);

  useEffect(() => {
    setLoanCustomTemplateId(product);
  }, [product]);

  useEffect(() => {
    const url = `/admin/lending/additionalinfo/${company.value}/${product.value}/${loanId}`;
    if (company.value && product.value && loanId) {
      handleNextStage(url);
    }
  }, [loanId]);

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

  const getTemplate = templatName => {
    dispatch(
      getAllLoanBookingTemplateWatcher(
        {
          loan_custom_templates_id,
          templatName
        },
        response => {
          const dataObj = {};
          const dataValidationObj = {};
          const data = response.filter(
            item => item.checked === "TRUE" || item.displayOnUI === "TRUE"
          );

          const stateIndex = data.findIndex(x => x.field === "state");
          const cityIndex = data.findIndex(x => x.field === "city");
          moveArryElement(data, cityIndex, stateIndex);
          const pinecodeeIndex = data.findIndex(x => x.field === "pincode");

          const stateDataMapped = response
            .filter(
              item => item.checked === "TRUE" || item.displayOnUI === "TRUE"
            )
            .forEach(item => {
              dataObj[`${item.type}_vl_${item.field}`] = "";
              dataValidationObj[`${item.type}_vl_${item.field}State`] = "";
            });

          setLoanTemplate(data);
          setStateData(dataObj);
          setValidationData(dataValidationObj);
        },
        error => {
          setLoanTemplate([]);
          setStateData({});
          setValidationData({});
        }
      )
    );
  };

  const setLoanCustomTemplateId = product => {
    if (product?.loan_schema_id) {
      dispatch(
        fetchLoanSchemaCustomWatcher(
          { loan_schema_id: product.loan_schema_id },
          result => {
            setLoan_custom_templates_id(result.loan_custom_templates_id);
            setForms([]);
            setCoBorrCount(0);
            setGuaranterCount(0);
          },
          error => { }
        )
      );
    } else {
      setLoan_custom_templates_id("");
      setLoanTemplate([]);
      setStateData({});
      setValidationData({});
    }
  };

  const change = (e, type, name) => {
    const value = e.value;
    let field = `${type}_vl_${name}`
    let isValid = validateData(
      field.substring(0, field.indexOf("_vl_")).toLowerCase(),
      value
    );
    if (field === "string_vl_per_addr_ln1") {
      if (value.length <= 4) {
        isValid = false;
      }
    }
    setStateData(prevState => ({
      ...prevState,
      [field]: value
    }));
    setValidationData(prevState => ({
      ...prevState,
      [`${field}State`]: !isValid ? "has-danger" : ""
    }));
  };

  const changeDateSelected = (value, name) => {
    const date = verifyDateAfter1800(moment(value).format("YYYY-MM-DD"))
      ? moment(value).format("YYYY-MM-DD")
      : value;
    const isValid = validateData(
      name.substring(0, name.indexOf("_vl_")).toLowerCase(),
      date
    );
    setStateData(prevState => ({
      ...prevState,
      [name]: date
    }));
    setValidationData(prevState => ({
      ...prevState,
      [`${name}State`]: !isValid ? "has-danger" : ""
    }));
  };

  const handleNextStage = url => {
    history.push(url);
  };

  const customFieldValidation = (item, value) => {
    if (
      !validateData(
        item.substring(0, item.indexOf("_vl_")).toLowerCase(),
        value
      )
    ) {
      return false
    } else {
      return true;
    }
  };

  const submitLoanRequest = () => {
    setIsDisabledSubmitBtn(true);
    let formValidated = true;

    Object.keys(stateData).forEach(item => {
      const currentField = loanTemplate.filter(ltItem => {
        return ltItem.field === item.substring(item.indexOf("_vl_") + 4);
      });
      if (currentField.length === 0) {
        if (!customFieldValidation(item, stateData[item])) {
          setValidationData(prevState => ({
            ...prevState,
            [`${item}State`]: "has-danger"
          }));
          formValidated = false;
          setIsDisabledSubmitBtn(false);
        }
      } else {
        if (
          currentField[0]?.checked.toLowerCase() === "true" ||
          (currentField[0]?.checked.toLowerCase() === "false" &&
            stateData[item] !== "")
        ) {
          let notOptionalEnum = currentField[0].isOptional.toLowerCase() === "false" && enumFields?.lead.hasOwnProperty(currentField[0].field);
          let emptyOptionalEnum = currentField[0].isOptional.toLowerCase() === "true" && enumFields?.lead.hasOwnProperty(currentField[0].field) && stateData[item] !== "";
          let nonEnum = !enumFields?.lead.hasOwnProperty(currentField[0].field);
          if (notOptionalEnum || emptyOptionalEnum || nonEnum) {
            if (
              !validateData(
                item.substring(0, item.indexOf("_vl_")).toLowerCase(),
                stateData[item]
              )
            ) {
              setValidationData(prevState => ({
                ...prevState,
                [`${item}State`]: "has-danger"
              }));
              formValidated = false;
              setIsDisabledSubmitBtn(false);
            }
          }
        }
      }
    });
    if (formValidated) {
      const options = {
        company_id: company.value,
        company_code: company.code,
        product_id: product.value,
        loan_schema_id: product.loan_schema_id
      };
      const postData = {};
      Object.keys(stateData).forEach(item => {
        // Check if optional fields have data if not ommit the field
        if (stateData[item] !== "")
          postData[item.substring(item.indexOf("_vl_") + 4, item.length)] = stateData[item];
      });
      for (const key in postData) {
        if (UIFieldMapping[key]) {
          postData[UIFieldMapping[key]] = postData[key];
          delete postData[key]
        }
      }
      dispatch(
        loanRequestFormPostWatcher(
          { options, postData },
          response => {
            setLoanId(response.data.preparedbiTmpl[0].loan_app_id);
            setIsDisabledSubmitBtn(false);
            handleNextStage();
          },
          error => {
            setIsDisabledSubmitBtn(false);
            setAlert(true);
            setSeverity("error");
            setAlertMessage(error.response.data.message);
            setTimeout(() => {
              handleAlertClose();
            }, 4000);
          }
        )
      );
    } else {
      setAlert(true);
      setSeverity("error");
      setAlertMessage("Kindly check for errors in fields");
      setTimeout(() => {
        handleAlertClose();
      }, 4000);
    }
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const handleGetCities = async (value, name, isGeneral = false) => {
    if (name === "state") setCityState(Cities(value));
    if (name === "bus_add_corr_state") setBusAddCorrCity(Cities(value));
    if (name === "bus_add_per_state") setBusPerCity(Cities(value));
    if (name === "per_state") setPerCity(Cities(value));
    if (isGeneral == true) setGeneralCity(Cities(value))
  };

  const handleGetPincodes = async value => {
    const pincodesData = await getPincodeData(stateCityData, value);
    setPincodeState(pincodesData);
  };

  const handleClearDropdown = name => {
    if (name === "state") {
      setStateData(prevState => ({
        ...prevState,
        pincode_vl_pincode: "",
        string_vl_city: ""
      }));
      setCityState([]);
      setPincodeState([]);
    }
    if (name === "city") {
      setStateData(prevState => ({
        ...prevState,
        pincode_vl_pincode: ""
      }));
      setPincodeState([]);
    }
  };

  const dropDownChange = (value, name) => {
    const pincodeVal = name === "pincode" ? value?.value : stateData.pincode_vl_pincode;
    setStateData(prevState => ({
      ...prevState,
      pincode_vl_pincode: pincodeVal ?? "",
      [`string_vl_${name}`]: value?.value ?? ""
    }));

    if (value === null || value === undefined) return handleClearDropdown(name);

    if (
      (name === "state" ||
        name === "bus_add_corr_state" ||
        name === "co_borr_1_res_state" ||
        name === "co_borr_2_res_state" ||
        name === "co_borr_3_res_state" ||
        name === "co_borr_1_res_city" ||
        name === "co_borr_2_res_city" ||
        name === "co_borr_3_res_city" ||
        name === "co_borr_1_per_state" ||
        name === "co_borr_2_per_state" ||
        name === "co_borr_3_per_state" ||
        name === "co_borr_1_per_city" ||
        name === "co_borr_2_per_city" ||
        name === "co_borr_3_per_city" ||
        name == "guarantor_1_res_city" ||
        name == "guarantor_1_per_city" ||
        name == "guarantor_2_res_city" ||
        name == "guarantor_2_per_city" ||
        name == "guarantor_1_res_state" ||
        name == "guarantor_1_per_state" ||
        name == "guarantor_2_res_state" ||
        name == "guarantor_2_per_state" ||
        name === "per_state" ||
        name === "bus_add_per_state") &&
      value !== undefined &&
      value !== null
    ) {
      setStateData(prevState => ({
        ...prevState,
        pincode_vl_pincode: stateData.pincode_vl_pincode,
      }));
      //setCityState([]);
      setPincodeState([]);
      handleGetCities(value, name, (name === "state" || name === "bus_add_corr_state" || name === "per_state" || name === "bus_add_per_state") ? false : true);
    }

    if (name === "city" && value !== undefined && value !== null) {
      setPincodeState([]);
      handleGetPincodes(value);
    }

    const validatingType = name === "pincode" ? "pincode" : "string";
    const isValid = validateData(validatingType, value?.value);

    setValidationData(prevState => ({
      ...prevState,
      [`${validatingType}_vl_${name}State`]: !isValid ? "has-danger" : ""
    }));
  };

  const handleEnumDropdownChanged = (value, name) => {
    if (value)
      setStateData(prevState => ({
        ...prevState,
        [`${name}`]: value?.value ?? ""
      }));
    else
      setStateData(prevState => ({
        ...prevState,
        [`${name}`]: ""
      }));

    const isValid = validateData(
      name.substring(0, name.indexOf("_vl_")).toLowerCase(),
      value
    );

    setValidationData(prevState => ({
      ...prevState,
      [`${name}State`]: !isValid ? "has-danger" : ""
    }));
  };

  const getStatseData = async data => {
    const statesData = await getStatesData(data);
    setStatesState(statesData);
  };

  const handleGetStateCity = async () => {
    dispatch(
      stateCityWatcher(
        {},
        response => {
          setStateCityDataStates(response);
          getStatseData(response);
        },
        error => { }
      )
    );
  };

  const disableCopiedDestinationFields = (fieldChecked, isChecked) => {
    const mappedFieldOptions = Object.keys(copyDataMapping);
    let stateDataDisabledCopy = { ...stateDataDisabled };
    let sourceFields = {};
    if (isChecked) {
      mappedFieldOptions.forEach(item => {
        const row = loanTemplate.filter(element => item === element.field)[0];

        sourceFields = Object.keys(copyDataMapping[item]);

        if (
          stateData[`${row.type}_vl_${row.field}`] ||
          fieldChecked.field === item
        ) {
          sourceFields.forEach(x => {
            const isFieldAvailable = loanTemplate.filter(element => x === element.field)[0];
            if (isFieldAvailable) {
              stateDataDisabledCopy[copyDataMapping[item][x]] =
                item === "same_as_corr" || item === "same_as_res";
            }
          });
        }
      });
    } else {
      sourceFields = Object.keys(copyDataMapping[fieldChecked.field]);
      sourceFields.forEach(x => {
        stateDataDisabledCopy[copyDataMapping[fieldChecked.field][x]] = false;
      });
    }

    setStateDataDisabled(stateDataDisabledCopy);
  };

  const onChangeCopyDataSourceToDestination = () => {
    const mappedFieldOptions = Object.keys(copyDataMapping);
    mappedFieldOptions.forEach(item => {
      const currentCopier = copyDataMapping[item];
      Object.keys(currentCopier).forEach(x => {
        if (stateDataDisabled[currentCopier[x]]) {
        }
      });
    });
  };
  const copyDataFromSourceToDesination = (event, row) => {
    if (!event.target.checked) return;
    const fieldsToMap = copyDataMapping[row.field];
    const stateDataCopy = { ...stateData };
    stateDataCopy[`${row.type}_vl_${row.field}`] = event.target.checked;
    Object.keys(fieldsToMap).forEach(item => {
      const currentField = loanTemplate.filter(
        element => item === element.field
      )[0];
      const currentFieldDestination = loanTemplate.filter(
        x => fieldsToMap[item] === x.field
      )[0];
      if (
        currentField &&
        currentFieldDestination &&
        fieldsToMap &&
        stateDataCopy.hasOwnProperty(`${currentField.type}_vl_${item}`) &&
        stateDataCopy.hasOwnProperty(
          `${currentFieldDestination.type}_vl_${fieldsToMap[item]}`
        )
      ) {
        stateDataCopy[
          `${currentFieldDestination.type}_vl_${fieldsToMap[item]}`
        ] = stateDataCopy[`${currentField.type}_vl_${item}`];
        const isValid = validateData(
          currentFieldDestination.type,
          stateDataCopy[`${currentField.type}_vl_${item}`]
        );
        setValidationData(prevState => ({
          ...prevState,
          [`${currentFieldDestination.type}_vl_${fieldsToMap[item]}State`]:
            !isValid ? "has-danger" : ""
        }));
      }
    });
    setStateData(stateDataCopy);

    disableCopiedDestinationFields(row, event.target.checked);
  };
  const getValidationMsg = (row) => {
    if (row.field === "per_addr_ln1") {
      if (String(stateData.string_vl_per_addr_ln1).length <= 4) {
        return "Minimum 5 Characters are required"
      } else {
        return row.validationmsg
      }
    }
    return row.validationmsg
  }

  const getDataByType = type => {
    if (
      type === "state" ||
      type === "bus_add_corr_state" ||
      type === "bus_add_per_state" ||
      type === "per_state"
    )
      return states ?? [];
    if (type === "city") return city ?? [];
    if (type === "bus_add_corr_city") return busAddCorrCity ?? [];
    if (type === "bus_add_per_city") return busPerCity ?? [];
    if (type === "per_city") return perCity ?? [];
    if (type === "pincode") return pincode ?? [];
    return [];
  };

  const renderFields = () => {
    const busPerAddrFields = [

      "bus_add_per_pincode",
      "bus_add_per_city",
      "bus_add_per_state",
      "bus_add_per_line2",
      "bus_add_per_line1",
    ];
    const perAddrFields = [
      "per_city",
      "per_state",
      "per_addr_ln1",
      "per_addr_ln2",
      "per_pincode"
    ];
    const resiAddrFields = [
      "gender",
      "pincode",
      "city",
      "state",
      "resi_addr_ln1",
      "resi_addr_ln2",
      "appl_pan",
      "middle_name",
      "first_name",
      "last_name",
      "father_fname",
      "father_mname",
      "father_lname",
      "type_of_addr",
      "dob"

    ];
    const busCorrAddrFields = [
      "doi",
      "bus_name",
      "bus_entity_type",
      "bus_pan",
      "bus_add_corr_pincode",
      "bus_add_corr_city",
      "bus_add_corr_state",
      "bus_add_corr_line1",
      "bus_add_corr_line2"
    ];
    const busCorrAddrArray = [];
    const busPerAddrArray = [];
    const perAddrArray = [];
    const resiAddrArray = [];
    const restArray = []
    let sameAsCorrCheck = null
    let sameAsBusCheck = null
    let sameAsResCheck = null
    loanTemplate.forEach(item => {
      const field = item.field;
      if (field === "same_as_corr") sameAsCorrCheck = item;
      else if (field === "same_as_bus") sameAsBusCheck = item;
      else if (field === "same_as_res") sameAsResCheck = item;
      else if (busPerAddrFields.includes(field)) {
        busPerAddrArray.push(item);
      }
      else if (perAddrFields.includes(field)) {
        perAddrArray.push(item);
      }
      else if (resiAddrFields.includes(field)) {
        if (field === "gender") {
          if (resiAddrArray.length > 3) {
            resiAddrArray.splice(2, 0, item);
          } else {
            resiAddrArray.splice(0, 0, item);
          }
        }
        else if (field === "dob") {
          if (resiAddrArray.length > 3) {
            resiAddrArray.splice(3, 0, item);
          } else {
            resiAddrArray.splice(0, 0, item);
          }
        }
        else {
          resiAddrArray.push(item);
        }
      }
      else if (busCorrAddrFields.includes(field)) {
        busCorrAddrArray.push(item);
      }
      else {
        restArray.push(item);
      }
    });
    const checkIsOptionalDropdown = (title) => {
      let found = true;
      loanTemplate.map(item => {
        if (item?.isOptional === "FALSE" && title === item?.field) {
          found = false;
        }
      })
      return found ? "" : "*";
    }
    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <div style={{ display: 'grid', rowGap: "20px", columnGap: "2%", gridTemplateColumns: "31% 31% 31%", width: "100%" }}>
          {restArray &&
            restArray.map((row, index) => {
              const isCheckBoxCopy = row.field === "same_as_corr" || row.field === "same_as_bus" || row.field === "same_as_res";
              return (
                <div
                  style={{ flex: isCheckBoxCopy ? '0 0 100%' : '0 0 auto', display: "flex", flexDirection: 'column' }}
                  key={`${row.type}_vl_${row.field}`}
                >
                  {row.field === "state" ||
                    row.field === "city" ||
                    row.field === "bus_add_corr_state" ||
                    row.field === "bus_add_corr_city" ||
                    row.field === "bus_add_per_state" ||
                    row.field === "bus_add_per_city" ||
                    row.field === "per_state" ||
                    row.field === "per_city" ? (
                    <>
                      <InputBox
                        id={row.id}
                        label={`${row.title}` + "*"}
                        options={
                          row.field === "bus_add_corr_city"
                            ? busAddCorrCity
                            : row.field === "per_city"
                              ? perCity
                              : row.field === "bus_add_per_city"
                                ? busPerCity
                                : getDataByType(row.field)
                        }
                        isDrawdown={true}
                        onClick={value =>
                          dropDownChange(value, row.field)
                        }
                        initialValue={stateData[`${row.type}_vl_${row.field}`] ?? ""}
                        isDisabled={stateDataDisabled[row.field]}
                        customDropdownClass={{ marginTop: "8px", zIndex: "1", width: "105.1%" }}
                        customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                        customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                        helperText={
                          row.checked.toLowerCase() === "true"
                            ? validationData[
                              `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                              ? row.validationmsg
                              : ""
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
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
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                            validationData[
                            `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                        }
                      />
                    </>
                  ) : enumFields?.lead[row.field]?.length ? (
                    <>
                      {enumFields?.lead ? (
                        <InputBox
                          id={row.field}
                          label={`${row.title}` + checkIsOptionalDropdown(row.field)}
                          options={enumFields?.lead[row.field].map(item => {
                            return { label: item, value: item };
                          })}
                          isDrawdown={true}
                          onClick={value => {
                            handleEnumDropdownChanged(
                              value,
                              `${row.type}_vl_${row.field}`
                            );
                          }}
                          isDisabled={stateDataDisabled[row.field]}
                          customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                          customDropdownClass={{ marginTop: "8px", zIndex: "1", width: "104.8%" }}
                          customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                          helperText={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationmsg
                                : ""
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
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
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                              validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                          }
                        />
                      ) : null}
                    </>
                  ) : row.type === "date" ? (
                    <>
                      <Typography>
                        {`${row.title}`}{" "}
                        <span style={{ color: "red" }}>
                          {row.checked.toLowerCase() === "true" ? ` *` : ""}
                        </span>
                      </Typography>
                      <BasicDatePicker
                        disabled={stateDataDisabled[row.field]}
                        placeholder={""}
                        value={stateData[`${row.type}_vl_${row.field}`] || null}
                        onDateChange={date =>
                          changeDateSelected(date, `${row.type}_vl_${row.field}`)
                        }
                        error={
                          row.checked.toLowerCase() === "true"
                            ? validationData[
                            `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                            validationData[
                            `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                        }
                        helperText={
                          row.checked.toLowerCase() === "true"
                            ? validationData[
                              `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                              ? row.validationmsg
                              : ""
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                            (validationData[
                              `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                              ? row.validationmsg
                              : "")
                        }
                      />
                    </>
                  ) : isCheckBoxCopy ? (
                    <>
                      <div style={{ height: "73px", display: "grid" }} />
                      <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gridRowStart: "none", marginLeft: "-213%" }}>
                        <Typography
                          alignSelf="center"
                          fontWeight="bold"
                          marginRight="20px"
                        >
                          {`${row.title}`}{" "}
                          <span style={{ color: "red" }}>
                            {row.checked.toLowerCase() === "true" ? ` *` : ""}
                          </span>
                        </Typography>
                        <FormControlLabel
                          required
                          control={
                            <Checkbox
                              onChange={e => {
                                copyDataFromSourceToDesination(e, row);
                              }}
                            />
                          }
                          label=""
                          alignSelf="center"
                          marginTop="12px"
                        />
                        <Typography alignSelf="center" color="#ccc">
                          {`${row.title}`}{" "}
                        </Typography>
                      </div>
                    </>
                  ) : (
                    <>
                      <InputBox
                        id={row.id}
                        label={`${row.field
                          .split('_')
                          .map((word, index, array) => {
                            const formattedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                            if (index === array.length - 1 && row.checked.toLowerCase() === "true") {
                              return `${formattedWord}*`;
                            } else {
                              return formattedWord;
                            }
                          })
                          .join(' ')
                          }`}
                        isDrawdown={false}
                        initialValue={stateData[`${row.type}_vl_${row.field}`] ?? ""}
                        onClick={(event) => change(event, row.type, row.field)}
                        isDisabled={stateDataDisabled[row.field]}
                        customDropdownClass={inputBoxCss}
                        customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                        customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                        error={
                          row.checked.toLowerCase() === "true"
                            ? validationData[
                            `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                            validationData[
                            `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                        }
                        helperText={
                          row.checked.toLowerCase() === "true"
                            ? validationData[
                              `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                              ? row.validationmsg
                              : ""
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                            (validationData[
                              `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                              ? row.validationmsg
                              : "")
                        }
                      // isRequired={row.checked?.toLowerCase() === "true" ? true : false}
                      />
                    </>
                  )}
                </div>
              );
            })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          {
            busCorrAddrArray.length > 0 && <div style={{ display: 'grid', rowGap: "20px", columnGap: "2%", gridTemplateColumns: "31% 31% 31%", width: "100%", marginTop: "14px" }}> {busCorrAddrArray.map((row, index) => {
              return (
                <div
                  style={{ flex: '0 0 auto', display: "flex", flexDirection: 'column' }}
                  key={`${row.type}_vl_${row.field}`}
                >
                  {row.field === "state" ||
                    row.field === "city" ||
                    row.field === "bus_add_corr_state" ||
                    row.field === "bus_add_corr_city" ||
                    row.field === "bus_add_per_state" ||
                    row.field === "bus_add_per_city" ||
                    row.field === "per_state" ||
                    row.field === "per_city" ? (
                    <>
                      <InputBox
                        id={row.id}
                        label={`${row.title}` + "*"}
                        options={
                          row.field === "bus_add_corr_city"
                            ? busAddCorrCity
                            : row.field === "per_city"
                              ? perCity
                              : row.field === "bus_add_per_city"
                                ? busPerCity
                                : getDataByType(row.field)
                        }
                        isDrawdown={true}
                        onClick={value =>
                          dropDownChange(value, row.field)
                        }
                        initialValue={stateData[`${row.type}_vl_${row.field}`] ?? ""}
                        isDisabled={stateDataDisabled[row.field]}
                        customDropdownClass={{ marginTop: "8px", zIndex: "1", width: "105.1%" }}
                        customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                        customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                        helperText={
                          row.checked.toLowerCase() === "true"
                            ? validationData[
                              `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                              ? row.validationmsg
                              : ""
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
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
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                            validationData[
                            `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                        }
                      />
                    </>
                  ) : enumFields?.lead[row.field]?.length ? (
                    <>
                      {enumFields?.lead ? (
                        <InputBox
                          id={row.field}
                          label={`${row.title}` + checkIsOptionalDropdown(row.field)}
                          options={enumFields?.lead[row.field].map(item => {
                            return { label: item, value: item };
                          })}
                          isDrawdown={true}
                          onClick={value => {
                            handleEnumDropdownChanged(
                              value,
                              `${row.type}_vl_${row.field}`
                            );
                          }}
                          isDisabled={stateDataDisabled[row.field]}
                          customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                          customDropdownClass={{ marginTop: "8px", zIndex: "1", width: "104.8%" }}
                          customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                          helperText={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationmsg
                                : ""
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
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
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                              validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                          }
                        />
                      ) : null}
                    </>
                  ) : (
                    <>
                      <InputBox
                        id={row.id}
                        label={`${row.field
                          .split('_')
                          .map((word, index, array) => {
                            const formattedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                            if (index === array.length - 1 && row.checked.toLowerCase() === "true") {
                              return `${formattedWord}*`;
                            } else {
                              return formattedWord;
                            }
                          })
                          .join(' ')
                          }`}
                        isDrawdown={false}
                        initialValue={stateData[`${row.type}_vl_${row.field}`] ?? ""}
                        onClick={(event) => change(event, row.type, row.field)}
                        isDisabled={stateDataDisabled[row.field]}
                        customDropdownClass={inputBoxCss}
                        customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                        customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                        error={
                          row.checked.toLowerCase() === "true"
                            ? validationData[
                            `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                            validationData[
                            `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                        }
                        helperText={
                          row.checked.toLowerCase() === "true"
                            ? validationData[
                              `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                              ? row.validationmsg
                              : ""
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                            (validationData[
                              `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                              ? row.validationmsg
                              : "")
                        }
                      // isRequired={row.checked?.toLowerCase() === "true" ? true : false}
                      />
                    </>
                  )}
                </div>
              );
            })}
            </div>
          }
          {sameAsCorrCheck && (
            <div style={{ display: "flex", flexDirection: "column", marginTop: "14px" }}>
              <Typography
                fontWeight="bold"
              >
                {`${sameAsCorrCheck?.title}`}{" "}
                <span style={{ color: "red" }}>
                  {sameAsCorrCheck?.checked.toLowerCase() === "true" ? ` *` : ""}
                </span>
              </Typography>
              <FormControlLabel
                required
                control={
                  <Checkbox
                    onChange={e => {
                      copyDataFromSourceToDesination(e, sameAsCorrCheck);
                    }}
                  />
                }
                label=""
                alignSelf="center"
                marginTop="12px"
              />
              <Typography color="#ccc">
                {`${sameAsCorrCheck?.title}`}{" "}
              </Typography>
            </div>
          )}
          {
            busPerAddrArray.length > 0 && <div style={{ display: 'grid', rowGap: "20px", columnGap: "2%", gridTemplateColumns: "31% 31% 31%", width: "100%", marginTop: "14px" }}> {busPerAddrArray.map((row, index) => {
              const isCheckBoxCopy = row.field === "same_as_corr" || row.field === "same_as_bus" || row.field === "same_as_res";
              return (
                <div
                  style={{ flex: isCheckBoxCopy ? '0 0 100%' : '0 0 auto', display: "flex", flexDirection: 'column' }}
                  key={`${row.type}_vl_${row.field}`}
                >
                  {row.field === "state" ||
                    row.field === "city" ||
                    row.field === "bus_add_corr_state" ||
                    row.field === "bus_add_corr_city" ||
                    row.field === "bus_add_per_state" ||
                    row.field === "bus_add_per_city" ||
                    row.field === "per_state" ||
                    row.field === "per_city" ? (
                    <>
                      <InputBox
                        id={row.id}
                        label={`${row.title}` + "*"}
                        options={
                          row.field === "bus_add_corr_city"
                            ? busAddCorrCity
                            : row.field === "per_city"
                              ? perCity
                              : row.field === "bus_add_per_city"
                                ? busPerCity
                                : getDataByType(row.field)
                        }
                        isDrawdown={true}




                        onClick={value =>
                          dropDownChange(value, row.field)
                        }
                        initialValue={stateData[`${row.type}_vl_${row.field}`] ?? ""}
                        isDisabled={stateDataDisabled[row.field]}
                        customDropdownClass={{ marginTop: "8px", zIndex: "1", width: "105.1%" }}
                        customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                        customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                        helperText={
                          row.checked.toLowerCase() === "true"
                            ? validationData[
                              `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                              ? row.validationmsg
                              : ""
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
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
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                            validationData[
                            `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                        }
                      />
                    </>
                  ) : enumFields?.lead[row.field]?.length ? (
                    <>
                      {enumFields?.lead ? (
                        <InputBox
                          id={row.field}
                          label={`${row.title}` + checkIsOptionalDropdown(row.field)}
                          options={enumFields?.lead[row.field].map(item => {
                            return { label: item, value: item };
                          })}
                          isDrawdown={true}
                          onClick={value => {
                            handleEnumDropdownChanged(
                              value,
                              `${row.type}_vl_${row.field}`
                            );
                          }}
                          isDisabled={stateDataDisabled[row.field]}
                          customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                          customDropdownClass={{ marginTop: "8px", zIndex: "1", width: "104.8%" }}
                          customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                          helperText={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationmsg
                                : ""
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
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
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                              validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                          }
                        />
                      ) : null}
                    </>
                  ) : (
                    <>
                      <InputBox
                        id={row.id}
                        label={`${row.field
                          .split('_')
                          .map((word, index, array) => {
                            const formattedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                            if (index === array.length - 1 && row.checked.toLowerCase() === "true") {
                              return `${formattedWord}*`;
                            } else {
                              return formattedWord;
                            }
                          })
                          .join(' ')
                          }`}
                        isDrawdown={false}
                        initialValue={stateData[`${row.type}_vl_${row.field}`] ?? ""}
                        onClick={(event) => change(event, row.type, row.field)}
                        isDisabled={stateDataDisabled[row.field]}
                        customDropdownClass={inputBoxCss}
                        customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                        customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                        error={
                          row.checked.toLowerCase() === "true"
                            ? validationData[
                            `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                            validationData[
                            `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                        }
                        helperText={
                          row.checked.toLowerCase() === "true"
                            ? validationData[
                              `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                              ? row.validationmsg
                              : ""
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                            (validationData[
                              `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                              ? row.validationmsg
                              : "")
                        }
                      // isRequired={row.checked?.toLowerCase() === "true" ? true : false}
                      />
                    </>
                  )}
                </div>
              );
            })
            }
            </div>
          }
          {sameAsBusCheck && (
            <div style={{ display: "flex", flexDirection: "column", marginTop: "14px" }}>
              <Typography
                fontWeight="bold"
              >
                {`${sameAsBusCheck?.title}`}{" "}
                <span style={{ color: "red" }}>
                  {sameAsBusCheck?.checked.toLowerCase() === "true" ? ` *` : ""}
                </span>
              </Typography>
              <FormControlLabel
                required
                control={
                  <Checkbox
                    onChange={e => {
                      copyDataFromSourceToDesination(e, sameAsBusCheck);
                    }}
                  />
                }
                label=""
                alignSelf="center"
                marginTop="12px"
              />
              <Typography color="#ccc">
                {`${sameAsBusCheck?.title}`}{" "}
              </Typography>
            </div>
          )}
          {
            resiAddrArray.length > 0 && <div style={{ display: 'grid', rowGap: "20px", columnGap: "2%", gridTemplateColumns: "31% 31% 31%", width: "100%", marginTop: "14px" }}> {resiAddrArray.map((row, index) => {
              return (
                <div
                  style={{ flex: '0 0 auto', display: "flex", flexDirection: 'column' }}
                  key={`${row.type}_vl_${row.field}`}
                >
                  {row.field === "state" ||
                    row.field === "city" ||
                    row.field === "bus_add_corr_state" ||
                    row.field === "bus_add_corr_city" ||
                    row.field === "bus_add_per_state" ||
                    row.field === "bus_add_per_city" ||
                    row.field === "per_state" ||
                    row.field === "per_city" ? (
                    <>
                      <InputBox
                        id={row.id}
                        label={`${row.title}` + "*"}
                        options={
                          row.field === "bus_add_corr_city"
                            ? busAddCorrCity
                            : row.field === "per_city"
                              ? perCity
                              : row.field === "bus_add_per_city"
                                ? busPerCity
                                : getDataByType(row.field)
                        }
                        isDrawdown={true}
                        onClick={value =>
                          dropDownChange(value, row.field)
                        }
                        initialValue={stateData[`${row.type}_vl_${row.field}`] ?? ""}
                        isDisabled={stateDataDisabled[row.field]}
                        customDropdownClass={{ marginTop: "8px", zIndex: "1", width: "105.1%" }}
                        customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                        customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                        helperText={
                          row.checked.toLowerCase() === "true"
                            ? validationData[
                              `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                              ? row.validationmsg
                              : ""
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
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
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                            validationData[
                            `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                        }
                      />
                    </>
                  ) : enumFields?.lead[row.field]?.length ? (
                    <>
                      {enumFields?.lead ? (
                        <InputBox
                          id={row.field}
                          label={`${row.title}` + checkIsOptionalDropdown(row.field)}
                          options={enumFields?.lead[row.field].map(item => {
                            return { label: item, value: item };
                          })}
                          isDrawdown={true}
                          onClick={value => {
                            handleEnumDropdownChanged(
                              value,
                              `${row.type}_vl_${row.field}`
                            );
                          }}
                          isDisabled={stateDataDisabled[row.field]}
                          customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                          customDropdownClass={{ marginTop: "8px", zIndex: "1", width: "104.8%" }}
                          customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                          helperText={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationmsg
                                : ""
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
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
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                              validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                          }
                        />
                      ) : null}
                    </>
                  ) : (
                    <>
                      <InputBox
                        id={row.id}
                        label={`${row.field
                          .split('_')
                          .map((word, index, array) => {
                            const formattedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                            if (index === array.length - 1 && row.checked.toLowerCase() === "true") {
                              return `${formattedWord}*`;
                            } else {
                              return formattedWord;
                            }
                          })
                          .join(' ')
                          }`}
                        isDrawdown={false}
                        initialValue={stateData[`${row.type}_vl_${row.field}`] ?? ""}
                        onClick={(event) => change(event, row.type, row.field)}
                        isDisabled={stateDataDisabled[row.field]}
                        customDropdownClass={inputBoxCss}
                        customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                        customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                        error={
                          row.checked.toLowerCase() === "true"
                            ? validationData[
                            `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                            validationData[
                            `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                        }
                        helperText={
                          row.checked.toLowerCase() === "true"
                            ? validationData[
                              `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                              ? row.validationmsg
                              : ""
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                            (validationData[
                              `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                              ? row.validationmsg
                              : "")
                        }
                      // isRequired={row.checked?.toLowerCase() === "true" ? true : false}
                      />
                    </>
                  )}
                </div>
              );
            })
            }
            </div>
          }
          {sameAsResCheck && (
            <div style={{ display: "flex", flexDirection: "column", marginTop: "14px" }}>
              <Typography
                fontWeight="bold"
              >
                {`${sameAsResCheck?.title}`}{" "}
                <span style={{ color: "red" }}>
                  {sameAsResCheck?.checked.toLowerCase() === "true" ? ` *` : ""}
                </span>
              </Typography>
              <FormControlLabel
                required
                control={
                  <Checkbox
                    onChange={e => {
                      copyDataFromSourceToDesination(e, sameAsResCheck);
                    }}
                  />
                }
                label=""
                alignSelf="center"
                marginTop="12px"
              />
              <Typography color="#ccc">
                {`${sameAsResCheck?.title}`}{" "}
              </Typography>
            </div>
          )}
          {
            perAddrArray.length > 0 &&
            <div style={{ display: 'grid', rowGap: "20px", columnGap: "2%", gridTemplateColumns: "31% 31% 31%", width: "100%", marginTop: "14px" }}> {perAddrArray.map((row, index) => {
              return (
                <div
                  style={{ flex: '0 0 auto', display: "flex" }}
                  key={`${row.type}_vl_${row.field}`}
                >
                  {row.field === "state" ||
                    row.field === "city" ||
                    row.field === "bus_add_corr_state" ||
                    row.field === "bus_add_corr_city" ||
                    row.field === "bus_add_per_state" ||
                    row.field === "bus_add_per_city" ||
                    row.field === "per_state" ||
                    row.field === "per_city" ? (
                    <>
                      <InputBox
                        id={row.id}
                        label={`${row.title}` + "*"}
                        options={
                          row.field === "bus_add_corr_city"
                            ? busAddCorrCity
                            : row.field === "per_city"
                              ? perCity
                              : row.field === "bus_add_per_city"
                                ? busPerCity
                                : getDataByType(row.field)
                        }
                        isDrawdown={true}
                        onClick={value =>
                          dropDownChange(value, row.field)
                        }
                        initialValue={stateData[`${row.type}_vl_${row.field}`] ?? ""}
                        isDisabled={stateDataDisabled[row.field]}
                        customDropdownClass={{ marginTop: "8px", zIndex: "1", width: "105.1%" }}
                        customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                        customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                        helperText={
                          row.checked.toLowerCase() === "true"
                            ? validationData[
                              `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                              ? row.validationmsg
                              : ""
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
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
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                            validationData[
                            `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                        }
                      />
                    </>
                  ) : enumFields?.lead[row.field]?.length ? (
                    <>
                      {enumFields?.lead ? (
                        <InputBox
                          id={row.field}
                          label={`${row.title}` + checkIsOptionalDropdown(row.field)}
                          options={enumFields?.lead[row.field].map(item => {
                            return { label: item, value: item };
                          })}
                          isDrawdown={true}
                          onClick={value => {
                            handleEnumDropdownChanged(
                              value,
                              `${row.type}_vl_${row.field}`
                            );
                          }}
                          isDisabled={stateDataDisabled[row.field]}
                          customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                          customDropdownClass={{ marginTop: "8px", zIndex: "1", width: "104.8%" }}
                          customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                          helperText={
                            row.checked.toLowerCase() === "true"
                              ? validationData[
                                `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                                ? row.validationmsg
                                : ""
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
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
                              : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                              validationData[
                              `${row.type}_vl_${row.field}State`
                              ] === "has-danger"
                          }
                        />
                      ) : null}
                    </>
                  ) : (
                    <>
                      <InputBox
                        id={row.id}
                        label={`${row.field
                          .split('_')
                          .map((word, index, array) => {
                            const formattedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                            if (index === array.length - 1 && row.checked.toLowerCase() === "true") {
                              return `${formattedWord}*`;
                            } else {
                              return formattedWord;
                            }
                          })
                          .join(' ')
                          }`}
                        isDrawdown={false}
                        initialValue={stateData[`${row.type}_vl_${row.field}`] ?? ""}
                        onClick={(event) => change(event, row.type, row.field)}
                        isDisabled={stateDataDisabled[row.field]}
                        customDropdownClass={inputBoxCss}
                        customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                        customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                        error={
                          row.checked.toLowerCase() === "true"
                            ? validationData[
                            `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                            validationData[
                            `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                        }
                        helperText={
                          row.checked.toLowerCase() === "true"
                            ? validationData[
                              `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                              ? getValidationMsg(row)
                              : ""
                            : stateData[`${row.type}_vl_${row.field}`] !== "" &&
                            (validationData[
                              `${row.type}_vl_${row.field}State`
                            ] === "has-danger"
                              ? row.validationmsg
                              : "")
                        }
                      // isRequired={row.checked?.toLowerCase() === "true" ? true : false}
                      />
                    </>
                  )}
                </div>
              );
            })
            }
            </div>
          }
          <div style={{ display: "flex", flexDirection: "column", marginTop: "25px" }}>
            {forms.map((form, index) => (
              <div style={{ marginTop: "20px" }} key={`form_${index}`}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "8px", marginTop: "12px", width: "97%" }}>
                  <h2>{`${form.type === "co_borr" ? "Co-Borrower" : "Guarantor"} ${form.count}`}</h2>
                  <img alt="trash" onClick={() => deleteLastFormOfType(form.type)} src={TRASH} onMouseOver={(e) => e.target.style.cursor = 'pointer'} />
                </div>
                <div style={{ display: 'grid', rowGap: "20px", columnGap: "2%", gridTemplateColumns: "31% 31% 31%", width: "100%" }}>
                  {Object.keys(form).map((key) => (
                    key.split('_').pop() === 'count' || key.split('_').pop() === 'type' || (key.split('_')[0] === "co" && key.split('_')[3] === "per") || (key.split('_')[0] === "guarantor" && key.split('_')[2] === "per") ?
                      null :
                      key.split('_').pop() === 'state' || key.split('_').pop() === 'city' ?
                        <InputBox
                          id={key}
                          key={key}
                          label={`${key}` + "*"}
                          options={key.split('_').pop() === "city" ? generalCity : getDataByType(key.split('_').pop())}
                          isDrawdown={true}
                          onClick={value =>
                            dropDownChange(value, key)
                          }
                          customDropdownClass={{ marginTop: "8px", zIndex: "1", width: "105.1%" }}
                          customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                          customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                          helperText={
                            (validationData[`${keyToReturn(key)}State`] === "has-danger") ? stateData[keyToReturn(key)] !== "" ? `${key.split('_').pop()} is Invalid`
                              : `${key.split('_').pop()} is Required` : ""
                          }
                          error={
                            validationData[
                              `${keyToReturn(key)}State`
                            ] === "has-danger" ? true
                              : stateData[`${keyToReturn(key)}`] !== "" &&
                              validationData[
                              `${keyToReturn(key)}State`
                              ] === "has-danger"
                          }
                        />
                        :
                        key.split('_').pop() === 'DOB' ?
                          <BasicDatePicker
                            style={{ zIndex: "0" }}
                            disabled={stateDataDisabled[key]}
                            placeholder={`${key}*`}
                            value={stateData[`${"date"}_vl_${key}`] || null}
                            onDateChange={date =>
                              changeDateSelected(date, `${"date"}_vl_${key}`)
                            }
                            helperText={
                              (validationData[`${keyToReturn(key)}State`] === "has-danger") ? stateData[keyToReturn(key)] !== "" ? `${key.split('_').pop()} is Invalid`
                                : `${key.split('_').pop()} is Required` : ""
                            }
                            error={
                              validationData[
                                `${keyToReturn(key)}State`
                              ] === "has-danger" ? true
                                : stateData[`${keyToReturn(key)}`] !== "" &&
                                validationData[
                                `${keyToReturn(key)}State`
                                ] === "has-danger"
                            }
                          />
                          :
                          key.split('_').pop() === 'pan' ?
                            <InputBox
                              key={key}
                              id={key}
                              label={key + "*"}
                              isDrawdown={false}
                              onClick={(event) => change(event, "pan", key)}
                              customDropdownClass={inputBoxCss}
                              customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                              customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                              helperText={
                                (validationData[`${keyToReturn(key)}State`] === "has-danger") ? stateData[keyToReturn(key)] !== "" ? `${key.split('_').pop()} is Invalid`
                                  : `${key.split('_').pop()} is Required` : ""
                              }
                              error={
                                validationData[
                                  `${keyToReturn(key)}State`
                                ] === "has-danger" ? true
                                  : stateData[`${keyToReturn(key)}`] !== "" &&
                                  validationData[
                                  `${keyToReturn(key)}State`
                                  ] === "has-danger"
                              }
                            />
                            : key.split('_').pop() === 'pincode' ?
                              <InputBox
                                key={key}
                                id={key}
                                label={key + "*"}
                                type={"number"}
                                isDrawdown={false}
                                onClick={(event) => change(event, "pincode", key)}
                                customDropdownClass={inputBoxCss}
                                customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                                customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                                helperText={
                                  (validationData[`${keyToReturn(key)}State`] === "has-danger") ? stateData[keyToReturn(key)] !== "" ? `${key.split('_').pop()} is Invalid`
                                    : `${key.split('_').pop()} is Required` : ""
                                }
                                error={
                                  validationData[
                                    `${keyToReturn(key)}State`
                                  ] === "has-danger" ? true
                                    : stateData[`${keyToReturn(key)}`] !== "" &&
                                    validationData[
                                    `${keyToReturn(key)}State`
                                    ] === "has-danger"
                                }
                              />
                              : key.split('_').pop() === 'phone' ?
                                <InputBox
                                  key={key}
                                  id={key}
                                  type={"number"}
                                  label={key + "*"}
                                  isDrawdown={false}
                                  onClick={(event) => change(event, "mobile", key)}
                                  customDropdownClass={inputBoxCss}
                                  customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                                  customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                                  helperText={
                                    (validationData[`${keyToReturn(key)}State`] === "has-danger") ? stateData[keyToReturn(key)] !== "" ? `${key.split('_').pop()} is Invalid`
                                      : `${key.split('_').pop()} is Required` : ""
                                  }
                                  error={
                                    validationData[
                                      `${keyToReturn(key)}State`
                                    ] === "has-danger" ? true
                                      : stateData[`${keyToReturn(key)}`] !== "" &&
                                      validationData[
                                      `${keyToReturn(key)}State`
                                      ] === "has-danger"
                                  }
                                />
                                :
                                key.split('_').pop() === 'gender' || key.split('_').pop() === 'check' ?
                                  <InputBox
                                    id={key}
                                    key={key}
                                    label={`${key}${key.split('_').pop() === 'gender' ? "*" : ""}`}
                                    options={
                                      key.split('_').pop() === 'gender' ?
                                        [{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }, { label: "Others", value: "Others" }]
                                        :
                                        [{ label: "Y", value: "Y" }, { label: "N", value: "N" }]
                                    }
                                    isDrawdown={true}
                                    onClick={value => {
                                      handleEnumDropdownChanged(
                                        value,
                                        `${"string"}_vl_${key}`
                                      );
                                    }}
                                    customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                                    customDropdownClass={{ marginTop: "8px", zIndex: "1", width: "104.8%" }}
                                    customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                                    helperText={
                                      (validationData[`${keyToReturn(key)}State`] === "has-danger") ? stateData[keyToReturn(key)] !== "" ? `${key.split('_').pop()} is Invalid`
                                        : `${key.split('_').pop()} is Required` : ""
                                    }
                                    error={
                                      validationData[
                                        `${keyToReturn(key)}State`
                                      ] === "has-danger" ? true
                                        : stateData[`${keyToReturn(key)}`] !== "" &&
                                        validationData[
                                        `${keyToReturn(key)}State`
                                        ] === "has-danger"
                                    }
                                  />
                                  : key.split('_').slice(-2, -1)[0] == "first" || key.split('_').slice(-2, -1)[0] == "last" || key.split('_').pop() === "line1" || key.split('_').pop() === "line2" ?
                                    <InputBox
                                      key={key}
                                      id={key}
                                      label={key + "*"}
                                      isDrawdown={false}
                                      onClick={(event) => change(event, "string", key)}
                                      customDropdownClass={inputBoxCss}
                                      customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                                      customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                                      helperText={
                                        (validationData[`${keyToReturn(key)}State`] === "has-danger") ? stateData[keyToReturn(key)] !== "" ? `${key.split('_').pop()} is Invalid`
                                          : `${key.split('_').pop()} is Required` : ""
                                      }
                                      error={
                                        validationData[
                                          `${keyToReturn(key)}State`
                                        ] === "has-danger" ? true
                                          : stateData[`${keyToReturn(key)}`] !== "" &&
                                          validationData[
                                          `${keyToReturn(key)}State`
                                          ] === "has-danger"
                                      }
                                    />
                                    : key.split('_').pop() === "aadhaar" ?
                                      <InputBox
                                        key={key}
                                        id={key}
                                        label={key + "*"}
                                        isDrawdown={false}
                                        onClick={(event) => change(event, "aadhaar", key)}
                                        customDropdownClass={inputBoxCss}
                                        customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                                        customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                                        helperText={
                                          (validationData[`${keyToReturn(key)}State`] === "has-danger") ? stateData[keyToReturn(key)] !== "" ? `${key.split('_').pop()} is Invalid`
                                            : `${key.split('_').pop()} is Required` : ""
                                        }
                                        error={
                                          validationData[
                                            `${keyToReturn(key)}State`
                                          ] === "has-danger" ? true
                                            : stateData[`${keyToReturn(key)}`] !== "" &&
                                            validationData[
                                            `${keyToReturn(key)}State`
                                            ] === "has-danger"
                                        }
                                      />
                                      :
                                      <InputBox
                                        key={key}
                                        id={key}
                                        label={key}
                                        isDrawdown={false}
                                        onClick={(event) => change(event, "string", key)}
                                        customDropdownClass={inputBoxCss}
                                        customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                                        customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                                      />
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "row", marginTop: "14px", marginTop: "20px" }}>
                  <Typography
                    fontWeight="bold"
                  >
                    {"Permanent Address"}
                  </Typography>
                  <FormControlLabel
                    required
                    control={
                      <Checkbox
                        checked={checkboxStates[index]} // Bind the checkbox state
                        onChange={(e) => {
                          const newCheckboxStates = [...checkboxStates];
                          newCheckboxStates[index] = e.target.checked;
                          setCheckboxStates(newCheckboxStates);
                          copyResFieldsToPerFields(e, form.type, form.count)
                          if (e.target.checked) {
                            let tempArr = [...checkObjectArr]
                            tempArr.push({
                              type: form.type,
                              count: form.count
                            })
                            setCheckObjectArr(tempArr);
                          } else if (!e.target.checked) {
                            let tempArr = [...checkObjectArr]
                            tempArr = tempArr.filter((obj) => (obj.type !== form.type && obj.count !== form.count));
                            setCheckObjectArr(tempArr);
                          }
                        }}
                      />
                    }
                    label=""
                    style={{ marginTop: "-9px", marginLeft: "5px" }}
                  />
                  <Typography color="#ccc" style={{ marginLeft: "-19px" }}>
                    {"Same as residential address"}
                  </Typography>
                </div>

                {
                  !checkboxStates[index] && (
                    <div style={{ display: 'grid', rowGap: "20px", columnGap: "2%", gridTemplateColumns: "31% 31% 31%", width: "100%" }}>
                      {Object.keys(form).map((key) => (
                        (key.split('_')[0] === "co" && key.split('_')[3] === "per") || (key.split('_')[0] === "guarantor" && key.split('_')[2] === "per") ?
                          key.split('_').pop() === 'state' || key.split('_').pop() === 'city' ?
                            <InputBox
                              id={key}
                              key={key}
                              label={`${key}` + "*"}
                              options={key.split('_').pop() === "city" ? generalCity : getDataByType(key.split('_').pop())}
                              isDrawdown={true}
                              onClick={value =>
                                dropDownChange(value, key)
                              }
                              customDropdownClass={{ marginTop: "8px", zIndex: "1", width: "105.1%" }}
                              customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                              customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                              helperText={
                                (validationData[`${keyToReturn(key)}State`] === "has-danger") ? stateData[keyToReturn(key)] !== "" ? `${key.split('_').pop()} is Invalid`
                                  : `${key.split('_').pop()} is Required` : ""
                              }
                              error={
                                validationData[
                                  `${keyToReturn(key)}State`
                                ] === "has-danger" ? true
                                  : stateData[`${keyToReturn(key)}`] !== "" &&
                                  validationData[
                                  `${keyToReturn(key)}State`
                                  ] === "has-danger"
                              }
                            />
                            : key.split('_').pop() === 'pincode' ?
                              <InputBox
                                key={key}
                                id={key}
                                label={key + "*"}
                                type={"number"}
                                isDrawdown={false}
                                onClick={(event) => change(event, "pincode", key)}
                                customDropdownClass={inputBoxCss}
                                customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                                customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                                helperText={
                                  (validationData[`${keyToReturn(key)}State`] === "has-danger") ? stateData[keyToReturn(key)] !== "" ? `${key.split('_').pop()} is Invalid`
                                    : `${key.split('_').pop()} is Required` : ""
                                }
                                error={
                                  validationData[
                                    `${keyToReturn(key)}State`
                                  ] === "has-danger" ? true
                                    : stateData[`${keyToReturn(key)}`] !== "" &&
                                    validationData[
                                    `${keyToReturn(key)}State`
                                    ] === "has-danger"
                                }
                              />
                              : key.split('_').pop() === 'line1' || key.split('_').pop() === 'line2' ?
                                <InputBox
                                  key={key}
                                  id={key}
                                  label={key + "*"}
                                  isDrawdown={false}
                                  onClick={(event) => change(event, "string", key)}
                                  customDropdownClass={inputBoxCss}
                                  customClass={{ height: "56px", width: "485px", maxWidth: "100%" }}
                                  customInputClass={{ width: "100%", backgroundColor: "#fff" }}
                                  helperText={
                                    (validationData[`${keyToReturn(key)}State`] === "has-danger") ? stateData[keyToReturn(key)] !== "" ? `${key.split('_').pop()} is Invalid`
                                      : `${key.split('_').pop()} is Required` : ""
                                  }
                                  error={
                                    validationData[
                                      `${keyToReturn(key)}State`
                                    ] === "has-danger" ? true
                                      : stateData[`${keyToReturn(key)}`] !== "" &&
                                      validationData[
                                      `${keyToReturn(key)}State`
                                      ] === "has-danger"
                                  }
                                />
                                : null
                          : null
                      ))}
                    </div>
                  )
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const inputBoxCss = {
    marginTop: "8px",
    maxHeight: "500px",
    zIndex: 1,
    padding: "0px 16px",
    width: "290px"
  }

  const inputBoxDropdownCss = {
    marginTop: "8px",
    maxHeight: "500px",
    width: "485px",
    zIndex: 1,
    padding: "0px 16px"
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
      <CardContent >
        <div style={{ display: "flex", flexDirection: "row", }}>
          <div style={{ marginRight: "16px" }}>
            <SelectCompany
              placeholder="Company"
              company={company}
              onCompanyChange={value => {
                setCompany(value);
                setProduct("");
              }}
              customStyle={{ marginTop: "8px", zIndex: "1", width: "106%" }}
              height="56px"
              width="290px"
            />
          </div>
          <SelectProduct
            placeholder="Product"
            company={company}
            product={product}
            onProductChange={value => setProduct(value)}
            customStyle={{ marginTop: "8px", zIndex: "1", width: "106%", maxWidth: "290px" }}
            height="56px"
            width="290px"
          />
        </div>
        {loanTemplate.length ? (
          <div style={{ width: "551px", height: "30px", marginTop: "40px", marginBottom: "24px" }}>
            <h4 style={{ fontSize: "20px", fontFamily: "Montserrat-SemiBold", fontWeight: 600, lineHeight: "150%" }}>
              Please fill out the following details to generate a lead.
            </h4>
          </div>) : null}
        {renderFields()}
        {/* {
          loanTemplate.length > 0 && (
            <div>
              <div>
                <div style={{ height: "2px", marginTop: "20px", marginBottom: "25px", width: "97%", backgroundColor: "#E5E5E8" }}></div>
                <h4 style={{ color: "var(--neutral-neutral-100, #141519)", fontFamily: "Montserrat-SemiBold", fontSize: "20px", fontStyle: "normal", fontWeight: "600", lineHeight: "150%" }}>
                  Add Co-Borrowers & Guarantors
                </h4>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Button
                  label="Add Co-Borrower"
                  onClick={() => addBorrowerGuaranteerCount("co_borr")}
                  isDisabled={isDisabledSubmitBtn}
                  buttonType="linkssss"
                  customStyle={{ color: "#475BD8", fontFamily: "Montserrat-regular", fontSize: "14px", fontStyle: "normal", fontWeight: "600", lineHeight: "150%", paddingLeft: "10px", paddingRight: "10px" }}
                ></Button>
                <Button
                  label="Add Guarantors"
                  onClick={() => addBorrowerGuaranteerCount("guarantor")}
                  isDisabled={isDisabledSubmitBtn}
                  buttonType="linkssss"
                  customStyle={{ color: "#475BD8", fontFamily: "Montserrat-regular", fontSize: "14px", fontStyle: "normal", fontWeight: "600", lineHeight: "150%", paddingLeft: "10px", paddingRight: "10px" }}
                ></Button>
              </div>
            </div>
          )
        } */}
        <div style={{ display: "flex", float: "right", marginRight: "34px" }}>
          {loanTemplate.length ? (
            <Button
              label="Submit"
              onClick={submitLoanRequest}
              isDisabled={isDisabledSubmitBtn}
              buttonType="primary"
              customStyle={{ height: "48px", width: "109px", fontSize: "16px", padding: "12px 24px", borderRadius: "40px", gap: "10px" }}
            ></Button>
          ) : null}
        </div>
      </CardContent>
    </>
  );
}
