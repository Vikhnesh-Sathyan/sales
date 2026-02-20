import React from "react";

function KPICards({ kpis }) {
  if (!kpis) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="kpi-container">
      <div className="kpi-card">
        <div className="kpi-icon">👥</div>
        <div className="kpi-content">
          <h3>Total Leads</h3>
          <p className="kpi-value">{kpis.totalLeads || 0}</p>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon">📞</div>
        <div className="kpi-content">
          <h3>Contacted Leads</h3>
          <p className="kpi-value">{kpis.contactedLeads || 0}</p>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon">✅</div>
        <div className="kpi-content">
          <h3>Sales Closed</h3>
          <p className="kpi-value">{kpis.salesClosed || 0}</p>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon">💰</div>
        <div className="kpi-content">
          <h3>Total Revenue</h3>
          <p className="kpi-value">{formatCurrency(kpis.totalRevenue || 0)}</p>
        </div>
      </div>
    </div>
  );
}

export default KPICards;