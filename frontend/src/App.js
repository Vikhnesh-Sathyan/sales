import React, { useEffect, useState } from "react";
import axios from "axios";
import KPICards from "./components/KPICards";
import StatusTable from "./components/StatusTable";
import SalesTrendChart from "./components/SalesTrendChart";
import StatusPieChart from "./components/StatusPieChart";
import DateFilter from "./components/DateFilter";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [range, setRange] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(range);
  }, [range]);

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h2>Loading Dashboard Data...</h2>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="error-container">
        <h2>Unable to Load Data</h2>
        <p>Please check if the backend server is running.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Sales Dashboard</h1>
      <DateFilter setRange={setRange} currentRange={range} />
      <KPICards kpis={data.kpis} />
      <div className="charts">
        <SalesTrendChart revenueData={data.revenueByDate} />
        <StatusPieChart statusCounts={data.statusCounts} />
      </div>
      <StatusTable statusCounts={data.statusCounts} />
    </div>
  );
}

export default App;