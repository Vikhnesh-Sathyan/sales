const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: {
    type: String,
    enum: [
      "New",
      "Contacted",
      "Follow Up",
      "Appointment Booked",
      "Converted",
      "Lost"
    ],
    required: true
  },
  revenue: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Lead", leadSchema);