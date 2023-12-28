import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

export default function lmsDemographicsCards(props) {
  const {panelId, title, data, loanData,expanded,handleChange, ...other} = props;
  return (
    <Grid item xs={12} key={panelId}>
      <Accordion
        expanded={expanded}
        onChange={() => {
          handleChange(panelId);
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="pane{index}bh-content"
          id="panel{index}bh-header"
        >
          <Typography variant="h6" component="h2" style={{fontSize:"18px"}}>{`${title ||
            "NA"}`}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid xs={12} container>
            {data.fields &&
              data.fields.map((item, index) => {
                return (
                  <Grid key={index} xs={12} md={3} item>
                    <Typography
                      sx={{mb: 1.5, ml: 2}}
                      variant="body2"
                      key={index}
                      item
                    >
                      {
                        <span style={{color: "#6E6E6E" ,fontSize:"12px"}}>
                          {item[0].toUpperCase() +
                            item.replace(/_/g, " ").slice(1)}
                        </span>
                      }
                       {<div style={{marginTop:"2px"}}>{loanData[item] || "NA"}</div>}
                    </Typography>
                  </Grid>
                );
              })}
            {title === "INSURANCE DETAILS" ?
              <Grid xs={12} md={3} item>
                <Typography
                  sx={{mb: 1.5, ml: 2}}
                  variant="body2"
                  item
                >
                  <span style={{fontWeight: "bold"}}>
                    Download policy PDF
                  </span>
                  
                  <Tooltip title="Download" placement="top" arrow>
                    <IconButton
                    aria-label="Download policy PDF"
                    color="primary"
                      >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Typography>
              </Grid>
              : null
            }
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
