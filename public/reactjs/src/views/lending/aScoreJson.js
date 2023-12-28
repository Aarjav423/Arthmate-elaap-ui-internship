export const aScoreFields = () => [
  {
    title: "First Name",
    name: "first_name",
    disabled: true,
    type: "string",
    section: "Basic Details",
    errorMsg: "Please enter valid first name"
  },
  {
    title: "Last Name",
    name: "last_name",
    disabled: true,
    type: "string",
    section: "Basic Details",
    errorMsg: "Please enter valid last name"
  },
  {
    title: "DOB",
    name: "dob",
    disabled: true,
    type: "date",
    section: "Basic Details",
    errorMsg: "Please enter valid date of birth"
  },
  {
    title: "Appl PAN",
    name: "appl_pan",
    disabled: true,
    type: "pan",
    section: "Basic Details",
    errorMsg: "Please enter valid pan number"
  },
  {
    title: "Gender",
    name: "gender",
    disabled: true,
    type: "string",
    section: "Basic Details",
    errorMsg: "Please enter valid gender"
  },
  {
    title: "Appl Phone",
    name: "appl_phone",
    disabled: true,
    type: "mobile",
    section: "Basic Details",
    errorMsg: "Please enter valid mobile number"
  },
  {
    title: "Address",
    name: "resi_addr_ln1",
    disabled: true,
    type: "string",
    section: "Basic Details",
    errorMsg: "Please enter valid address"
  },
  {
    title: "City",
    name: "city",
    disabled: true,
    type: "string",
    section: "Basic Details",
    errorMsg: "Please enter valid city"
  },
  {
    title: "State",
    name: "state",
    disabled: true,
    type: "string",
    section: "Basic Details",
    errorMsg: "Please enter valid state"
  },
  {
    title: "Pincode",
    name: "pincode",
    disabled: true,
    type: "string",
    section: "Basic Details",
    errorMsg: "Please enter valid pin code"
  },
  {
    title: "Loan app Id",
    name: "loan_app_id",
    disabled: true,
    type: "string",
    section: "Basic Details",
    errorMsg: "Please enter valid loan_app_id"
  },
  {
    title: "Product type",
    name: "product_type",
    disabled: true,
    type: "string",
    section: "Basic Details",
    errorMsg: "Please enter valid product type"
  },
  {
    title: "Enquiry Purpose",
    name: "enquiry_purpose",
    disabled: false,
    type: "string",
    section: "Bureau Details",
    errorMsg: "Please enter valid enquiry purpose",
    required: true
  },
  {
    title: "Enquiry Stage",
    name: "enquiry_stage",
    disabled: false,
    type: "string",
    section: "Bureau Details",
    errorMsg: "Please enter valid enquiry stage",
    required: true
  },
  {
    title: "Enquiry Amount",
    name: "enquiry_amount",
    disabled: false,
    type: "float",
    section: "Bureau Details",
    errorMsg: "Please enter valid enquiry amount",
    required: true
  },
  {
    title: "Enquiry Account Number",
    name: "en_acc_account_number_1",
    disabled: false,
    type: "string",
    section: "Bureau Details",
    errorMsg: "Please enter valid en_acc_account_number",
    required: true,
    infoText:
      "This field is mandatory for CIBIL Bureau type only. Use loan App Id in this field."
  },
  {
    title: "Bureau Type",
    name: "bureau_type",
    disabled: false,
    type: "string",
    section: "Bureau Details",
    errorMsg: "Please enter valid bureau type",
    required: true
  },

  {
    title: "Consent",
    name: "consent",
    disabled: false,
    type: "string",
    section: "Bureau Details",
    errorMsg: "Please enter valid consent",
    required: true
  },
  {
    title: "Consent Timestamp",
    name: "consent_timestamp",
    disabled: false,
    type: "dateTime",
    section: "Bureau Details",
    errorMsg: "Please enter valid consent timestamp",
    required: true
  },
  {
    title: "Tenure",
    name: "tenure",
    disabled: false,
    type: "float",
    section: "Loan Details",
    errorMsg: "Please enter valid tenure",
    required: true
  },
  {
    title: "A-Score Request ID",
    name: "a_score_request_id",
    disabled: true,
    type: "string",
    section: "A-Score Details",
    errorMsg: "",
    required: false
  },
  {
    title: "A Score",
    name: "a_score",
    disabled: true,
    type: "string",
    section: "A-Score Details",
    errorMsg: "",
    required: false
  }
];
