import React, { useEffect, useState } from "react";
import axios from "axios";
import KPICards from "./components/KPICards";
import StatusTable from "./components/StatusTable";

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
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) return <h2 className="center">Loading...</h2>;
  if (!data) return <h2 className="center">No Data Available</h2>;

  return (
    <div className="container">
      <h1>Sales Dashboard</h1>
      <DateFilter setRange={setRange} />
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