import React, { useState, useEffect } from "react";
import axios from "axios";
import LeadForm from "./LeadForm";

function LeadList({ onStatusChange }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, sortBy, sortOrder]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);
      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);

      const res = await axios.get(`http://localhost:5000/api/leads?${params}`);
      setLeads(res.data);
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchLeads();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/leads/${id}`);
      fetchLeads();
      if (onStatusChange) onStatusChange();
    } catch (err) {
      alert("Error deleting lead");
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/leads/${leadId}`, {
        status: newStatus
      });
      fetchLeads();
      if (onStatusChange) onStatusChange();
    } catch (err) {
      alert("Error updating lead status");
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    if (selectedLeads.length === 0) {
      alert("Please select at least one lead");
      return;
    }

    try {
      await axios.patch("http://localhost:5000/api/leads/bulk-status", {
        leadIds: selectedLeads,
        status: newStatus
      });
      setSelectedLeads([]);
      fetchLeads();
      if (onStatusChange) onStatusChange();
    } catch (err) {
      alert("Error updating leads");
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingLead(null);
    fetchLeads();
    if (onStatusChange) onStatusChange();
  };

  const toggleSelectLead = (id) => {
    setSelectedLeads(prev =>
      prev.includes(id)
        ? prev.filter(leadId => leadId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead._id));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (showForm) {
    return (
      <div className="lead-management">
        <LeadForm
          lead={editingLead}
          onSave={handleFormClose}
          onCancel={() => {
            setShowForm(false);
            setEditingLead(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="lead-management">
      <div className="lead-list-header">
        <h2>Lead Management</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add New Lead
        </button>
      </div>

      <div className="lead-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, email, company, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Follow Up">Follow Up</option>
            <option value="Appointment Booked">Appointment Booked</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortBy(field);
              setSortOrder(order);
            }}
            className="filter-select"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="status-asc">Status (A-Z)</option>
            <option value="revenue-desc">Revenue (High-Low)</option>
          </select>
        </div>
      </div>

      {selectedLeads.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedLeads.length} lead(s) selected</span>
          <select
            onChange={(e) => handleBulkStatusChange(e.target.value)}
            defaultValue=""
            className="bulk-status-select"
          >
            <option value="" disabled>Change Status...</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Follow Up">Follow Up</option>
            <option value="Appointment Booked">Appointment Booked</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>
          <button
            className="btn btn-secondary"
            onClick={() => setSelectedLeads([])}
          >
            Clear Selection
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading leads...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="empty-state">
          <p>No leads found. Create your first lead to get started!</p>
        </div>
      ) : (
        <div className="lead-table-container">
          <table className="lead-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === leads.length && leads.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Status</th>
                <th>Revenue</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead._id)}
                      onChange={() => toggleSelectLead(lead._id)}
                    />
                  </td>
                  <td className="lead-name">{lead.name}</td>
                  <td>{lead.email || "-"}</td>
                  <td>{lead.phone || "-"}</td>
                  <td>{lead.company || "-"}</td>
                  <td>
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Follow Up">Follow Up</option>
                      <option value="Appointment Booked">Appointment Booked</option>
                      <option value="Converted">Converted</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </td>
                  <td className="revenue-cell">
                    {lead.status === "Converted" ? formatCurrency(lead.revenue || 0) : "-"}
                  </td>
                  <td>{formatDate(lead.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => handleEdit(lead)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => handleDelete(lead._id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LeadList;
