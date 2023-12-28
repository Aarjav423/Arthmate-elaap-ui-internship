import React, { useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function CustomizeTemplates(props) {
  const { templatesdata, onIndexChange, ...other } = props;
  const [tabIndex, setTabIndex] = useState(0);
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");

  const handleSetTabValue = (e, newValue) => {
    e.preventDefault();
    setTabIndex(newValue);
    onIndexChange(e, newValue);
  };

  return (
    <Grid item xs={12}>
      <Grid item xs={12} container>
        <Grid item xs={12}>
          <AppBar color="transparent" position="static">
            <Tabs
              orientation={tabsOrientation}
              value={tabIndex}
              onChange={handleSetTabValue}
            >
              {templatesdata &&
                templatesdata.map((template, index) => {
                  return <Tab label={template} key={index} />;
                })}
            </Tabs>
          </AppBar>
        </Grid>
      </Grid>
    </Grid>
  );
}
