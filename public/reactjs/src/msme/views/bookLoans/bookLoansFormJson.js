export const bookLoansFormJsonFields = () => [
    {
        title: "First Name",
        dept: "Co-Applicant Details",
        type: "string",
        isDrawdown: false,
        field: `cb_fname`,
        isOptional: false,
        validationMsg: "First Name is required",
        checked: "true"
    },
    {
        title: "Middle Name (Optional)",
        dept: "Co-Applicant Details",
        type: "string",
        isDrawdown: false,
        field: `cb_mname`,
        isOptional: true,
        validationMsg: "Middle Name is required",
        checked: "false"
    },
    {
        title: "Last Name",
        dept: "Co-Applicant Details",
        type: "string",
        isDrawdown: false,
        field: `cb_lname`,
        isOptional: false,
        validationMsg: "Last Name is required",
        checked: "true"
    },
    {
        title: "Date of Birth",
        dept: "Co-Applicant Details",
        type: "date",
        isDrawdown: false,
        field: `cb_dob`,
        isOptional: false,
        validationMsg: "Date of Birth is required",
        checked: "true"
    },
    {
        title: "Age",
        dept: "Co-Applicant Details",
        type: "number",
        isDrawdown: false,
        field: `cb_age`,
        isOptional: false,
        validationMsg: "Age is required",
        checked: "false"
    },
    {
        title: "Gender",
        dept: "Co-Applicant Details",
        type: "string",
        isDrawdown: true,
        options: [
            { value: "Female", label: "Female" },
            { value: "Male", label: "Male" }
        ],
        field: `cb_gender`,
        isOptional: false,
        validationMsg: "Gender is required",
        checked: "true"
    },
    {
        title: "Mobile No.",
        dept: "Co-Applicant Details",
        type: "mobile",
        isDrawdown: false,
        field: `cb_mobile`,
        isOptional: false,
        validationMsg: "Please enter a valid Mobile No.",
        checked: "true"
    },
    {
        title: "Email ",
        dept: "Co-Applicant Details",
        type: "email",
        isDrawdown: false,
        field: `cb_email`,
        isOptional: false,
        validationMsg: "Please enter a valid email",
        checked: "true"
    },
    {
        title: "Father Full Name",
        dept: "Co-Applicant Details",
        type: "string",
        isDrawdown: false,
        field: `cb_father_name`,
        isOptional: false,
        validationMsg: "Father Full Name is required",
        checked: "true"
    },
    {
        title: "Address Line 1",
        dept: "Co-Applicant Current Address",
        type: "string",
        isDrawdown: false,
        field: `cb_resi_addr_ln1`,
        isOptional: false,
        validationMsg: "Address Line 1 is required",
        checked: "true"
    },
    {
        title: "Address Line 2 (Optional)",
        dept: "Co-Applicant Current Address",
        type: "string",
        isDrawdown: false,
        field: `cb_resi_addr_ln2`,
        isOptional: true,
        validationMsg: "field is required",
        checked: "false"
    },
    {
        title: "State",
        dept: "Co-Applicant Current Address",
        type: "string",
        isDrawdown: true,
        options: [
            { value: "State1", label: "State1" },
            { value: "State2", label: "State2" },
            { value: "State3", label: "State3" },
            { value: "State4", label: "State4" },
        ],
        field: `cb_state`,
        isOptional: false,
        validationMsg: "State is required",
        checked: "true"
    },
    {
        title: "City",
        dept: "Co-Applicant Current Address",
        type: "string",
        isDrawdown: true,
        options: [
            { value: "City1", label: "City1" },
            { value: "City2", label: "City2" },
            { value: "City3", label: "City3" },
            { value: "City4", label: "City4" },
        ],
        field: `cb_city`,
        isOptional: false,
        validationMsg: "City is required",
        checked: "true"
    },
    {
        title: "Pincode",
        dept: "Co-Applicant Current Address",
        type: "pincode",
        isDrawdown: false,
        field: `cb_pincode`,
        isOptional: false,
        validationMsg: "Please enter a valid Pincode",
        checked: "true"
    },
    {
        title: "Address Line 1",
        dept: "Co-Applicant Permanent Address",
        type: "string",
        isDrawdown: false,
        field: `cb_per_addr_ln1`,
        isOptional: false,
        validationMsg: "Address Line 1 is required",
        checked: "true"
    },
    {
        title: "Address Line 2 (Optional)",
        dept: "Co-Applicant Permanent Address",
        type: "string",
        isDrawdown: false,
        field: `cb_per_addr_ln2`,
        isOptional: true,
        validationMsg: "field is required",
        checked: "false"
    },
    {
        title: "State",
        dept: "Co-Applicant Permanent Address",
        type: "string",
        isDrawdown: true,
        options: [
            { value: "State1", label: "State1" },
            { value: "State2", label: "State2" },
            { value: "State3", label: "State3" },
            { value: "State4", label: "State4" },
        ],
        field: `cb_per_state`,
        isOptional: false,
        validationMsg: "State is required",
        checked: "true"
    },
    {
        title: "City",
        dept: "Co-Applicant Permanent Address",
        type: "string",
        isDrawdown: true,
        options: [
            { value: "City1", label: "City1" },
            { value: "City2", label: "City2" },
            { value: "City3", label: "City3" },
            { value: "City4", label: "City4" },
        ],
        field: `cb_per_city`,
        isOptional: false,
        validationMsg: "City is required",
        checked: "true"
    },
    {
        title: "Pincode",
        dept: "Co-Applicant Permanent Address",
        type: "pincode",
        isDrawdown: false,
        field: `cb_per_pincode`,
        isOptional: false,
        validationMsg: "Please enter a valid Pincode",
        checked: "true"
    },
    {
        title: "PAN",
        dept: "Co-Applicant KYC",
        type: "pan",
        isDrawdown: false,
        field: `cb_pan`,
        isOptional: false,
        validationMsg: "Please enter a valid PAN",
        checked: "true"
    },
    {
        title: "Aadhaar Number",
        dept: "Co-Applicant KYC",
        type: "aadhaar",
        isDrawdown: false,
        field: `cb_aadhaar`,
        isOptional: false,
        validationMsg: "Please enter valid Aadhaar",
        checked: "true"
    },
    {
        title: "Aadhaar Front",
        dept: "Co-Applicant Aadhar Details",
        type: "string",
        isDrawdown: false,
        field: `cb_aadhar_front`,
        helperText: "JPG,JPEG,PNG,PDF upto 5MB",
        isOptional: false,
        validationMsg: "Aadhaar Front image is required",
        checked: "true"
    },
    {
        title: "Aadhaar Back",
        dept: "Co-Applicant Aadhar Details",
        type: "string",
        isDrawdown: false,
        field: `cb_aadhar_back`,
        helperText: "JPG,JPEG,PNG,PDF upto 5MB",
        isOptional: true,
        validationMsg: "Aadhaar Back image is required",
        checked: "true"
    },
    {
        title: "PAN",
        dept: "Co-Applicant PAN Details",
        type: "string",
        isDrawdown: false,
        field: `cb_pan_doc`,
        helperText: "JPG,JPEG,PNG,PDF upto 5MB",
        isOptional: true,
        validationMsg: "PAN image is required",
        checked: "true"
    },
    {
        title: "Applicant Selfie",
        dept: "Co-Applicant KYC Documents",
        type: "string",
        isDrawdown: false,
        field: `cb_selfie`,
        helperText: "JPG,JPEG,PNG,PDF upto 5MB",
        isOptional: true,
        validationMsg: "Applicant Selfie is required",
        checked: "true"
    },
    {
        title: "First Name",
        dept: "Guarantor Details",
        type: "string",
        isDrawdown: false,
        field: `gua_fname`,
        isOptional: false,
        validationMsg: "First Name is required",
        checked: "true"
    },
    {
        title: "Middle Name (Optional)",
        dept: "Guarantor Details",
        type: "string",
        isDrawdown: false,
        field: `gua_mname`,
        isOptional: true,
        validationMsg: "Middle Name is required",
        checked: "false"
    },
    {
        title: "Last Name",
        dept: "Guarantor Details",
        type: "string",
        isDrawdown: false,
        field: `gua_lname`,
        isOptional: false,
        validationMsg: "Last Name is required",
        checked: "true"
    },
    {
        title: "Date of Birth",
        dept: "Guarantor Details",
        type: "date",
        isDrawdown: false,
        field: `gua_dob`,
        isOptional: false,
        validationMsg: "Date of Birth is required",
        checked: "true"
    },
    {
        title: "Age",
        dept: "Guarantor Details",
        type: "number",
        isDrawdown: false,
        field: `gua_age`,
        isOptional: false,
        validationMsg: "Age is required",
        checked: "false"
    },
    {
        title: "Gender",
        dept: "Guarantor Details",
        type: "string",
        isDrawdown: true,
        options: [
            { value: "Female", label: "Female" },
            { value: "Male", label: "Male" }
        ],
        field: `gua_gender`,
        isOptional: false,
        validationMsg: "Gender is required",
        checked: "true"
    },
    {
        title: "Mobile No.",
        dept: "Guarantor Details",
        type: "mobile",
        isDrawdown: false,
        field: `gua_mobile`,
        isOptional: false,
        validationMsg: "Please enter a valid Mobile No.",
        checked: "true"
    },
    {
        title: "Email ",
        dept: "Guarantor Details",
        type: "email",
        isDrawdown: false,
        field: `guarantor_email`,
        isOptional: false,
        validationMsg: "Please enter a valid email",
        checked: "true"
    },
    {
        title: "Father Full Name",
        dept: "Guarantor Details",
        type: "string",
        isDrawdown: false,
        field: `gua_father_name`,
        isOptional:false,
        validationMsg: "Father Full Name is required",
        checked: "true"
    },
    {
        title: "Address Line 1",
        dept: "Guarantor Current Address",
        type: "string",
        isDrawdown: false,
        field: `gua_resi_addr_ln1`,
        isOptional: false,
        validationMsg: "Address Line 1 is required",
        checked: "true"
    },
    {
        title: "Address Line 2 (Optional)",
        dept: "Guarantor Current Address",
        type: "string",
        isDrawdown: false,
        field: `gua_resi_addr_ln2`,
        isOptional: true,
        validationMsg: "Address Line 2 is required",
        checked: "false"
    },
    {
        title: "State",
        dept: "Guarantor Current Address",
        type: "string",
        isDrawdown: true,
        options: [
            { value: "State1", label: "State1" },
            { value: "State2", label: "State2" },
            { value: "State3", label: "State3" },
            { value: "State4", label: "State4" },
        ],
        field: `gua_state`,
        isOptional: false,
        validationMsg: "State is required",
        checked: "true"
    },
    {
        title: "City",
        dept: "Guarantor Current Address",
        type: "string",
        isDrawdown: true,
        options: [
            { value: "City1", label: "City1" },
            { value: "City2", label: "City2" },
            { value: "City3", label: "City3" },
            { value: "City4", label: "City4" },
        ],
        field: `gua_city`,
        isOptional: false,
        validationMsg: "City is required",
        checked: "true"
    },
    {
        title: "Pincode",
        dept: "Guarantor Current Address",
        type: "pincode",
        isDrawdown: false,
        field: `gua_pincode`,
        isOptional: false,
        validationMsg: "Please enter a valid Pincode",
        checked: "true"
    },
    {
        title: "Address Line 1",
        dept: "Guarantor Permanent Address",
        type: "string",
        isDrawdown: false,
        field: `gua_per_addr_ln1`,
        isOptional: false,
        validationMsg: "Address Line 1 is required",
        checked: "true"
    },
    {
        title: "Address Line 2",
        dept: "Guarantor Permanent Address",
        type: "string",
        isDrawdown: false,
        field: `gua_per_addr_ln2`,
        isOptional: true,
        validationMsg: "Address Line 2 is required",
        checked: "false"
    },
    {
        title: "State",
        dept: "Guarantor Permanent Address",
        type: "string",
        isDrawdown: true,
        options: [
            { value: "State1", label: "State1" },
            { value: "State2", label: "State2" },
            { value: "State3", label: "State3" },
            { value: "State4", label: "State4" },
        ],
        field: `gua_per_state`,
        isOptional: false,
        validationMsg: "State is required",
        checked: "true"
    },
    {
        title: "City",
        dept: "Guarantor Permanent Address",
        type: "string",
        isDrawdown: true,
        field: `gua_per_city`,
        isOptional: false,
        validationMsg: "City is required",
        checked: "true"
    },
    {
        title: "Pincode",
        dept: "Guarantor Permanent Address",
        type: "pincode",
        isDrawdown: false,
        field: `gua_per_pincode`,
        isOptional: false,
        validationMsg: "Please enter a valid Pincode",
        checked: "true"
    },
    {
        title: "PAN",
        dept: "Guarantor KYC",
        type: "pan",
        isDrawdown: false,
        field: `gua_pan`,
        isOptional: false,
        validationMsg: "Please enter valid PAN",
        checked: "true"
    },
    {
        title: "Aadhaar Number",
        dept: "Guarantor KYC",
        type: "aadhaar",
        isDrawdown: false,
        field: `gua_aadhaar`,
        isOptional: false,
        validationMsg: "Please enter valid Aadhaar",
        checked: "true"
    },
    {
        title: "Aadhaar Front",
        dept: "Guarantor Aadhar Details",
        type: "string",
        isDrawdown: false,
        field: `guarantor_aadhar_front`,
        helperText: "JPG,JPEG,PNG,PDF upto 5MB",
        isOptional: true,
        validationMsg: "Aadhaar Front image is required",
        checked: "true"
    },
    {
        title: "Aadhaar Back",
        dept: "Guarantor Aadhar Details",
        type: "string",
        isDrawdown: false,
        field: `guarantor_aadhar_back`,
        helperText: "JPG,JPEG,PNG,PDF upto 5MB",
        isOptional: true,
        validationMsg: "Aadhaar Back image is required",
        checked: "true"
    },
    {
        title: "PAN",
        dept: "Guarantor PAN Details",
        type: "string",
        isDrawdown: false,
        field: `guarantor_pan_doc`,
        helperText: "JPG,JPEG,PNG,PDF upto 5MB",
        isOptional: true,
        validationMsg: "PAN image is required",
        checked: "true"
    },
    {
        title: "Applicant Selfie",
        dept: "Guarantor KYC Documents",
        type: "string",
        isDrawdown: false,
        field: `guarantor_selfie`,
        helperText: "JPG,JPEG,PNG,PDF upto 5MB",
        isOptional: true,
        validationMsg: "Applicant Selfie is required",
        checked: "true"
    },
    {
        title: "Company",
        field: "company_id",
        type: "string",
        isDrawdown: true,
        isOptional: false,
        dept: "select_company",
        validationMsg: "Company is Required",
        checked: "true"
    },
    {
        title: "Product",
        field: "product_id",
        type: "string",
        isDrawdown: true,
        isOptional: false,
        dept: "select_company",
        validationMsg: "Product is Required",
        checked: "true"
    },
    {
        title: "Partner Loan App ID",
        field: "partner_loan_app_id",
        type: "string",
        isOptional: false,
        dept: "select_partner",
        validationMsg: "Partner Loan App ID is Required",
        checked: "true"
    },
    {
        title: "Partner Borrower ID",
        field: "partner_borrower_id",
        type: "string",
        isOptional: false,
        dept: "select_partner",
        validationMsg: "Partner Borrower ID is Required",
        checked: "true"
    },
    {
        title: "Requested Loan Amount",
        field: "requested_loan_amount",
        type: "float",
        isOptional: false,
        dept: "Loan Requirement",
        validationMsg: "Requested Loan Amount is Required",
        checked: "true"
    },
    {
        title: "Tenure In Months",
        field: "tenure_in_months",
        type: "number",
        isOptional: false,
        dept: "Loan Requirement",
        validationMsg: "Tenure is Required",
        checked: "true"
    }, {
        title: "Interest Rate",
        field: "interest_rate",
        type: "float",
        isOptional: false,
        dept: "Loan Requirement",
        validationMsg: "Interest Rate is Required",
        checked: "true"
    },
    {
        title: "Purpose Of Loan",
        field: "purpose_of_loan",
        type: "string",
        isDrawdown: true,
        options: [
            { value: "working_capital", label: "Working Capital" },
            { value: "business_expansion", label: "Business Expansion" },
            { value: "purchase_of_business_fixed_assets", label: "Purchase of Business Fixed Assets" },
            { value: "inventory", label: "Inventory" },
            { value: "expansion_of_premises", label: "Expansion of Premises" },
            { value: "personal_requirement", label: "Personal requirement" },
            { value: "others", label: "Others" },
        ],
        isOptional: false,
        dept: "Loan Requirement",
        validationMsg: "Purpose Of Loan is Required",
        checked: "true",
    },
    {
        title: "First Name",
        field: "first_name",
        type: "string",
        isOptional: false,
        dept: "Applicant Details",
        validationMsg: "First Name is Required",
        checked: "true"
    },
    {
        title: "Middle Name (Optional)",
        field: "middle_name",
        type: "string",
        isOptional: true,
        dept: "Applicant Details",
        validationMsg: "field is Required",
        checked: "false"
    },
    {
        title: "Last Name",
        field: "last_name",
        type: "string",
        isOptional: false,
        dept: "Applicant Details",
        validationMsg: "Last Name is Required",
        checked: "true"
    },
    {
        title: "Date Of Birth",
        field: "date_of_birth",
        type: "date",
        isOptional: false,
        dept: "Applicant Details",
        validationMsg: "Date Of Birth is Required",
        checked: "true"
    },
    {
        title: "Age",
        field: "age",
        type: "number",
        isOptional: false,
        dept: "Applicant Details",
        validationMsg: "Age is Required",
        checked: "false"
    },
    {
        title: "Gender",
        field: "gender",
        type: "string",
        isDrawdown: true,
        options: [
            { value: "Female", label: "Female" },
            { value: "Male", label: "Male" }
        ],
        isOptional: false,
        dept: "Applicant Details",
        validationMsg: "Gender is Required",
        checked: "true"
    },
    {
        title: "Mobile No.",
        field: "mobile_number",
        type: "mobile",
        isOptional: false,
        dept: "Applicant Details",
        validationMsg: "Mobile Number is Required",
        checked: "true"
    },
    {
        title: "Email ",
        field: "email",
        type: "email",
        isOptional: false,
        dept: "Applicant Details",
        validationMsg: "Please enter a valid email",
        checked: "true"
    },
    {
        title: "Father Full Name",
        field: "father_full_name",
        type: "string",
        isOptional: false,
        dept: "Applicant Details",
        validationMsg: "Father Full Name is Required",
        checked: "true"
    },
    {
        title: "Address Line 1",
        field: "curr_addr_ln1",
        type: "string",
        isOptional: false,
        dept: "Current Address",
        validationMsg: "Address Line 1 is required",
        checked: "true"
    },
    {
        title: "Address Line 2 (Optional)",
        field: "curr_addr_ln2",
        type: "string",
        isOptional: true,
        dept: "Current Address",
        validationMsg: "field is Required",
        checked: "false"
    },
    {
        title: "State",
        field: "curr_addr_state",
        type: "string",
        isDrawdown: true,
        isOptional: false,
        dept: "Current Address",
        validationMsg: "State is Required",
        checked: "true"
    },
    {
        title: "City",
        field: "curr_addr_city",
        type: "string",
        isDrawdown: true,
        isOptional: false,
        dept: "Current Address",
        validationMsg: "City is Required",
        checked: "true"
    },
    {
        title: "Pincode",
        field: "curr_addr_pincode",
        type: "pincode",
        isOptional: false,
        dept: "Current Address",
        validationMsg: "Please enter a valid Pincode",
        checked: "true"
    },
    {
        title: "Address Line 1",
        field: "per_addr_ln1",
        type: "string",
        isOptional: false,
        dept: "Permanent Address",
        validationMsg: "Address Line 1 is required",
        checked: "true"
    },
    {
        title: "Address Line 2 (Optional)",
        field: "per_addr_ln2",
        type: "string",
        isOptional: true,
        dept: "Permanent Address",
        validationMsg: "field is Required",
        checked: "false"
    },
    {
        title: "State",
        field: "per_addr_state",
        type: "string",
        isDrawdown: true,
        isOptional: false,
        dept: "Permanent Address",
        validationMsg: "State is Required",
        checked: "true"
    },
    {
        title: "City",
        field: "per_addr_city",
        type: "string",
        isDrawdown: true,
        isOptional: false,
        dept: "Permanent Address",
        validationMsg: "City is Required",
        checked: "true"
    },
    {
        title: "Pincode",
        field: "per_addr_pincode",
        type: "pincode",
        isOptional: false,
        dept: "Permanent Address",
        validationMsg: "Please enter a valid Pincode",
        checked: "true"
    },
    {
        title: "PAN",
        field: "pan_value",
        type: "pan",
        isOptional: false,
        dept: "Applicant KYC 1",
        validationMsg: "Pan is Required",
        checked: "true"
    },
    {
        title: "Aadhaar Number",
        field: "aadhaar_value",
        type: "aadhaar",
        isOptional: false,
        dept: "Applicant KYC 1",
        validationMsg: "Aadhaar Number is Required",
        checked: "true"
    },
    {
        title: "Applicant Selfie",
        field: "applicant_image_value",
        type: "string",
        isOptional: false,
        dept: "Applicant Selfie",
        box_type: "upload",
        validationMsg: "Applicant Selfie is Required",
        checked: "true"
    },
    {
        title: "PAN",
        field: "pan_image_value",
        type: "string",
        isOptional: false,
        dept: "KYC Document PAN",
        box_type: "upload",
        validationMsg: "PAN image is Required",
        checked: "true"
    },
    {
        title: "Aadhaar Front",
        field: "aadhaar_front_image_value",
        type: "string",
        isOptional: true,
        dept: "KYC Document Aadhaar",
        box_type: "upload",
        validationMsg: "Aadhaar Front image is Required",
        checked: "true"
    },
    {
        title: "Aadhaar Back (Optional)",
        field: "aadhaar_back_image_value",
        type: "string",
        isOptional: true,
        dept: "KYC Document Aadhaar",
        box_type: "upload",
        validationMsg: "field is Required",
        checked: "true"
    },
    {
        title: "Aadhaar",
        field: "aadhaar_xml_image_value",
        type: "string",
        isOptional: true,
        dept: "KYC Document XML Aadhaar",
        box_type: "upload",
        validationMsg: "Aadhaar XML is Required",
        checked: "true"
    },
    {
        title: "Select Entity Type",
        field: "select_entity_type",
        type: "string",
        isOptional: false,
        dept: "Entity Details 1",
        validationMsg: "Entity Type is Required",
        checked: "true"
    },
    {
        title: "Entity Name",
        field: "entity_name_value",
        type: "string",
        isOptional: false,
        dept: "Entity Details",
        validationMsg: "Entity Name is Required",
        checked: "true"
    },
    {
        title: "Date Of Incorporation",
        field: "doi_value",
        type: "date",
        isOptional: false,
        dept: "Entity Details",
        validationMsg: "Date of Incorporation is Required",
        checked: "true"
    },
    {
        title: "Upload Certificate",
        field: "udhyam_certificalte_value",
        type: "string",
        isOptional: false,
        dept: "Shop Establishment Certificate",
        box_type: "upload",
        validationMsg: "Upload Certificate is Required",
        checked: "true"
    },
    // {
    //     title: "GSTIN Certificate",
    //     field: "gst_certificate_value",
    //     type: "string",
    //     isOptional: true,
    //     box_type: "upload",
    //     dept: "GSTIN",
    //     checked: "true"
    // },
    {
        title: "GSTIN",
        field: "gstin_value",
        type: "string",
        isOptional: false,
        box_type: "verify",
        dept: "GSTIN",
        checked: "true"
    },
    {
        title: "Address Line 1",
        field: "comm_addr_ln1",
        type: "string",
        isOptional: false,
        dept: "Communication Address",
        validationMsg: "Address Line 1 is required",
        checked: "true"
    },
    {
        title: "Address Line 2 (Optional)",
        field: "comm_addr_ln2",
        type: "string",
        isOptional: true,
        dept: "Communication Address",
        validationMsg: "field is Required",
        checked: "false"
    },
    {
        title: "State",
        field: "comm_addr_state",
        type: "string",
        isDrawdown: true,
        isOptional: false,
        dept: "Communication Address",
        validationMsg: "State is Required",
        checked: "true"
    },
    {
        title: "City",
        field: "comm_addr_city",
        type: "string",
        isDrawdown: true,
        isOptional: false,
        dept: "Communication Address",
        validationMsg: "City is Required",
        checked: "true"
    },
    {
        title: "Pincode",
        field: "comm_addr_pincode",
        type: "pincode",
        isOptional: false,
        dept: "Communication Address",
        validationMsg: "Please enter a valid Pincode",
        checked: "true"
    },
    {
        title: "Address Line 1",
        field: "reg_addr_ln1",
        type: "string",
        isOptional: false,
        dept: "Registered Address",
        validationMsg: "Address Line 1 is required",
        checked: "true"
    },
    {
        title: "Address Line 2 (Optional)",
        field: "reg_addr_ln2",
        type: "string",
        isOptional: true,
        dept: "Registered Address",
        validationMsg: "field is Required",
        checked: "false"
    },
    {
        title: "State",
        field: "reg_addr_state",
        type: "string",
        isDrawdown: true,
        isOptional: false,
        dept: "Registered Address",
        validationMsg: "State is Required",
        checked: "true"
    },
    {
        title: "City",
        field: "reg_addr_city",
        type: "string",
        isDrawdown: true,
        isOptional: false,
        dept: "Registered Address",
        validationMsg: "City is Required",
        checked: "true"
    },
    {
        title: "Pincode",
        field: "reg_addr_pincode",
        type: "pincode",
        isOptional: false,
        dept: "Registered Address",
        validationMsg: "Please enter a valid Pincode",
        checked: "true"
    },
    {
        title: "PAN",
        field: "entity_kyc_pvtLtd_pan",
        type: "pan",
        isOptional: false,
        box_type: "verify",
        dept: "Entity-KYC pvtLtd",
        validationMsg: "PAN is  Required",
        checked: "true"
    },
    {
        title: "CIN/LLPIN",
        field: "entity_kyc_pvtLtd_cin_llpin",
        type: "string",
        isOptional: false,
        box_type: "verify",
        dept: "Entity-KYC pvtLtd",
        validationMsg: "CIN/LLPIN is Required",
        checked: "true"
    },
    {
        title: "URC NO.",
        field: "entity_kyc_pvtLtd_urc",
        type: "string",
        isOptional: false,
        box_type: "verify",
        dept: "Entity-KYC pvtLtd URC",
        validationMsg: "URC NO. is Required",
        checked: "true"
    },
    {
        title: "PAN",
        field: "entity_kyc_partnerShip_pan",
        type: "pan",
        isOptional: false,
        box_type: "verify",
        dept: "Entity-KYC partnership verify",
        validationMsg: "PAN is Required",
        checked: "true"
    },
    // {
    //     title: "URC NO.",
    //     field: "entity_kyc_partnerShip_urc",
    //     type: "string",
    //     isOptional: false,
    //     box_type: "verify",
    //     dept: "Entity-KYC partnership verify",
    //     validationMsg: "field is Required",
    //     checked: "true"
    // },
    {
        title: "MOA",
        field: "entity_kyc_partnerShip_moa",
        type: "string",
        isOptional: false,
        box_type: "upload",
        dept: "Entity-KYC partnership upload",
        validationMsg: "MOA is Required",
        checked: "true"
    },
    {
        title: "AOA",
        field: "entity_kyc_partnerShip_aoa",
        type: "string",
        isOptional: false,
        box_type: "upload",
        dept: "Entity-KYC partnership upload",
        validationMsg: "AOA is Required",
        checked: "true"
    },
    {
        title: "By-laws",
        field: "entity_kyc_partnerShip_by_laws",
        type: "string",
        isOptional: false,
        box_type: "upload",
        dept: "Entity-KYC partnership upload",
        validationMsg: "By-laws is Required",
        checked: "true"
    },
    {
        title: "Latest list of members",
        field: "entity_kyc_partnerShip_llom",
        type: "string",
        isOptional: false,
        box_type: "upload",
        dept: "Entity-KYC partnership upload",
        validationMsg: "Latest list of members is Required",
        checked: "true"
    },
    {
        title: "Registration Certificate",
        field: "entity_kyc_partnerShip_rc",
        type: "string",
        isOptional: false,
        box_type: "upload",
        dept: "Entity-KYC partnership upload",
        validationMsg: "Registration Certificate is Required",
        checked: "true"
    },
    {
        title: "Authority Letter",
        field: "entity_kyc_partnerShip_al",
        type: "string",
        isOptional: false,
        box_type: "upload",
        dept: "Entity-KYC partnership upload",
        validationMsg: "Authority Letter is Required",
        checked: "true"
    },
    {
        title: "Authority Letter",
        field: "entity_kyc_partnerShip_als",
        type: "string",
        isOptional: false,
        box_type: "upload",
        dept: "Entity-KYC Authority Letter upload",
        validationMsg: "Authority Letter is Required",
        checked: "true"
    },
    {
        title: "URC NO.",
        field: "entity_kyc_proprietor_urc",
        type: "string",
        isOptional: false,
        box_type: "verify",
        dept: "Entity-KYC proprietor verify",
        validationMsg: "URN NO. is Required",
        checked: "true"
    },

]