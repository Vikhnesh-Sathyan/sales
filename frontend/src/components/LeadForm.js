import React, { useState, useEffect } from "react";
import axios from "axios";

function LeadForm({ lead, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "New",
    estimatedValue: 0,
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        company: lead.company || "",
        status: lead.status || "New",
        estimatedValue: lead.estimatedValue || 0,
        notes: lead.notes || ""
      });
    }
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "estimatedValue" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (lead) {
        // Update existing lead
        await axios.put(`http://localhost:5000/api/leads/${lead._id}`, formData);
      } else {
        // Create new lead
        await axios.post("http://localhost:5000/api/leads", formData);
      }
      
      onSave();
      // Reset form if creating new lead
      if (!lead) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          status: "New",
          estimatedValue: 0,
          notes: ""
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error saving lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lead-form-container">
      <h2>{lead ? "Edit Lead" : "Add New Lead"}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="lead-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter lead name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Follow Up">Follow Up</option>
              <option value="Appointment Booked">Appointment Booked</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="estimatedValue">Estimated Value ($)</label>
            <input
              type="number"
              id="estimatedValue"
              name="estimatedValue"
              value={formData.estimatedValue}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0"
            />
            {formData.status === "Converted" && (
              <small className="form-hint">
                Revenue will be auto-calculated when status is "Converted"
              </small>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Add any additional notes..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : lead ? "Update Lead" : "Create Lead"}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default LeadForm;
