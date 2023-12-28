import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

export default function AScoreDemographicCard(props) {
  const {
    key,
    change,
    title,
    fields,
    expanded,
    handleChange,
    stateDataValidation,
    stateData
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
            {fields.map((field, index) => {
              return (
                <Grid key={field.name} xs={4} md={4} item>
                  <FormControl sx={{ m: 1, width: "100%" }} variant="standard">
                    {
                      <TextField
                        variant="standard"
                        label={field.title}
                        placeholder={field.title}
                        name={field.name}
                        onChange={event => change(event, field)}
                        InputProps={{
                          readOnly: field.disabled
                        }}
                        error={
                          stateDataValidation[`${field.name}State`] ===
                          "has-danger"
                        }
                        helperText={
                          stateDataValidation[`${field.name}State`] ===
                          "has-danger"
                            ? field.errorMsg
                            : ""
                        }
                      />
                    }
                  </FormControl>
                </Grid>
              );
            })}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
