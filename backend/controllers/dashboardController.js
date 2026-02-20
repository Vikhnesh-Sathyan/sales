const Lead = require("../models/Lead");

exports.getDashboardData = async (req, res) => {
  try {
    const range = parseInt(req.query.range) || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - range);

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
      .reduce((sum, lead) => sum + lead.revenue, 0);

    // Status Count
    const statusCounts = {};
    leads.forEach(lead => {
      statusCounts[lead.status] =
        (statusCounts[lead.status] || 0) + 1;
    });

    // Revenue by Date
    const revenueByDate = {};
    leads.forEach(lead => {
      if (lead.status === "Converted") {
        const date = lead.createdAt.toISOString().split("T")[0];
        revenueByDate[date] =
          (revenueByDate[date] || 0) + lead.revenue;
      }
    });

    res.json({
      kpis: {
        totalLeads,
        contactedLeads,
        salesClosed,
        totalRevenue
      },
      statusCounts,
      revenueByDate
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};