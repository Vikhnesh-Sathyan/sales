import React from "react";

function StatusTable({ statusCounts }) {
  const allStatuses = [
    "New",
    "Contacted",
    "Follow Up",
    "Appointment Booked",
    "Converted",
    "Lost"
  ];

  if (!statusCounts) return null;

  return (
    <div className="status-table-container">
      <h2>Lead Status Summary</h2>
      <table className="status-table">
        <thead>
          <tr>
            <th>Lead Status</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {allStatuses.map((status) => (
            <tr key={status}>
              <td>{status}</td>
              <td>{statusCounts[status] || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StatusTable;