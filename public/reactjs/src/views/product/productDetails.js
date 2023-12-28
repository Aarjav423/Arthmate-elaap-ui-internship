import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import FormGroup from "@mui/material/FormGroup";
import { withStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Alert from "@mui/material/Alert";
// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CardContent from "@material-ui/core/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CustomDropdown from "../../components/custom/customSelect";
import { storedList } from "../../util/localstorage";
import { getProductByCompanyAndProductWatcher } from "actions/product";
import { verifyNumber } from "../../util/helper";
import { productFields } from "./productFields";
import { AlertBox } from "../../components/AlertBox";
import { colendersListWatcher } from "../../actions/colenders.js";

class ProductDetails extends Component {
  constructor(props) {
    const URLdata = window.location.href;
    super(props);
    this.state = {
      selectedCompany: "",
      selectLoanSchema: "",
      company_id: verifyNumber(URLdata.split("/").slice(-3)[0])
        ? URLdata.split("/").slice(-3)[0]
        : null,
      loan_schema_id: verifyNumber(URLdata.split("/").slice(-3)[1])
        ? URLdata.split("/").slice(-3)[1]
        : null,
      product_id: verifyNumber(URLdata.split("/").slice(-3)[2])
        ? URLdata.split("/").slice(-3)[2]
        : null,
      title: "Product details",
      productName: "",
      maxLoanAmount: "",
      intRateType: "",
      workDayWeek: "",
      repaymentSchedule: "",
      loanTenureType: "",
      repaymentType: "",
      aadhaar: "",
      pan: "",
      partyType: "",
      vintage: "",
      loanTenure: "",
      subventionFees: "",
      processingFees: "",
      usageFee: "",
      intValue: "",
      maximumNumberOfEmi: "",
      forceUsageConvertToEmi: "",
      penalInterest: "",
      bounceCharges: "",
      cancellationPeriod: "",
      minLoanAmount: "",
      productNameState: "",
      repaymentDays: "",
      maxLoanAmountState: "",
      intRateTypeState: "",
      interestType: "",
      workDayWeekState: "",
      repaymentScheduleState: "",
      loanTenureTypeState: "",
      repaymentTypeState: "",
      loanTenureState: "",
      subventionFeesState: "",
      processingFeesState: "",
      usageFeeState: "",
      intValueState: "",
      penalInterestState: "has-success",
      bounceChargesState: "has-success",
      cancellationPeriodState: "",
      calculateBrokenInterest: "",
      insuranceCharges: "",
      stampCharges: "",
      applicatrionFees: "",
      convenienceFees: "",
      subventionBased: "",
      advanceEMI: "",
      cgstOnPfPerc: "",
      sgstOnPfPerc: "",
      igstOnPfPerc: "",
      gstOnPfPerc: "",
      loanKey: "",
      calculateGstForProduct: "",
      enhancedReviewRequired: "",
      bureauPartner: "",
      ckycSearch: "",
      bureauCheck: "",
      alert: false,
      severity: "",
      alertMessage: "",
      allowSubLoans: "",
      allowLoc: "",
      foreclosure: "",
      foreclosureCharge: "",
      lockInPeriod: "",
      ascore: "",
      bscore: "",
      productType: "",
      colender: [],
      validation: [],
      daysInCalenderYear: "",
      reconType: "",
      reconTypeState: "",
      beneficiaryBankSource: "",
      isLenderSelectorFlag: "",
      names: [],
      downpayment: "",
      bureauParser: "",
      linePF: "",
      withHold: "",
      cashCollateral: "",
      pennyDrop: "",
      foreclosureOfferDays: "",
      eNach: false,
      foreclosureOfferDaysOptions: [
        {
          value: 1,
          label: 1
        },
        {
          value: 2,
          label: 2
        },
        {
          value: 3,
          label: 3
        },
        {
          value: 4,
          label: 4
        }
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
      bureauCoApplicant: "",
      vintage: "",
      firstInstallmentDate: "",
      assetClassificationPolicy: "",
      isMsmeAutomation: "",
    };
  }

  fetchColendersList = () => {
    const payload = {};
    // let names = [];
    let codes = [];
    let colenders = [];
    new Promise((resolve, reject) => {
      this.props.colendersListWatcher(payload, resolve, reject);
    })
      .then(res => {
        for (var i = 0; i < res.length; i++) {
          this.state.names.push({
            label: res[i].co_lender_name,
            value: res[i].co_lender_shortcode
          });
        }
      })

      .catch(error => {
        // setTimeout(() => { }, 4000);
      });
  };

  componentDidMount = () => {
    this.fetchColendersList();

    const user = storedList("user");
    const { company_id, product_id, loan_schema_id } = this.state;
    const data = {
      user_id: user._id,
      company_id: company_id,
      product_id: product_id,
      loan_schema_id: loan_schema_id
    };
    new Promise((resolve, reject) => {
      this.props.getProductByCompanyAndProductWatcher(data, resolve, reject);
    })
      .then(response => {
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
          const colenderobj = this.state.names.find(
            x => x.value === res[i].co_lender_shortcode
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
              : ""
          },
          workDayWeek: {
            value: response.dpdrecords.workday_weeek
              ? response.dpdrecords.workday_weeek
              : "",
            label: response.dpdrecords.workday_weeek
              ? response.dpdrecords.workday_weeek
              : ""
          },
          productType: {
            value: response.dpdrecords.product_type_name
              ? response.dpdrecords.product_type_name
              : "",
            label: response.dpdrecords.product_type_name
              ? response.dpdrecords.product_type_name
              : ""
          },

          colender: co_lender_label,
          validation: val_check_label,

          daysInCalenderYear: {
            value: response.dpdrecords.days_in_year
              ? response.dpdrecords.days_in_year
              : "",
            label: response.dpdrecords.days_in_year
              ? response.dpdrecords.days_in_year
              : ""
          },
          reconType: {
            value: response.dpdrecords.recon_type
              ? response.dpdrecords.recon_type
              : "",
            label: response.dpdrecords.recon_type
              ? response.dpdrecords.recon_type
              : ""
          },
          beneficiaryBankSource: {
            value: response.dpdrecords.beneficiary_bank_source
              ? response.dpdrecords.beneficiary_bank_source
              : "Loan/Line",
            label: response.dpdrecords.beneficiary_bank_source
              ? response.dpdrecords.beneficiary_bank_source
              : "Loan/Line"
          },
          repaymentSchedule: {
            value: response.dpdrecords.repayment_schedule
              ? response.dpdrecords.repayment_schedule
              : "",
            label: response.dpdrecords.repayment_schedule
              ? response.dpdrecords.repayment_schedule
              : ""
          },
          loanTenureType: {
            value: response.dpdrecords.loan_tenure_type
              ? response.dpdrecords.loan_tenure_type
              : "",
            label: response.dpdrecords.loan_tenure_type
              ? response.dpdrecords.loan_tenure_type
              : ""
          },
          repaymentType: {
            value: response.dpdrecords.repayment_type
              ? response.dpdrecords.repayment_type
              : "",
            label: response.dpdrecords.repayment_type
              ? response.dpdrecords.repayment_type
              : ""
          },
          aadhaar: {
            value: response.dpdrecords.aadhaar_type
              ? response.dpdrecords.aadhaar_type
              : "",
            label: response.dpdrecords.aadhaar_type
              ? response.dpdrecords.aadhaar_type
              : ""
          },

          pan: {
            value: response.dpdrecords.pan_type
              ? response.dpdrecords.pan_type
              : "",
            label: response.dpdrecords.pan_type
              ? response.dpdrecords.pan_type
              : ""
          },
          partyType: {
            value: response.dpdrecords.party_type
              ? response.dpdrecords.party_type
              : "",
            label: response.dpdrecords.party_type
              ? response.dpdrecords.party_type
              : ""
          },
          vintage: response.dpdrecords?.vintage,
          firstInstallmentDate: response.dpdrecords?.first_installment_date,
          assetClassificationPolicy: response.dpdrecords?.asset_classification_policy,
          bureauPartner: {
            value: response.dpdrecords.bureau_partner_name
              ? response.dpdrecords.bureau_partner_name
              : "",
            label: response.dpdrecords.bureau_partner_name
              ? response.dpdrecords.bureau_partner_name
              : ""
          },
          interestType: {
            value: response.dpdrecords.interest_type
              ? response.dpdrecords.interest_type
              : "",
            label: response.dpdrecords.interest_type
              ? response.dpdrecords.interest_type
              : ""
          },
          loanTenure: response.dpdrecords.loan_tenure,
          repaymentDays: response.dpdrecords?.repayment_days,
          subventionFees: response.dpdrecords.subvention_fees,
          processingFees: response.dpdrecords.processing_fees,
          usageFee: response.dpdrecords.usage_fee,
          intValue: response.dpdrecords.int_value,
          penalInterest: response.dpdrecords.penal_interest || 0,
          bounceCharges: response.dpdrecords.bounce_charges || 0,
          calculateBrokenInterest:
            response.dpdrecords.calculate_broken_interest,
          insuranceCharges: response.dpdrecords.insurance_charges,
          stampCharges: response.dpdrecords.stamp_charges,
          applicatrionFees: response.dpdrecords.application_fee,
          convenienceFees: response.dpdrecords.convenience_fees,
          subventionBased: response.dpdrecords.subvention_based,
          advanceEMI: response.dpdrecords.advance_emi,
          calculateGstForProduct: response.dpdrecords.calculateGstForProduct,
          enhancedReviewRequired: response.dpdrecords.enhanced_review_required,
          cgstOnPfPerc: response.dpdrecords.cgst_on_pf_perc,
          sgstOnPfPerc: response.dpdrecords.sgst_on_pf_perc,
          igstOnPfPerc: response.dpdrecords.igst_on_pf_perc,
          gstOnPfPerc: response.dpdrecords.gst_on_pf_perc,
          loanKey: response.dpdrecords.loan_key,
          ckycSearch: response.dpdrecords.ckyc_search,
          allowSubLoans: response.dpdrecords?.allow_sub_loans,
          allowLoc: response.dpdrecords?.allow_loc,
          bureauCheck: response.dpdrecords.bureau_check,
          cancellationPeriod: response.dpdrecords.cancellation_period,
          minLoanAmount: response.dpdrecords.min_loan_amount,
          foreclosure: response.dpdrecords.foreclosure,
          foreclosureCharge: response.dpdrecords.foreclosure_charge,
          lockInPeriod: response.dpdrecords.lock_in_period,
          ascore: response.dpdrecords.a_score,
          bscore: response.dpdrecords.b_score,
          maximumNumberOfEmi: response.dpdrecords?.maximum_number_of_emi,
          forceUsageConvertToEmi:
            response.dpdrecords?.force_usage_convert_to_emi,
          isLenderSelectorFlag:
            response.dpdrecords.is_lender_selector_flag == "Y" ? 1 : 0,
          isMsmeAutomation:
            response.dpdrecords.is_msme_automation_flag == "Y" ? 1 : 0,
          downpayment: response.dpdrecords.downpayment,
          bureauParser: response.dpdrecords.bureau_parser,
          linePF: response.dpdrecords.line_pf,
          withHold: response.dpdrecords.withhold_amount,
          cashCollateral: response.dpdrecords?.cash_collateral,
          eNach: response.dpdrecords?.e_nach,
          pennyDrop: response.dpdrecords?.penny_drop,
          foreclosureOfferDays: {
            value: response.dpdrecords.fc_offer_days
              ? response.dpdrecords.fc_offer_days
              : "",
            label: response.dpdrecords.fc_offer_days
              ? response.dpdrecords.fc_offer_days
              : ""
          },
          bureauCoApplicant: response.dpdrecords?.bureau_co_applicant
        });
      })
      .catch(error => {
        this.setState({
          alert: true,
          severity: "error",
          alertMessage: error.response.data.message,
          company_id: null,
          product_id: null,
          loan_schema_id: null
        });
        setTimeout(() => {
          this.handleAlertClose();
        }, 4000);
      });
  };

  handleAlertClose = () => {
    this.setState({
      severity: "",
      alertMessage: "",
      alert: false
    });
  };

  render() {
    return (
      <>
        <CardContent>
          <Grid item xs={12}>
            {this.state.alert ? (
              <AlertBox
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
              margin: "0.812rem"
            }}
            variant="h6"
          >
            {this.state.title}
          </Typography>
          <Box
            sx={{
              marginLeft: "20px"
            }}
            py={3}
            mb={20}
          >
            <Grid container>
              {this.state.showCompany || this.state.showLoanSchema ? (
                <Grid container item xs={12} spacing={1}>
                  <Grid md={12}>
                    <Divider
                      textAlign="left"
                      sx={{
                        margin: "10px 0"
                      }}
                    />
                  </Grid>
                </Grid>
              ) : null}
              {productFields(this.state).map((field, index) => {
                return (
                  <Grid key={index} xs={12} md={4} item>
                    {field.component === "text" ? (
                      <FormControl
                        sx={{
                          m: 1,
                          width: "100%"
                        }}
                        variant="standard"
                      >
                        <TextField
                          InputProps={{
                            readOnly: true
                          }}
                          variant="standard"
                          label={field.placeholder}
                          type={field.type}
                          error={field.resultState === "has-danger"}
                          helperText={
                            field.resultState === "has-danger"
                              ? field.errorMsg
                              : ""
                          }
                          placeholder={field.placeholder}
                          name={field.name}
                          value={this.state[field.name]}
                        />
                      </FormControl>
                    ) : field.component === "select" ? (
                      <FormControl
                        sx={{
                          m: 1,
                          width: "100%"
                        }}
                        variant="standard"
                      >
                        <CustomDropdown
                          InputProps={{
                            readOnly: true
                          }}
                          placeholder={field.placeholder}
                          data={[]}
                          value={this.state[field.name]}
                          id={field.name}
                          multiple={field.placeholder === "Colender" || field.placeholder === "Validation"}
                        />
                      </FormControl>
                    ) : field.component === "checkbox" ? (
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              InputProps={{
                                readOnly: true
                              }}
                              checked={this.state[field.name]}
                            />
                          }
                          label={field.placeholder}
                        />
                      </FormGroup>
                    ) : null}
                  </Grid>
                );
              })}
              <Grid md={12}>
                <Divider
                  textAlign="left"
                  sx={{
                    margin: "10px 0"
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      colendersListWatcher,
      getProductByCompanyAndProductWatcher
    },
    dispatch
  );
};

export default connect(
  null,
  mapDispatchToProps
)(
  withStyles(null, {
    withTheme: true
  })(ProductDetails)
);
