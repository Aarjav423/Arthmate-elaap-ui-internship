import React from "react";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Bar } from "react-chartjs-2";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import FindInPageOutlinedIcon from "@mui/icons-material/FindInPageOutlined";
// @material-ui/icons components

// core components

import { chartOptions, parseOptions, chartExample2 } from "variables/charts.js";

import componentStyles from "assets/theme/components/cards/charts/card-total-orders.js";
import { chartHistogram } from "variables/charts";

const useStyles = makeStyles(componentStyles);

function CardHistogram({chartHeader,toolTipLabel,xLabel,yLabel,xAxis,yAxis,maxValue,stepSize}) {
  const classes = useStyles();
  const theme = useTheme();
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }
  return (
    <>
      <Card classes={{ root: classes.cardRoot }}>
        <CardHeader
          title={
            <Box component="span" color={theme.palette.gray[600]}>
              {' '}
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
          <Box position="relative" height="450px">
            {
              xAxis.length==0? (
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
                <Bar 
              data={chartHistogram.data(xAxis,yAxis,toolTipLabel)}
              options={chartHistogram.options({
                xLabel:xLabel,
                yLabel:yLabel,
                maxValue: maxValue,
                stepSize: stepSize,
                xAxisLabels:xAxis,
                yAxisLabels:yAxis
              })} />
              )
            }
            
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

export default CardHistogram;
