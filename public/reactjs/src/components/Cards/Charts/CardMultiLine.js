import React, { useState } from "react";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line } from "react-chartjs-2";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import FindInPageOutlinedIcon from "@mui/icons-material/FindInPageOutlined";
import TypesDropDown from "components/Dropdowns/TypesDropDown";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
// @material-ui/icons components

// core components

import {
  chartOptions,
  parseOptions,
  chartExample4,
  chart1,
} from "variables/charts.js";

import componentStyles from "assets/theme/components/cards/charts/card-sales-value-dots.js";
import { chartMultiLine } from "variables/charts";
import { Button } from "@material-ui/core";
import { isJSDocNullableType, isNonNullChain } from "typescript";

const defaultErrors = {
  typeError: false,
};

const useStyles = makeStyles(componentStyles);
if (window.Chart) {
  parseOptions(Chart, chartOptions());
}

function CardMultiLine({
  chartHeader,
  xLabel,
  yLabel,
  xAxis,
  yAxis,
  maxValue,
  types,
  stepSize,
  showColorLabel,
  typesColor,
}) {
  const classes = useStyles();
  const theme = useTheme();

  const [showLegend, setShowLegend] = useState(showColorLabel);
  const [errors, setErrors] = useState(defaultErrors);
  const [type, setType] = useState("");

  const handleSelectChange = (field, value, setValue, isMulti) => {
    if (value === null) {
      setValue("");
    } else {
      setValue(value);
    }
    setErrors({
      ...errors,
      [field + "Error"]: isMulti ? !value?.length : !value,
    });
  };

  return (
    <>
      <Card
        classes={{
          root: classes.cardRoot,
        }}
      >
        <CardHeader
          title={
            <Box component="span" color={theme.palette.gray[600]}>
              {" "}
            </Box>
          }
          subheader={chartHeader}
          classes={{ root: classes.cardHeaderRoot }}
          titleTypographyProps={{
            component: Box,
            variant: "h6",
            letterSpacing: "2px",
            marginBottom: "0!important",
            classes: {
              root: classes.textUppercase,
            },
          }}
          subheaderTypographyProps={{
            component: Box,
            variant: "h3",
            marginBottom: "0!important",
            color: "initial",
          }}
        ></CardHeader>
        <CardContent>
          {!showColorLabel && types.length != 0 && xAxis.length != 0 ? (
            <div>
              <div>
                <Grid container spacing={6} alignItems="center">
                  <Grid item xs={3}>
                    <FormControl variant="filled" component={Box} width="100%" style={{}}>
                      <TypesDropDown
                        typesList={types}
                        colors={typesColor}
                        id="select-type-z"
                        placeholder="Select Services"
                        valueData={type}
                        error={errors.typeError}
                        onValueChange={(value) =>
                          handleSelectChange("type", value, setType, false)
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item
                    style={{
                      marginLeft: "auto",
                    }}
                  >
                    <FormControl variant="filled" component={Box} width="100%" style={{ display: (type.value || type.value == 0) ? "none" : "flex" }}>
                      <Button
                        size="small"
                        style={{ borderColor: "black" }}
                        onClick={() => setShowLegend(!showLegend)}
                      >
                        {!showLegend ? "Show Legend" : "Hide Legend"}
                      </Button>
                    </FormControl>
                  </Grid>
                </Grid>

              </div>

              <br />
              <br />
            </div>
          ) : null}

          <Box
            position="relative"
            height={
              showLegend
                ? `${450 + ((types ? types.length : 0) * 50) / 8}px`
                : "450px"
            }
          >
            {types.length == 0 || xAxis.length == 0 ? (
              <div style={{ textAlign: "center", paddingTop: "8vh" }}>
                <FindInPageOutlinedIcon
                  style={{
                    fontSize: "125px",
                    color: "#d1d4cf",
                  }}
                />
                <p
                  style={{
                    alignSelf: "center",
                    fontSize: "13px",
                    color: "rgb(63, 63, 63)",
                  }}
                  className="no_row_found"
                >
                  No data found
                </p>
              </div>
            ) : (
              <Line
                data={(type.value || type.value == 0) ? chartMultiLine.data(xAxis, [yAxis[type.value]], types[type.value], [typesColor[type.value]]) : chartMultiLine.data(xAxis, yAxis, types, typesColor)}
                options={chartMultiLine.options({
                  xLabel: xLabel,
                  yLabel: yLabel,
                  maxValue: maxValue,
                  stepSize: stepSize,
                  showLegend: showLegend,
                })}
                getDatasetAtEvent={(e) => console.log(e)}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

export default CardMultiLine;
