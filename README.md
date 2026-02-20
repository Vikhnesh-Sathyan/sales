# Sales Dashboard - Full Stack Application

A full-stack sales dashboard web application for internal business monitoring. This application displays key performance metrics, visualizes sales trends, shows lead distribution, and allows basic data filtering.

## Features

### Dashboard
- **KPI Summary**: Displays Total Leads, Contacted Leads, Sales Closed, and Total Revenue
- **Lead Status Summary**: Table showing all lead statuses with counts
- **Sales Trend Chart**: Line chart showing revenue trends over time
- **Lead Status Distribution**: Pie chart displaying lead status distribution
- **Date Range Filter**: Filter data by Last 7 Days or Last 30 Days

### Lead Management (CRUD)
- **Create Leads**: Add new leads with name, email, phone, company, status, estimated value, and notes
- **Read/View Leads**: View all leads in a sortable, filterable table
- **Update Leads**: Edit lead information and change status directly from the table
- **Delete Leads**: Remove leads from the system
- **Search & Filter**: Search by name, email, company, or phone; filter by status
- **Bulk Operations**: Select multiple leads and update their status simultaneously
- **Auto Revenue Calculation**: Revenue is automatically calculated when a lead status changes to "Converted"
- **Auto Dashboard Update**: Dashboard automatically refreshes when leads are created, updated, or deleted

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- CORS
- JWT Authentication

### Frontend
- React
- Recharts (for data visualization)
- Axios (for API calls)
- CSS3
- React Router DOM

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
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
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

### Dashboard

#### GET `/api/dashboard`
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

### Leads

#### GET `/api/leads`
Get all leads with optional search and filter.

**Query Parameters:**
- `search` (optional): Search by name, email, company, or phone
- `status` (optional): Filter by lead status
- `sortBy` (optional): Field to sort by (default: "createdAt")
- `sortOrder` (optional): "asc" or "desc" (default: "desc")

#### GET `/api/leads/:id`
Get a single lead by ID.

#### POST `/api/leads`
Create a new lead.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-123-4567",
  "company": "Tech Corp",
  "status": "New",
  "estimatedValue": 5000,
  "notes": "Interested in our premium package"
}
```

#### PUT `/api/leads/:id`
Update an existing lead.

**Request Body:** (all fields optional)
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-123-4567",
  "company": "Tech Corp",
  "status": "Converted",
  "estimatedValue": 5000,
  "notes": "Successfully converted"
}
```

**Note:** When status is changed to "Converted", revenue is automatically calculated if not provided.

#### DELETE `/api/leads/:id`
Delete a lead.

#### PATCH `/api/leads/bulk-status`
Bulk update status for multiple leads.

**Request Body:**
```json
{
  "leadIds": ["id1", "id2", "id3"],
  "status": "Converted"
}
```

## Project Structure

```
sales/
├── backend/
│   ├── controllers/
│   │   └── dashboardController.js
├── middleware/
│       └── authMiddleware.js
├── controllers/
│       └── authController.js
├── routes/
│       └── authRoutes.js
├── models/
│       └── User.js
│       └── Lead.js
│── routes/
│     └── dashboardRoutes.js
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
- **Converted**: Successfully closed sales (revenue is auto-calculated)
- **Lost**: Lost opportunities

## Revenue Auto-Calculation

When a lead's status is changed to "Converted":
- If `revenue` is provided, it will be used
- If `revenue` is 0 or not provided, but `estimatedValue` exists, `estimatedValue` will be used as revenue
- If both are 0 or not provided, a random revenue between $1,000 and $16,000 will be assigned

This ensures that all converted leads have revenue data for accurate dashboard metrics.

## Development Notes

- The application is designed for a minimum resolution of 1366 × 768
- All dates are displayed in the user's local timezone
- Revenue is displayed in USD currency format
- The dashboard updates automatically when:
  - The date range filter is changed
  - Leads are created, updated, or deleted
  - Lead statuses are changed
- Status changes in the lead table trigger immediate dashboard refresh
- Search is debounced (300ms) for better performance

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
