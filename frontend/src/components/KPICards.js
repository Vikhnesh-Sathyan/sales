import React from "react";

function KPICards({ kpis }) {
  return (
    <div className="kpi-container">
      <div className="card">
        <h3>Total Leads</h3>
        <p>{kpis.totalLeads}</p>
      </div>
      <div className="card">
        <h3>Contacted Leads</h3>
        <p>{kpis.contactedLeads}</p>
      </div>
      <div className="card">
        <h3>Sales Closed</h3>
        <p>{kpis.salesClosed}</p>
      </div>
      <div className="card">
        <h3>Total Revenue</h3>
        <p>₹{kpis.totalRevenue}</p>
      </div>
    </div>
  );
}

export default KPICards;