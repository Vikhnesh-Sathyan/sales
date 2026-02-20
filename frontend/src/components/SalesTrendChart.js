import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

function SalesTrendChart({ revenueData }) {
  if (!revenueData || Object.keys(revenueData).length === 0) {
    return (
      <div className="chart-container">
        <h3>Sales Trend</h3>
        <div className="empty-chart">No sales data available for the selected period.</div>
      </div>
    );
  }

  const data = Object.keys(revenueData).map((date) => {
    // Format date for display (MM/DD)
    const dateObj = new Date(date);
    const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;
    return {
      date: formattedDate,
      fullDate: date,
      revenue: revenueData[date],
    };
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="chart-container">
      <h3>Sales Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="date" 
            stroke="#666"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#666"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            formatter={(value) => formatCurrency(value)}
            labelStyle={{ color: '#333' }}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#4A90E2" 
            strokeWidth={2}
            dot={{ fill: '#4A90E2', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SalesTrendChart;