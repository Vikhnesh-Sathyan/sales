const mongoose = require("mongoose");
const Lead = require("./models/Lead");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected for Seeding"));

const statuses = [
  "New",
  "Contacted",
  "Follow Up",
  "Appointment Booked",
  "Converted",
  "Lost"
];

async function seedData() {
  try {
    await Lead.deleteMany(); // Clear old data

    const leads = [];
    const now = new Date();

    // Create leads with better distribution across dates and statuses
    for (let i = 1; i <= 150; i++) {
      // Distribute statuses more realistically
      // More "New" and "Contacted" leads, fewer "Converted"
      let status;
      const rand = Math.random();
      if (rand < 0.25) {
        status = "New";
      } else if (rand < 0.45) {
        status = "Contacted";
      } else if (rand < 0.60) {
        status = "Follow Up";
      } else if (rand < 0.75) {
        status = "Appointment Booked";
      } else if (rand < 0.90) {
        status = "Converted";
      } else {
        status = "Lost";
      }

      // Distribute dates over the last 30 days, with more recent dates having more leads
      // Using Math.random() * Math.random() creates a bias towards more recent dates
      const daysAgo = Math.floor(Math.random() * Math.random() * 30);
      const createdAt = new Date(now);
      createdAt.setDate(createdAt.getDate() - daysAgo);
      createdAt.setHours(
        Math.floor(Math.random() * 24),
        Math.floor(Math.random() * 60),
        0,
        0
      );
      
      // Ensure date is not in the future
      if (createdAt > now) {
        createdAt.setTime(now.getTime());
      }

      const revenue = status === "Converted"
        ? Math.floor(Math.random() * 15000) + 1000
        : 0;

      leads.push({
        name: `Lead ${i}`,
        status,
        revenue,
        createdAt
      });
    }

    await Lead.insertMany(leads);

    console.log("✅ 150 Leads Inserted Successfully");
    console.log("📊 Data distribution:");
    const counts = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    counts.forEach(item => {
      console.log(`   ${item._id}: ${item.count}`);
    });
    process.exit();

  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seedData();