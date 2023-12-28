import * as React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { storedList } from "../../../../util/localstorage";
import { validateData } from "../../../../util/validation";
import { newLoanCreationData } from "./newLoanCreationData";
import InputBox from "react-sdk/dist/components/InputBox/InputBox";
import Button from "react-sdk/dist/components/Button/Button";
import { Checkbox } from "@mui/material";
import "./createLoan.style.css";
import { getBookLoanDetailsWatcher, postLoanDetailsWatcher } from "../../../../msme/actions/bookLoan.action";
import { AlertBox } from "../../../../components/CustomAlertbox";
import Preloader from "../../../../components/custom/preLoader";
import { LeadStatus } from "../../../config/LeadStatus";
import { getLeadOfferWcher, getCalculateFeesAndChargesWatcher } from "../../../../msme/actions/lead.action";
import BasicDatePicker from "components/DatePicker/basicDatePicker";
import { verifyDateAfter1800 } from "util/helper";
import moment from "moment";
import { BankList } from '../../financialDocument/data';

const user = { _id: storedList('user')?._id, id: storedList('user')?.id };

export default function CreateLoan() {
  const [stateData, setStateData] = useState({dropdown_vl_purpose_of_loan:'Working Capital'});
  const [validationData, setValidationData] = useState({});
  const [sameAsBeneficiary, setSameAsBeneficiary] = useState(false);
  const dispatch = useDispatch();
  const params = useParams();
  const history = useHistory();
  const [initialData, setInitialData] = useState("")
  const [companyId, setCompanyID] = useState("")
  const [productId, setProductID] = useState("")
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const isLoading = useSelector((state) => state.profile.loading);
  const [isDisabled, setIsDisabled] = useState(false);
  const [offeredAMount, setOfferedAMount] = useState("");
  const [offeredIntRate, setOfferedIntRate] = useState("");
  const [isConvenience, setIsConvenience] = useState(false);
  const [isApplicationFee, setIsApplicationFee] = useState(false);
  const [isBrokenInt, setIsBrokenInt] = useState(false);
  const [isCalculate, setIsCalculate] = useState(true);
  const [onPageLoad,setOnPageLoad] = useState(true);
  const BankType = [
    { value: "Current", label: "Current" },
    { value: "Saving", label: "Savings" },
    { value: "Others", label: "Others" },
  ];
  const purpose_of_loan_options = [
      { value: "working_capital", label: "Working Capital" },
      { value: "business_expansion", label: "Business Expansion" },
      { value: "purchase_of_business_fixed_assets", label: "Purchase of Business Fixed Assets" },
      { value: "inventory", label: "Inventory" },
      { value: "expansion_of_premises", label: "Expansion of Premises" },
      { value: "personal_requirement", label: "Personal requirement" },
      { value: "others", label: "Others" },
  ];

  const showAlert = (msg, type) => {
    setAlert(true);
    setSeverity(type);
    setAlertMessage(msg);
    setTimeout(() => {
      handleAlertClose();
    }, 3000);
  };

  const handleAlertClose = () => {
    setAlert(false);
    setSeverity("");
    setAlertMessage("");
  };

  const changeDateSelected = (value, name) => {
    const date = verifyDateAfter1800(moment(value).format("YYYY-MM-DD"))
      ? moment(value).format("YYYY-MM-DD")
      : value;
    const isValid = validateData(
      name.substring(0, name.indexOf("_vl_")).toLowerCase(),
      date
    );
    setStateData((prevState) => ({
      ...prevState,
      [name]: date,
    }));
    setValidationData((prevState) => ({
      ...prevState,
      [`${name}State`]: !isValid ? "has-danger" : "",
    }));
  };

  const change = (e, type, name) => {
    setOnPageLoad(false)
    let editableFields = ["processing_fees_perc", "sanction_amount", "application_fee_perc", "insurance_amount"]
    if (editableFields.includes(name)) {
      setIsCalculate(false)
    }
    const value = e.value;
    let field = `${type}_vl_${name}`;
    let isValid = validateData(
      field.substring(0, field.indexOf("_vl_")).toLowerCase(),
      value
    );
    setStateData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    setInitialData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setValidationData((prevState) => ({
      ...prevState,
      [`${field}State`]: !isValid ? "has-danger" : "",
    }));
    if (name === "bene_confirm_bank_acc_no") {
      let isConfirm = (e.value !== stateData.String_vl_bene_bank_acc_num) ? true : false;
      setValidationData((prevState) => ({
        ...prevState,
        [`${field}State`]: isConfirm ? "has-danger" : "",
      }))
    }
    if (name === "borro_confirm_bank_acc_no") {
      let isConfirm = (e.value !== stateData.String_vl_borro_bank_acc_num) ? true : false;
      setValidationData((prevState) => ({
        ...prevState,
        [`${field}State`]: isConfirm ? "has-danger" : "",
      }))
    }
    if (name === "sanction_amount") {
      if (e.value > offeredAMount)
        setValidationData((prevState) => ({
          ...prevState,
          [`${field}State`]: "has-danger",
        }))
    }
  };

  const copyBeneficiaryToBorrower = (ischecked) => {
    const beneficiaryFields = newLoanCreationData.filter(
      (row) => row.dept === "Enter Beneficiary Bank Details"
    );
    const borrowerFields = newLoanCreationData.filter(
      (row) => row.dept === "Enter Borrower Bank Details"
    );
    beneficiaryFields.forEach((beneficiaryField) => {
      const borrowerField = borrowerFields.find((row) => {
        const borrowerFieldName = row.field.replace("borro_", "bene_");
        return borrowerFieldName === beneficiaryField.field;
      });
      if (borrowerField) {
        setStateData((prevState) => ({
          ...prevState,
          [`${borrowerField.type}_vl_${borrowerField.field}`]: ischecked
            ? stateData[`${beneficiaryField.type}_vl_${beneficiaryField.field}`]
            : "",
        }));
        setInitialData((prevState) => ({
          ...prevState,
          [borrowerField.field]: ischecked
            ? stateData[`${beneficiaryField.type}_vl_${beneficiaryField.field}`]
            : "",
        }))
        setValidationData((prevState) => ({
          ...prevState,
          [`${`${borrowerField.type}_vl_${borrowerField.field}`}State`]: !ischecked ? "has-danger" : "",
        }));
      }
    });
  };

  const handlePaste = (event, name) => {
    if (name === "bene_confirm_bank_acc_no" || name === "borro_confirm_bank_acc_no") {
      event.preventDefault();
    }
  }

  const handleSubmit = () => {
    const payload = {
      companyId: initialData.company_id,
      productId: initialData.product_id,
      user: user._id,
      data: {
        loan_app_id: initialData.loan_app_id ?? "",
        partner_loan_app_id: initialData.partner_loan_app_id ?? "",
        partner_borrower_id: initialData.partner_borrower_id ?? "",
        borrower_id: initialData.borrower_id ?? "",
        first_name: initialData.primary_applicant.first_name ?? "",
        middle_name: initialData.primary_applicant.middle_name ?? "",
        last_name: initialData.primary_applicant.last_name ?? "",
        partner_loan_id: initialData.partner_loan_id ?? "",
        purpose_of_loan: initialData.purpose_of_loan ?? "",
        loan_app_date: initialData.loan_app_date ?? "",
        sanction_amount: initialData.sanction_amount ?? "",
        first_inst_date: initialData.first_installment_date ?? "",
        final_approve_date: initialData.final_approval_date ?? "",
        loan_int_rate: initialData.loan_interest_rate ?? "",
        offered_amount: offeredAMount ?? "",
        offered_int_rate: offeredIntRate ?? "",
        processing_fees_perc: initialData.processing_fees_perc ?? "",
        processing_fees_amt: Number(initialData.processing_fees_amt) - Number(initialData.gst_on_pf_amt)?? "",
        gst_on_pf_amt: initialData.gst_on_pf_amt ?? "",
        insurance_amount: initialData.insurance_amount ?? "",
        broken_interest: initialData.broken_interest ?? "",
        net_disbur_amt: initialData.net_disbur_amt ?? "",
        tenure: initialData.tenure ?? "",
        bene_bank_name: initialData.bene_bank_name ?? "",
        bene_bank_ifsc: initialData.bene_bank_ifsc ?? "",
        bene_bank_acc_num: initialData.bene_bank_acc_num ?? "",
        bene_confirm_bank_acc_no: initialData.bene_confirm_bank_acc_no ?? "",
        bene_bank_account_holder_name: initialData.bene_bank_account_holder_name ?? "",
        bene_bank_account_type: stateData.dropdown_vl_bene_bank_account_type ?? "",
        borro_bank_name: initialData.borro_bank_name ?? "",
        borro_bank_ifsc: stateData.IFSC_vl_borro_bank_ifsc ?? "",
        borro_bank_acc_num: stateData.String_vl_borro_bank_acc_num ?? "",
        borro_confirm_bank_acc_no: stateData.String_vl_borro_confirm_bank_acc_no ?? "",
        borro_bank_account_holder_name: stateData.String_vl_borro_bank_account_holder_name ?? "",
        borro_bank_account_type: stateData.dropdown_vl_borro_bank_account_type ?? "",
        igst_amount: initialData.igst_amount ?? "",
        cgst_amount: initialData.cgst_amount ?? "",
        sgst_amount: initialData.sgst_amount ?? "",
        gst_on_application_fees: initialData.gst_on_application_fees ?? "",
        cgst_on_application_fees: initialData.cgst_on_application_fees ?? "",
        sgst_on_application_fees: initialData.sgst_on_application_fees ?? "",
        igst_on_application_fees: initialData.igst_on_application_fees ?? "",
        conv_fees_excluding_gst: initialData.conv_fees_excluding_gst ?? "",
        application_fees_excluding_gst: initialData.application_fees_excluding_gst ?? "",
        conv_fees: initialData.conv_fees ?? "",
        application_fees: initialData.application_fees ?? "",
        application_fee_perc: initialData.application_fee_perc ?? "",
      }
    };
    let errorFiedls = false
    if (newLoanCreationData) {
      newLoanCreationData.map((item) => {
        let name = item.field
        let field = `${item.type}_vl_${item.field}`;
        if ((initialData[name] === "" || initialData[name] === undefined || initialData[name] === null)
          && name !== 'insurance_amount' && name !== 'calculate'
        ) {
          if( (name === 'application_fee_perc' || name === "application_fees") && !isApplicationFee){
            setValidationData((prevState) => ({...prevState,[`${field}State`]: ""}));
          }
          else if (!isBrokenInt && name === "broken_interest" ){
            setValidationData((prevState) => ({...prevState,[`${field}State`]: ""}));
          }
          else if (!isConvenience && name === "conv_fees"){
            setValidationData((prevState) => ({...prevState,[`${field}State`]: ""}));
          }
          else {
          setValidationData((prevState) => ({
            ...prevState,
            [`${field}State`]: "has-danger",
          }));
          errorFiedls = true;
        }
        }
      })
    }
    const formValid = Object.values(validationData).every(value => value !== 'has-danger');
    if (!formValid) {
      showAlert("Kindky check errors", "error")
    }
    if (formValid && !errorFiedls) {
      new Promise((resolve, reject) => {
        dispatch(postLoanDetailsWatcher(payload, resolve, reject));
      })
        .then((response) => {
          showAlert(response?.message, "success");
          setIsDisabled(true)
          setTimeout(() => {
            window.open(`/admin/msme/loan_details/${response.data.loan_id}/${initialData.company_id}/${initialData.product_id}?tab=${"SL & LBA"}`, "_self");
          },3000);
        })
        .catch((error) => {
          showAlert(error?.response?.data?.data?.message, "error");
        });
    }
  };

  const renderFields = () => {
    let fieldsArray = newLoanCreationData
    if (!isConvenience) {
      const filteredArray = newLoanCreationData.filter(obj => obj.field !== 'conv_fees');
      fieldsArray = filteredArray
    }
    if (!isApplicationFee) {
      let idsToDelete = ['application_fee_perc', 'application_fees']
      const filteredArray = fieldsArray.filter(obj => !idsToDelete.includes(obj.field));
      fieldsArray = filteredArray
    }
    if (!isBrokenInt) {
      const filteredArray = fieldsArray.filter(obj => obj.field !== 'broken_interest');
      fieldsArray = filteredArray
    }
    const groupedFields = {};
    fieldsArray.forEach((row) => {
      const dept = row.dept;
      if (!groupedFields[dept]) {
        groupedFields[dept] = [];
      }
      groupedFields[dept].push(row);
    });

    return (
      <div className="create-loan-body">
        {alert ? <AlertBox severity={severity} msg={alertMessage} onClose={handleAlertClose} /> : null}
        {Object.keys(groupedFields).map((dept) => (
          <div key={dept}>
            <div className="create-loan-header">
              {dept}
              {dept === 'Enter Borrower Bank Details' && !isDisabled ? (
                <>
                  <input
                    style={{
                      marginLeft: '16px',
                      marginTop: '6px',
                      width: '1rem',
                      height: '1rem',
                    }}
                    type="checkbox"
                    checked={sameAsBeneficiary}
                    onClick={() => {
                            setSameAsBeneficiary(!sameAsBeneficiary);
                            copyBeneficiaryToBorrower(!sameAsBeneficiary);
                          }}
                  ></input>
                  <div
                    style={{
                      fontFamily: 'Montserrat-Regular',
                      fontSize: '16px',
                      marginLeft: '8px',
                      fontWeight: '500',
                      lineHeight: '24px',
                      color: '#767888',
                      marginTop: '2px',
                    }}
                  >
                    Same as beneficiary bank details
                  </div>
                </>
              ) : null}
            </div>
            <div className="create-loan-container">
              {groupedFields[dept].map((row) => (
                <div key={`${row.type}_vl_${row.field}`}>
                  {row.type === 'Date' ? (
                    <BasicDatePicker
                      disableFutureDate={true}
                      disabled={initialData[row.field] || isDisabled}
                      style={{
                        width: '100%',
                        backgroundColor: '#fff',
                      }}
                      placeholder={row.title}
                      value={initialData[row.field]}
                      onDateChange={(date) => changeDateSelected(date, `${row.type}_vl_${row.field}`)}
                      format="dd-MM-yyyy"
                      error={stateData[`${row.type}_vl_${row.field}`] !== '' && validationData[`${row.type}_vl_${row.field}State`] === 'has-danger'}
                      helperText={stateData[`${row.type}_vl_${row.field}`] !== '' && validationData[`${row.type}_vl_${row.field}State`] === 'has-danger' ? row.validationmsg : ''}
                    />
                  ) : row.type === 'button' ? (
                    <Button buttonType="" label={row.title} onClick={handleCalculate} isDisabled={isCalculate || isDisabled} customStyle={customSubmitButton} />
                  ) : row.type === 'dropdown' ? (
                    <InputBox
                      label={row.title}
                      isDrawdown={true}
                      customClass={{
                        height: '56px',
                        width: '500px',
                        maxWidth: '100%',
                      }}
                      customInputClass={{
                        width: '100%',
                        backgroundColor: '#fff',
                      }}
                      error={validationData[`${row.type}_vl_${row.field}State`] === 'has-danger' ? true : false}
                      helperText={validationData[`${row.type}_vl_${row.field}State`] === 'has-danger' ? row.validationmsg : ''}
                      initialValue={stateData[`${row.type}_vl_${row.field}`] || initialData[row.field]}
                      isDisabled={isDisabled || (row.dept === 'Enter Borrower Bank Details' && sameAsBeneficiary)}
                      customDropdownClass={{ marginTop: '7px', zIndex: 5 }}
                      options={
                            (row.field === "purpose_of_loan") ? purpose_of_loan_options
                            :row.field === 'bene_bank_account_type' || row.field === 'borro_bank_account_type' ? BankType : BankList}
                      onClick={(value) => handleDropdownAccTypeChange(value, row.type, row.field)}
                    />
                  ) : (
                    <InputBox
                      id={row.field}
                      label={row.title}
                      customClass={{
                        height: '56px',
                        width: '500px',
                        maxWidth: '100%',
                      }}
                      customInputClass={{
                        width: '100%',
                        backgroundColor: '#fff',
                        marginTop: row.isDisabled ? '-3px' : '3px',
                      }}
                      initialValue={row.field === 'conv_fees' && initialData[row.field] === 0 ? '0' : stateData[`${row.type}_vl_${row.field}`] || initialData[row.field]}
                      onClick={(event) => change(event, row.type, row.field)}
                      helperText={validationData[`${row.type}_vl_${row.field}State`] === 'has-danger' ? row.validationmsg : ''}
                      error={validationData[`${row.type}_vl_${row.field}State`] === 'has-danger'}
                      isDisabled={row.isDisabled || (row.dept === 'Enter Borrower Bank Details' && sameAsBeneficiary) || isDisabled}
                      onPaste={(event) => handlePaste(event, row.field)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {isLoading && <Preloader />}
      </div>
    );
  };

  const fetchLoanDetails = () => {
    new Promise((resolve, reject) => {
      dispatch(
        getBookLoanDetailsWatcher(
          {
            loan_app_id: params.id,
            user: user
          },
          resolve,
          reject
        )
      );
    })
      .then(response => {
        setInitialData(response);
        setCompanyID(response.company_id)
        setProductID(response.product_id)
        if (response.lead_status === LeadStatus.approved.value) {
          history.push(`/admin/msme/loans`, "_self")
        }
      })
      .catch(error => {
        showAlert("Error while Fetching Lead Details","error")
      });
  };

  const handleCalculate = () => {
    setOnPageLoad(false)
    const formValid = Object.values(validationData).every(value => value !== 'has-danger');
    if (!formValid) {
      showAlert("Kindky check errors", "error")
    }
    else {
      let data = {
        "processing_fees_perc": initialData["processing_fees_perc"] ?? "",
        "sanction_amount": initialData["sanction_amount"] ?? "",
        "application_fee_perc": initialData["application_fee_perc"] ?? "",
        "insurance_amount": initialData["insurance_amount"] ?? "",
      }
      getCalculateFeesAndCharges(data)
      setIsCalculate(true)
    }
  };

  const getCalculateFeesAndCharges = (data) => {
    const payload = {
      loan_app_id: params.id,
      companyId: companyId,
      productId: productId,
      user_id: user._id,
    };
    if (data) {
      payload.processing_fees_perc = data.processing_fees_perc
      payload.sanction_amount = data.sanction_amount
      payload.application_fee_perc = data.application_fee_perc
      payload.insurance_amount = data.insurance_amount
    }
    new Promise((resolve, reject) => {
      dispatch(getCalculateFeesAndChargesWatcher(payload, resolve, reject));
    })
      .then((response) => {
        setOfferedAMount(response?.data?.offered_amount)
        setOfferedIntRate(response?.data?.loan_int_rate)
        setInitialData((prevState) => ({
          ...prevState,
          "conv_fees": response?.data?.conv_fees ?? "",
          'processing_fees_perc': response?.data?.processing_fees_perc ?? "",
          "processing_fees_amt": response?.data?.processing_fees_amt === "NaN" ? "" : Number(response?.data?.processing_fees_amt) + Number(response?.data?.gstCalculationOnPF?.calculatedGstAmt) ?? "",
          'net_disbur_amt': response?.data?.net_disbursement_amount === null ? "" : response?.data?.net_disbursement_amount + "" ?? "",
          "first_installment_date": response?.data.first_inst_date ?? "",
          "final_approval_date": response?.data.final_approve_date ?? "",
          "loan_app_date": response?.data.loan_app_date ?? "",
          "tenure": response?.data?.tenure ?? "",
          "sanction_amount": response?.data?.sanction_amount + "" ?? "",
          "loan_interest_rate": response?.data?.loan_int_rate ?? "",
          "gst_on_pf_amt": response?.data?.gstCalculationOnPF?.calculatedGstAmt ?? "",
          "application_fee_perc": response?.data?.application_fee_perc ?? "",
          'application_fees': response?.data?.application_fees ?? "",
          'conv_fees': response?.data?.conv_fees ?? "",
          "broken_interest": response?.data?.broken_interest + "" ?? "",
          "igst_amount": response?.data?.gstCalculationOnPF?.calculatedIgst ?? "",
          "cgst_amount": response?.data?.gstCalculationOnPF?.calculatedCgst ?? "",
          "sgst_amount": response?.data?.gstCalculationOnPF?.calculatedSgst ?? "",
          "purpose_of_loan": "Working Capital" ?? "",
          "gst_on_application_fees": response?.data?.gstOnApplicationFees?.calculatedGstAmt ?? "",
          "cgst_on_application_fees": response?.data?.gstOnApplicationFees?.calculatedCgst ?? "",
          "sgst_on_application_fees": response?.data?.gstOnApplicationFees?.calculatedSgst ?? "",
          "igst_on_application_fees": response?.data?.gstOnApplicationFees?.calculatedIgst ?? "",
          "conv_fees_excluding_gst": response?.data?.gstOnConvFees?.convFeesExcludingGst ?? "",
          "application_fees_excluding_gst": response?.data?.gstOnApplicationFees?.applFeesExcludingGst ?? "",
        }))
        if (response.data.isConvFeeApplicable) {
          setIsConvenience(true)
        }
        if (response.data.isApplicationFeeApplicable) {
          setIsApplicationFee(true)
        }
        if (response.data.isBrokenInterestApplicable) {
          setIsBrokenInt(true)
        }
      })
      .catch((error) => {
        showAlert(error?.response?.data?.data?.message, "error")
      });
  };

  useEffect(() => {
    fetchLoanDetails();
  }, []);

  useEffect(() => {
    if (companyId && productId) {
      getCalculateFeesAndCharges();
    }
  }, [companyId, productId]);

  const customSubmitButton = {
    display: 'inline - flex',
    height: '48px',
    width: 'max-content',
    padding: '8px 24px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    color: '#FFF',
    fontFamily: 'Montserrat-Regular',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '150%',
    flexShrink: '0',
    borderRadius: '40px',
    background: isCalculate ? '#CCCDD3' : 'linear-gradient(180deg, #134CDE 0%, #163FB7 100%)',
  };

  const handleDropdownAccTypeChange = (event, type, name) => {
    let field = `${type}_vl_${name}`;
    setStateData((prevState) => ({
      ...prevState,
      [field]: event?.label ?? null,
    }));
    setInitialData((prevState) => ({
      ...prevState,
      [name]: event?.label ?? null,
    }));
    setValidationData((prevState) => ({
      ...prevState,
      [`${field}State`]: "",
    }));
  };

  return (
    <>
      <div style={{ marginBottom: "30px" }}>
        {renderFields()}
      </div>
      <div>
        <div className="create-loan-button-css">
          <Button
            buttonType=""
            label="Submit & Next"
            onClick={handleSubmit}
            isDisabled={isDisabled || onPageLoad || !isCalculate}
            customStyle={{ ...customSubmitButton, background: !isCalculate || isDisabled || onPageLoad ? '#CCCDD3' : 'linear-gradient(180deg, #134CDE 0%, #163FB7 100%)' }}
          />
        </div>
      </div>
    </>
  );
}
