export const offerGenerateJson= ()=>{
    return {
        loan_amount: {
          label: "Loan Amount (₹)",
          name: "loan_amount",
          id: "loan_amount",
          placeholder: "Loan Amount",
          isRequired: false,
          defaultValue: 10,
        },
        tenure: {
          label: "Tenure (Months)",
          name: "tenure",
          id: "tenure",
          // type: "number",
          placeholder: "Tenure",
          isRequired: false,
          defaultValue: 10,
        },
        interest_rate: {
          label: "Interest Rate (%)",
          name: "interest_rate",
          id: "interest_rate",
          // type: "number",
          placeholder: "Interest Rate",
          isRequired: false,
          defaultValue: 10,
        },
      };
}