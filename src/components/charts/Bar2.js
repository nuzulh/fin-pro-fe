import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { barChartOptions } from "./config";

const Bar2 = ({ data }) => {
  const chartContainer = useRef(null);
  const [, setChartInstance] = useState(null);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const context = chartContainer.current.getContext("2d");
      const newChartInstance = new Chart(context, {
        type: "bar",
        options: barChartOptions,
        data,
      });
      setChartInstance(newChartInstance);
    }
  }, [chartContainer, data]);

  return <canvas ref={chartContainer} />;
};

export default Bar2;
