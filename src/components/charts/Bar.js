import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { barChartOptions } from "./config";

const Bar = ({ data }) => {
  const chartContainer = useRef(null);
  const [, setChartInstance] = useState(null);

  useEffect(() => {
    const context = chartContainer.current.getContext("2d");
    const newChartInstance = new Chart(context, {
      type: "bar",
      options: barChartOptions,
      data,
    });
    setChartInstance(newChartInstance);
  }, []);

  return <canvas ref={chartContainer} />;
};

export default Bar;
