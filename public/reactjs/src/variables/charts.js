const { TryRounded } = require("@mui/icons-material");
const Chart = require("chart.js");
const { generateRandomColor } = require("util/helper");
const themeColors = require("assets/theme/colors.js").default;
// Only for demo purposes - return a random number to generate datasets
var randomScalingFactor = function () {
  return Math.round(Math.random() * 100);
};

//
// Chart extension for making the bars rounded
// Code from: https://codepen.io/jedtrow/full/ygRYgo
//

Chart.elements.Rectangle.prototype.draw = function () {
  var ctx = this._chart.ctx;
  var vm = this._view;
  var left, right, top, bottom, signX, signY, borderSkipped, radius;
  var borderWidth = vm.borderWidth;
  // Set Radius Here
  // If radius is large enough to cause drawing errors a max radius is imposed
  var cornerRadius = 6;

  if (!vm.horizontal) {
    // bar
    left = vm.x - vm.width / 2;
    right = vm.x + vm.width / 2;
    top = vm.y;
    bottom = vm.base;
    signX = 1;
    signY = bottom > top ? 1 : -1;
    borderSkipped = vm.borderSkipped || "bottom";
  } else {
    // horizontal bar
    left = vm.base;
    right = vm.x;
    top = vm.y - vm.height / 2;
    bottom = vm.y + vm.height / 2;
    signX = right > left ? 1 : -1;
    signY = 1;
    borderSkipped = vm.borderSkipped || "left";
  }

  // Canvas doesn't allow us to stroke inside the width so we can
  // adjust the sizes to fit if we're setting a stroke on the line
  if (borderWidth) {
    // borderWidth shold be less than bar width and bar height.
    var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
    borderWidth = borderWidth > barSize ? barSize : borderWidth;
    var halfStroke = borderWidth / 2;
    // Adjust borderWidth when bar top position is near vm.base(zero).
    var borderLeft = left + (borderSkipped !== "left" ? halfStroke * signX : 0);
    var borderRight =
      right + (borderSkipped !== "right" ? -halfStroke * signX : 0);
    var borderTop = top + (borderSkipped !== "top" ? halfStroke * signY : 0);
    var borderBottom =
      bottom + (borderSkipped !== "bottom" ? -halfStroke * signY : 0);
    // not become a vertical line?
    if (borderLeft !== borderRight) {
      top = borderTop;
      bottom = borderBottom;
    }
    // not become a horizontal line?
    if (borderTop !== borderBottom) {
      left = borderLeft;
      right = borderRight;
    }
  }

  ctx.beginPath();
  ctx.fillStyle = vm.backgroundColor;
  ctx.strokeStyle = vm.borderColor;
  ctx.lineWidth = borderWidth;

  // Corner points, from bottom-left to bottom-right clockwise
  // | 1 2 |
  // | 0 3 |
  var corners = [
    [left, bottom],
    [left, top],
    [right, top],
    [right, bottom],
  ];

  // Find first (starting) corner with fallback to 'bottom'
  var borders = ["bottom", "left", "top", "right"];
  var startCorner = borders.indexOf(borderSkipped, 0);
  if (startCorner === -1) {
    startCorner = 0;
  }

  function cornerAt(index) {
    return corners[(startCorner + index) % 4];
  }

  // Draw rectangle from 'startCorner'
  var corner = cornerAt(0);
  ctx.moveTo(corner[0], corner[1]);

  for (var i = 1; i < 4; i++) {
    corner = cornerAt(i);
    let nextCornerId = i + 1;
    if (nextCornerId === 4) {
      nextCornerId = 0;
    }

    // let nextCorner = cornerAt(nextCornerId);

    let width = corners[2][0] - corners[1][0];
    let height = corners[0][1] - corners[1][1];
    let x = corners[1][0];
    let y = corners[1][1];
    // eslint-disable-next-line
    var radius = cornerRadius;

    // Fix radius being too large
    if (radius > height / 2) {
      radius = height / 2;
    }
    if (radius > width / 2) {
      radius = width / 2;
    }

    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  }

  ctx.fill();
  if (borderWidth) {
    ctx.stroke();
  }
};

var mode = "light"; //(themeMode) ? themeMode : 'light';
var fonts = {
  base: "Open Sans",
};

// Colors
var colors = {
  gray: themeColors.gray,
  theme: {
    default: themeColors.dark.main,
    primary: themeColors.primary.main,
    secondary: themeColors.secondary.main,
    info: themeColors.info.main,
    success: themeColors.success.main,
    danger: themeColors.error.main,
    warning: themeColors.warning.main,
  },
  black: themeColors.black.light,
  white: themeColors.white.main,
  transparent: themeColors.transparent.main,
};

// Methods

// Chart.js global options
function chartOptions() {
  // Options
  var options = {
    defaults: {
      global: {
        responsive: true,
        maintainAspectRatio: false,
        defaultColor: mode === "dark" ? colors.gray[700] : colors.gray[600],
        defaultFontColor: mode === "dark" ? colors.gray[700] : colors.gray[600],
        defaultFontFamily: fonts.base,
        defaultFontSize: 13,
        layout: {
          padding: 0,
        },
        legend: {
          display: false,
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 16,
          },
        },
        elements: {
          point: {
            radius: 0,
            backgroundColor: colors.theme["primary"],
          },
          line: {
            tension: 0.4,
            borderWidth: 4,
            borderColor: colors.theme["primary"],
            backgroundColor: colors.transparent,
            borderCapStyle: "rounded",
          },
          rectangle: {
            backgroundColor: colors.theme["warning"],
          },
          arc: {
            backgroundColor: colors.theme["primary"],
            borderColor: mode === "dark" ? colors.gray[800] : colors.white,
            borderWidth: 4,
          },
        },
        tooltips: {
          enabled: true,
          mode: "index",
          intersect: true,
        },
      },
      doughnut: {
        cutoutPercentage: 83,
        legendCallback: function (chart) {
          var data = chart.data;
          var content = "";

          data.labels.forEach(function (label, index) {
            var bgColor = data.datasets[0].backgroundColor[index];

            content += '<span class="chart-legend-item">';
            content +=
              '<i class="chart-legend-indicator" style="background-color: ' +
              bgColor +
              '"></i>';
            content += label;
            content += "</span>";
          });

          return content;
        },
      },
    },
  };

  // yAxes
  Chart.scaleService.updateScaleDefaults("linear", {
    gridLines: {
      borderDash: [2],
      borderDashOffset: [2],
      color: mode === "dark" ? colors.gray[900] : colors.gray[300],
      drawBorder: false,
      drawTicks: false,
      lineWidth: 1,
      zeroLineWidth: 1,
      zeroLineColor: mode === "dark" ? colors.gray[900] : colors.gray[300],
      zeroLineBorderDash: [2],
      zeroLineBorderDashOffset: [2],
    },
    ticks: {
      beginAtZero: true,
      padding: 10,
      callback: function (value) {
        if (!(value % 10)) {
          return value;
        }
      },
    },
  });

  // xAxes
  Chart.scaleService.updateScaleDefaults("category", {
    gridLines: {
      drawBorder: false,
      drawOnChartArea: false,
      drawTicks: false,
    },
    ticks: {
      padding: 20,
    },
  });

  return options;
}

// Parse global options
function parseOptions(parent, options) {
  for (var item in options) {
    if (typeof options[item] !== "object") {
      parent[item] = options[item];
    } else {
      parseOptions(parent[item], options[item]);
    }
  }
}

// Example 1 of Chart inside src/views/dashboards/Dashboard.js
let chartExample1 = {
  options: {
    scales: {
      yAxes: [
        {
          gridLines: {
            color: colors.gray[700],
            zeroLineColor: colors.gray[700],
          },
          ticks: {
            callback: function (value) {
              if (!(value % 10)) {
                return "$" + value + "k";
              }
            },
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: function (item, data) {
          var label = data.datasets[item.datasetIndex].label || "";
          var yLabel = item.yLabel;
          var content = "";

          if (data.datasets.length > 1) {
            content += label;
          }

          content += "$" + yLabel + "k";
          return content;
        },
      },
    },
  },
  data1: () => {
    return {
      labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Performance",
          data: [0, 20, 10, 30, 15, 40, 20, 60, 60],
        },
      ],
    };
  },
  data2: () => {
    return {
      labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Performance",
          data: [0, 20, 5, 25, 10, 30, 15, 40, 40],
        },
      ],
    };
  },
};

// Example 2 of Chart inside src/views/dashboards/Dashboard.js and src/views/dashboards/Alternative.js and src/views/pages/Charts.js
let chartExample2 = {
  options: {
    scales: {
      yAxes: [
        {
          gridLines: {
            color: colors.gray[200],
            zeroLineColor: colors.gray[200],
          },
          ticks: {
            callback: function (value) {
              if (!(value % 10)) {
                //return '$' + value + 'k'
                return value;
              }
            },
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: function (item, data) {
          var label = data.datasets[item.datasetIndex].label || "";
          var yLabel = item.yLabel;
          var content = "";
          if (data.datasets.length > 1) {
            content += label;
          }
          content += yLabel;
          return content;
        },
      },
    },
  },
  data: {
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales",
        data: [25, 20, 30, 22, 17, 29],
        maxBarThickness: 10,
      },
    ],
  },
};

// Example 3 of Chart inside src/views/dashboards/Alternative.js and src/views/pages/Charts.js
let chartExample3 = {
  options: {
    scales: {
      yAxes: [
        {
          gridLines: {
            color: colors.gray[200],
            zeroLineColor: colors.gray[200],
          },
          ticks: {},
        },
      ],
    },
  },
  data: {
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Performance",
        data: [0, 20, 10, 30, 15, 40, 20, 60, 60],
      },
    ],
  },
};

// Example 4 of Chart inside src/views/pages/Charts.js
const chartExample4 = {
  options: {
    scales: {
      yAxes: [
        {
          gridLines: {
            color: colors.gray[200],
            zeroLineColor: colors.gray[200],
          },
          ticks: {},
        },
      ],
    },
  },
  data: {
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Performance",
        data: [10, 18, 28, 23, 28, 40, 36, 46, 52],
        pointRadius: 10,
        pointHoverRadius: 15,
        showLine: false,
      },
    ],
  },
};

// Example 5 of Chart inside src/views/pages/Charts.js
const chartExample5 = {
  data: {
    labels: ["Danger", "Warning", "Success", "Primary", "Info"],
    datasets: [
      {
        data: [
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
        ],
        backgroundColor: [
          colors.theme["danger"],
          colors.theme["warning"],
          colors.theme["success"],
          colors.theme["primary"],
          colors.theme["info"],
        ],
        label: "Dataset 1",
      },
    ],
  },
  options: {
    responsive: true,
    legend: {
      position: "top",
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  },
};

// Example 6 of Chart inside src/views/pages/Charts.js
const chartExample6 = {
  data: {
    labels: ["Danger", "Warning", "Success", "Primary", "Info"],
    datasets: [
      {
        data: [
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
        ],
        backgroundColor: [
          colors.theme["danger"],
          colors.theme["warning"],
          colors.theme["success"],
          colors.theme["primary"],
          colors.theme["info"],
        ],
        label: "Dataset 1",
      },
    ],
  },
  options: {
    responsive: true,
    legend: {
      position: "top",
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  },
};

// Example 7 of Chart inside src/views/pages/Charts.js
const chartExample7 = {
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Dataset 1",
        backgroundColor: colors.theme["danger"],
        data: [
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
        ],
        maxBarThickness: 10,
      },
      {
        label: "Dataset 2",
        backgroundColor: colors.theme["primary"],
        data: [
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
        ],
        maxBarThickness: 10,
      },
      {
        label: "Dataset 3",
        backgroundColor: colors.theme["success"],
        data: [
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
        ],
        maxBarThickness: 10,
      },
    ],
  },
  options: {
    tooltips: {
      mode: "index",
      intersect: false,
    },
    responsive: true,
    scales: {
      xAxes: [
        {
          stacked: true,
        },
      ],
      yAxes: [
        {
          stacked: true,
        },
      ],
    },
  },
};

// Example 1 of Chart inside src/views/dashboards/Dashboard.js
let chartExample8 = {
  options: {
    scales: {
      yAxes: [
        {
          gridLines: {
            color: colors.gray[200],
            zeroLineColor: colors.gray[200],
          },
          ticks: {
            callback: function (value) {
              if (!(value % 10)) {
                return value;
              }
            },
          },
        },
      ],
    },
    tooltips: {
      callbacks: {
        label: function (item, data) {
          var label = data.datasets[item.datasetIndex].label || "";
          var yLabel = item.yLabel;
          var content = "";

          if (data.datasets.length > 1) {
            content += label;
          }

          content += "$" + yLabel + "k";
          return content;
        },
      },
    },
  },
  data: () => {
    return {
      labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          label: "Performance",
          data: [0, 20, 10, 30, 15, 40, 20, 60, 60],
        },
      ],
    };
  },
};

// Example 1 of Chart inside src/views/dashboards/Dashboard.js
let chartLine = {
  options: ({ xLabel,yLabel, maxValue, stepSize }) => {
    return {
      scales: {
        xAxes:[
          {
            scaleLabel: {
              display: xLabel?true:false,
              labelString: xLabel?xLabel:''
            },
          }
        ],
        yAxes: [
          {
            scaleLabel: {
              display: yLabel?true:false,
              labelString: yLabel?yLabel:''
            },
            gridLines: {
              color: colors.gray[200],
              zeroLineColor: colors.gray[200],
            },
            ticks: {
              beginAtZero: true,
              min: 0,
              max: maximumValue(maxValue),
              stepSize: stepSize ? stepSize : 5,
              callback: function (value) {
                return parseInt(Math.ceil(value));
            },
            },
          },
        ],
      },
    };
  },
  data: (xAxisLabels, yAxisLabels,label) => {
    return {
      labels: xAxisLabels,
      datasets: [
        {
          label: label,
          data: yAxisLabels,
          pointRadius: 7,
          pointHoverRadius: 8,
          showLine: true
        },
      ],
    };
  },
};

// Example 1 of Chart inside src/views/dashboards/Dashboard.js
let chartMultiLine = {
  options: ({ xLabel,yLabel, maxValue, stepSize, showLegend}) => {
    return {
      tooltips: {
        mode: "nearest",
        intersect: false,
        callbacks: {
          label: function (item, data) {
            var label = data.datasets[item.datasetIndex].label || "";
            var yLabel = item.yLabel;
            var content = "";
            if (data.datasets.length > 1) {
              content += label;
            }
            content += `\t : ${yLabel}`;
            return content;
          },
        },
      },
      legend:{
        display: showLegend ,
        position:'top'
      },
      plugins: {
        title: {
          display: true,
          text: "Test chart",
          position: "top"
        }
      },
      scales: {
        xAxes:[
          {
            scaleLabel: {
              display: xLabel?true:false,
              labelString: xLabel?xLabel:''
            },
            ticks:{
              beginAtZero: true,
            }
          }
        ],
        yAxes: [
          {
            scaleLabel: {
              display: yLabel?true:false,
              labelString: yLabel?yLabel:''
            },
            gridLines: {
              color: colors.gray[200],
              zeroLineColor: colors.gray[200],
            },
            ticks: {
              beginAtZero: true ,
              min: 0,
              max: maximumValue(maxValue),
              stepSize: stepSize ? stepSize : 5,
              callback: function (value) {
                return parseInt(Math.ceil(value));
            },
            },
            /*
            beforeBuildTicks: function(axis) {
              if (axis.max >= 17) {
                  axis.options.ticks.stepSize = 1;
              } else if (axis.max >= 10) {
                  axis.options.ticks.stepSize = .5;
              }
            }
            */
          },
        ]
      },
    };
  },
  data: (xAxisLabels, yAxisLabels,types,typesColor) => {
    var arr=[];
    for(var i=0;i<yAxisLabels.length;i++){
      arr.push({
          label: types[i],
          data: yAxisLabels[i],
          pointRadius: 5,
          pointHoverRadius: 10,
          borderWidth: 3,
          showLine: true,
          pointBackgroundColor: typesColor[i],
          borderColor: typesColor[i]
      })
    }

    return {
      labels: xAxisLabels,
      datasets: arr
    };
  },
};

// Example 1 of Chart inside src/views/dashboards/Dashboard.js
let chartBar = {
  options: ({ xLabel,yLabel,xAxisLabels,yAxisLabels,maxValue, stepSize}) => {
    return {
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (item, data) {
            var label = data.datasets[item.datasetIndex].label || "";
            var yLabel = item.yLabel;
            var content = "";
            if (data.datasets.length > 1) {
              content += label;
            }
            content += `\t : ${yLabel}`;
            return content;
          },
        },
      },
      scales: {
        xAxes:[
          {
            scaleLabel: {
              display: xLabel?true:false,
              labelString: xLabel?xLabel:''
            },
         
            barPercentage: 1.3,
            ticks: {
              callback: (v, i) => xAxisLabels[i]
            }
          }
        ],
        yAxes: [
          {
            scaleLabel: {
              display: yLabel?true:false,
              labelString: yLabel?yLabel:''
            },
            gridLines: {
              color: colors.gray[200],
              zeroLineColor: colors.gray[200],
            },
            ticks: {
              type:"linear",
              min: 0,
              max: maximumValue(maxValue),
              stepSize: stepSize ? stepSize : 5,
              callback: function (value) {
                  return parseInt(Math.ceil(value));
                }
            },
          },
        ],
      }
    };
  },
  data: (xAxisLabels, yAxisLabels,label) => {
    return {
      labels: xAxisLabels,
      datasets: [
        {
          label: label,
          data: yAxisLabels,
          maxBarThickness: 580/xAxisLabels.length
        },
      ],
    };
  },
};

let chartHistogram = {
  options: ({ xLabel,yLabel,xAxisLabels,yAxisLabels,maxValue, stepSize}) => {
    return {
      tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (item, data) {
            var label = data.datasets[item.datasetIndex].label || "";
            var yLabel = item.yLabel;
            var content = "";
            if (data.datasets.length > 1) {
              content += label;
            }
            content += `${label} : ${yLabel}`;
            return content;
          },
          title: (item,data)=>{
            var content= `${item[0].index==0?"0-":`${data.labels[item[0].index-1]}-`}${item[0].xLabel}`;
            return content;
          }
        },
      },
      scales: {
        xAxes:[
          {
            scaleLabel: {
              display: xLabel?true:false,
              labelString: xLabel?xLabel:''
            },
            ticks: {
              display: false
            },
         
            barPercentage: 1.3,
          },
          {
            type:"linear",
            ticks: {
              min: 0,
              max: xAxisLabels.length,
              stepSize: 1,
              callback: (v, i) => i == 0 ? '0' : xAxisLabels[i - 1]
            }
          }
        ],
        yAxes: [
          {
            scaleLabel: {
              display: yLabel?true:false,
              labelString: yLabel?yLabel:''
            },
            gridLines: {
              color: colors.gray[200],
              zeroLineColor: colors.gray[200],
            },
            ticks: {
              min: 0,
              max: maximumValue(maxValue),
              stepSize: stepSize ? stepSize : 5,
              callback: function (value) {
                  return parseInt(Math.ceil(value));
              }
            },
          },
        ],
      }
    };
  },
  data: (xAxisLabels, yAxisLabels,label) => {
    return {
      labels: xAxisLabels,
      datasets: [
        {
          label: label,
          data: yAxisLabels,
          maxBarThickness: 580/xAxisLabels.length,
          backgroundColor: colors.theme["primary"]
        },
      ],
    };
  },
};

let chartLineHistogram = {
  options: ({ xLabel,yLabel1,yLabel2,yAxisLabels,maxValue,maxValue2, stepSize,stepSize2,showLegend}) => {
    return {
      responsive: true,
      tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (item, data) {
            var label = data.datasets[item.datasetIndex].label || "";
            var yLabel = item.yLabel;
            var content = "";
            if (data.datasets.length > 1) {
              content += label;
            }
            content += `: ${yLabel}`;
            return content;
          },
        },
      },
      legend:{
        display: showLegend ,
        position:'top'
      },
      plugins: {
        title: {
          display: true,
          text: 'Chart.js Line Chart - Multi Axis'
        }
      },
      scales: {
        xAxes:[
          {
            ticks: {
              beginAtZero: true,
              display:true,
              min:0
            },
            barPercentage: 1,
            scaleLabel: {
              display: xLabel?true:false,
              labelString: xLabel?xLabel:''
            },
          },
        ],
        yAxes: [
          {
          id: 'A',
          type: 'linear',
          position: 'left',
          stacked: true,
          scaleLabel: {
            display: yLabel1?true:false,
            labelString: yLabel1?yLabel1:''
          },
          ticks: {
            beginAtZero: true,
            min: 0,
            max:maximumValue(maxValue),
            stepSize: stepSize ? stepSize : 5,
            callback: function (value) {
              return parseInt(Math.ceil(value));
            },
          },
          gridLines: {
            color: colors.gray[200],
            zeroLineColor: colors.gray[200],
          }
        }, {
          id: 'B',
          type: 'linear',
          position: 'right',
          grace: '1%',
          stacked: true,
          scaleLabel: {
            display: yLabel2?true:false,
            labelString: yLabel2?yLabel2:''
          },
          ticks: {
            beginAtZero: true,
            min: 0,
            max:maximumValue(maxValue2),
            stepSize: stepSize2 ? stepSize2 : 5,
            callback: function (value) {
                return parseInt(Math.ceil(value));
            },
            //maxTicksLimit: 10,
          },
          gridLines: {
            color: colors.gray[200],
            zeroLineColor: colors.gray[200],
          },
          afterBuildTicks(axis, ticks) {
            axis.ticks = [];
            for (let i = axis.options.ticks.min; i<=axis.options.ticks.max; i+=axis.options.ticks.stepSize) {
              axis.ticks.push(i);
            }
      
          }
        }]
      }
    };
  },
  data: (xAxisLabels, yAxisLabels,types,typesColor, yAxisTypes) => {

    var arr=[];
    for(var i=0;i<yAxisLabels.length;i++){
      if(yAxisTypes[i]=="line"){
        arr.push({
            type:"line",
            yAxisID: 'B',
            label: types[i],
            data: yAxisLabels[i],
            pointRadius: 5,
            pointHoverRadius: 10,
            borderWidth: 3,
            showLine: true,
            pointBackgroundColor: typesColor[i],
            borderColor: typesColor[i]
        })
      }else if(yAxisTypes[i]=="bar"){
        arr.push({
          type:"bar",
          label: types[i],
          yAxisID: 'A',
          data: yAxisLabels[i],
          backgroundColor: typesColor[i],
          maxBarThickness: 300,
          stack: 'Stack 0',
      })
      }
    }
    
    return {
      labels: xAxisLabels,
      datasets: arr
    }
  }
};


function maximumValue(maxValue){
  var length= maxValue?parseInt(maxValue).toString().length:0;

  var additionalValue=  length<=2?10:Math.pow(10,(length-2));

  return maxValue?(parseFloat(maxValue)+parseFloat(additionalValue)):10;
}

module.exports = {
  chartOptions, // used alonside with the chartExamples variables
  parseOptions, // used alonside with the chartExamples variables
  chartExample1, // used inside src/views/dashboards/Dashboard.js
  chartExample2, // used inside src/views/dashboards/Dashboard.js and src/views/dashboards/Alternative.js and src/views/pages/Charts.js
  chartExample3, // used inside src/views/dashboards/Alternative.js and src/views/pages/Charts.js
  chartExample4, // used inside src/views/pages/Charts.js
  chartExample5, // used inside src/views/pages/Charts.js
  chartExample6, // used inside src/views/pages/Charts.js
  chartExample7, // used inside src/views/pages/Charts.js
  chartExample8, // used inside src/views/pages/Charts.js
  chartLine, // used inside src/views/pages/company/chart.js
  chartMultiLine, // used inside src/views/pages/company/chart.js
  chartHistogram, // used inside src/views/pages/company/chart.js
  chartLineHistogram, // used inside src/views/pages/company/chart.js
};
