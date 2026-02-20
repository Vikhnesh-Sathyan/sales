import React from "react";

function StatusTable({ statusCounts }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Status</th>
          <th>Count</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(statusCounts).map(([status, count]) => (
          <tr key={status}>
            <td>{status}</td>
            <td>{count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default StatusTable;