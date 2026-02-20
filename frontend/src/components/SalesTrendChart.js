import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function SalesTrendChart({ revenueData }) {
  const data = Object.keys(revenueData).map((date) => ({
    date,
    revenue: revenueData[date],
  }));

  return (
    <div>
      <h3>Sales Trend</h3>
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}

export default SalesTrendChart;