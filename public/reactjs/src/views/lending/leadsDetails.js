import * as React from "react";
import LeadDemographics from "./leadDemographics";
import {Grid} from "@mui/material";

const leadsDetails = () => {
  return (
    <div>
      <Grid item xs={12}>
        <LeadDemographics title="Lead Details" />
      </Grid>
    </div>
  );
};

export default leadsDetails;
