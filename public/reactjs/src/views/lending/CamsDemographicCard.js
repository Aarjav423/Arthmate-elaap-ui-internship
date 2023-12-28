import * as React from "react";
import { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

export default function CamsDemographicCard(props) {
  const {
    key,
    isLoaded,
    isCamsDetailsAvailable,
    payloadData,
    change,
    errors,
    editable,
    title,
    fields,
    expanded,
    handleChange
  } = props;

  return (
    <Grid item xs={12} key={key}>
      <Accordion
        expanded={expanded}
        onChange={() => {
          handleChange(key);
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="pane{index}bh-content"
          id="panel{index}bh-header"
        >
          <Typography
            variant="h6"
            component="h2"
            style={{ fontSize: "18px" }}
          >{`${title || "NA"}`}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid xs={12} container>
            {isLoaded
              ? fields.map((field, index) => {
                  return (
                    <>
                      <Grid key={index} xs={4} md={4} item>
                        <FormControl
                          key={index}
                          sx={{ m: 1, width: "100%" }}
                          variant="standard"
                        >
                          <Typography>
                            {`${field.title}`}{" "}
                            <span style={{ color: "red" }}></span>
                          </Typography>
                          {isCamsDetailsAvailable ? (
                            <TextField
                              key={index}
                              variant="standard"
                              value={payloadData[field.name]}
                              error={errors?.includes(field.name)}
                              onChange={event => change(event, field)}
                              InputProps={{
                                readOnly: !editable
                              }}
                            />
                          ) : (
                            <TextField
                              key={index}
                              variant="standard"
                              value={payloadData[field.name]}
                              name={field.name}
                              error={errors?.includes(field.name)}
                              onChange={event => change(event, field)}
                              InputProps={{
                                readOnly: !editable
                              }}
                            />
                          )}
                        </FormControl>
                      </Grid>
                    </>
                  );
                })
              : null}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
