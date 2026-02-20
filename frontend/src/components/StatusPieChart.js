import React from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

function StatusPieChart({ statusCounts }) {
  const data = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
  }));

  return (
    <div>
      <h3>Lead Status Distribution</h3>
      <PieChart width={400} height={300}>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label />
        <Tooltip />
      </PieChart>
    </div>
  );
}

export default StatusPieChart;