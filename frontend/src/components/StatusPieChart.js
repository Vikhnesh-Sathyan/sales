import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts";

function StatusPieChart({ statusCounts }) {
  if (!statusCounts) return null;

  const COLORS = ['#4A90E2', '#50C878', '#FFB84D', '#9B59B6', '#2ECC71', '#E74C3C'];

  const allStatuses = [
    "New",
    "Contacted",
    "Follow Up",
    "Appointment Booked",
    "Converted",
    "Lost"
  ];

  const data = allStatuses.map((status) => ({
    name: status,
    value: statusCounts[status] || 0,
  })).filter(item => item.value > 0); // Only show statuses with data

  if (data.length === 0) {
    return (
      <div className="chart-container">
        <h3>Lead Status Distribution</h3>
        <div className="empty-chart">No lead data available for the selected period.</div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3>Lead Status Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => value}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatusPieChart;