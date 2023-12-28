export const lead_data = [
  {
    date: "2022-12-01",
    total_leads: 0,
  },
  {
    date: "2022-12-02",
    total_leads: 52,
  },
  {
    date: "2022-12-03",
    total_leads: 0,
  },
  {
    date: "2022-12-04",
    total_leads: 0,
  },
  {
    date: "2022-12-05",
    total_leads: 32,
  },
  {
    date: "2022-12-06",
    total_leads: 19,
  },
  {
    date: "2022-12-07",
    total_leads: 10,
  },
  {
    date: "2022-12-08",
    total_leads: 0,
  },
  {
    date: "2022-12-09",
    total_leads: 12,
  },
  {
    date: "2022-12-10",
    total_leads: 0,
  },
  {
    date: "2022-12-11",
    total_leads: 0,
  },
  {
    date: "2022-12-12",
    total_leads: 0,
  },
  {
    date: "2022-12-13",
    total_leads: 0,
  },
  {
    date: "2022-12-14",
    total_leads: 0,
  },
  {
    date: "2022-12-15",
    total_leads: 0,
  },
];

export const loan_data = [
  {
    date: "2022-12-01",
    total_loans: 0,
  },
  {
    date: "2022-12-02",
    total_loans: 0,
  },
  {
    date: "2022-12-03",
    total_loans: 0,
  },
  {
    date: "2022-12-04",
    total_loans: 0,
  },
  {
    date: "2022-12-05",
    total_loans: 25,
  },
  {
    date: "2022-12-06",
    total_loans: 0,
  },
  {
    date: "2022-12-07",
    total_loans: 87,
  },
  {
    date: "2022-12-08",
    total_loans: 18,
  },
  {
    date: "2022-12-09",
    total_loans: 13,
  },
  {
    date: "2022-12-10",
    total_loans: 0,
  },
  {
    date: "2022-12-11",
    total_loans: 45,
  },
  {
    date: "2022-12-12",
    total_loans: 0,
  },
  {
    date: "2022-12-13",
    total_loans: 32,
  },
  {
    date: "2022-12-14",
    total_loans: 0,
  },
  {
    date: "2022-12-15",
    total_loans: 2,
  },
];

export const daily_disbursed_loans_data = [
  {
    date: "2022-12-16",
    disbursed_loan_count: 7,
    net_disbursement_value: "2800",
  },
  {
    date: "2022-12-15",
    disbursed_loan_count: 40,
    net_disbursement_value: "16000",
  },
  {
    date: "2022-12-14",
    disbursed_loan_count: 2,
    net_disbursement_value: "800",
  },
  {
    date: "2022-12-13",
    disbursed_loan_count: 8,
    net_disbursement_value: "2700",
  },
];

export const dpd_data = [
  {
    dpd_range: "0-30",
    principal_outstanding: 143360.54,
    interest_outstanding: 2935.11,
    principal_due: 32772.14,
    interest_due: 750.01,
    count: 1,
  },
  {
    dpd_range: "31-60",
    principal_outstanding: 175062.07,
    interest_outstanding: 4061.33,
    principal_due: 85920.47,
    interest_due: 2714.49,
    count: 0,
  },
  {
    dpd_range: "61-90",
    principal_outstanding: 17666.67,
    interest_outstanding: 251.33,
    principal_due: 12604.26,
    interest_due: 209.54,
    count: 1,
  },
  {
    dpd_range: "90+",
    principal_outstanding: 143360.54,
    interest_outstanding: 2935.11,
    principal_due: 32772.14,
    interest_due: 750.01,
    count: 1,
  },
];

export const service_data = [
  {
    month: "2022-09",
    services: [
      {
        api: "BUREAU-SCORECARD",
        count: 30,
      },
      {
        api: "BUREAU-SCORECARD-CACHE",
        count: 18,
      },
      {
        api: "GST-ONLY",
        count: 10,
      },
      {
        api: "AADHAAR-XML-FILE",
        count: 1,
      },
      {
        api: "CKYC-DOWNLOAD-XML",
        count: 12,
      },
      {
        api: "CKYC-DOWNLOAD-V2",
        count: 11,
      },
      {
        api: "GST-AND-ITR",
        count: 11,
      },
      {
        api: "OCR-KYC",
        count: 12,
      },
      {
        api: "MCA-DOCS-REQUEST-DETAILS",
        count: 4,
      },
      {
        api: "PAN-ADV-KYC-HOOK",
        count: 2,
      },
      {
        api: "EXPERIAN-AR",
        count: 2,
      },
      {
        api: "DL-KYC",
        count: 11,
      },
      {
        api: "KYC-OCR",
        count: 14,
      },
      {
        api: "CRIF",
        count: 137,
      },
      {
        api: "kscan",
        count: 4,
      },
      {
        api: "CIBIL-VERIFY",
        count: 34,
      },
      {
        api: "PAN-ADV-KYC",
        count: 8,
      },
      {
        api: "BANK-ACC-NUM-KYC",
        count: 2,
      },
      {
        api: "EXPERIAN-CIRV2",
        count: 150,
      },
      {
        api: "ITR-ONLY",
        count: 18,
      },
      {
        api: "VOTERID-KYC",
        count: 2,
      },
      {
        api: "CKYC-DOWNLOAD",
        count: 6,
      },
    ],
  },
  {
    month: "2022-10",
    services: [
      {
        api: "EXPERIAN-CIRV2",
        count: 22,
      },
      {
        api: "BUREAU-SCORECARD",
        count: 16,
      },
      {
        api: "CKYC-SEARCH",
        count: 13,
      },
      {
        api: "AADHAAR-XML-OTP",
        count: 5,
      },
      {
        api: "BRE-VALIDATE",
        count: 25,
      },
      {
        api: "KZ-ADDRESS",
        count: 15,
      },
      {
        api: "MCA-DOCS-REQUEST-DETAILS",
        count: 17,
      },
      {
        api: "PAN-KYC",
        count: 13,
      },
      {
        api: "KSCAN",
        count: 14,
      },
      {
        api: "GST-PARSING",
        count: 13,
      },
      {
        api: "kscan",
        count: 14,
      },
      {
        api: "VEHICLE-RC-VERIFY",
        count: 21,
      },
      {
        api: "CKYC-DOWNLOAD-V2",
        count: 12,
      },
      {
        api: "GST-ONLY",
        count: 11,
      },
      {
        api: "AADHAAR-XML-FILE",
        count: 3,
      },
      {
        api: "BANK-ACC-NUM-KYC",
        count: 15,
      },
      {
        api: "CKYC-DOWNLOAD-XML",
        count: 27,
      },
      {
        api: "PAN-ADV-KYC",
        count: 4,
      },
      {
        api: "kz-address",
        count: 22,
      },
      {
        api: "ITR-ONLY",
        count: 6,
      },
      {
        api: "CRIF",
        count: 13,
      },
      {
        api: "PAN-ADV-KYC-HOOK",
        count: 2,
      },
      {
        api: "GST-AND-ITR",
        count: 5,
      },
      {
        api: "EXPERIAN-AR",
        count: 1,
      },
      {
        api: "KZ-NAME",
        count: 28,
      },
      {
        api: "GST-VERIFY",
        count: 8,
      },
      {
        api: "KYC-OCR",
        count: 8,
      },
      {
        api: "CIBIL-VERIFY",
        count: 2,
      },
      {
        api: "CKYC-DOWNLOAD-JSON",
        count: 17,
      },
    ],
  },
  {
    month: "2022-11",
    services: [
      {
        api: "cf-subscriptions-activate",
        count: 8,
      },
      {
        api: "cf-subscriptions/:subReferenceId/payments/:paymentId",
        count: 7,
      },
      {
        api: "CRIF-SOFT-PULL-STAGE3-SAM0008",
        count: 3,
      },
      {
        api: "CRIF-SOFT-PULL/557/STAGE2",
        count: 5,
      },
      {
        api: "CF-SUBSCRIPTION",
        count: 5,
      },
      {
        api: "DL-KYC",
        count: 1,
      },
      {
        api: "GST-PARSING",
        count: 15,
      },
      {
        api: "cf-subscriptions-cancel",
        count: 2,
      },
      {
        api: "CF-GET-SINGLE-SUBSCRIPTION",
        count: 14,
      },
      {
        api: "CRIF-SOFT-PULL-STAGE3",
        count: 58,
      },
      {
        api: "CRIF-SOFT-PULL/557}/STAGE2",
        count: 1,
      },
      {
        api: "GST-VERIFY",
        count: 2,
      },
      {
        api: '"CRIF-SOFT-PULL3/"+SAM0008',
        count: 1,
      },
      {
        api: "CF-GET-ALL-SUBSCRIPTIONS",
        count: 15,
      },
      {
        api: "CF-CHARGE-SUBSCRIPTION",
        count: 4,
      },
      {
        api: "CRIF-SOFT-PULL",
        count: 52,
      },
      {
        api: "CKYC-DOWNLOAD-JSON",
        count: 1,
      },
      {
        api: "CRIF-SOFT-PULL3/+SAM0008",
        count: 1,
      },
      {
        api: "BANK-ACC-NUM-KYC",
        count: 7,
      },
      {
        api: "AADHAAR-XML-OTP",
        count: 8,
      },
      {
        api: "cf-subscriptions",
        count: 10,
      },
      {
        api: "BUREAU-SCORECARD",
        count: 21,
      },
      {
        api: "CRIF-SOFT-PULL/557/STAGE1",
        count: 4,
      },
      {
        api: "CF-CANCEL-SUBSCRIPTION",
        count: 3,
      },
      {
        api: "CKYC-SEARCH",
        count: 4,
      },
      {
        api: "A-SCORE",
        count: 17,
      },
      {
        api: "CF-SUBSCRIPTION-PLANS",
        count: 5,
      },
      {
        api: "cf-subscriptions-charge",
        count: 4,
      },
      {
        api: "CRIF-SOFT-PULL1/+SAM0008",
        count: 1,
      },
      {
        api: "CF-GET-SUBSCRIPTIONS",
        count: 16,
      },
      {
        api: "KZ-NAME",
        count: 1,
      },
      {
        api: "CIBIL-CACHE",
        count: 52,
      },
      {
        api: "CRIF-SOFT-PULL/557/STAGE3",
        count: 5,
      },
      {
        api: "CRIF-SOFT-PULL-STAGE1",
        count: 58,
      },
      {
        api: "CRIF-SOFT-PULL/557}/STAGE1",
        count: 1,
      },
      {
        api: "cf-subscription-plans",
        count: 15,
      },
      {
        api: "CF-ACTIVATE-SUBSCRIPTION",
        count: 3,
      },
      {
        api: "CRIF-SOFT-PULL-STAGE2-SAM0008",
        count: 6,
      },
      {
        api: "MCA-DOCS-REQUEST-DETAILS",
        count: 6,
      },
      {
        api: "cf-subscriptions/:subReferenceId/payments",
        count: 9,
      },
      {
        api: "CIBIL-VERIFY",
        count: 37,
      },
      {
        api: "BUREAU-SCORECARD-V2",
        count: 12,
      },
      {
        api: '"CRIF-SOFT-PULL2/"+SAM0008',
        count: 1,
      },
      {
        api: "CRIF-SOFT-PULL2/+SAM0008",
        count: 2,
      },
      {
        api: "CRIF",
        count: 5,
      },
      {
        api: "VEHICLE-RC-VERIFY",
        count: 6,
      },
      {
        api: "PAN-KYC",
        count: 1,
      },
      {
        api: "cf-subscriptions/:subReferenceId",
        count: 26,
      },
      {
        api: "KSCAN",
        count: 31,
      },
      {
        api: "CRIF-SOFT-PULL-STAGE1-SAM0008",
        count: 2,
      },
      {
        api: "CRIF-SOFT-PULL-STAGE2",
        count: 74,
      },
      {
        api: "cf-subscriptions/:subReferenceId/charge/:chargeId/cancel",
        count: 1,
      },
      {
        api: "CRIF-SOFT-PULL3-+SAM0008",
        count: 1,
      },
      {
        api: "KYC-OCR",
        count: 4,
      },
      {
        api: "BUREAU-SCORECARD-CACHE",
        count: 3,
      },
    ],
  },
  {
    month: "2022-12",
    services: [
      {
        api: "VEHICLE-RC-VERIFY",
        count: 4,
      },
      {
        api: "cf-subscriptions",
        count: 3,
      },
      {
        api: "CKYC-DOWNLOAD-JSON",
        count: 1,
      },
      {
        api: "GST-PDF-PARSING-DOWNLOAD",
        count: 22,
      },
      {
        api: "AADHAAR-XML-FILE-V2",
        count: 1,
      },
      {
        api: "CKYC-SEARCH",
        count: 1,
      },
      {
        api: "PAN-KYC",
        count: 5,
      },
      {
        api: "GST-VERIFY",
        count: 4,
      },
      {
        api: "AADHAAR-XML-OTP",
        count: 14,
      },
      {
        api: "cf-subscriptions/:subReferenceId",
        count: 5,
      },
      {
        api: "A-SCORE",
        count: 5,
      },
      {
        api: "BUREAU-SCORECARD-V2",
        count: 45,
      },
      {
        api: "KYC-OCR",
        count: 2,
      },
      {
        api: "CRIF",
        count: 10,
      },
      {
        api: "CRIF-SOFT-PULL",
        count: 4,
      },
      {
        api: "GST-PARSING",
        count: 29,
      },
      {
        api: "AADHAAR-XML-FILE",
        count: 5,
      },
      {
        api: "cf-subscription-plans",
        count: 3,
      },
      {
        api: "CRIF-SOFT-PULL-STAGE1",
        count: 3,
      },
    ],
  },
];

export const companiesList = [
  {
    _id: 1,
    name: "Company 1",
    status: "1",
    business_phone: "8937827342",
    code: "ASEdzr",
  },
  {
    _id: 2,
    name: "Company 2",
    status: "1",
    business_phone: "8937827213",
    code: "ASEds3",
  },
  {
    _id: 3,
    name: "Company 3",
    status: "1",
    business_phone: "8937827341",
    code: "ASEd827",
  },
  {
    _id: 4,
    name: "Company 4",
    status: "1",
    business_phone: "8937827321",
    code: "ASEdss",
  },
  {
    _id: 5,
    name: "Company 5",
    status: "1",
    business_phone: "8937827334",
    code: "ASEdssa",
  },
  {
    _id: 6,
    name: "Company 6",
    status: "1",
    business_phone: "8937827332",
    code: "ASEds3",
  },
];

export const productsList = [
  {
    _id: 1,
    name: "Product 1",
    status: "1",
    business_phone: "8937827342",
    code: "ASEdzr",
  },
  {
    _id: 2,
    name: "Product 2",
    status: "1",
    business_phone: "8937827213",
    code: "ASEds3",
  },
  {
    _id: 3,
    name: "Product 3",
    status: "1",
    business_phone: "8937827341",
    code: "ASEd827",
  },
  {
    _id: 4,
    name: "Product 4",
    status: "1",
    business_phone: "8937827321",
    code: "ASEdss",
  },
  {
    _id: 5,
    name: "Product 5",
    status: "1",
    business_phone: "8937827334",
    code: "ASEdssa",
  },
  {
    _id: 6,
    name: "Product 6",
    status: "1",
    business_phone: "8937827332",
    code: "ASEds3",
  }
];
