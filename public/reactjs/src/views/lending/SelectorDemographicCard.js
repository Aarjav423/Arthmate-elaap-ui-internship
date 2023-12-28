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
import { Button } from "@mui/material";
export default function SelectorDemographicCard(props) {
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
    product,
    expanded,
    handleChange,
    onButtonClick
  } = props;

  const [readonly, setReadonly] = useState(false);
  const handleCheck = check => {
    if (editable === false && isCamsDetailsAvailable === true) {
      return true;
    }
    if (editable === true && isCamsDetailsAvailable === true) {
      return check.Readonly;
    }
  };

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
          <div style={{display:"flex", width:"120%", justifyContent:"space-between"}}>
            <div>
            <Typography variant="h6" component="h2">{`${
            title || "NA"
          }`}</Typography>
            </div>
            <div>
            {title === "Loan Summary" ? 
            <Button
          style={{
            backgroundColor: "white",
            color: "#5e72e4",
          }}
          sx={{
            height: "30px", textTransform:"none"
              }}
          disabled={false}
          onClick={onButtonClick}
        >
          Statement of account
        </Button>
      : null
      }
            </div>
          </div>   
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
                          {isCamsDetailsAvailable ? (
                            <>
                              <Typography>{`${field.title}`} </Typography>
                              <TextField
                                key={index}
                                variant="standard"
                                value={payloadData[field.name]}
                                error={errors?.includes(field.name)}
                                onChange={event => change(event, field)}
                                InputProps={{
                                  readOnly: handleCheck(field)
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <Typography>{`${field.title}`} </Typography>
                              <TextField
                                key={index}
                                variant="standard"
                                name={field.name}
                                error={errors?.includes(field.name)}
                                onChange={event => change(event, field)}
                                InputProps={{
                                  readOnly: !editable
                                }}
                              />
                            </>
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
