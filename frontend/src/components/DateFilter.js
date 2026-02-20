import React from "react";

function DateFilter({ setRange, currentRange }) {
  return (
    <div className="filter-container">
      <label htmlFor="date-range">Date Range:</label>
      <select 
        id="date-range"
        className="date-filter-select"
        value={currentRange}
        onChange={(e) => setRange(parseInt(e.target.value))}
      >
        <option value={7}>Last 7 Days</option>
        <option value={30}>Last 30 Days</option>
      </select>
    </div>
  );
}

export default DateFilter;