# Sales Dashboard - Full Stack Application

A full-stack sales dashboard web application for internal business monitoring with JWT authentication. This application displays key performance metrics, visualizes sales trends, shows lead distribution, and provides comprehensive lead management capabilities.

## Features

### Authentication (JWT-based)
- **User Registration**: Create a new account with name, email, and password
- **User Login**: Secure login with JWT (JSON Web Token) authentication
- **JWT Token Management**: Tokens are automatically stored in localStorage and included in API requests
- **Protected Routes**: All dashboard and lead management routes require JWT authentication
- **Session Management**: Automatic token storage and management
- **Auto-logout**: Automatic logout on token expiration (default: 7 days)

### Dashboard
- **KPI Summary**: Displays Total Leads, Contacted Leads, Sales Closed, and Total Revenue
- **Lead Status Summary**: Table showing all lead statuses with counts
- **Sales Trend Chart**: Line chart showing revenue trends over time
- **Lead Status Distribution**: Pie chart displaying lead status distribution
- **Date Range Filter**: Filter data by Last 7 Days or Last 30 Days
- **Real-time Updates**: Dashboard automatically refreshes when data changes

### Lead Management (CRUD)
- **Create Leads**: Add new leads with name, email, phone, company, status, estimated value, and notes
- **Read/View Leads**: View all leads in a sortable, filterable table with pagination
- **Update Leads**: Edit lead information and change status directly from the table
- **Delete Leads**: Remove leads from the system with confirmation modal
- **Search & Filter**: 
  - Real-time search by name, email, company, or phone
  - Filter by status (New, Contacted, Follow Up, Appointment Booked, Converted, Lost)
  - Sort by date, name, status, or revenue
- **Bulk Operations**: Select multiple leads and update their status simultaneously
- **Colored Status Badges**: Visual status indicators with color coding:
  - New → Blue
  - Contacted → Green
  - Follow Up → Orange
  - Appointment Booked → Light Blue
  - Converted → Dark Green
  - Lost → Red
- **Pagination**: Navigate through leads with configurable items per page (5, 10, 20, 50)
- **Auto Revenue Calculation**: Revenue is automatically calculated when a lead status changes to "Converted"
- **Auto Dashboard Update**: Dashboard automatically refreshes when leads are created, updated, or deleted

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- **JWT (JSON Web Tokens)** - Used for secure authentication and authorization
- **jsonwebtoken** - JWT token generation and verification library
- **bcryptjs** - Password hashing for secure password storage
- CORS

### Frontend
- React
- React Router for navigation
- **JWT Token Management** - Automatic token storage and API request headers
- Recharts (for data visualization)
- Axios (for API calls with JWT token injection)
- Context API for authentication state management
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
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

For MongoDB Atlas, use:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/sales-dashboard
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

**Important:** 
- **JWT_SECRET**: Replace with a strong, random string for production use
- This secret is used to sign and verify JWT tokens
- You can generate a secure secret using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- **JWT_EXPIRE**: Token expiration time (default: 7d = 7 days)

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

## Usage

1. **Register/Login (JWT Authentication)**: 
   - First-time users should register at `/register`
   - Existing users can login at `/login`
   - After successful authentication, a JWT token is stored in your browser
   - The JWT token is automatically included in all API requests
   - After successful authentication, you'll be redirected to the dashboard

2. **Dashboard**: 
   - View key performance metrics
   - Filter data by date range (7 or 30 days)
   - View sales trends and lead distribution charts

3. **Lead Management**:
   - Click "Lead Management" tab to view all leads
   - Use search bar to find specific leads
   - Filter by status using the dropdown
   - Click "Add New Lead" to create a new lead
   - Click edit icon (✏️) to modify a lead
   - Click delete icon (🗑️) to remove a lead (with confirmation)
   - Change status directly from the table using the colored badge dropdown
   - Select multiple leads for bulk operations

## API Endpoints

### Authentication (JWT-based)

All authentication endpoints return a JWT token upon successful authentication. This token must be included in the `Authorization` header for protected routes.

#### POST `/api/auth/register`
Register a new user. Returns a JWT token upon successful registration.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/api/auth/login`
Login user. Returns a JWT token upon successful login.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### GET `/api/auth/me`
Get current authenticated user (requires JWT authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Note:** This endpoint validates the JWT token and returns the authenticated user's information.

### Dashboard

#### GET `/api/dashboard`
Returns dashboard data for the specified date range.

**Note:** Requires JWT authentication. Include JWT token in Authorization header.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

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

**Note:** All lead endpoints require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

**JWT Token Format:** The token is obtained from `/api/auth/login` or `/api/auth/register` endpoints and must be included in all requests to lead endpoints.

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
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   └── leadController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Lead.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── leadRoutes.js
│   ├── seed.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── DateFilter.js
│   │   │   ├── DeleteConfirmModal.js
│   │   │   ├── KPICards.js
│   │   │   ├── LeadForm.js
│   │   │   ├── LeadList.js
│   │   │   ├── Login.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── Register.js
│   │   │   ├── SalesTrendChart.js
│   │   │   ├── StatusBadge.js
│   │   │   ├── StatusPieChart.js
│   │   │   └── StatusTable.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── README.md
```

## Lead Statuses

The application tracks the following lead statuses with color-coded badges:
- **New**: Newly created leads (Blue)
- **Contacted**: Leads that have been contacted (Green)
- **Follow Up**: Leads requiring follow-up (Orange)
- **Appointment Booked**: Leads with scheduled appointments (Light Blue)
- **Converted**: Successfully closed sales (Dark Green)
- **Lost**: Lost opportunities (Red)

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
- **JWT Authentication**: 
  - JWT tokens are automatically stored in browser localStorage after login/register
  - Tokens are automatically included in all API requests via axios interceptors
  - Tokens expire after 7 days (configurable via `JWT_EXPIRE` in `.env`)
  - Invalid or expired tokens automatically redirect to login page
- The dashboard updates automatically when:
  - The date range filter is changed
  - Leads are created, updated, or deleted
  - Lead statuses are changed
- Status changes in the lead table trigger immediate dashboard refresh
- Search is debounced (300ms) for better performance

## Troubleshooting

### Backend Issues
- Ensure MongoDB is running (if using local installation)
- Check that the `.env` file exists and has the correct `MONGO_URI` and `JWT_SECRET`
- Verify the port 5000 is not already in use
- Make sure all dependencies are installed: `npm install`

### Frontend Issues
- Ensure the backend server is running on port 5000
- Check browser console for CORS errors
- Verify API endpoint URL in components
- Clear browser cache and localStorage if authentication issues occur
- Make sure all dependencies are installed: `npm install`

### Database Issues
- Run `node seed.js` again to reset and populate the database
- Check MongoDB connection string in `.env` file
- Verify MongoDB is accessible

### Authentication Issues (JWT)
- Ensure `JWT_SECRET` is set in `.env` file (required for JWT token signing)
- Check that JWT token is being sent in Authorization header: `Authorization: Bearer <token>`
- Verify JWT token hasn't expired (default: 7 days, configurable via `JWT_EXPIRE`)
- Clear localStorage and login again if JWT token is invalid or expired
- Check browser console for JWT-related errors
- Ensure backend server has restarted after adding `JWT_SECRET` to `.env`

## Security Notes

- **JWT_SECRET**: Use a strong, random secret key in production (minimum 32 characters recommended)
  - Never commit `JWT_SECRET` to version control
  - Use different secrets for development and production environments
- **JWT Tokens**: 
  - Tokens are signed using the `JWT_SECRET` to prevent tampering
  - Tokens contain user ID and expiration time
  - Tokens expire after 7 days (configurable via `JWT_EXPIRE`)
  - Tokens are stored in browser localStorage (consider httpOnly cookies for enhanced security in production)
- **Password Hashing**: Passwords are hashed using bcryptjs before storage
- **Protected Routes**: All sensitive endpoints require valid JWT authentication
- **CORS**: Configured for development; adjust allowed origins for production

## License

This project is created for assignment purposes.
