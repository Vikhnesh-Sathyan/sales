import React, { useEffect, useState } from "react";
import axios from "axios";
import KPICards from "./components/KPICards";
import StatusTable from "./components/StatusTable";
import SalesTrendChart from "./components/SalesTrendChart";
import StatusPieChart from "./components/StatusPieChart";
import DateFilter from "./components/DateFilter";
import LeadList from "./components/LeadList";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [range, setRange] = useState(7);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchData(range);
  }, [range, refreshTrigger]);

  const fetchData = async (days) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/dashboard?days=${days}`
      );
      setData(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadChange = () => {
    // Trigger dashboard refresh when leads change
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading && !data) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h2>Loading Dashboard Data...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="app-header">
        <h1>Sales Dashboard</h1>
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            className={`tab-button ${activeTab === "leads" ? "active" : ""}`}
            onClick={() => setActiveTab("leads")}
          >
            👥 Lead Management
          </button>
        </div>
      </div>

      {activeTab === "dashboard" ? (
        <>
          {!data ? (
            <div className="error-container">
              <h2>Unable to Load Data</h2>
              <p>Please check if the backend server is running.</p>
            </div>
          ) : (
            <>
              <DateFilter setRange={setRange} currentRange={range} />
              <KPICards kpis={data.kpis} />
              <div className="charts">
                <SalesTrendChart revenueData={data.revenueByDate} />
                <StatusPieChart statusCounts={data.statusCounts} />
              </div>
              <StatusTable statusCounts={data.statusCounts} />
            </>
          )}
        </>
      ) : (
        <LeadList onStatusChange={handleLeadChange} />
      )}
    </div>
  );
}

export default App;