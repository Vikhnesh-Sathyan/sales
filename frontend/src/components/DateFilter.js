import React from "react";

function DateFilter({ setRange }) {
  return (
    <div className="filter">
      <select onChange={(e) => setRange(e.target.value)}>
        <option value={7}>Last 7 Days</option>
        <option value={30}>Last 30 Days</option>
      </select>
    </div>
  );
}

export default DateFilter;