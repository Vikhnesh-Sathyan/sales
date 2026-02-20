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

      const estimatedValue = Math.floor(Math.random() * 20000) + 500;
      const revenue = status === "Converted"
        ? Math.floor(Math.random() * 15000) + 1000
        : 0;

      // Generate realistic names and contact info
      const firstNames = ["John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Jessica", "William", "Ashley", "James", "Amanda", "Christopher", "Melissa", "Daniel", "Michelle"];
      const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson", "Thomas", "Taylor"];
      const companies = ["Tech Corp", "Digital Solutions", "Innovate Inc", "Global Systems", "Future Tech", "Smart Solutions", "Cloud Services", "Data Analytics", "Software Plus", "Tech Innovations"];
      
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${companies[Math.floor(Math.random() * companies.length)].toLowerCase().replace(/\s+/g, '')}.com`;
      const phone = `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
      const company = companies[Math.floor(Math.random() * companies.length)];

      leads.push({
        name,
        email,
        phone,
        company,
        status,
        estimatedValue,
        revenue,
        notes: status === "Converted" ? "Successfully converted lead" : "",
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