import React, { Component } from "react";
import {useEffect,useState} from "react"
import LabelDropdown from "../../components/Dropdowns/LabelDropdown";
import Button from "react-sdk/dist/components/Button/Button"
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { repaymentFormPostWatcher } from "../../actions/repayment";
import { repaymentFields } from "./repaymentFieldConfigs";
import {
  verifyNumber,
  verifyDate,
  verifyAlpha,
  verifyFloat,
  verifyAlphaNeumeric,
  verifyAlphaNeumericName,
  verifyDateAfter1800
} from "../../util/helper";
import { validateData } from "../../util/validation";
import { AlertBox } from "../../components/AlertBox";
import { repaymentV2FormPostWatcher } from "../../actions/repaymentV2";
import moment from "moment";
import BasicDatePicker from "../../components/DatePicker/basicDatePicker";
import FormPopup from "react-sdk/dist/components/Popup/FormPopup";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import "react-sdk/dist/styles/_fonts.scss";

class Repayment extends Component {
  constructor(props) {
    super(props);
    this.submitButton=false;
    this.state = {
      isLoc: this.props.product?.allow_loc ?? this.props.product?.isLoc,
      forceUsageConvertToEmi: this.props.product.forceUsageConvertToEmi,
      reconType: this.props.product.recon_type,
      companyId: this.props.data.company_id,
      productId: this.props.data.product_id,
      loanId: this.props.data.loan_id,
      loanIdState: "",
      loanAppId: this.props.data.loan_app_id,
      loanAppIdState: "",
      partnerLoanAppId: this.props.data.partner_loan_app_id,
      partnerLoanAppIdState: "",
      partnerLoanIdState: "",
      partnerLoanId: this.props.data.partner_loan_id,
      borrowerId: this.props.data.borrower_id,
      borrowerIdState: "",
      partnerBorrowerId: this.props.data.partner_borrower_id,
      partnerBorrowerIdState: "",
      txnAmount: "",
      txnAmountState: "",
      txnReference: "",
      txnReferenceState: "",
      label: "",
      labelState: "",
      disbursementStatus: "",
      disbursementStatusState: "",
      utrNumber: "",
      utrNumberState: "",
      utrDateTimeStamp: "",
      utrDateTimeStampState: "",
      recordMethod: "",
      recordMethodState: "",
      repaymentDueAmount: "",
      repaymentDueAmountState: "",
      emiNumber: "",
      emiNumberState: "",
      emiType: "",
      emiTypeState: "",
      paidBy: "",
      paidByState: "",
      txnReferenceDatetime: "",
      txnReferenceDatetimeState: "",
      principalAmount: "",
      principalAmountState: "",
      paymentMode: "",
      paymentModeState: "",
      principalPaidAmount: "",
      principalPaidAmountState: "",
      repaymentTag: "",
      repaymentTagState: "",
      principalDueAmount: "",
      principalDueAmountState: "",
      interestDueAmount: "",
      interestDueAmountState: "",
      repaymentDueDate: "",
      repaymentDueDateState: "",
      interestPaidAmount: "",
      interestPaidAmountState: "",
      additionalChargesPaid: "",
      additionalChargesPaidState: "",
      amountNetOfTds: "",
      amountNetOfTdsState: "has-success",
      tdsAmountState: "has-success",
      tdsAmount: "",
      usageId: "",
      alert: false,
      severity: "",
      alertMessage: "",
      usageIdState: "",
      repaymentArray: "",
    };
  }

  closePopupHandler = () => {
    this.props.onModalClose();
  };

  handleClear = () => {
    this.setState({
      txnAmount: "",
      txnReference: "",
      label: "",
      disbursementStatus: "",
      utrNumber: "",
      utrDateTimeStamp: "",
      recordMethod: "",
      repaymentDueAmount: "",
      emiNumber: "",
      emiType: "",
      paidBy: "",
      txnReferenceDatetime: "",
      principalAmount: "",
      paymentMode: "",

      usageId: "",
      principalPaidAmount: "",
      repaymentTag: "",
      principalDueAmount: "",
      interestDueAmount: "",
      repaymentDueDate: "",
      interestPaidAmount: "",
      additionalChargesPaid: "",
      repaymentArray: "",
      amountNetOfTds: "",
      tdsAmount: ""
    });
  };

  handleOriginLmsSubmit = () => {
    if (this.isValidForOrigin()) {
      const data = { 
        company_id: this.state.companyId,
        product_id: this.state.productId,
        loan_id: this.state.loanId,
        loan_app_id: this.state.loanAppId,
        partner_loan_id: this.state.partnerLoanId,
        txn_amount: this.state.txnAmount * 1,
        txn_reference: this.state.txnReference,
        label: this.state.label,
        utr_number: this.state.utrNumber,
        utr_date_time_stamp: moment(this.state.utrDateTimeStamp).format(
          "YYYY-MM-DD HH:MM:SS"
        ),
        txn_reference_datetime: moment(this.state.txnReferenceDatetime).format(
          "YYYY-MM-DD HH:MM:SS"
        ),
        payment_mode: this.state.paymentMode,
        usage_id: this.state.usageId,
        tds_amount: this.state.tdsAmount * 1
      };
      new Promise((resolve, reject) => {
        this.props.repaymentV2FormPostWatcher(data, resolve, reject);
      })
        .then(response => {
          this.handleClear();
          setTimeout(() => {
            this.closePopupHandler();
          }, 4000);
          return this.showAlert(response.message, "success");
        })
        .catch(error => {
          this.submitButton=false; 
          const displayError = error.response?.data?.data?.body?.details
            ? error.response?.data?.data?.body?.details
            : error?.response?.data?.message
            ? error?.response?.data.message
            : "Something went wrong while adding repayment data.";
          return this.showAlert(displayError, "error");
        });
    } else {
      this.showAlert("Enter Valid data in all the fields.", "error");
      this.submitButton=false; 
    }
  };

  checkValidation = (valueToUpdate, stateName, type, stateNameEqualTo) => {
    switch (type) {
      case "alpha":
        if (
          verifyAlpha(valueToUpdate) &&
          valueToUpdate.length >= stateNameEqualTo
        ) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "date":
        if (verifyDate(valueToUpdate)) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "float":
        if (
          verifyFloat(valueToUpdate) &&
          valueToUpdate.length >= stateNameEqualTo
        ) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else if (
          stateName === "additionalChargesPaid" &&
          validateData("number", valueToUpdate) &&
          valueToUpdate.length >= stateNameEqualTo
        ) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "alnum":
        if (
          verifyAlphaNeumeric(valueToUpdate) &&
          valueToUpdate.length >= stateNameEqualTo
        ) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "alnumname":
        if (
          verifyAlphaNeumericName(valueToUpdate) &&
          valueToUpdate.length >= stateNameEqualTo
        ) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "number":
        if (
          verifyNumber(valueToUpdate) &&
          valueToUpdate.length >= stateNameEqualTo
        ) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      default:
        this.setState({ [stateName + "State"]: "has-success" });
        break;
    }
    this.setState({ [stateName]: valueToUpdate });
  };

  change = (event, stateName, type, stateNameEqualTo) => {
    const { value } = event;
    this.setState({ repaymentArray: "" });
    this.checkValidation(event.value, stateName, type, stateNameEqualTo);
    if (stateName === "txnAmount")
      this.setState({
        amountNetOfTds:
          this.state.tdsAmount > 0
            ? (value * 1 || 0) - (this.state.tdsAmount * 1 || 0)
            : 0,
        amountNetOfTdsState: "has-success"
      });
    if (stateName === "tdsAmount")
      this.setState({
        amountNetOfTds:
          value >= 0 ? (this.state.txnAmount * 1 || 0) - (value * 1 || 0) : 0,
        amountNetOfTdsState: "has-success"
      });
  };

  changeDates = (date, stateName, type, stateNameEqualTo) => {
    this.setState({ repaymentArray: "" });

    this.checkValidation(
      verifyDateAfter1800(moment(date).format("YYYY-MM-DD"))
        ? moment(date).format("YYYY-MM-DD")
        : date,
      stateName,
      type,
      stateNameEqualTo
    );
  };

  handleSubmit = () => {
    this.submitButton= true ;
    if (this.props.isOriginLms) {
      this.handleOriginLmsSubmit();
    } else {
      let data = {};
      const isValidated = this.isValidated();

      if (isValidated === true) {
        data = {
          company_id: this.state.companyId,
          product_id: this.state.productId,
          loan_id: this.state.loanId,
          loan_app_id: this.state.loanAppId,
          partner_loan_app_id: this.state.partnerLoanAppId,
          borrower_id: this.state.borrowerId,
          partner_borrower_id: this.state.partnerBorrowerId,
          txn_amount: this.state.txnAmount * 1,
          txn_reference: this.state.txnReference,
          label: this.state.label,
          disbursement_status: this.state.disbursementStatus,
          utr_number: this.state.utrNumber,
          utr_date_time_stamp: this.state.utrDateTimeStamp,
          record_method: this.state.recordMethod,
          repayment_due_amount: this.state.repaymentDueAmount,
          emi_number: this.state.emiNumber,
          emi_type: this.state.emiType,
          paid_by: this.state.paidBy,
          txn_reference_datetime: this.state.txnReferenceDatetime,
          principal_amount: this.state.principalAmount,
          payment_mode: this.state.paymentMode,
          principal_paid_amount: this.state.principalPaidAmount,
          repayment_tag: this.state.repaymentTag,
          principal_due_amount: this.state.principalDueAmount,
          interest_due_amount: this.state.interestDueAmount,
          repayment_due_date: this.state.repaymentDueDate,
          interest_paid_amount: this.state.interestPaidAmount,
          additional_charge_paid: this.state.additionalChargesPaid,
          amount_net_of_tds: this.state.amountNetOfTds * 1,
          tds_amount: this.state.tdsAmount * 1,
          usage_id: this.state.usageId,
          repaymentArray: ""
        };
      } else {
        this.showAlert("Enter Valid data in all the fields.", "error");
        this.submitButton=false; 
        return;
      }
      new Promise((resolve, reject) => {
        this.props.repaymentFormPostWatcher(data, resolve, reject);
      })
        .then(response => {
          this.handleClear();
          setTimeout(() => {
            this.closePopupHandler();
          }, 4000);
          return this.showAlert(response.message, "success");
        })
        .catch(error => {
          this.submitButton=false; 
          const displayError = error.response?.data?.data?.body?.details
            ? error.response?.data?.data?.body?.details
            : error?.response?.data?.message
            ? error?.response?.data.message
            : "Something went wrong while adding repayment data.";
          return this.showAlert(displayError, "error");
        });
    }
  };

  isValidated = () => {
    if (
      this.state.txnAmountState === "has-success" &&
      this.state.txnReferenceState === "has-success" &&
      this.state.labelState === "has-success" &&
      this.state.disbursementStatusState === "has-success" &&
      this.state.utrNumberState === "has-success" &&
      this.state.utrDateTimeStampState === "has-success" &&
      this.state.recordMethodState === "has-success" &&
      this.state.repaymentDueAmountState === "has-success" &&
      this.state.emiNumberState === "has-success" &&
      this.state.emiTypeState === "has-success" &&
      this.state.paidByState === "has-success" &&
      this.state.txnReferenceDatetimeState === "has-success" &&
      this.state.principalAmountState === "has-success" &&
      this.state.paymentModeState === "has-success" &&
      this.state.principalPaidAmountState === "has-success" &&
      this.state.repaymentTagState === "has-success" &&
      this.state.principalDueAmountState === "has-success" &&
      this.state.interestDueAmountState === "has-success" &&
      this.state.repaymentDueDateState === "has-success" &&
      this.state.interestPaidAmountState === "has-success" &&
      this.state.additionalChargesPaidState === "has-success"
    ) {
      if (this.state.isLoc && 
        (this.state.forceUsageConvertToEmi ||
          (this.state.label.toLocaleLowerCase() == "repayment" && this.state.reconType === "Invoice"))) {
        if (this.state.usageIdState !== "has-success") {
          this.setState({ usageIdState: "has-danger" });
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  };

  isValidForOrigin = () => {
    if (
      this.state.txnAmountState === "has-success" &&
      this.state.txnReferenceState === "has-success" &&
      this.state.utrNumberState === "has-success" &&
      this.state.utrDateTimeStampState === "has-success" &&
      this.state.txnReferenceDatetimeState === "has-success" &&
      this.state.paymentModeState === "has-success" &&
      this.state.amountNetOfTdsState === "has-success" &&
      this.state.tdsAmountState === "has-success"
    ) {
      if (this.state.isLoc && 
        (this.state.forceUsageConvertToEmi || 
          (this.state.label.toLocaleLowerCase() == "repayment" && this.state.reconType === "Invoice"))) {
        if (this.state.usageIdState !== "has-success") {
          this.setState({ usageIdState: "has-danger" });
          return false;
        }
        return this.state.usageIdState === "has-success";
      }
      return true;
    }
    return false;
  };

  showAlert = (msg, type) => {
    this.setState({ alert: true, severity: type, alertMessage: msg });
    setTimeout(() => {
      this.handleAlertClose();
    }, 3000);
  };

  handleAlertClose = () => {
    this.setState({ alert: false, severity: "", alertMessage: "" });
  };

  handleRepaymentArrayChanged = e => {
    this.setState({ repaymentArray: e.value }, () => {
      const sequentialValues = this.state.repaymentArray.split("|");
      const lengthRequired =
        (this.state.forceUsageConvertToEmi || 
          (this.state.reconType === "Invoice")) && this.state.isLoc ? 8 : 7;
      if (sequentialValues.length < lengthRequired) {
        this.setState({
          txnAmount: "",
          txnReference: "",
          utrNumber: "",
          utrDateTimeStamp: "",
          txnReferenceDatetime: "",
          paymentMode: "",
          usageId: "",
          amountNetOfTds: "",
          tdsAmount: ""
        });
        return this.showAlert(
          `Enter all ${lengthRequired} values in | separated string`,
          "error"
        );
      } else {
        const fieldsV2 = {
          loanId: this.state.loanId,
          partnerLoanId: this.state.partnerLoanId,
          txnAmount: sequentialValues[0],
          txnReference: sequentialValues[1],
          label: this.state.label || "",
          utrNumber: sequentialValues[2],
          utrDateTimeStamp: sequentialValues[3],
          txnReferenceDatetime: sequentialValues[4],
          paymentMode: sequentialValues[5],
          usageId: this.state.label && this.state.label.toLocaleLowerCase() === "repayment" ? sequentialValues[6] : "",
          tdsAmount:
              this.state.label && this.state.label.toLocaleLowerCase() === "repayment" && lengthRequired === 8 
              ? sequentialValues[7] : sequentialValues[6]
        };

        const fieldsFinalV3 = repaymentFields(this.state).filter(
          (field, index) => {
            return (
              field.v2 &&
              this.props.isOriginLms &&
              (field.placeholder === "usage_id"
                ? !!(this.state.isLoc && 
                  (this.state.forceUsageConvertToEmi || 
                    (this.state.label?.toLocaleLowerCase() === "repayment" && this.state.reconType === "Invoice")))
                : true)
            );
          }
        );

        fieldsFinalV3.forEach(field => {
          this.checkValidation(
            fieldsV2[field.name],
            field.name,
            field.condition,
            field.value
          );
        });
        const tds_Amt = this.state.label && this.state.label.toLocaleLowerCase() === "repayment" && lengthRequired === 8 
        ? sequentialValues[7] : sequentialValues[6]
        if (tds_Amt) {
          this.setState({
            amountNetOfTds: sequentialValues[0] - tds_Amt,
            amountNetOfTdsState: "has-success",
            tdsAmountState: "has-success"
          });
        }
      }
    });
  };

  render() {
    const customButtonCss = {height:"48px",fontSize:"16px",padding: "13px 44px",borderRadius:"8px",gap:"10px", width:"180px"}
    const cancelCustomButtonCss = {height:"48px",fontSize:"16px",padding: "13px 44px",borderRadius:"8px",gap:"10px", width:"180px", color:"#475BD8",border:"1px solid #475BD8"}
    return (
      <>
        {this.state.alert ? (
              <AlertBox
                severity={this.state.severity}
                msg={this.state.alertMessage}
                onClose={this.handleAlertClose}
              />
            ) : null}
          <FormPopup
          heading={this.props.title}
          onClose={this.closePopupHandler}
          isOpen={this.props.isOpen}
          customStyles={{
              width: "fit-content",
              display:"flex",flexDirection: "column"
          }}
          >
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            width:"fit-content",
            marginLeft:"-0.625rem",
            marginTop:"14px"
          }} >
            {this.props.isOriginLms
              ? repaymentFields(this.state).map((field, index) => {
                  return field.v2 &&
                    this.props.isOriginLms &&
                    (field.placeholder === "usage_id"
                      ? !!(
                          this.state.isLoc && (this.state.forceUsageConvertToEmi || this.state.reconType === "Invoice")
                        )
                      : true) ? (
                    <div key={index}
                     style={{
                        display:"flex",
                        margin:"10px 10px 16px 10px"
                        }}
                     >
                        {field.name.indexOf("label") > -1 ? (
                          <LabelDropdown
                            id="select-type-1"
                            isLoc={this.state.isLoc}
                            onLabelChange={(label, name) => {
                              if (label) {
                                this.setState({
                                  [name + "State"]: "has-success"
                                });
                                this.setState({
                                  [name]: label.value
                                });
                              } else {
                                this.setState({
                                  [name + "State"]: "has-danger"
                                });
                                this.setState({
                                  [name]: ""
                                });
                              }
                            }}
                            placeholder="Select label"
                            nameField={field.name}
                          />
                        ) : field.placeholder.indexOf("utr_date_time_stamp") >
                            -1 ||
                          field.placeholder.indexOf("txn_reference_datetime") >
                            -1 ? (
                          <BasicDatePicker
                            disableFutureDate={true}
                            placeholder={
                              `${field.placeholder
                                .split('_')
                                .map((word) => {
                                  const formattedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                                    return `${formattedWord}`;
                                })
                                .join(' ')
                              }`
                            }
                            name={field.name}
                            disabled={field.condition === ""}
                            value={this.state[field.name]}
                            onDateChange={date =>
                              this.changeDates(
                                date,
                                field.name,
                                field.condition,
                                field.value
                              )
                            }
                            error={field.resultState === "has-danger"}
                            helperText={
                              field.resultState === "has-danger"
                                ? field.errorMsg
                                : ""
                            }
                            style={{height:"56px",width:"335px",borderRadius:"8px"}}
                          />
                        ) : (
                          <InputBox
                            isDrawdown={false}
                            label={
                              `${field.placeholder
                                .split('_')
                                .map((word) => {
                                  const formattedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                                    return `${formattedWord}`;
                                })
                                .join(' ')
                              }`
                            }
                            error={field.resultState === "has-danger"}
                            helperText={
                                  field.resultState === "has-danger"
                                    ? field.errorMsg
                                    : ""
                                }
                            name={field.name}
                            initialValue={this.state[field.name]}
                            isDisabled={field.condition === "" || field.disabled}
                            onClick={e =>
                                  this.change(
                                    e,
                                    field.name,
                                    field.condition,
                                    field.value
                                  )
                                }
                            customClass={{height:"56px",width:"335px",maxWidth:"none"}}
                            customInputClass = {{width:"100%", backgroundColor:"#FFF", marginTop:"0px"}}
                          />
                        )}
                    </div>
                  ) : null;
                })
              : repaymentFields(this.state).map((field, index) => {
                  return field.valueState !== "partnerLoanId" &&
                    (field.placeholder === "usage_id" ||
                    field.placeholder === "amount_net_of_tds" ||
                    field.placeholder === "tds_amount"
                      ? !!(
                          this.state.isLoc && this.state.forceUsageConvertToEmi
                        )
                      : true) ? (
                        <div key={index} style={{display:"flex",flexDirection:"row",margin:"10px 10px 10px 10px"}}>
                        <InputBox
                         label={
                          `${field.placeholder
                            .split('_')
                            .map((word) => {
                              const formattedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                                return `${formattedWord}`;
                            })
                            .join(' ')
                          }`
                        }
                         error={field.resultState === "has-danger"}
                          helperText={
                            field.resultState === "has-danger"
                              ? field.errorMsg
                              : ""
                          }
                          name={field.name}
                          initialValue={this.state[field.name]}
                          isDisabled={field.condition === ""}
                          onClick={e =>
                                      this.change(
                                        e,
                                        field.name,
                                        field.condition,
                                        field.value
                                      )
                                    }
                          customClass={{height:"56px",width:"335px",maxWidth:"none"}}
                        />
                    </div>
                  ) : null;
                })}
          </div>
          {this.props.isOriginLms ? (
            <>
              <h6 style={{fontSize:"18px",fontFamily:"Montserrat-Medium",fontStyle:"normal",lineHeight:"150%",fontWeight:"500",display:"flex",justifyContent:"center",marginTop:"44px",marginBottom:"44px"}}>
                OR
              </h6>
              <div>
                  <InputBox
                  label="Repayment Array"
                  isDrawdown={false}
                  initialValue={this.state.repaymentArray}
                  onClick={e => this.handleRepaymentArrayChanged(e)}
                  customClass={{height:"56px",maxWidth:"none",width:"1400px"}}
                  customInputClass = {{width:"100%",maxWidth:"none"}}
                  />
              </div>
            </>
          ) : (
            ""
          )}
          <div style={{display:"flex",float:"right",marginTop:"44px",marginRight:"0.9rem"}}>
              <Button
                  label="Clear"
                  onClick={this.handleClear}
                  buttonType="secondary"
                  customStyle={cancelCustomButtonCss}
                  isDisabled={this.submitButton}
                />
              <Button
                label="Submit"
                onClick={this.handleSubmit}
                buttonType="primary"
                customStyle={customButtonCss}
                isDisabled={this.submitButton}
              />
            </div>
          </FormPopup>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      repaymentFormPostWatcher,
      repaymentV2FormPostWatcher
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(Repayment);
