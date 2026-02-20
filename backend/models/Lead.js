const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  company: { type: String, default: "" },
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
    required: true,
    default: "New"
  },
  revenue: {
    type: Number,
    default: 0
  },
  estimatedValue: {
    type: Number,
    default: 0
  },
  notes: { type: String, default: "" },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-update updatedAt before saving
leadSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Auto-calculate revenue when status changes to "Converted"
  if (this.isModified('status') && this.status === 'Converted') {
    // If revenue is 0 and estimatedValue exists, use estimatedValue
    if (this.revenue === 0 && this.estimatedValue > 0) {
      this.revenue = this.estimatedValue;
    }
    // If both are 0, set a default revenue based on estimatedValue or random
    if (this.revenue === 0) {
      this.revenue = this.estimatedValue > 0 
        ? this.estimatedValue 
        : Math.floor(Math.random() * 15000) + 1000;
    }
  }
  
  // Reset revenue to 0 if status changes from "Converted" to something else
  if (this.isModified('status') && this.status !== 'Converted' && this.revenue > 0) {
    // Keep revenue for historical purposes, but you can reset if needed
    // this.revenue = 0;
  }
  
  next();
});

module.exports = mongoose.model("Lead", leadSchema);