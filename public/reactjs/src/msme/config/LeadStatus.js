export const LeadStatus = {
  new: { label: "New", value: "new" },
  in_review: { label: "In Review", value: "in_review" },
  in_progress: { label: "In Progress", value: "in_progress" },
  active: { label: "Active", value: "active" },
  pending: { label: "Pending", value: "pending" },
  approved: { label: "Approved", value: "approved" },
  rejected: { label: "Rejected", value: "rejected" },
  draft: { label: "Draft", value: "draft" },
  lead_deviation: { label: "Lead Deviation", value: "lead_deviation" },
  offer_generated: { label: "Offer Generated", value: "offer_generated" },
  offer_accepted: { label: "Offer Accepted", value:"offer_accepted"},
  loan_created: {label: "Loan Created", value:"loan_created"},
  accepted:{ label: "Accepted", value: "Accepted"},
  offer_in_progress :{label: "Offer In Progress", value: "offer_in_progress"},
  follow_up_doc: {label: "Follow Up Doc", value: "follow_up_doc"},
  follow_up_kyc: {label:'Follow Up KYC',value:"follow_up_kyc"},
  offer_deviation:{label:"Offer Deviation",value:"offer_deviation"}
};

export const LeadMapping= {
  100:"primary",
  200: "entity",
  300: "co-applicant_details_1",
  301: "co-applicant_details_2",
  302: "co-applicant_details_3",
  303: "co-applicant_details_4",
  304: "co-applicant_details_5",
  400: "guarantor_details_1",
  401: "guarantor_details_2",
  500: "financial_doc",
  600: "additional_doc",
  700: "share_holding"
}

export const LeadNewStatus= {
  Approved: 'approved',
  Rejected: 'rejected',
  New: 'new',
  Pending: 'pending',
  InReview: 'in_review',
  InProgress: 'in_progress',
  Active: 'active',
  Draft: 'draft',
  Deviation: 'deviation',
  LeadDeviation: 'lead_deviation',
  OfferGenerated: 'offer_generated',
  Accepted: 'offer_accepted',
  LoanCreated: 'loan_created',
  FollowUpDoc: 'follow_up_doc',
  FollowUpKyc: 'follow_up_kyc',
}
