import * as React from "react";
import LoanDemographics from "./lmsLoanDemographics";
import {Grid} from "@mui/material";

const loansDemographicsDetails = () => {
  return (
    <div>
      <Grid item xs={12}>
        <LoanDemographics title="Loan Profile Details" />
      </Grid>
    </div>
  );
};

export default loansDemographicsDetails;
