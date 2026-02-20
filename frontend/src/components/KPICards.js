import React from "react";

function KPICards({ data }) {
  if (!data) return null;

  return (
    <div className="kpi-container">
      <div className="kpi-card">
        <h3>Total Sales</h3>
        <p>₹ {data.totalSales}</p>
      </div>

      <div className="kpi-card">
        <h3>Total Orders</h3>
        <p>{data.totalOrders}</p>
      </div>

      <div className="kpi-card">
        <h3>Conversion Rate</h3>
        <p>{data.conversionRate}%</p>
      </div>
    </div>
  );
}

export default KPICards;