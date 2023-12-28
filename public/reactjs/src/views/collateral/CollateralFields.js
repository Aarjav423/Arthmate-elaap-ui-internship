export const collateralFields=()=>[
  {
    title: "loan id",
    name: "loan_id",
    type: "string",
    required: true
  },
  {
    title: "Engine number",
    name: "engine_number",
    type: "string",
    required: true
  },
  {
    title: "Chassis number",
    name: "chassis_number",
    type: "string",
    required: true
  },
  {
    title: "Invoice number",
    name: "invoice_number",
    type: "string",
    required: false
  },
  {
    title: "Invoice date",
    name: "invoice_date",
    type: "date",
    required: false
  },
  {
    title: "Invoice amount",
    name: "invoice_amount",
    type: "float",
    required: false
  },
  {
    title: "Insurance partner name",
    name: "insurance_partner_name",
    type: "string",
    required: false
  },
  {
    title: "Policy number",
    name: "policy_number",
    type: "string",
    required: false
  },
  {
    title: "Policy insurance date",
    name: "policy_issuance_date",
    type: "date",
    required: false
  },
  {
    title: "Policy expiry date",
    name: "policy_expiry_date",
    type: "date",
    required: false
  },
  {
    title: "Vehicle registration number",
    name: "vehicle_registration_number",
    type: "string",
    required: false
  },
  {
    title: "Vehicle number",
    name: "vehicle_brand",
    type: "string",
    required: false
  },
  {
    title: "Vehicle model",
    name: "vehicle_model",
    type: "string",
    required: false
  },
  {
    title: "Vehicle sub model",
    name: "vehicle_sub_model",
    type: "string",
    required: false
  },
  {
    title: "Vehicle type",
    name: "vehicle_type",
    type: "string",
    required: false
  },
  {
    title: "Battery Serial No.",
    name: "battery_serial_number",
    type: "string",
    required: false
  },
]
