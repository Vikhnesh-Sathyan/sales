const express = require("express");
const router = express.Router();
const {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  bulkUpdateStatus
} = require("../controllers/leadController");
const { protect } = require("../middleware/auth");

// Protect all routes
router.use(protect);

router.get("/", getAllLeads);
router.get("/:id", getLeadById);
router.post("/", createLead);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);
router.patch("/bulk-status", bulkUpdateStatus);

module.exports = router;
