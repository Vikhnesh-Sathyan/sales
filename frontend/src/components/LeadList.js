import React, { useState, useEffect } from "react";
import axios from "axios";
import LeadForm from "./LeadForm";
import StatusBadge from "./StatusBadge";
import DeleteConfirmModal from "./DeleteConfirmModal";

function LeadList({ onStatusChange }) {
  const [leads, setLeads] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [selectedLeads, setSelectedLeads] = useState([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    leadId: null,
    leadName: "",
    isBulk: false,
    count: 0
  });

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchLeads();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);
      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);

      const res = await axios.get(`http://localhost:5000/api/leads?${params}`);
      setAllLeads(res.data);
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(allLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLeads = allLeads.slice(startIndex, endIndex);

  const handleDeleteClick = (id, name) => {
    setDeleteModal({
      isOpen: true,
      leadId: id,
      leadName: name,
      isBulk: false,
      count: 0
    });
  };

  const handleBulkDeleteClick = () => {
    if (selectedLeads.length === 0) {
      alert("Please select at least one lead");
      return;
    }
    setDeleteModal({
      isOpen: true,
      leadId: null,
      leadName: "",
      isBulk: true,
      count: selectedLeads.length
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      if (deleteModal.isBulk) {
        // Bulk delete
        for (const id of selectedLeads) {
          await axios.delete(`http://localhost:5000/api/leads/${id}`);
        }
        setSelectedLeads([]);
      } else {
        // Single delete
        await axios.delete(`http://localhost:5000/api/leads/${deleteModal.leadId}`);
      }
      
      setDeleteModal({ isOpen: false, leadId: null, leadName: "", isBulk: false, count: 0 });
      fetchLeads();
      if (onStatusChange) onStatusChange();
      
      // Adjust page if needed
      if (!deleteModal.isBulk && paginatedLeads.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      alert("Error deleting lead(s)");
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
    if (selectedLeads.length === paginatedLeads.length) {
      // Deselect all on current page
      setSelectedLeads(selectedLeads.filter(id => !paginatedLeads.some(lead => lead._id === id)));
    } else {
      // Select all on current page
      const pageIds = paginatedLeads.map(lead => lead._id);
      setSelectedLeads([...new Set([...selectedLeads, ...pageIds])]);
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
            className="btn btn-danger"
            onClick={handleBulkDeleteClick}
          >
            Delete Selected
          </button>
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
      ) : allLeads.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No leads found</h3>
          <p>
            {searchTerm || statusFilter
              ? "Try adjusting your search or filter criteria."
              : "Create your first lead to get started!"}
          </p>
          {!searchTerm && !statusFilter && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              + Add New Lead
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="lead-table-container">
            <div className="table-header-info">
              <span>
                Showing {startIndex + 1}-{Math.min(endIndex, allLeads.length)} of {allLeads.length} lead(s)
              </span>
              <div className="items-per-page">
                <label>Items per page:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="items-per-page-select"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
            <table className="lead-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedLeads.length === paginatedLeads.length && paginatedLeads.length > 0}
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
                {paginatedLeads.map((lead) => (
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
                      <StatusBadge
                        status={lead.status}
                        editable={true}
                        onChange={(newStatus) => handleStatusChange(lead._id, newStatus)}
                      />
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
                          onClick={() => handleDeleteClick(lead._id, lead.name)}
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

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                ««
              </button>
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ‹
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show first page, last page, current page, and pages around current
                  return (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  );
                })
                .map((page, index, array) => {
                  // Add ellipsis if there's a gap
                  const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                  return (
                    <React.Fragment key={page}>
                      {showEllipsisBefore && <span className="pagination-ellipsis">...</span>}
                      <button
                        className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}
              
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                ›
              </button>
              <button
                className="pagination-btn"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                »»
              </button>
            </div>
          )}
        </>
      )}

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, leadId: null, leadName: "", isBulk: false, count: 0 })}
        onConfirm={handleDeleteConfirm}
        leadName={deleteModal.leadName}
        isBulk={deleteModal.isBulk}
        count={deleteModal.count}
      />
    </div>
  );
}

export default LeadList;
