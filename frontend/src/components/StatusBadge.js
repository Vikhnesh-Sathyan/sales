import React from "react";

function StatusBadge({ status, editable = false, onChange }) {
  const getStatusColor = (status) => {
    const colors = {
      "New": { bg: "#E3F2FD", text: "#1976D2", border: "#90CAF9" }, // Blue
      "Contacted": { bg: "#E8F5E9", text: "#2E7D32", border: "#66BB6A" }, // Green
      "Follow Up": { bg: "#FFF3E0", text: "#F57C00", border: "#FFB74D" }, // Orange
      "Appointment Booked": { bg: "#E1F5FE", text: "#0277BD", border: "#4FC3F7" }, // Light Blue
      "Converted": { bg: "#C8E6C9", text: "#1B5E20", border: "#4CAF50" }, // Dark Green
      "Lost": { bg: "#FFEBEE", text: "#C62828", border: "#EF5350" } // Red
    };
    return colors[status] || { bg: "#F5F5F5", text: "#757575", border: "#BDBDBD" };
  };

  const color = getStatusColor(status);

  if (editable) {
    return (
      <select
        value={status}
        onChange={(e) => onChange && onChange(e.target.value)}
        className="status-badge-select"
        style={{
          backgroundColor: color.bg,
          color: color.text,
          borderColor: color.border,
        }}
      >
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Follow Up">Follow Up</option>
        <option value="Appointment Booked">Appointment Booked</option>
        <option value="Converted">Converted</option>
        <option value="Lost">Lost</option>
      </select>
    );
  }

  return (
    <span
      className="status-badge"
      style={{
        backgroundColor: color.bg,
        color: color.text,
        borderColor: color.border,
      }}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
