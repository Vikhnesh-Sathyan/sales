const Lead = require("../models/Lead");

exports.getDashboardData = async (req, res) => {
  try {
    // Accept both 'days' and 'range' query parameters
    const range = parseInt(req.query.days) || parseInt(req.query.range) || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - range);
    startDate.setHours(0, 0, 0, 0); // Start of day

    const leads = await Lead.find({
      createdAt: { $gte: startDate }
    });

    // KPI
    const totalLeads = leads.length;

    const contactedLeads = leads.filter(
      lead => lead.status === "Contacted"
    ).length;

    const salesClosed = leads.filter(
      lead => lead.status === "Converted"
    ).length;

    const totalRevenue = leads
      .filter(lead => lead.status === "Converted")
      .reduce((sum, lead) => sum + (lead.revenue || 0), 0);

    // Status Count - initialize all statuses
    const allStatuses = [
      "New",
      "Contacted",
      "Follow Up",
      "Appointment Booked",
      "Converted",
      "Lost"
    ];
    const statusCounts = {};
    allStatuses.forEach(status => {
      statusCounts[status] = 0;
    });
    leads.forEach(lead => {
      if (statusCounts.hasOwnProperty(lead.status)) {
        statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1;
      }
    });

    // Revenue by Date - ensure all dates in range are included
    const revenueByDate = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Initialize all dates in range with 0 revenue
    for (let i = 0; i < range; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      revenueByDate[dateStr] = 0;
    }

    // Add actual revenue data
    leads.forEach(lead => {
      if (lead.status === "Converted") {
        const date = new Date(lead.createdAt);
        date.setHours(0, 0, 0, 0);
        const dateStr = date.toISOString().split("T")[0];
        if (revenueByDate.hasOwnProperty(dateStr)) {
          revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + (lead.revenue || 0);
        }
      }
    });

    // Sort revenueByDate by date
    const sortedRevenueByDate = {};
    Object.keys(revenueByDate)
      .sort()
      .forEach(key => {
        sortedRevenueByDate[key] = revenueByDate[key];
      });

    res.json({
      kpis: {
        totalLeads,
        contactedLeads,
        salesClosed,
        totalRevenue
      },
      statusCounts,
      revenueByDate: sortedRevenueByDate
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};