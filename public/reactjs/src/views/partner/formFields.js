export const PARTNER_BUSINESS_DETAILS_FIELDS = state => [
  {
    resultState: state.partnernameState,
    placeholder: "Company name*",
    name: "partnername",
    type: "text",
    component: "text",
    condition: "name",
    errorMsg: "Minimum 6 character string",
    value: 6
  },
  {
    resultState: state.cinState,
    placeholder: "CIN number*",
    name: "cin",
    type: "text",
    component: "text",
    condition: "cin",
    errorMsg: "Please enter a valid CIN.",
    value: 21
  },
  {
    resultState: state.addressState,
    placeholder: "Address*",
    name: "address",
    type: "textarea",
    component: "text",
    condition: "address",
    errorMsg: "Minimum 10 character string",
    value: 10
  },
  {
    resultState: state.stateState,
    placeholder: "Select state*",
    name: "state",
    type: "input",
    component: "select",
    condition: "state",
    errorMsg: "Select state",
    value: 3,
    dataSet: "states"
  },
  {
    resultState: state.cityState,
    placeholder: "Select city*",
    name: "city",
    type: "input",
    component: "select",
    condition: "city",
    errorMsg: "Select city",
    value: 3,
    dataSet: "cities"
  },
  {
    resultState: state.pincodeState,
    placeholder: "PIN code*",
    name: "pincode",
    type: "number",
    component: "text",
    condition: "pincode",
    errorMsg: "Number of 6 numbers",
    value: 6,
    dataSet: "pincodes"
  },
  {
    resultState: state.gstinState,
    placeholder: "GSTIN",
    name: "gstin",
    type: "text",
    component: "text",
    condition: "gstin",
    errorMsg: "Please enter a valid GSTIN.",
    value: 15
  },
  {
    resultState: state.tinState,
    placeholder: "TIN",
    name: "tin",
    type: "text",
    component: "text",
    condition: "tin",
    errorMsg: "Please enter a valid TIN.",
    value: 9
  },
  {
    resultState: state.phoneState,
    placeholder: "Business phone*",
    name: "phone",
    type: "text",
    component: "text",
    condition: "phone",
    errorMsg: "Please enter a 10 digit phone number.",
    value: 11
  },
  {
    resultState: state.websiteState,
    placeholder: "Website*",
    name: "website",
    type: "text",
    component: "text",
    condition: "url",
    errorMsg: "Please enter a valid url.",
    value: 0
  },
  {
    resultState: state.shortNameState,
    placeholder: "Short name",
    name: "shortName",
    type: "text",
    component: "text",
    condition: "length",
    errorMsg: "Please enter a valid short name.",
    value: 1
  },
  {
    resultState: state.lmsVersionState,
    placeholder: "Select lms version*",
    name: "lmsVersion",
    type: "input",
    component: "select",
    condition: "lmsVersion",
    errorMsg: "Select lms version",
    value: 3,
    dataSet: "lmsOptions"
  },
  {
    resultState: state.groNameState,
    placeholder: "GRO Name*",
    name: "groName",
    type: "text",
    component: "text",
    condition: "string",
    errorMsg: "Please enter GRO Name",
    value: 4
  },
  {
    resultState: state.groDesignationState,
    placeholder: "GRO Designation*",
    name: "groDesignation",
    type: "text",
    component: "text",
    condition: "string",
    errorMsg: "Please enter GRO Designation",
    value: 5
  },
  {
    resultState: state.groAddressState,
    placeholder: "GRO Address*",
    name: "groAddress",
    type: "text",
    component: "text",
    condition: "string",
    errorMsg: "Please enter GRO Address",
    value: 7
  },
  {
    resultState: state.groEmailIdState,
    placeholder: "GRO Email ID*",
    name: "groEmailId",
    type: "text",
    component: "text",
    condition: "email",
    errorMsg: "Please enter a valid email",
    value: 12
  },
  {
    resultState: state.groContactNumberState,
    placeholder: "GRO Contact Number*",
    name: "groContactNumber",
    type: "text",
    component: "text",
    condition: "phone",
    errorMsg: "Please enter a valid contact number",
    value: 13
  },
  {
    resultState: state.digitalLendingAppState,
    placeholder: "Digital lending app name*",
    name: "digitalLendingApp",
    type: "text",
    component: "text",
    condition: "string",
    errorMsg: "Please enter digital lending app name",
    value: 14
  }
];

// FIELDS FOR ADD PARTNER
export const PARTNER_ABROAD_COMPANY_DETAILS_FIELDS = state => [
  {
    resultState: state.abCompanynameState,
    placeholder: "Company Name",
    name: "abCompanyname",
    type: "text",
    condition: "length",
    errorMsg: "Minimum 3 character name.",
    value: 3,
    component: "text"
  },
  {
    resultState: state.abAddressState,
    placeholder: "Address",
    name: "abAddress",
    type: "text",
    condition: "length",
    errorMsg: "Minimum 10 character string.",
    value: 10,
    component: "text"
  },
  {
    resultState: state.abWebsiteState,
    placeholder: "Website",
    name: "abWebsite",
    type: "text",
    condition: "url",
    errorMsg: "Please enter a valid url.",
    value: 0,
    component: "text"
  },
  {
    resultState: state.stateState,
    placeholder: "Select country",
    name: "abCountry",
    type: "input",
    component: "select",
    condition: "length",
    errorMsg: "Select country",
    value: 3,
    dataSet: "countries"
  },
  {
    resultState: state.abNameState,
    placeholder: "SPOC Name",
    name: "abName",
    type: "text",
    condition: "name",
    errorMsg: "Minimum 2 character name.",
    value: 2,
    component: "text"
  },
  {
    resultState: state.abDesignationState,
    placeholder: "SPOC Designation",
    name: "abDesignation",
    type: "text",
    condition: "name",
    errorMsg: "Minimum 2 character designation",
    value: 2,
    component: "text"
  },
  {
    resultState: state.abRoleState,
    placeholder: "SPOC Role",
    name: "abRole",
    type: "text",
    condition: "name",
    errorMsg: "Minimum 2 character role.",
    value: 2,
    component: "text"
  },
  {
    resultState: state.abEmailState,
    placeholder: "SPOC Email",
    name: "abEmail",
    type: "text",
    condition: "email",
    errorMsg: "Enter a valid email address.",
    value: 0,
    component: "text"
  },
  {
    resultState: state.abNumberState,
    placeholder: "SPOC contact (10 digit)",
    name: "abNumber",
    type: "text",
    condition: "mobile",
    errorMsg: "Enter a 10 digit mobile number.",
    value: 10,
    component: "text"
  },
  {
    resultState: state.abPhoneState,
    placeholder: "Phone (11 digit)",
    name: "abPhone",
    type: "text",
    condition: "phone",
    errorMsg: "Enter a 11 digit phone number.",
    value: 11,
    component: "text"
  },
  {
    resultState: state.abWhatsAppState,
    placeholder: "WhatsApp Number (10 digit)",
    name: "abWhatsApp",
    type: "text",
    condition: "mobile",
    errorMsg: "Enter a 10 digit mobile number.",
    value: 10,
    component: "text"
  }
];
