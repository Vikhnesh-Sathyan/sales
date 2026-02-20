const Lead = require("../models/Lead");

// Get all leads with search and filter
exports.getAllLeads = async (req, res) => {
  try {
    const { search, status, sortBy = "createdAt", sortOrder = "desc" } = req.query;
    
    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }
    
    // Status filter
    if (status) {
      query.status = status;
    }
    
    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
    
    const leads = await Lead.find(query).sort(sortOptions);
    
    res.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get single lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    
    res.json(lead);
  } catch (error) {
    console.error("Error fetching lead:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Create new lead
exports.createLead = async (req, res) => {
  try {
    const { name, email, phone, company, status, estimatedValue, notes } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    
    const leadData = {
      name,
      email: email || "",
      phone: phone || "",
      company: company || "",
      status: status || "New",
      estimatedValue: estimatedValue || 0,
      notes: notes || "",
      revenue: 0
    };
    
    // Auto-calculate revenue if status is Converted
    if (leadData.status === "Converted") {
      leadData.revenue = leadData.estimatedValue > 0 
        ? leadData.estimatedValue 
        : Math.floor(Math.random() * 15000) + 1000;
    }
    
    const lead = await Lead.create(leadData);
    
    res.status(201).json(lead);
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update lead
exports.updateLead = async (req, res) => {
  try {
    const { name, email, phone, company, status, revenue, estimatedValue, notes } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (company !== undefined) updateData.company = company;
    if (status !== undefined) updateData.status = status;
    if (estimatedValue !== undefined) updateData.estimatedValue = estimatedValue;
    if (notes !== undefined) updateData.notes = notes;
    
    // Auto-calculate revenue when status changes to Converted
    if (status === "Converted") {
      if (revenue !== undefined && revenue > 0) {
        updateData.revenue = revenue;
      } else if (estimatedValue > 0) {
        updateData.revenue = estimatedValue;
      } else {
        // Get current lead to check existing revenue
        const currentLead = await Lead.findById(req.params.id);
        if (!currentLead || currentLead.revenue === 0) {
          updateData.revenue = Math.floor(Math.random() * 15000) + 1000;
        }
      }
    }
    
    updateData.updatedAt = new Date();
    
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    
    res.json(lead);
  } catch (error) {
    console.error("Error updating lead:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    
    res.json({ message: "Lead deleted successfully", lead });
  } catch (error) {
    console.error("Error deleting lead:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Bulk update status
exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { leadIds, status } = req.body;
    
    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return res.status(400).json({ message: "leadIds array is required" });
    }
    
    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }
    
    const updateData = { status, updatedAt: new Date() };
    
    // Auto-calculate revenue for converted leads
    if (status === "Converted") {
      const leads = await Lead.find({ _id: { $in: leadIds } });
      const bulkOps = leads.map(lead => {
        const revenue = lead.revenue > 0 
          ? lead.revenue 
          : (lead.estimatedValue > 0 
            ? lead.estimatedValue 
            : Math.floor(Math.random() * 15000) + 1000);
        
        return {
          updateOne: {
            filter: { _id: lead._id },
            update: { ...updateData, revenue }
          }
        };
      });
      
      await Lead.bulkWrite(bulkOps);
    } else {
      await Lead.updateMany(
        { _id: { $in: leadIds } },
        updateData
      );
    }
    
    const updatedLeads = await Lead.find({ _id: { $in: leadIds } });
    res.json({ message: "Leads updated successfully", leads: updatedLeads });
  } catch (error) {
    console.error("Error bulk updating leads:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
