# Sales Dashboard - Full Stack Application

A full-stack sales dashboard web application for internal business monitoring. This application displays key performance metrics, visualizes sales trends, shows lead distribution, and allows basic data filtering.

## Features

- **KPI Summary**: Displays Total Leads, Contacted Leads, Sales Closed, and Total Revenue
- **Lead Status Summary**: Table showing all lead statuses with counts
- **Sales Trend Chart**: Line chart showing revenue trends over time
- **Lead Status Distribution**: Pie chart displaying lead status distribution
- **Date Range Filter**: Filter data by Last 7 Days or Last 30 Days

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- CORS

### Frontend
- React
- Recharts (for data visualization)
- Axios (for API calls)
- CSS3

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/sales-dashboard
PORT=5000
```

For MongoDB Atlas, use:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sales-dashboard
PORT=5000
```

4. Seed the database with sample data:
```bash
node seed.js
```

5. Start the backend server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### 2. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### GET `/api/dashboard`
Returns dashboard data for the specified date range.

**Query Parameters:**
- `days` (optional): Number of days to look back (default: 7)
  - Options: 7 (Last 7 Days) or 30 (Last 30 Days)

**Response:**
```json
{
  "kpis": {
    "totalLeads": 150,
    "contactedLeads": 30,
    "salesClosed": 25,
    "totalRevenue": 250000
  },
  "statusCounts": {
    "New": 40,
    "Contacted": 30,
    "Follow Up": 25,
    "Appointment Booked": 20,
    "Converted": 25,
    "Lost": 10
  },
  "revenueByDate": {
    "2024-01-01": 5000,
    "2024-01-02": 7500,
    ...
  }
}
```

## Project Structure

```
sales/
├── backend/
│   ├── controllers/
│   │   └── dashboardController.js
│   ├── models/
│   │   └── Lead.js
│   ├── routes/
│   │   └── dashboardRoutes.js
│   ├── seed.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DateFilter.js
│   │   │   ├── KPICards.js
│   │   │   ├── SalesTrendChart.js
│   │   │   ├── StatusPieChart.js
│   │   │   └── StatusTable.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── README.md
```

## Lead Statuses

The application tracks the following lead statuses:
- **New**: Newly created leads
- **Contacted**: Leads that have been contacted
- **Follow Up**: Leads requiring follow-up
- **Appointment Booked**: Leads with scheduled appointments
- **Converted**: Successfully closed sales
- **Lost**: Lost opportunities

## Development Notes

- The application is designed for a minimum resolution of 1366 × 768
- All dates are displayed in the user's local timezone
- Revenue is displayed in USD currency format
- The dashboard updates automatically when the date range filter is changed

## Troubleshooting

### Backend Issues
- Ensure MongoDB is running (if using local installation)
- Check that the `.env` file exists and has the correct `MONGO_URI`
- Verify the port 5000 is not already in use

### Frontend Issues
- Ensure the backend server is running on port 5000
- Check browser console for CORS errors
- Verify API endpoint URL in `App.js`

### Database Issues
- Run `node seed.js` again to reset and populate the database
- Check MongoDB connection string in `.env` file

## License

This project is created for assignment purposes.
