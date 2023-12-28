import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import FormGroup from "@mui/material/FormGroup";
import { withStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Alert from "@mui/material/Alert";
import { useState, useEffect } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CardContent from "@material-ui/core/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CustomDropdown from "../../components/custom/customSelect";
import CompanyDropdown from "../../components/Company/CompanySelect";
import LoanSchemaDropDown from "../../components/Dropdowns/LoanSchemaDropDown";
import { storedList } from "../../util/localstorage";
import { productEnum } from "../../config/product";
import { getCompanyByIdWatcher } from "../../actions/company";

import {
  createProductWithConfigWatcher,
  getProductByCompanyAndProductWatcher,
} from "actions/product";

import {
  colendersListWatcher,
  productTypeListWatcher,
} from "../../actions/colenders.js";
import { validationsListWatcher } from "../../actions/validations.js";
import {
  verifyNumber,
  verifyFloat,
  VerifyPenalInterest,
  VerifyInterest,
  VerifyUpfront,
  VerifyRear,
  VerifyRearV2,
  verifyProductName,
  verifySubvention,
  positiveNumbers,
  enumFunction,
} from "../../util/helper";
import { productFields } from "./productFields";
import { AlertBox } from "../../components/AlertBox";
import { ProductAlertBox } from "components/ProductAlertBox";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";

class CreateProduct extends Component {
  constructor(props) {
    super(props);
    const URLdata = window.location.href;
    const urlArr = URLdata.split("/").slice(-3);
    const ids = urlArr.filter((key) => verifyNumber(key) === true);
    const companyId = URLdata.split("/").slice(-3)[0];
    const loanSchemaId = URLdata.split("/").slice(-2)[0];
    const loanSchemaName = URLdata.split("/").slice(-3)[2];

    this.state = {
      selectedCompany: "",
      showCompany: ids.length > 1 ? false : true,
      selectLoanSchema: loanSchemaName ? loanSchemaName : "",
      showLoanSchema: true,
      company_id: companyId ? companyId : id[0],
      loan_schema_id: loanSchemaId ? loanSchemaId : id[1],
      product_id: ids.length === 3 ? ids[2] : null,
      title: "Create product",
      productName: "",
      maxLoanAmount: "",
      intRateType: "",
      workDayWeek: "",
      colender: [],
      validation: [],
      productType: "",
      daysInCalenderYear: "",
      reconType: "",
      reconTypeState: "",
      beneficiaryBankSource: "Loan/Line",
      maximumNumberOfEmi: "",
      forceUsageConvertToEmi: "",
      repaymentSchedule: "",
      loanTenureType: "",
      aadhaar: "",
      pan: "",
      repaymentType: "",
      partyType: "",
      loanTenure: "",
      subventionFees: "",
      processingFees: "",
      usageFee: "",
      intValue: "",
      penalInterest: "",
      bounceCharges: "",
      bureauPartner: "",
      cancellationPeriod: "",
      minLoanAmount: "",
      //field validation state
      productNameState: "",
      maxLoanAmountState: "",
      intRateTypeState: "",
      productTypeState: "",
      interestType: "",
      interestTypeState: "",
      linePF: "",
      linePFState: "",
      workDayWeekState: "",
      repaymentScheduleState: "",
      repaymentDaysState: "",
      repaymentDays: "",
      loanTenureTypeState: "",
      aadhaarTypeState: "",
      panTypeState: "",
      repaymentTypeState: "",
      partyTypeState: "",
      loanTenureState: "",
      subventionFeesState: "",
      processingFeesState: "",
      usageFeeState: "",
      intValueState: "",
      penalInterestState: "has-success",
      bounceChargesState: "has-success",
      penalInterestDaysState: "",
      bureauPartnerState: "",
      cancellationPeriodState: "",
      minLoanAmountState: "",
      vintageState: "has-success",
      //product flags
      calculateBrokenInterest: "",
      insuranceCharges: "",
      stampCharges: "",
      applicatrionFees: "",
      convenienceFees: "",
      subventionBased: "",
      advanceEMI: "",
      calculateGstForProduct: "",
      enhancedReviewRequired: "",
      ckycSearch: "",
      bureauCheck: "",
      bureauParser: "",
      allowSubLoans: "",
      allowSubLoansState: "",
      allowLoc: "",
      isLenderSelectorFlag: "",
      foreclosure: "",
      foreclosureState: "",
      ascore: "",
      ascoreState: "",
      bscore: "",
      bscoreState: "",
      maximumNumberOfEmiState: "",
      forceUsageConvertToEmiState: "",
      lockInPeriod: "",
      lockInPeriodState: "",
      foreclosureCharge: "",
      foreclosureChargeState: "",
      foreclosureOfferDays: "",
      foreclosureOfferDaysState: "",
      foreclosureCheckState: false,
      minLoanAndSubLoanState: false, // this state will be used to determine whether allowSubLoans should be visible or not
      colenders: "",
      validations: "",
      colendersNameArray: [],
      coLender: [],
      validationCheck: [],
      productArray: "",
      product: "",
      is_Lender_Selector_Flag: "",
      names: [],
      downpayment: "",
      downpaymentState: "",
      cashCollateral: 0,
      cashCollateralState: "",
      pennyDrop: "",
      pennyDropState: "",
      withHoldState: "",
      withHold: "",
      workDayWeekptions: [
        {
          value: "5 days",
          label: "5 Days",
        },
        {
          value: "6 days",
          label: "6 Days",
        },
        {
          value: "7 days",
          label: "7 days",
        },
      ],
      repaymentScheduleOptions: [
        {
          value: "partner",
          label: "Partner",
        },
        {
          value: "custom",
          label: "Custom",
        },
      ],
      loanTenureOptions: [
        {
          value: "Month",
          label: "Month",
        },
        {
          value: "Fortnight",
          label: "Fortnight",
        },
        { value: "years", label: "Years" },
        {
          value: "Week",
          label: "Week",
        },
        {
          value: "Day",
          label: "Day",
        },
      ],

      adhaarOptions: enumFunction(productEnum.adhaar),

      panOptions: enumFunction(productEnum.pan),

      repaymentTypeOptions: [
        {
          value: "Daily",
          label: "Daily",
        },
        {
          value: "Weekly",
          label: "Weekly",
        },
        {
          value: "Monthly",
          label: "Monthly",
        },
        {
          value: "Bullet",
          label: "Bullet",
        },
      ],
      partyTypeOptions: enumFunction(productEnum.partyType),
      intRateTypeOptions: [
        {
          value: "flat",
          label: "Flat",
        },
        {
          value: "reducing",
          label: "Reducing",
        },
      ],
      interestTypeOptions: [
        {
          value: "upfront",
          label: "Upfront",
        },
        {
          value: "rearended",
          label: "Rearended",
        },
      ],
      linePFOptions: [
        {
          value: "drawdown",
          label: "drawdown",
        },
        {
          value: "repayment",
          label: "repayment",
        },
      ],
      bureuPartnerOptions: [
        {
          value: "CRIF",
          label: "CRIF",
        },
        {
          value: "CIBIL",
          label: "CIBIL",
        },
        {
          value: "EXPERIAN",
          label: "EXPERIAN",
        },
      ],
      productTypeOptions: [],
      colenderOptions: [],
      validationOptions: [],
      daysInCalenderYearOptions: [
        {
          value: "360",
          label: "360",
        },
        {
          value: "365",
          label: "365",
        },
      ],
      reconTypeOptions: [
        {
          value: "FIFO",
          label: "FIFO",
        },
        {
          value: "Invoice",
          label: "Invoice",
        },
      ],
      beneficiaryBankSourceOptions: [
        {
          value: "Loan/Line",
          label: "Loan/Line",
        },
        {
          value: "Disbursement/Drawdown",
          label: "Disbursement/Drawdown",
        },
      ],
      foreclosureOfferDaysOptions: [
        {
          value: 1,
          label: 1,
        },
        {
          value: 2,
          label: 2,
        },
        {
          value: 3,
          label: 3,
        },
        {
          value: 4,
          label: 4,
        },
      ],
      assetClassificationPolicyOptions: [
        {
          value: "Non-CL",
          label: "Non-CL",
        },
        {
          value: "CL",
          label: "CL",
        }
      ],
      firstInstallmentDateOptions: [
        {
          value: 1,
          label: 1,
        },
        {
          value: 2,
          label: 2,
        },
        {
          value: 3,
          label: 3,
        },
        {
          value: 4,
          label: 4,
        }, {
          value: 5,
          label: 5,
        },
        {
          value: 6,
          label: 6,
        },
        {
          value: 7,
          label: 7,
        },
        {
          value: 8,
          label: 8,
        },
        {
          value: 9,
          label: 9,
        },
        {
          value: 10,
          label: 10,
        },
        {
          value: 11,
          label: 11,
        },
        {
          value: 12,
          label: 12,
        },
        {
          value: 13,
          label: 13,
        },
        {
          value: 14,
          label: 14,
        },
        {
          value: 15,
          label: 15,
        },
        {
          label: 16,
          value: 16,
        },
        {
          value: 17,
          label: 17,
        },
        {
          value: 18,
          label: 18,
        },
        {
          value: 19,
          label: 19,
        },
        {
          value: 20,
          label: 20,
        },
        {
          value: 21,
          label: 21,
        },
        {
          value: 22,
          label: 22,
        },
        {
          value: 23,
          label: 23,
        },
        {
          value: 24,
          label: 24,
        },
        {
          value: 25,
          label: 25,
        },
        {
          value: 26,
          label: 26,
        },
        {
          value: 27,
          label: 27,
        },
        {
          value: 28,
          label: 28,
        },
        {
          value: 29,
          label: 29,
        },
        {
          value: 30,
          label: 30,
        },
        {
          value: 31,
          label: 31,
        }
      ],
      alert: false,
      severity: "",
      alertMessage: "",
      eNach: false,
      eNachState: "",
      bureauCoApplicant: "",
      bureauCoApplicantState: "",
      isMsmeAutomation: "",
      vintage: "1",
      firstInstallmentDate: "5",
      firstInstallmentDateState: "has-success",
      assetClassificationPolicyState: "",
      assetClassificationPolicy: ""
    };
  }

  handleDropdownChange = (value, stateName) => {
    if (Array.isArray(value)) {
      if (stateName == "colender") {
        const unique2 = value.filter((obj, index) => {
          return (
            index ===
            value.findIndex(
              (o) => obj.label === o.label && obj.value === o.value
            )
          );
        });

        if (this.state.coLender.length < value.length) {
          //add
          // if(!this.state.colender.includes((x) => x.value === value[value.length - 1].value)) {
          if (unique2.length == value.length) {
            const indexOfProduct = this.state.colenders.findIndex(
              (x) => x.co_lender_shortcode === value[value.length - 1].value
            );
            const targetcolender = this.state.colenders[indexOfProduct];

            const colenderObj = {
              value: value[value.length - 1].value,
              label: value[value.length - 1].label,
            };
            this.state.coLender.push(targetcolender);

            this.state.colender.push(colenderObj);
          } else {
            this.setState({
              alert: true,
              severity: "error",
              alertMessage: "colender already added",
            });
            setTimeout(() => {
              this.handleAlertClose();
            }, 4000);
            return false;
          }
        } else if (this.state.coLender.length > value.length) {
          //remove

          const filterArrayCoLender = this.state.coLender.filter((x) => {
            return value.some((v) => {
              return v.value === x.co_lender_shortcode;
            });
          });

          const filterArrayColender = this.state.colender.filter((x) => {
            return value.some((v) => {
              return v.value === x.value;
            });
          });
          this.setState({ coLender: filterArrayCoLender });
          this.setState({ colender: filterArrayColender });
        }
      } else if (stateName == "validation") {
        const unique2 = value.filter((obj, index) => {
          return (
            index ===
            value.findIndex(
              (o) => obj.label === o.label && obj.value === o.value
            )
          );
        });
        if (this.state.validation.length < value.length) {
          if (unique2.length == value.length) {
            const indexOfProduct = this.state.validations.findIndex(
              (x) => x.code === value[value.length - 1].value
            );
            const targetvalcheck = this.state.validations[indexOfProduct];
            const valCheckObj = {
              value: value[value.length - 1].value,
              label: value[value.length - 1].label,
            };

            this.state.validation.push(valCheckObj);
            this.state.validationCheck.push(targetvalcheck);
          } else {
            this.setState({
              alert: true,
              severity: "error",
              alertMessage: "Validation already added",
            });
            setTimeout(() => {
              this.handleAlertClose();
            }, 4000);
            return false;
          }
        } else if (this.state.validations.length > value.length) {
          //remove
          const filterArrayValidations = this.state.validations.filter((x) => {
            return value.some((v) => {
              return v.value === x.code;
            });
          });
          const filterArrayValidation = this.state.validation.filter((x) => {
            return value.some((v) => {
              return v.value === x.value;
            });
          });
          this.setState({ validation: filterArrayValidation });
          this.setState({ validations: filterArrayValidations });
        }
      }
    } else if (
      value?.label !== "" &&
      value?.label !== undefined &&
      value?.label !== null
    ) {
      this.setState({
        [stateName]: value,
        [stateName + "State"]: "has-success",
      });
      if (stateName == "assetClassificationPolicy"){
        this.setState({
          [stateName]: value?.value,
          [stateName + "State"]: "has-success",
        });
      }
      if (stateName == "firstInstallmentDate")
        this.setState({
          firstInstallmentDate: value?.value,
        });
      if (stateName == "selectedCompany")
        this.setState({
          company_id: value?.value,
          selectLoanSchema: "",
          loan_schema_id: "",
        });
      if (stateName == "selectLoanSchema")
        this.setState({
          loan_schema_id: value?.value,
        });
      if (stateName == "productType" && value != null) {
        const indexOfProduct = this.state.productArray.findIndex(
          (x) => x.product_type_name === value.value
        );
        this.setState({ product: this.state.productArray[indexOfProduct] });
      }
    } else {
      if (stateName == "productType" && value == null)
        this.setState({
          product: {
            product_type_name: "",
            product_type_code: "",
          },
        });
      if (stateName == "selectedCompany")
        this.setState({
          company_id: null,
          selectedCompany: "",
          selectLoanSchema: "",
          loan_schema_id: "",
        });
      this.setState({
        [stateName]: "",
        [stateName + "State"]: "has-danger",
      });
    }
  };

  change = (event, stateName, type, stateNameEqualTo, setState) => {
    switch (type) {
      case "name":
        if (
          verifyProductName(event.target.value) &&
          event.target.value.length >= stateNameEqualTo
        ) {
          this.setState({
            [stateName + "State"]: "has-success",
          });
        } else {
          this.setState({
            [stateName + "State"]: "has-danger",
          });
        }
        break;
      case "number":
        if (
          verifyNumber(event.target.value) &&
          event.target.value.length >= stateNameEqualTo
        ) {
          this.setState({
            [stateName + "State"]: "has-success",
          });
        } else {
          this.setState({
            [stateName + "State"]: "has-danger",
          });
        }
        break;
      case "float":
        if (event.target.value && verifyFloat(event.target.value)) {
          this.setState({
            [stateName + "State"]: "has-success",
          });
        } else {
          this.setState({
            [stateName + "State"]: "has-danger",
          });
        }
        break;
      case "overdues":
        if (VerifyPenalInterest(event.target.value)) {
          this.setState({
            [stateName + "State"]: "has-success",
          });
        } else {
          this.setState({
            [stateName + "State"]: "has-danger",
          });
        }
        break;
      case "subvention":
        if (verifySubvention(event.target.value)) {
          this.setState({
            [stateName + "State"]: "has-success",
          });
        } else {
          this.setState({
            [stateName + "State"]: "has-danger",
          });
        }
        break;
      case "rear":
        if (
          VerifyRear(event.target.value) ||
          (stateName === "overdueChargesPerDay" && event.target.value === "0")
        ) {
          this.setState({
            [stateName + "State"]: "has-success",
          });
        } else {
          this.setState({
            [stateName + "State"]: "has-danger",
          });
        }
        break;
      case "rear2":
        if (VerifyRearV2(event.target.value)) {
          this.setState({
            [stateName + "State"]: "has-success",
          });
        } else {
          this.setState({
            [stateName + "State"]: "has-danger",
          });
        }
        break;
      case "interest":
        if (VerifyInterest(event.target.value)) {
          this.setState({
            [stateName + "State"]: "has-success",
          });
        } else {
          this.setState({
            [stateName + "State"]: "has-danger",
          });
        }
        break;
      case "upfront":
        if (VerifyUpfront(event.target.value)) {
          this.setState({
            [stateName + "State"]: "has-success",
          });
        } else {
          this.setState({
            [stateName + "State"]: "has-danger",
          });
        }
        break;
      case "positiveNumbers":
        if (positiveNumbers(event.target.value)) {
          this.setState({
            [stateName + "State"]: "has-success",
          });
        } else {
          this.setState({
            [stateName + "State"]: "has-danger",
          });
        }
        break;
      default:
        break;
    }
    this.setState({
      [stateName]: event.target.value,
    });
  };

  handleClear = () => {
    this.setState({
      productName: "",
      maxLoanAmount: "",
      intRateType: "",
      workDayWeek: "",
      // co_lender: "",
      colender: [],
      daysInCalenderYear: "",
      reconType: "",
      reconTypeState: "",
      beneficiaryBankSource: "",
      productType: "",
      repaymentSchedule: "",
      loanTenureType: "",
      repaymentType: "",
      partyType: "",
      loanTenure: "",
      subventionFees: "",
      processingFees: "",
      usageFee: "",
      intValue: "",
      penalInterest: "",
      bounceCharges: "",

      cancellationPeriod: "",
      minLoanAmount: "",
      productNameState: "",
      maxLoanAmountState: "",
      intRateTypeState: "",
      productTypeState: "",
      interestType: "",
      interestTypeState: "",
      linePF: "",
      linePFState: "",
      workDayWeekState: "",
      repaymentScheduleState: "",
      repaymentDaysState: "",
      repaymentDays: "",
      loanTenureTypeState: "",
      aadhaarTypeState: "",
      panTypeState: "",
      aadhaar: "",
      pan: "",
      repaymentTypeState: "",
      partyTypeState: "",
      loanTenureState: "",
      subventionFeesState: "",
      processingFeesState: "",
      usageFeeState: "",
      intValueState: "",
      penalInterestState: "has-success",
      bounceChargesState: "has-success",

      cancellationPeriodState: "",
      minLoanAmountState: "",
      vintageState: "",
      maximumNumberOfEmi: "",
      forceUsageConvertToEmi: 0,
      //checkboxes
      calculateBrokenInterest: "",
      insuranceCharges: "",
      stampCharges: "",
      applicatrionFees: "",
      convenienceFees: "",
      subventionBased: "",
      advanceEMI: "",
      calculateGstForProduct: "",
      enhancedReviewRequired: "",
      ckycSearch: "",
      bureauCheck: "",
      bureauParser: "",
      allowSubLoans: "",
      allowLoc: "",
      alert: false,
      severity: "",
      alertMessage: "",
      minLoanAndSubLoanState: "",
      foreclosure: "",
      foreclosureState: "",
      ascore: "",
      isLenderSelectorFlag: "",
      ascoreState: "",
      bscore: "",
      bscoreState: "",
      lockInPeriod: "",
      lockInPeriodState: "",
      foreclosureCharge: "",
      foreclosureChargeState: "",
      foreclosureOfferDays: "",
      foreclosureOfferDaysState: "",
      foreclosureCheckState: "",
      bureauPartner: "",
      maximumNumberOfEmiState: "has-success",
      downpayment: "",
      downpaymentState: "",
      cashCollateral: 0,
      cashCollateralState: "",
      pennyDrop: "",
      pennyDropState: "",
      withHoldState: "",
      withHold: "",
      eNach: false,
      eNachState: "",
      bureauCoApplicant: "",
      bureauCoApplicantState: "",
      isMsmeAutomation: "",
      firstInstallmentDate: "",
      vintage: "",
    });
  };

  isValidated = () => {
    if (this.state.productNameState !== "has-success")
      this.setState({
        productNameState: "has-danger",
      });
    if (this.state.maxLoanAmountState !== "has-success")
      this.setState({
        maxLoanAmountState: "has-danger",
      });
    if (this.state.intRateTypeState !== "has-success")
      this.setState({
        intRateTypeState: "has-danger",
      });
    if (this.state.interestTypeState !== "has-success")
      this.setState({
        interestTypeState: "has-danger",
      });
    if (this.state.workDayWeekState !== "has-success")
      this.setState({
        workDayWeekState: "has-danger",
      });
    if (this.state.repaymentScheduleState !== "has-success")
      this.setState({
        repaymentScheduleState: "has-danger",
      });
    if (this.state.loanTenureTypeState !== "has-success")
      this.setState({
        loanTenureTypeState: "has-danger",
      });
    if (this.state.repaymentTypeState !== "has-success")
      this.setState({
        repaymentTypeState: "has-danger",
      });
    if (this.state.partyTypeState !== "has-success")
      this.setState({
        partyTypeState: "has-danger",
      });
    if (this.state.productTypeState !== "has-success")
      this.setState({
        productTypeState: "has-danger",
      });
    if (this.state.loanTenureState !== "has-success")
      this.setState({
        loanTenureState: "has-danger",
      });
    if (this.state.feesState !== "has-success")
      this.setState({
        feesState: "has-danger",
      });
    if (this.state.subventionFeesState !== "has-success")
      this.setState({
        subventionFeesState: "has-danger",
      });
    if (this.state.processingFeesState !== "has-success")
      this.setState({
        processingFeesState: "has-danger",
      });
    if (this.state.usageFeeState !== "has-success")
      this.setState({
        usageFeeState: "has-danger",
      });
    if (this.state.upfrontInterestState !== "has-success")
      this.setState({
        upfrontInterestState: "has-danger",
      });
    if (this.state.intValueState !== "has-success")
      this.setState({
        intValueState: "has-danger",
      });
    if (this.state.interestFreeDaysState !== "has-success")
      this.setState({
        interestFreeDaysState: "has-danger",
      });
    if (this.state.tenureInDaysState !== "has-success")
      this.setState({
        tenureInDaysState: "has-danger",
      });
    if (this.state.gracePeriodState !== "has-success")
      this.setState({
        gracePeriodState: "has-danger",
      });
    if (this.state.overdueChargesPerDayState !== "has-success")
      this.setState({
        overdueChargesPerDayState: "has-danger",
      });
    if (this.state.overdueDaysState !== "has-success")
      this.setState({
        overdueDaysState: "has-danger",
      });
    if (this.state.penalInterestDaysState !== "has-success")
      this.setState({
        penalInterestDaysState: "has-danger",
      });
    if (this.state.upfrontInterestDaysState !== "has-success")
      this.setState({
        upfrontInterestDaysState: "has-danger",
      });
    if (this.state.brokenInterestRateState !== "has-success")
      this.setState({
        brokenInterestRateState: "has-danger",
      });
    if (this.state.assetClassificationPolicyState !== "has-success")
      this.setState({
        assetClassificationPolicyState: "has-danger",
      });
    if (this.state.cancellationPeriodState !== "has-success")
      this.setState({
        cancellationPeriodState: "has-danger",
      });
    if (this.state.allowLoc) {
      if (this.state.linePFState !== "has-success")
        this.setState({
          linePFState: "has-danger",
        });
      if (this.state.reconTypeState !== "has-success")
        this.setState({
          reconTypeState: "has-danger",
        });
      if (this.state.minLoanAmountState !== "has-success")
        this.setState({
          minLoanAmountState: "has-danger",
        });
      if (this.state.vintageState !== "has-success")
        this.setState({
          vintageState: "has-danger",
        });
      if (this.state.repaymentDaysState !== "has-success")
        this.setState({
          repaymentDaysState: "has-danger",
        });
      if (this.state.allowSubLoansState !== "has-success")
        this.setState({
          allowSubLoansState: "has-danger",
        });
      if (this.state.bureauPartnerState !== "has-success")
        this.setState({
          bureauPartnerState: "has-danger",
        });
    }
    let checkNumberFlag = false;
    if (
      this.state.maximumNumberOfEmiState === "has-danger" ||
      this.state.bounceChargesState === "has-danger" ||
      this.state.penalInterestState === "has-danger"
    ) {
      checkNumberFlag = true;
    }
    if (this.state.foreclosure) {
      if (this.state.foreclosureChargeState !== "has-success")
        this.setState({
          foreclosureChargeState: "has-danger",
        });
      if (this.state.foreclosureOfferDaysState !== "has-success")
        this.setState({
          foreclosureOfferDaysState: "has-danger",
        });
      if (this.state.lockInPeriodState !== "has-success") {
        this.setState({
          lockInPeriodState: "has-danger",
        });
      }
    }
    if (this.state.isMsmeAutomation) {
      if (this.state.firstInstallmentDateState !== "has-success") {
        this.setState({
          firstInstallmentDateState: "has-danger",
        });
      }
    }

    if (this.state.cashCollateral) {
      if (this.state.withHoldState !== "has-success") {
        this.setState({
          withHoldState: "has-danger",
        });
      }
    }
    if (
      this.state.productNameState === "has-success" &&
      this.state.maxLoanAmountState === "has-success" &&
      this.state.intRateTypeState === "has-success" &&
      this.state.workDayWeekState === "has-success" &&
      this.state.repaymentScheduleState === "has-success" &&
      this.state.loanTenureTypeState === "has-success" &&
      this.state.repaymentTypeState === "has-success" &&
      ((this.state.isMsmeAutomation !== true && this.state.partyTypeState == "has-success") || (this.state.isMsmeAutomation === true)) &&
      this.state.productTypeState == "has-success" &&
      this.state.loanTenureState === "has-success" &&
      this.state.subventionFeesState === "has-success" &&
      this.state.processingFeesState === "has-success" &&
      this.state.usageFeeState === "has-success" &&
      this.state.intValueState === "has-success" &&
      this.state.cancellationPeriodState === "has-success" &&
      this.state.bureauPartnerState === "has-success" &&
      this.state.interestTypeState === "has-success" &&
      this.state.assetClassificationPolicyState === "has-success"
    ) {
      if (
        (this.state.allowLoc &&
          (this.state.minLoanAmountState !== "has-success" ||
            this.state.repaymentDaysState !== "has-success" ||
            this.state.reconTypeState !== "has-success")) ||
        (this.state.foreclosure &&
          (this.state.foreclosureChargeState !== "has-success" ||
            this.state.foreclosureOfferDaysState !== "has-success" ||
            this.state.lockInPeriodState !== "has-success")) ||
        (this.state.cashCollateral &&
          this.state.withHoldState !== "has-success") ||
        (this.state.isMsmeAutomation &&
          (this.state.vintageState !== "has-success" ||
            this.state.firstInstallmentDateState !== "has-success")) ||
        checkNumberFlag
      ) {
        this.setState({
          alert: true,
          severity: "error",
          alertMessage:
            "Enter data in all the fields, all are mandatory except checkbox.",
        });
        setTimeout(() => {
          this.handleAlertClose();
        }, 4000);
        return false;
      }
      return true;
    } else {
      this.setState({
        alert: true,
        severity: "error",
        alertMessage:
          "Enter data in all the fields, all are mandatory except checkbox.",
      });
      setTimeout(() => {
        this.handleAlertClose();
      }, 4000);
      return false;
    }
  };

  showAlert = (msg, type) => {
    this.setState({ alert: true, severity: type, alertMessage: msg }, () => {
      setTimeout(() => {
        this.handleAlertClose();
      }, 3000);
    });
  };

  handleAddProduct = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    const { maxLoanAmount, minLoanAmount } = this.state;
    const user = storedList("user");
    let data = {};
    const isValidated = true;
    if (maxLoanAmount && minLoanAmount) {
      if (Number(maxLoanAmount) < Number(minLoanAmount))
        return this.showAlert(
          "Min limit should be less than max limit",
          "error"
        );
    }
    if (
      this.state.coLender.length != 0 &&
      this.state.product.product_type_name === ""
    )
      return this.showAlert("Please select a productType", "error");
    if (isValidated == this.isValidated()) {
      data = {
        company_id: this.state.company_id,
        loan_schema_id: this.state.loan_schema_id,
        user_id: user._id,
        product_id: this.state.product_id,
        name: this.state.productName,
        max_loan_amount: this.state.maxLoanAmount,
        interest_rate_type: this.state.intRateType?.value,
        workday_weeek: this.state.workDayWeek?.value,
        repayment_schedule: this.state.repaymentSchedule?.value,
        loan_tenure_type: this.state.loanTenureType?.value,
        aadhaar_type: this.state.aadhaar?.value,
        pan_type: this.state.pan?.value,
        repayment_type: this.state.repaymentType?.value,
        party_type: this.state.partyType?.value,
        loan_tenure: this.state.loanTenure,
        subvention_fees: this.state.subventionFees,
        processing_fees: this.state.processingFees,
        usage_fee: this.state.usageFee,
        int_value: this.state.intValue,
        interest_free_days: this.state.interestFreeDays,
        exclude_interest_till_grace_period:
          this.state.excludeInterestTillGracePeriod,
        tenure_in_days: this.state.tenureInDays,
        grace_period: this.state.gracePeriod,
        overdue_charges_per_day: this.state.overdueChargesPerDay,
        penal_interest: this.state.penalInterest || 0,
        bounce_charges: this.state.bounceCharges || 0,
        cancellation_period: this.state.cancellationPeriod,
        min_loan_amount: this.state.minLoanAmount,
        vintage: this.state.vintage,
        first_installment_date: this.state.firstInstallmentDate,
        assetClassificationPolicy: this.state.assetClassificationPolicy,
        asset_classification_policy: this.state.assetClassificationPolicy,
        calculate_broken_interest: this.state.calculateBrokenInterest,
        insurance_charges: this.state.insuranceCharges,
        stamp_charges: this.state.stampCharges,
        application_fee: this.state.applicatrionFees,
        convenience_fees: this.state.convenienceFees,
        subvention_based: this.state.subventionBased,
        advance_emi: this.state.advanceEMI,
        calculateGstForProduct: this.state.calculateGstForProduct,
        enhanced_review_required: this.state.enhancedReviewRequired,
        bureau_partner_name: this.state.bureauPartner?.value,
        ckyc_search: this.state.ckycSearch,
        bureau_check: this.state.bureauCheck,
        bureau_parser: this.state.bureauParser,
        allow_sub_loans: this.state.allowSubLoans,
        allow_loc: this.state.allowLoc,
        interest_type: this.state.interestType.value,
        line_pf: this.state.linePF.value,
        repayment_days: this.state.repaymentDays,
        lock_in_period: this.state.lockInPeriod,
        foreclosure: this.state.foreclosure,
        foreclosure_charge: this.state.foreclosureCharge,
        fc_offer_days: this.state.foreclosureOfferDays?.value,
        a_score: this.state.ascore,
        is_lender_selector_flag:
          this.state.isLenderSelectorFlag == true ? "Y" : "N",
        is_msme_automation_flag:
          this.state.isMsmeAutomation == true ? "Y" : "N",
        product_type_name:
          JSON.stringify(this.state.product) === "{}"
            ? ""
            : this.state.product.product_type_name,
        product_type_code:
          JSON.stringify(this.state.product) === "{}"
            ? ""
            : this.state.product.product_type_code,
        co_lenders: this.state.coLender,
        validations: this.state.validations,
        days_in_year: this.state.daysInCalenderYear?.value,
        recon_type: this.state.reconType?.value,
        beneficiary_bank_source: this.state.beneficiaryBankSource.value
          ? this.state.beneficiaryBankSource.value
          : this.state.beneficiaryBankSource,
        b_score: this.state.bscore,
        maximum_number_of_emi: this.state.maximumNumberOfEmi,
        force_usage_convert_to_emi: this.state.forceUsageConvertToEmi,
        downpayment: this.state.downpayment,
        cash_collateral: this.state.cashCollateral,
        penny_drop: this.state.pennyDrop,
        withhold_amount: this.state.withHold,
        e_nach: this.state.eNach,
        bureau_co_applicant: this.state.bureauCoApplicant,
      };


      new Promise((resolve, reject) => {
        this.props.createProductWithConfigWatcher(data, resolve, reject);
      })
        .then((response) => {
          if (this.state.product_id === null) {
            this.handleClear();
          }
          return this.showAlert(response.message, "success");
        })
        .catch((error) => {
          return this.showAlert(error?.response?.data?.message, "error");
        });
    }
  };

  fetchColendersList = () => {
    const payload = {};
    // let names = [];
    let codes = [];
    let colenders = [];
    new Promise((resolve, reject) => {
      this.props.colendersListWatcher(payload, resolve, reject);
    })
      .then((res) => {
        for (var i = 0; i < res.length; i++) {
          this.state.names.push({
            label: res[i].co_lender_name,
            value: res[i].co_lender_shortcode,
          });
          // codes.push(res[i].colender_shortcode);
          colenders.push({
            co_lender_id: res[i].co_lender_id,
            // co_lender_name: res[i].co_lender_name,
            co_lender_shortcode: res[i].co_lender_shortcode,
          });
        }
        const sortedArray = this.state.names.sort();
        this.setState({ colenderOptions: sortedArray });
        this.setState({ colenders: colenders });
      })

      .catch((error) => {
        // setTimeout(() => { }, 4000);
      });
  };

  fetchValidationList = () => {
    const payload = {};
    let tempvalidations = [];
    let validCheck = [];
    new Promise((resolve, reject) => {
      this.props.validationsListWatcher(payload, resolve, reject);
    })
      .then((res) => {
        for (var i = 0; i < res.length; i++) {
          tempvalidations.push({
            label: res[i].details,
            value: res[i].code,
          });
          validCheck.push({
            code: res[i].code,
            validation_id: res[i].validation_id,
            details: res[i].details,
          });
        }
        this.setState({ validationOptions: tempvalidations });
        this.setState({ validations: validCheck });
      })

      .catch((error) => {
        // setTimeout(() => { }, 4000);
      });
  };

  fetchProductTypeList = () => {
    const payload = {};
    let name = [];
    new Promise((resolve, reject) => {
      this.props.productTypeListWatcher(payload, resolve, reject);
    })
      .then((response) => {
        // setProductTypeList(response);

        this.setState({ productArray: response });
        for (var i = 0; i < response.length; i++) {
          name.push({
            value: response[i].product_type_name,
            label: response[i].product_type_name,
          });
        }
        const sortedArray = name.sort();
        this.setState({ productTypeOptions: sortedArray });
      })
      .catch((error) => {
        console.error(error);
        // setAlert(true);
        // setSeverity("error");
        // setAlertMessage(error.response.data.message);
        // setTimeout(() => {
        //   handleAlertClose();
        // }, 4000);
      });
  };

  getCompanyDetails = () => {
    const user = storedList("user");
    new Promise((resolve, reject) => {
      this.props.getCompanyByIdWatcher(this.state.company_id, resolve, reject);
    })
      .then((result) => {
        this.setState({ selectedCompany: result.billing_name });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount = () => {
    this.fetchValidationList();
    this.getCompanyDetails();
    this.fetchColendersList();
    this.fetchProductTypeList();

    if (
      this.state.product_id !== null &&
      this.state.company_id !== null &&
      this.state.loan_schema_id !== null
    ) {
      const user = storedList("user");
      const data = {
        user_id: user._id,
        company_id: this.state.company_id,
        product_id: this.state.product_id,
        loan_schema_id: this.state.loan_schema_id,
      };
      new Promise((resolve, reject) => {
        this.props.getProductByCompanyAndProductWatcher(data, resolve, reject);
      })
        .then((response) => {
          if (response.dpdrecords?.name) {
            let co_lender_label = [];
            let val_check_label = [];
            let res = response.dpdrecords.co_lenders;
            let valCheck = response.dpdrecords.validations;

            for (var i = 0; i < valCheck.length; i++) {
              val_check_label.push({
                label: valCheck[i].details,
                value: valCheck[i].code,
              });
            }

            for (var i = 0; i < res.length; i++) {
              this.state.coLender.push({
                co_lender_id: res[i].co_lender_id,

                co_lender_shortcode: res[i].co_lender_shortcode,
              });

              const colenderobj = this.state.names.find(
                (x) => x.value === res[i].co_lender_shortcode
              );
              if (colenderobj != null) {
                co_lender_label.push(colenderobj);
              }
            }

            this.setState({
              company_id: response.dpdrecords.company_id,
              loan_schema_id: response.dpdrecords.loan_schema_id,
              productName: response.dpdrecords.name,
              maxLoanAmount: response.dpdrecords.max_loan_amount,
              intRateType: {
                value: response.dpdrecords.interest_rate_type
                  ? response.dpdrecords.interest_rate_type
                  : "",
                label: response.dpdrecords.interest_rate_type
                  ? response.dpdrecords.interest_rate_type
                  : "",
              },
              interestType: {
                value: response.dpdrecords.interest_type
                  ? response.dpdrecords.interest_type
                  : "",
                label: response.dpdrecords.interest_type
                  ? response.dpdrecords.interest_type
                  : "",
              },
              linePF: {
                value: response.dpdrecords.line_pf
                  ? response.dpdrecords.line_pf
                  : "",
                label: response.dpdrecords.line_pf
                  ? response.dpdrecords.line_pf
                  : "",
              },
              workDayWeek: {
                value: response.dpdrecords.workday_weeek,
                label: response.dpdrecords.workday_weeek,
              },
              productType: {
                value: response.dpdrecords.product_type_name
                  ? response.dpdrecords.product_type_name
                  : "",
                label: response.dpdrecords.product_type_name
                  ? response.dpdrecords.product_type_name
                  : "",
              },

              colender: co_lender_label,
              validation: val_check_label,

              daysInCalenderYear: {
                value: response.dpdrecords.days_in_year
                  ? response.dpdrecords.days_in_year
                  : "",
                label: response.dpdrecords.days_in_year
                  ? response.dpdrecords.days_in_year
                  : "",
              },
              reconType: {
                value: response.dpdrecords.recon_type
                  ? response.dpdrecords.recon_type
                  : "",
                label: response.dpdrecords.recon_type
                  ? response.dpdrecords.recon_type
                  : "",
              },
              beneficiaryBankSource: {
                value: response.dpdrecords.beneficiary_bank_source
                  ? response.dpdrecords.beneficiary_bank_source
                  : "Loan/Line",
                label: response.dpdrecords.beneficiary_bank_source
                  ? response.dpdrecords.beneficiary_bank_source
                  : "Loan/Line",
              },
              repaymentSchedule: {
                value: response.dpdrecords.repayment_schedule,
                label: response.dpdrecords.repayment_schedule,
              },
              loanTenureType: {
                value: response.dpdrecords.loan_tenure_type,
                label: response.dpdrecords.loan_tenure_type,
              },

              aadhaar: {
                value: response.dpdrecords.aadhaar_type
                  ? response.dpdrecords.aadhaar_type
                  : "",
                label: response.dpdrecords.aadhaar_type
                  ? response.dpdrecords.aadhaar_type
                  : "",
              },

              pan: {
                value: response.dpdrecords.pan_type
                  ? response.dpdrecords.pan_type
                  : "",
                label: response.dpdrecords.pan_type
                  ? response.dpdrecords.pan_type
                  : "",
              },

              repaymentType: {
                value: response.dpdrecords.repayment_type,
                label: response.dpdrecords.repayment_type,
              },
              partyType: {
                value: response.dpdrecords.party_type
                  ? response.dpdrecords.party_type
                  : "",
                label: response.dpdrecords.party_type
                  ? response.dpdrecords.party_type
                  : "",
              },
              bureauPartner: {
                value: response.dpdrecords.bureau_partner_name
                  ? response.dpdrecords.bureau_partner_name
                  : "",
                label: response.dpdrecords.bureau_partner_name
                  ? response.dpdrecords.bureau_partner_name
                  : "",
              },
              foreclosureOfferDays: {
                value: response.dpdrecords.fc_offer_days
                  ? response.dpdrecords.fc_offer_days
                  : "",
                label: response.dpdrecords.fc_offer_days
                  ? response.dpdrecords.fc_offer_days
                  : "",
              },

              product: {
                product_type_name: response.dpdrecords.product_type_name,
                product_type_code: response.dpdrecords.product_type_code,
              },

              loanTenure: response.dpdrecords.loan_tenure,
              subventionFees: response.dpdrecords.subvention_fees,
              processingFees: response.dpdrecords.processing_fees,
              usageFee: response.dpdrecords.usage_fee,
              intValue: response.dpdrecords.int_value,
              penalInterest: response.dpdrecords.penal_interest || "",
              bounceCharges: response.dpdrecords.bounce_charges || "",
              cancellationPeriod: response.dpdrecords.cancellation_period,
              minLoanAmount: response.dpdrecords.min_loan_amount,
              vintage: response.dpdrecords.vintage,
              firstInstallmentDate: response.dpdrecords.first_installment_date,
              assetClassificationPolicy: response.dpdrecords.asset_classification_policy,
              calculateBrokenInterest:
                response.dpdrecords.calculate_broken_interest,
              insuranceCharges: response.dpdrecords.insurance_charges,
              stampCharges: response.dpdrecords.stamp_charges,
              applicatrionFees: response.dpdrecords.application_fee,
              convenienceFees: response.dpdrecords.convenience_fees,
              subventionBased: response.dpdrecords.subvention_based,
              advanceEMI: response.dpdrecords.advance_emi,
              calculateGstForProduct:
                response.dpdrecords.calculateGstForProduct,
              enhancedReviewRequired:
                response.dpdrecords.enhanced_review_required,
              ckycSearch: response.dpdrecords.ckyc_search,
              bureauCheck: response.dpdrecords.bureau_check,
              bureauParser: response.dpdrecords.bureau_parser,
              allowSubLoans: response.dpdrecords.allow_sub_loans,
              allowLoc: response.dpdrecords.allow_loc,
              interest_type: response.dpdrecords.interest_type,
              repaymentDays: response.dpdrecords?.repayment_days,
              foreclosure: response.dpdrecords.foreclosure,
              ascore: response.dpdrecords.a_score,
              bscore: response.dpdrecords.b_score,
              foreclosureCharge: response.dpdrecords.foreclosure_charge,
              lockInPeriod: response.dpdrecords.lock_in_period,
              isLenderSelectorFlag:
                response.dpdrecords.is_lender_selector_flag == "Y"
                  ? true
                  : false,
              isMsmeAutomation:
                response.dpdrecords?.is_msmse_automation == "Y"
                  ? true
                  : false,
              cashCollateral: response.dpdrecords?.cash_collateral,
              withHold: response.dpdrecords?.withhold_amount,
              pennyDrop: response.dpdrecords?.penny_drop,
              maximumNumberOfEmi: response.dpdrecords.maximum_number_of_emi,
              forceUsageConvertToEmi:
                response.dpdrecords.force_usage_convert_to_emi,
              downpayment: response.dpdrecords.downpayment,
              bureauCoApplicant: response.dpdrecords?.bureau_co_applicant,
              productNameState: "has-success",
              maxLoanAmountState: "has-success",
              intRateTypeState: "has-success",
              productTypeState: "has-success",
              workDayWeekState: "has-success",
              repaymentScheduleState: "has-success",
              loanTenureTypeState: "has-success",
              repaymentTypeState: "has-success",
              partyTypeState: "has-success",
              loanTenureState: "has-success",
              subventionFeesState: "has-success",
              processingFeesState: "has-success",
              usageFeeState: "has-success",
              intValueState: "has-success",
              penalInterestState: "has-success",
              bounceChargesState: "has-success",
              cancellationPeriodState: "has-success",
              bureauPartnerState: "has-success",
              interestTypeState: "has-success",
              linePFState: "has-success",
              lockInPeriodState: "has-success",
              foreclosureChargeState: "has-success",
              foreclosureOfferDaysState: "has-success",
              maximumNumberOfEmiState: "has-success",
              ascoreState: "has-success",
              pennyDropState: "has-success",
              bscoreState: "has-success",
              title: "Update product",
              downpaymentState: "has-success",
              eNach: response.dpdrecords?.cash_collateral,
              bureauCoApplicantState: "has-success",
            });
          }
          if (response.dpdrecords.allow_loc) {
            this.setState({ minLoanAndSubLoanState: true });
            if (response.dpdrecords.min_loan_amount) {
              this.setState({ minLoanAmountState: "has-success" });
            } else this.setState({ minLoanAmountState: "has-danger" });

            if (response.dpdrecords.repayment_days) {
              this.setState({ repaymentDaysState: "has-success" });
            } else this.setState({ repaymentDaysState: "has-danger" });

            if (response.dpdrecords.recon_type) {
              this.setState({ reconTypeState: "has-success" });
            } else this.setState({ reconTypeState: "has-danger" });
          }
          if (response.dpdrecords.foreclosure) {
            this.setState({ foreclosureCheckState: true });
          }
          if (response.dpdrecords.cash_collateral) {
            this.setState({ cashCollateralState: true });
          }
          if (response.dpdrecords.e_nach) {
            this.setState({ eNach: true });
          }
          if (response.dpdrecords.is_msmse_automation) {
            if (response.dpdrecords.vintage) {
              this.setState({ vintageState: "has-success" });
            } else this.setState({ vintageState: "has-danger" });

            if (response.dpdrecords.vintage) {
              this.setState({ firstInstallmentDateState: "has-success" });
            } else this.setState({ firstInstallmentDateState: "has-danger" });
          }
        })
        .catch((error) => {
          this.setState({
            alert: true,
            severity: "error",
            alertMessage: error.response.data.message,
            company_id: null,
            product_id: null,
            loan_schema_id: null,
            showCompany: true,
            showLoanSchema: true,
            title: "Create product",
          });
          setTimeout(() => {
            this.handleAlertClose();
          }, 4000);
        });
    }
  };

  handleAlertClose = () => {
    this.setState({
      severity: "",
      alertMessage: "",
      alert: false,
    });
  };

  handleProductBack = () => {
    this.setState({
      isCreateProduct: false,
      schemaid: "",
      isLoanType: true,
    });
  };

  handleCheck = (name) => (event) => {
    this.setState({
      [name]: event.target.checked ? 1 : 0,
    });

    if (name === "isLenderSelectorFlag" && event.target.checked) {
      this.setState({
        isLenderSelectorFlag: true,
      });
    } else if (name === "isLenderSelectorFlag" && !event.target.checked) {
      this.setState({
        isLenderSelectorFlag: false,
        daysInCalenderYear: {
          value: "",
          label: "",
        },
      });
    }

    if (name === "cashCollateral" && event.target.checked) {
      this.setState({
        cashCollateralState: true,
      });
    } else if (name === "cashCollateral" && !event.target.checked) {
      this.setState({
        cashCollateralState: false,
        withHold: "",
        withHoldState: "",
      });
    }
    if (name === "allowLoc" && event.target.checked) {
      this.setState({
        minLoanAndSubLoanState: true,
        linePFState: "",
        linePF: { value: "", label: "" },
      });
    } else if (name === "allowLoc" && !event.target.checked) {
      this.setState({
        minLoanAndSubLoanState: false,
        allowSubLoans: 0,
        minLoanAmount: "",
        repaymentDays: "",
        repaymentDaysState: "",
        minLoanAmountState: "",
        linePFState: "",
        linePF: { value: "", label: "" },
        maximumNumberOfEmi: "",
        forceUsageConvertToEmi: 0,
        reconTypeState: "",
        reconType: {
          value: "",
          label: "",
        },
      });
    } else if (name === "allowSubLoans" && !event.target.checked) {
      this.setState({
        maximumNumberOfEmi: "",
        forceUsageConvertToEmi: 0,
        linePFState: "",
      });
    } else if (name == "eNach" && event.target.checked) {
      this.setState({
        eNach: true,
      });
    } else if (name == "eNach" && !event.target.checked) {
      this.setState({
        eNach: false,
      });
    }

    if (name === "foreclosure" && event.target.checked) {
      this.setState({
        foreclosureCheckState: true,
      });
    } else if (name === "foreclosure" && !event.target.checked) {
      this.setState({
        foreclosureCheckState: false,
        foreclosureCharge: "",
        foreclosureOfferDays: {
          value: "",
          label: "",
        },
        lockInPeriod: "",
      });
    }

    if (name === "isMsmeAutomation" && event.target.checked) {
      this.setState({
        isMsmeAutomation: true
      });
    } else if (name === "isMsmeAutomation" && !event.target.checked) {
      this.setState({
        isMsmeAutomation: false,
        firstInstallmentDate: { value: "", label: "" },
        firstInstallmentDate: "",
        firstInstallmentDateState: false,
        vintageState: false,
        vintage: ""
      });
    }

  };

  render() {
    const { classes } = this.props;

    return (
      <>
        <CardContent>
          <Grid item xs={12}>
            {this.state.alert ? (
              <ProductAlertBox
                severity={this.state.severity}
                msg={this.state.alertMessage}
                onClose={this.handleAlertClose}
              />
            ) : null}
          </Grid>
          <Typography
            id="keep-mounted-modal-title"
            display="block"
            sx={{
              fontWeight: "bold",
              margin: "0.812rem",
            }}
            variant="h6"
          >
            {this.state.title}
          </Typography>
          <Box
            sx={{
              marginLeft: "20px",
            }}
            py={3}
            mb={20}
          >
            <Grid container>
              <Grid container item xs={12} spacing={1}>
                <Grid xs={12} sm={4} item>
                  <CompanyDropdown
                    placeholder="Select company"
                    onCompanyChange={(value) =>
                      this.handleDropdownChange(value, "selectedCompany")
                    }
                    company={this.state.selectedCompany ?? ""}
                    isDisabled={this.state.company_id ? true : false}
                  />
                </Grid>
                <Grid xs={12} sm={4} item>
                  <LoanSchemaDropDown
                    placeholder="Select loan schema"
                    valueData={this.state.selectLoanSchema}
                    company_id={this.state.company_id}
                    onValueChange={(value) =>
                      this.handleDropdownChange(value, "selectLoanSchema")
                    }
                    isDisabled={this.state.selectLoanSchema ? true : false}
                  />
                </Grid>
                <Grid md={12}>
                  <Divider
                    textAlign="left"
                    sx={{
                      margin: "10px 0",
                    }}
                  />
                </Grid>
              </Grid>
              <Grid xs={12} sm={4} item>
                <LoanSchemaDropDown
                  placeholder="Select loan schema"
                  valueData={this.state.selectLoanSchema}
                  company_id={this.state.company_id}
                  onValueChange={(value) =>
                    this.handleDropdownChange(value, "selectLoanSchema")
                  }
                  isDisabled={true}
                />
              </Grid>
              <Grid md={12}>
                <Divider
                  textAlign="left"
                  sx={{
                    margin: "10px 0",
                  }}
                />
              </Grid>
            </Grid>
            <Grid container xs={12} spacing={1}>
              {productFields(this.state).map((field, index) => {
                let flag = false;
                let foreClosureFlag = false;
                let iscolenderflag = false;
                let isrecontypeflag = false;
                let cashCollateralFlag = false;
                let isMsmeAutomationFlag = false;

                let forceUsage = false;
                if (
                  !this.state.minLoanAndSubLoanState &&
                  (field.name === "allowSubLoans" ||
                    field.name === "minLoanAmount" ||
                    field.name === "linePF" ||
                    field.name === "repaymentDays")
                )
                  flag = true;
                if (
                  !this.state.foreclosureCheckState &&
                  (field.name === "foreclosureCharge" ||
                    field.name === "foreclosureOfferDays" ||
                    field.name === "lockInPeriod")
                )
                  foreClosureFlag = true;
                if (
                  !this.state.isLenderSelectorFlag &&
                  field.name === "daysInCalenderYear"
                )
                  iscolenderflag = true;
                if (
                  !this.state.cashCollateralState &&
                  field.name === "withHold"
                )
                  cashCollateralFlag = true;
                if (
                  !this.state.isMsmeAutomation &&
                  (field.name === "firstInstallmentDate" || field.name === "vintage")
                )
                  isMsmeAutomationFlag = true;
                if (!this.state.allowLoc && field.name === "reconType")
                  isrecontypeflag = true;
                if (
                  !this.state.allowSubLoans &&
                  (field.name === "forceUsageConvertToEmi" ||
                    field.name === "maximumNumberOfEmi")
                )
                  forceUsage = true;
                return (
                  (field.createAllow && field.component !== "checkbox") &&
                  <Grid key={index} xs={12} md={4} item>
                    {field.component === "text" && field.createAllow ? (
                      <FormControl
                        sx={{
                          m: 1,
                          width: "100%",
                        }}
                        variant="standard"
                      >
                        <TextField
                          variant="standard"
                          label={field.placeholder}
                          type={field.type}
                          error={field.resultState === "has-danger"}
                          disabled={
                            (field.name === "vintage" && isMsmeAutomationFlag) ||
                            flag ||
                            foreClosureFlag ||
                            forceUsage ||
                            cashCollateralFlag
                          }
                          helperText={
                            field.resultState === "has-dager"
                              ? field.errorMsg
                              : ""
                          }
                          placeholder={field.placeholder}
                          name={field.name}
                          value={this.state[field.name]}
                          onChange={(e) =>
                            this.change(
                              e,
                              field.name,
                              field.condition,
                              field.value
                            )
                          }
                        />
                      </FormControl>
                    ) : field.component === "select" && field.createAllow ? (
                      <FormControl
                        sx={{
                          m: 1,
                          width: "100%",
                        }}
                        variant="standard"
                      >
                        <CustomDropdown
                          placeholder={field.placeholder}
                          data={this.state[field.dataSet]}
                          value={this.state[field.name]}
                          disabled={
                            (field.name == "daysInCalenderYear" && iscolenderflag) ||
                              (!this.state.minLoanAndSubLoanState && field.name === "linePF") ||
                              (field.name === "reconType" && isrecontypeflag) ||
                              (field.name === "foreclosureOfferDays" && foreClosureFlag) ||
                              (field.name === "firstInstallmentDate" && isMsmeAutomationFlag)
                              ? true
                              : false
                          }
                          id={field.id}
                          multiple={
                            field.placeholder === "Colender" ||
                            field.placeholder === "Validation"
                          }
                          handleDropdownChange={(value) =>
                            this.handleDropdownChange(value, field.name)
                          }
                          helperText={
                            field.resultState === "has-danger"
                              ? field.errorMsg
                              : ""
                          }
                        />
                      </FormControl>
                    ) : null}
                  </Grid>
                );
              })}
              <Grid container xs={12} spacing={1} ml={1.2}>
                {productFields(this.state).map((field, index) => {
                  let flag = false;
                  let foreClosureFlag = false;
                  let iscolenderflag = false;
                  let isrecontypeflag = false;
                  let cashCollateralFlag = false;
                  let isMsmeAutomationFlag = false;

                  let forceUsage = false;
                  if (
                    !this.state.minLoanAndSubLoanState &&
                    (field.name === "allowSubLoans" ||
                      field.name === "minLoanAmount" ||
                      field.name === "linePF" ||
                      field.name === "repaymentDays")
                  )
                    flag = true;
                  if (
                    !this.state.foreclosureCheckState &&
                    (field.name === "foreclosureCharge" ||
                      field.name === "foreclosureOfferDays" ||
                      field.name === "lockInPeriod")
                  )
                    foreClosureFlag = true;
                  if (
                    !this.state.isLenderSelectorFlag &&
                    field.name === "daysInCalenderYear"
                  )
                    iscolenderflag = true;
                  if (
                    !this.state.cashCollateralState &&
                    field.name === "withHold"
                  )
                    cashCollateralFlag = true;
                  if (
                    !this.state.isMsmeAutomation &&
                    (field.name === "firstInstallmentDate" || field.name === "vintage")
                  )
                    isMsmeAutomationFlag = true;
                  if (!this.state.allowLoc && field.name === "reconType")
                    isrecontypeflag = true;
                  if (
                    !this.state.allowSubLoans &&
                    (field.name === "forceUsageConvertToEmi" ||
                      field.name === "maximumNumberOfEmi")
                  )
                    forceUsage = true;
                  return (
                    (field.createAllow && field.component === "checkbox") &&
                    <Grid key={index} xs={12} md={4} item>
                      {field.component === "checkbox" && field.createAllow ? (
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                disabled={flag || forceUsage}
                                checked={this.state[field.name]}
                                onChange={this.handleCheck(field.name)}
                              />
                            }
                            label={field.placeholder}
                          />
                        </FormGroup>
                      ) : null}
                    </Grid>
                  );
                })}
              </Grid>
              <Grid md={12}>
                <Divider
                  textAlign="left"
                  sx={{
                    margin: "10px 0",
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} className="mt-3 mb-3 pl-0">
              <Button
                variant="contained"
                onClick={this.handleAddProduct}
                sx={{
                  color: "#fff",
                }}
              >
                {this.state.product_id ? "UPDATE" : "ADD"}
              </Button>
            </Grid>
          </Box>
        </CardContent>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      colendersListWatcher,
      productTypeListWatcher,
      validationsListWatcher,
      createProductWithConfigWatcher,
      getProductByCompanyAndProductWatcher,
      getCompanyByIdWatcher,
    },
    dispatch
  );
};

export default connect(
  null,
  mapDispatchToProps
)(
  withStyles(null, {
    withTheme: true,
  })(CreateProduct)
);
