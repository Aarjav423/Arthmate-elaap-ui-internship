import * as React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function DemographicsCards(props) {
  const {title, data, loanData, ...other} = props;
  return (
    <Card
      sx={{
        maxWidth: "25%",
        minHeight: "10px",
        borderRadius: "1rem",
        margin: "10px",
        ":hover": {
          boxShadow: 20
        }
      }}
    >
      <CardContent sx={{fontSize: "14px", margin: 0}}>
        <Typography sx={{mb: 1.5}} variant="h5" component="div">
          {`${title || "NA"}`}
        </Typography>
        <Grid xs={12} container spacing={1} sx={{fontSize: "14px", margin: 0}}>
          {data.fields &&
            data.fields.map((item, index) => {
              return (
                <Typography
                  sx={{mb: 1.5, ml: 2}}
                  variant="body2"
                  key={index}
                  item
                >
                  {
                    <span style={{fontWeight: "bold"}}>
                      {item.replace(/_/g, " ")}
                    </span>
                  }
                  : {<span>{loanData[item] || "NA"} </span>}
                </Typography>
              );
            })}
        </Grid>
      </CardContent>
    </Card>
  );
}
