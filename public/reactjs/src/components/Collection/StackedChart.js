import { Chart } from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";

const StackedBarChart = ({
  chartlabels,
  dataInPercentage,
  total,
  barColors,
  containerStyle,
  heading,
  labels,
}) => {
  const options = {
    scales: {
      xAxes: [
        {
          stacked: true,
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            borderDash: [], // Make the y-axis grid lines solid
          },
          ticks: {
            beginAtZero: true,
            max: 100,
            stepSize: 20,
            callback: function (value) {
              return value + "%";
            },
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          return (
            data.datasets[tooltipItem.datasetIndex].label +
            ": " +
            tooltipItem.yLabel +
            "%"
          );
        },
      },
    },
  };

  Chart.plugins.register({
    afterDraw: function (chart) {
      const ctx = chart.ctx;
      const xAxis = chart.scales["x-axis-0"];
      const yAxis = chart.scales["y-axis-0"];

      // Draw vertical line on x-axis
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(xAxis.left, yAxis.bottom);
      ctx.lineTo(xAxis.left, yAxis.top);
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "#E1E1E1";
      ctx.stroke();
      ctx.restore();

      // Draw horizontal line on y-axis
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(xAxis.left, yAxis.bottom);
      ctx.lineTo(xAxis.right, yAxis.bottom);
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "#E1E1E1";
      ctx.stroke();
      ctx.restore();
    },
  });

  const data = {
    labels: chartlabels,
    datasets: [
      {
        label: labels.original,
        backgroundColor: barColors.original,
        data: dataInPercentage,
        barThickness: 42,
      },
      {
        label: labels.background,
        backgroundColor: barColors.background,
        data: total,
        barThickness: 42,
      },
    ],
  };

  return (
    <div style={containerStyle}>
      <h2
        style={{
          color: "#1C1C1C",
          fontFamily: "Montserrat-Regular",
          fontSize: "20px",
          paddingLeft: "7px",
          fontWeight: 600,
          lineHeight: "24px",
          letterSpacing: "-0.25px",
          marginBottom: "20px",
        }}
      >
        {heading}
      </h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default StackedBarChart;
