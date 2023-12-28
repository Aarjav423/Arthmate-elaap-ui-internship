import React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from '@mui/material/Box';
import CardContent from "@mui/material/CardContent";
import Grid from '@mui/material/Grid';
import CreateRole from "./role";
import CreateDepartment from "./department";
import CreateDesignation from "./designation";

function RoleMetrix() {
  const [value, setValue] = useState("Role");
  const [showRole, setShowRole] = useState(true);
  const [showDepartment, setShowDepartment] = useState(false);
  const [showDesignation, setShowDesignation] = useState(false);

  const handleChange = (event, newValue) => {
    if (newValue == "Role") {
      setValue("Role");
      setShowRole(true);
      setShowDepartment(false);
      setShowDesignation(false);
    } else if (newValue == "Department") {
      setValue("Department");
      setShowDepartment(true);
      setShowRole(false);
      setShowDesignation(false);
    } else if(newValue == "Designation") {
      setValue("Designation");
      setShowDesignation(true);
      setShowDepartment(false);
      setShowRole(false);
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <CardContent>
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              sx={{
                textColor: "#11ceef",
                indicatorColor: "#11ceef",
              }}
              aria-label="secondary tabs example"
            >
              <Tab value="Role" label="Role" />
              <Tab value="Department" label="Department" />
              <Tab value="Designation" label="Designation" />
            </Tabs>
          </Box>

          <Grid item xs={12}>
            {showRole ? (
              <CreateRole />
            ) : showDepartment ? (
              <CreateDepartment />
            ) : showDesignation ? (
              <CreateDesignation />
            ) : null}
          </Grid>
        </CardContent>
      </Grid>
    </>
  );
}

export default RoleMetrix;
