export const newLoanCreationData = [
  {
    title: "Loan Application ID",
    dept: "Loan Details",
    type: "String",
    field: "loan_app_id",
    isOptional: false,
    validationmsg: "Please enter Loan Appliaction ID in correct format",
    isDisabled: true
  },
  {
    title: "Borrower ID",
    dept: "Loan Details",
    type: "String",
    field: "borrower_id",
    isOptional: false,
    validationmsg: "Please enter Borrower ID in correct format",
    isDisabled: true
  },
  {
    title: "Partner Loan Application ID",
    dept: "Loan Details",
    type: "String",
    field: "partner_loan_app_id",
    isOptional: false,
    validationmsg: "Please enter Partner Loan Application ID in correct format",
    isDisabled: true
  },
  {
    title: "Partner Borrower ID",
    dept: "Loan Details",
    type: "String",
    field: "partner_borrower_id",
    isOptional: false,
    validationmsg: "Please enter Borrower ID in correct format",
    isDisabled: true
  },
  {
    title: "Partner Loan ID",
    dept: "Loan Details",
    type: "String",
    field: "partner_loan_id",
    isOptional: false,
    validationmsg: "Please enter Partner Loan ID in correct format",
    isDisabled: false
  },
  {
    title: "Purpose Of Loan",
    dept: "Loan Details",
    field: "purpose_of_loan",
    type: "dropdown",
    isDrawdown: true,
    isOptional: false,
    validationMsg: "Purpose Of Loan is Required",
    checked: "true",
},
  {
    title: "Loan Application Date",
    dept: "Loan Details",
    type: "String",
    field: "loan_app_date",
    isOptional: false,
    validationmsg: "Please enter Loan Application Date in dd-mm-yyyy format",
    isDisabled: true
  },
  {
    title: "Final Approval Date",
    dept: "Loan Details",
    type: "String",
    field: "final_approval_date",
    isOptional: false,
    validationmsg: "Please enter Final Approval Date in correct format",
    isDisabled: true
  },
  {
    title: "First Installment Date",
    dept: "Loan Details",
    type: "String",
    field: "first_installment_date",
    isOptional: false,
    validationmsg: "Please enter First Installment Date in correct format",
    isDisabled: true
  },
  {
    title: "Loan Amount",
    dept: "Loan Details",
    type: "float",
    field: "sanction_amount",
    isOptional: false,
    validationmsg: "Loan amount should be less than offered amount",
    isDisabled: false
  },
  {
    title: "Loan Interest Rate",
    dept: "Loan Details",
    type: "float",
    field: "loan_interest_rate",
    isOptional: false,
    validationmsg: "Please enter Loan Interest Rate in correct format",
    isDisabled: true
  },
  {
    title: "Tenure",
    dept: "Loan Details",
    type: "Number",
    field: "loan_tenure",
    isOptional: false,
    validationmsg: "Please enter Tenure in correct format",
    isDisabled: true
  },
  {
    title: "Processing Fees Percentage",
    dept: "Fees, charges and Net disbursement",
    type: "Float",
    field: "processing_fees_perc",
    isOptional: false,
    validationmsg: "Please enter Processing Fees Percentage in correct format",
    isDisabled: false
  },
  {
    title: "Processing Fee (Incl gst)",
    dept: "Fees, charges and Net disbursement",
    type: "Float",
    field: "processing_fees_amt",
    isOptional: false,
    validationmsg: "Please enter Processing Fees Amount in correct format",
    isDisabled: true
  },
  {
    title: "Convenience Fees (Incl gst)",
    dept: "Fees, charges and Net disbursement",
    type: "Float",
    field: "conv_fees",
    isOptional: false,
    validationmsg: "Please enter Loan Interest Rate in correct format",
    isDisabled: true
  },
  {
    title: "Application Fee Percentage",
    dept: "Fees, charges and Net disbursement",
    type: "float",
    field: "application_fee_perc",
    isOptional: false,
    validationmsg: "Please enter Loan Interest Rate in correct format",
    isDisabled: false
  },
  {
    title: "Application fee (Incl gst)",
    dept: "Fees, charges and Net disbursement",
    type: "float",
    field: "application_fees",
    isOptional: false,
    validationmsg: "Please enter Loan Interest Rate in correct format",
    isDisabled: true
  },
  {
    title: "Insurance Amount (Optional)",
    dept: "Fees, charges and Net disbursement",
    type: "floatEmpty",
    field: "insurance_amount",
    isOptional: true,
    validationmsg: "Please enter Insurance Amount in correct format",
    isDisabled: false
  },
  {
    title: "Broken Period Interest Amount",
    dept: "Fees, charges and Net disbursement",
    type: "Float",
    field: "broken_interest",
    isOptional: false,
    validationmsg:
      "Please enter Broken Period Interest Amount in correct format",
    isDisabled: true
  },
  {
    title: "Net Disbursement Amount",
    dept: "Fees, charges and Net disbursement",
    type: "Float",
    field: "net_disbur_amt",
    isOptional: false,
    validationmsg: "Please enter Net Disbursement Amount in correct format",
    isDisabled: true
  },
  {
    title: "Calculate",
    dept: "Fees, charges and Net disbursement",
    type: "button",
    field: "calculate",
    isOptional: false,
    validationmsg: "",
  },
  {
    title: "Bank Name",
    dept: "Enter Beneficiary Bank Details",
    type: "dropdown",
    field: "bene_bank_name",
    isOptional: false,
    isDropDown: true,
    validationmsg: "Please enter Bank Name in correct format",
    isDisabled: false
  },

  {
    title: "Bank Account type",
    dept: "Enter Beneficiary Bank Details",
    type: "dropdown",
    field: "bene_bank_account_type",
    isOptional: false,
    isDropDown: true,
    validationmsg: "Please select Bank Account Type",
    isDisabled: false
  },
  {
    title: "Bank IFSC",
    dept: "Enter Beneficiary Bank Details",
    type: "IFSC",
    field: "bene_bank_ifsc",
    isOptional: false,
    validationmsg: "Please enter Bank IFSC in correct format",
    isDisabled: false
  },
  {
    title: "Bank A/C No.",
    dept: "Enter Beneficiary Bank Details",
    type: "String",
    field: "bene_bank_acc_num",
    isOptional: false,
    validationmsg: "Please enter Bank Account Number in correct format",
    isDisabled: false
  },
  {
    title: "Confirm Bank A/C No.",
    dept: "Enter Beneficiary Bank Details",
    type: "String",
    field: "bene_confirm_bank_acc_no",
    isOptional: false,
    validationmsg: "Please enter Bank Account Number in correct format",
    isDisabled: false
  },
  {
    title: "Bank A/C Holder Name",
    dept: "Enter Beneficiary Bank Details",
    type: "String",
    field: "bene_bank_account_holder_name",
    isOptional: false,
    validationmsg: "Please enter Bank Account Holder Name in correct format",
    isDisabled: false
  },
  {
    title: "Bank Name",
    dept: "Enter Borrower Bank Details",
    type: "dropdown",
    field: "borro_bank_name",
    isOptional: false,
    isDropDown: true,
    validationmsg: "Please enter Bank Name in correct format",
    isDisabled: false
  },
  {
    title: "Bank Account type",
    dept: "Enter Borrower Bank Details",
    type: "dropdown",
    field: "borro_bank_account_type",
    isOptional: false,
    isDropDown: true,
    validationmsg: "Please select Bank Account Type",
    isDisabled: false
  },
  {
    title: "Bank IFSC",
    dept: "Enter Borrower Bank Details",
    type: "IFSC",
    field: "borro_bank_ifsc",
    isOptional: false,
    validationmsg: "Please enter Bank IFSC in correct format",
    isDisabled: false
  },
  {
    title: "Bank A/C No.",
    dept: "Enter Borrower Bank Details",
    type: "String",
    field: "borro_bank_acc_num",
    isOptional: false,
    validationmsg: "Please enter Bank Account Number in correct format",
    isDisabled: false
  },
  {
    title: "Confirm Bank A/C No.",
    dept: "Enter Borrower Bank Details",
    type: "String",
    field: "borro_confirm_bank_acc_no",
    isOptional: false,
    validationmsg: "Please enter Bank Account Number in correct format",
    isDisabled: false
  },
  {
    title: "Bank A/C Holder Name",
    dept: "Enter Borrower Bank Details",
    type: "String",
    field: "borro_bank_account_holder_name",
    isOptional: false,
    validationmsg: "Please enter Bank Account Holder Name in correct format",
    isDisabled: false
  },
];
