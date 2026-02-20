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

    for (let i = 1; i <= 100; i++) {

      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      await Lead.create({
        name: `Lead ${i}`,
        status: randomStatus,
        revenue: randomStatus === "Converted"
          ? Math.floor(Math.random() * 10000) + 1000
          : 0,
        createdAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        )
      });
    }

    console.log("✅ 100 Leads Inserted Successfully");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedData();