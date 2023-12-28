import React, { useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import TabPanel from "../../components/tabPanel";

export default function CustomizeTemplates(props) {
  const { templatesdata, onDataChange, ...other } = props;
  const [tabIndex, setTabIndex] = useState(0);
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");

  const handleSetTabValue = (e, newValue) => {
    e.preventDefault();
    setTabIndex(newValue);
  };

  return (
    <Grid xs={12}>
      <Grid xs={12} container>
        <Grid item xs={12}>
          <AppBar color="transparent" position="static">
            <Tabs
              orientation={tabsOrientation}
              value={tabIndex}
              onChange={handleSetTabValue}
            >
              {templatesdata &&
                Object.keys(templatesdata).map((template, index) => {
                  return <Tab key={index} label={template} />;
                })}
            </Tabs>
          </AppBar>
          {templatesdata &&
            Object.keys(templatesdata).map((template, index) => {
              return (
                <TabPanel value={tabIndex} index={index} key={template}>
                  <Grid xs={12} container spacing={1}>
                    {templatesdata &&
                      templatesdata[template].map((field, id) => {
                        return (
                          <Grid
                            xs={3}
                            item
                            key={id}
                            sx={{
                              border: "1px solid #ccc",
                              borderCollapse: "collapse",
                              padding: "5px",
                            }}
                          >
                            <FormGroup variant="outlined">
                              <Typography
                                variant="caption"
                                display="block"
                                sx={{
                                  color: "green",
                                  fontWeight: "bold",
                                }}
                              >
                                {field.title}
                              </Typography>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    defaultChecked={
                                      field.checked.toLowerCase() === "true"
                                        ? true
                                        : false
                                    }
                                    onChange={e => {
                                      field.checked =
                                        e.target.checked === true
                                          ? "TRUE"
                                          : "FALSE";
                                      onDataChange(templatesdata);
                                    }}
                                    disabled={
                                      field.isOptional.toLowerCase() === "false"
                                        ? true
                                        : false
                                    }
                                  />
                                }
                                label={
                                  <Typography variant="caption">
                                    {field.field}
                                  </Typography>
                                }
                              />

                              <FormControlLabel
                                control={
                                  <Checkbox
                                    defaultChecked={
                                      field?.displayOnUI && field.displayOnUI.toLowerCase() === "true"
                                        ? true
                                        : false
                                    }
                                    onChange={e => {
                                      field.displayOnUI =
                                        e.target.checked === true
                                          ? "TRUE"
                                          : "FALSE";
                                      onDataChange(templatesdata);
                                    }}
                                    disabled={
                                      field.checked.toLowerCase() === "true" ? true : false
                                    }
                                  />
                                }
                                label={
                                  <Typography variant="caption">
                                    Display on UI
                                  </Typography>
                                }
                              />
                              <Typography
                                variant="caption"
                                display="block"
                                sx={{
                                  color: "blue",
                                  fontWeight: "bold",
                                }}
                              >
                                {field.type}
                              </Typography>
                              <Typography variant="caption">
                                {field.dept}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "red",
                                }}
                              >
                                {field.validationmsg}
                              </Typography>
                            </FormGroup>
                          </Grid>
                        );
                      })}
                  </Grid>
                </TabPanel>
              );
            })}
        </Grid>
      </Grid>
    </Grid>
  );
}
