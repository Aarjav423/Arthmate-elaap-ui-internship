export const getDrawdownRequestUIFields=(product)=>{
  const drawDownRequestUiFields = [
    {
      placeholder: "loan id",
      field: "loan_id",
      type: "string",
      component: "span",
      condition: "",
      errorMsg: "Enter valid loan id.",
      value: 1,
      disableDefault: true,
      checked: "true"
    },
    {
      placeholder: "drawdown amount",
      field: "drawdown_amount",
      type: "float",
      component: "span",
      condition: "",
      errorMsg: "Enter valid drawdown amount.",
      value: 1,
      disableDefault: false,
      checked: "true"
    },
    {
      placeholder: "Withheld Percentage",
      field: "withheld_percentage",
      type: "float",
      component: "span",
      condition: "",
      errorMsg: "Enter valid withheld percentage",
      value: 1,
      disableDefault: false,
      checked: product.cash_collateral?"true":"false"
    },
    {
      placeholder: "Withheld Amount",
      field: "withheld_amount",
      type: "any",
      component: "span",
      condition: "",
      errorMsg: "",
      value: 1,
      disableDefault: true,
      checked: "false"
      },
    {
      placeholder: "no of emi (optional)",
      field: "no_of_emi",
      type: "number",
      component: "span",
      condition: "",
      errorMsg: "Enter valid no of emi",
      value: 1,
      disableDefault: false,
      checked: "false"
    },
    {
      placeholder: "repayment days (optional)",
      field: "repayment_days",
      type: "number",
      component: "span",
      condition: "",
      errorMsg: "Enter valid repayment days",
      value: 1,
      disableDefault: false,
      checked: "false"
    },
    {
      placeholder: "processing fees including gst (optional)",
      field: "processing_fees_including_gst",
      type: "number",
      component: "span",
      condition: "",
      errorMsg: "Enter valid processing_fees_including_gst",
      value: 1,
      disableDefault: true,
      checked: "false"
    },
    {
      placeholder: "usage fee including gst",
      field: "usage_fees_including_gst",
      type: "float",
      component: "span",
      condition: "",
      errorMsg: "Enter valid usage fees including gst",
      value: 1,
      disableDefault: false,
      checked: "true"
    },
    {
      placeholder: "net drawdown amount",
      field: "net_drawdown_amount",
      type: "float",
      component: "span",
      condition: "",
      errorMsg: "Enter valid net drawdown amount",
      value: 1,
      disableDefault: true,
      checked: ""
    }
  ];
  return drawDownRequestUiFields;
}




