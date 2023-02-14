import { ThemeColors } from "helpers/ThemeColors";

const colors = ThemeColors();

export const lineChartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "",
      data: [54, 63, 60, 65, 60, 68, 60],
      borderColor: colors.themeColor1,
      pointBackgroundColor: colors.foregroundColor,
      pointBorderColor: colors.themeColor1,
      pointHoverBackgroundColor: colors.themeColor1,
      pointHoverBorderColor: colors.foregroundColor,
      pointBorderWidth: 2,
      pointHoverRadius: 8,
      fill: false,
    },
  ],
};

export const polarAreaChartData = {
  labels: ["Sales", "Orders", "Stock"],
  datasets: [
    {
      data: [80, 90, 70],
      borderWidth: 2,
      borderColor: [colors.themeColor1, colors.themeColor2, colors.themeColor3],
      backgroundColor: [
        colors.themeColor1_10,
        colors.themeColor2_10,
        colors.themeColor3_10,
      ],
    },
  ],
};

export const areaChartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "",
      data: [54, 63, 60, 65, 60, 68, 60],
      borderColor: colors.themeColor1,
      pointBackgroundColor: colors.foregroundColor,
      pointBorderColor: colors.themeColor1,
      pointHoverBackgroundColor: colors.themeColor1,
      pointHoverBorderColor: colors.foregroundColor,
      pointRadius: 4,
      pointBorderWidth: 2,
      pointHoverRadius: 5,
      fill: true,
      borderWidth: 2,
      backgroundColor: colors.themeColor1_10,
    },
  ],
};

export const scatterChartData = {
  datasets: [
    {
      borderWidth: 2,
      showLine: false,
      label: "Cakes",
      borderColor: colors.themeColor1,
      backgroundColor: colors.themeColor1_10,
      data: [
        { x: 62, y: -78 },
        { x: -0, y: 74 },
        { x: -67, y: 45 },
        { x: -26, y: -43 },
        { x: -15, y: -30 },
        { x: 65, y: -68 },
        { x: -28, y: -61 },
      ],
    },
    {
      borderWidth: 2,
      showLine: false,
      label: "Desserts",
      borderColor: colors.themeColor2,
      backgroundColor: colors.themeColor2_10,
      data: [
        { x: 79, y: 62 },
        { x: 62, y: 0 },
        { x: -76, y: -81 },
        { x: -51, y: 41 },
        { x: -9, y: 9 },
        { x: 72, y: -37 },
        { x: 62, y: -26 },
      ],
    },
  ],
};

export const barChartData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agt",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ],
  datasets: [
    {
      label: "Realisasi",
      backgroundColor: "#8F00FF",
      data: [20, 25, 35, 45, 50, 55, 58, 60, 62, 65, 0, 0],
      borderRadius: 20,
      barThickness: 10,
    },
    {
      label: "Target",
      backgroundColor: "#B9179F",
      data: [18, 23, 38, 51, 48, 58, 58, 60, 62, 66, 68, 70],
      borderRadius: 20,
      barThickness: 10,
    },
  ],
};

export const radarChartData = {
  datasets: [
    {
      label: "Stock",
      borderWidth: 2,
      pointBackgroundColor: colors.themeColor1,
      borderColor: colors.themeColor1,
      backgroundColor: colors.themeColor1_10,
      data: [80, 90, 70],
    },
    {
      label: "Order",
      borderWidth: 2,
      pointBackgroundColor: colors.themeColor2,
      borderColor: colors.themeColor2,
      backgroundColor: colors.themeColor2_10,
      data: [68, 80, 95],
    },
  ],
  labels: ["Cakes", "Desserts", "Cupcakes"],
};

export const pieChartData = {
  labels: ["Cakes", "Cupcakes", "Desserts"],
  datasets: [
    {
      label: "",
      borderColor: [colors.themeColor1, colors.themeColor2, colors.themeColor3],
      backgroundColor: [
        colors.themeColor1_10,
        colors.themeColor2_10,
        colors.themeColor3_10,
      ],
      borderWidth: 2,
      data: [15, 25, 20],
    },
  ],
};

export const doughnutChartData = {
  labels: ["Cakes", "Cupcakes", "Desserts"],
  datasets: [
    {
      label: "",
      borderColor: [colors.themeColor3, colors.themeColor2, colors.themeColor1],
      backgroundColor: [
        colors.themeColor3_10,
        colors.themeColor2_10,
        colors.themeColor1_10,
      ],
      borderWidth: 2,
      data: [15, 25, 20],
    },
  ],
};

export const smallChartData1 = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Total Orders",
      borderColor: colors.themeColor1,
      pointBorderColor: colors.themeColor1,
      pointHoverBackgroundColor: colors.themeColor1,
      pointHoverBorderColor: colors.themeColor1,
      pointRadius: 2,
      pointBorderWidth: 3,
      pointHoverRadius: 2,
      fill: false,
      borderWidth: 2,
      data: [1250, 1300, 1550, 921, 1810, 1106, 1610],
      datalabels: {
        align: "end",
        anchor: "end",
      },
    },
  ],
};

export const smallChartData2 = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Pending Orders",
      borderColor: colors.themeColor1,
      pointBorderColor: colors.themeColor1,
      pointHoverBackgroundColor: colors.themeColor1,
      pointHoverBorderColor: colors.themeColor1,
      pointRadius: 2,
      pointBorderWidth: 3,
      pointHoverRadius: 2,
      fill: false,
      borderWidth: 2,
      data: [115, 120, 300, 222, 105, 85, 36],
      datalabels: {
        align: "end",
        anchor: "end",
      },
    },
  ],
};

export const smallChartData3 = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Total Orders",
      borderColor: colors.themeColor1,
      pointBorderColor: colors.themeColor1,
      pointHoverBackgroundColor: colors.themeColor1,
      pointHoverBorderColor: colors.themeColor1,
      pointRadius: 2,
      pointBorderWidth: 3,
      pointHoverRadius: 2,
      fill: false,
      borderWidth: 2,
      data: [350, 452, 762, 952, 630, 85, 158],
      datalabels: {
        align: "end",
        anchor: "end",
      },
    },
  ],
};

export const smallChartData4 = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Total Orders",
      borderColor: colors.themeColor1,
      pointBorderColor: colors.themeColor1,
      pointHoverBackgroundColor: colors.themeColor1,
      pointHoverBorderColor: colors.themeColor1,
      pointRadius: 2,
      pointBorderWidth: 3,
      pointHoverRadius: 2,
      fill: false,
      borderWidth: 2,
      data: [200, 452, 250, 630, 125, 85, 20],
      datalabels: {
        align: "end",
        anchor: "end",
      },
    },
  ],
};

export const conversionChartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "",
      data: [65, 60, 68, 60, 58, 63, 60],
      borderColor: colors.themeColor2,
      pointBackgroundColor: colors.foregroundColor,
      pointBorderColor: colors.themeColor2,
      pointHoverBackgroundColor: colors.themeColor2,
      pointHoverBorderColor: colors.foregroundColor,
      pointRadius: 4,
      pointBorderWidth: 2,
      pointHoverRadius: 5,
      fill: true,
      borderWidth: 2,
      backgroundColor: colors.themeColor2_10,
    },
  ],
};
