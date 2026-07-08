# 🏙️ CivicMind AI

**AI-Powered Civic Issue Management Platform**

CivicMind AI is a full-stack civic issue reporting and management platform that connects **Citizens, Government Officials, and Administrators** through a centralized digital system.

The platform allows citizens to report civic problems, uses AI to automatically classify issues and determine urgency levels, enables administrators to assign issues to officials, and provides transparent status tracking throughout the issue lifecycle.

---

## 🌐 Live Application

### Frontend
https://civic-mind-ai-nine.vercel.app

### Backend API
https://civicmind-ai-xuhf.onrender.com

> Note: The backend is hosted on Render and may take a short time to wake up after inactivity.

---

## ✨ Key Features

### 👤 Citizen Features

- Secure account registration and login
- Report civic issues
- Add issue title, description, and address
- AI-powered automatic issue categorization
- AI-powered urgency detection
- View personal reported issues
- Track issue status
- View detailed issue information
- View complete status history
- View assignment activity
- Consistent India Standard Time display

### 🏛️ Official Features

- Secure role-based login
- View assigned civic issues
- Search and filter issues
- Filter by status
- Filter by urgency
- Filter by category
- Update issue status
- Add official remarks
- Track issue progress
- View issue history and assignment timeline

### 🛡️ Admin Features

- Dedicated Admin Dashboard
- View platform analytics
- Monitor total users
- Monitor total issues
- Track assigned issues
- Track unassigned issues
- View issue status distribution
- View official workload
- Search users by name or email
- Filter users by role
- View Admin, Official, and Citizen accounts
- Change user roles
- Assign issues to officials
- Reassign issues when required
- Monitor issue lifecycle

---

## 🤖 AI-Powered Issue Classification

CivicMind AI integrates the **Google Gemini API** to analyze citizen issue reports.

Based on the issue title and description, the AI automatically predicts:

- **Category**
- **Urgency Level**

Example categories may include:

- Roads
- Water Supply
- Electricity
- Sanitation
- Drainage
- Street Lights
- Waste Management
- Public Safety
- Other Civic Issues

Urgency levels:

- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`

This reduces manual classification work and helps prioritize important civic problems.

---

## 🔐 Authentication and Authorization

The application uses **JWT-based authentication** with Spring Security.

Supported roles:

| Role | Access |
|------|--------|
| `CITIZEN` | Report and track personal civic issues |
| `OFFICIAL` | Manage assigned issues and update status |
| `ADMIN` | Manage users, roles, analytics, and assignments |

Passwords are securely stored using password hashing and are never returned in API responses.

---

## 📊 Admin Analytics Dashboard

The Admin Dashboard provides a centralized view of platform activity.

Available analytics include:

- Total registered users
- Total civic issues
- Assigned issues
- Unassigned issues
- Pending issues
- In-progress issues
- Resolved issues
- Rejected issues
- Issue status distribution
- Official workload

The dashboard includes interactive visualizations using **Recharts**.

---

## 🔎 Search and Filtering

The platform includes advanced search and filtering capabilities.

### Issue Filters

- Search by title
- Search by description
- Search by address
- Search by reporter
- Search by assigned official
- Filter by status
- Filter by urgency
- Filter by category

### User Management Filters

- Search by full name
- Search by email
- All Users
- Admins
- Officials
- Citizens

---

## 🕒 Consistent Date and Time

The frontend uses a centralized date-time utility to maintain consistent timestamps throughout the website.

Timezone:

```text
Asia/Kolkata
```

Example format:

```text
08 Jul 2026, 10:45 AM
```

This format is used across:

- Admin Dashboard
- Citizen issue pages
- Official dashboards
- Issue cards
- Issue details
- Status history
- Assignment history

---

## 🧰 Technology Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Axios
- React Router
- Recharts

### Backend

- Java
- Spring Boot
- Spring Security
- Spring Data MongoDB
- JWT Authentication
- Maven
- Lombok

### Database

- MongoDB Atlas

### AI Integration

- Google Gemini API

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Source Code: GitHub

---

## 🏗️ Project Architecture

```text
Civic-AI/
│
├── backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/
│           │       └── civicmind/
│           │           ├── config/
│           │           ├── controller/
│           │           ├── dto/
│           │           ├── model/
│           │           │   ├── entity/
│           │           │   └── enums/
│           │           ├── repository/
│           │           ├── security/
│           │           └── service/
│           │
│           └── resources/
│               └── application.yml
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🔄 Issue Lifecycle

A typical civic issue follows this workflow:

```text
Citizen Reports Issue
        ↓
Gemini AI Analyzes Report
        ↓
Category Automatically Assigned
        ↓
Urgency Automatically Assigned
        ↓
Issue Created as PENDING
        ↓
Admin Reviews Issue
        ↓
Admin Assigns Official
        ↓
Official Updates Status
        ↓
IN_PROGRESS
        ↓
RESOLVED or REJECTED
```

The platform maintains status and assignment history for transparency.

---

## 📌 Issue Status Types

```text
PENDING
IN_PROGRESS
RESOLVED
REJECTED
```

---

## 📜 Activity Timeline

Each issue can maintain a combined timeline containing:

- Status updates
- Official assignments
- Reassignments
- Official remarks
- User responsible for changes
- Date and time of activity

Example:

```text
PENDING
   ↓
ASSIGNED
   ↓
IN_PROGRESS
   ↓
REASSIGNED
   ↓
RESOLVED
```

---

## ⚙️ Environment Variables

### Backend Environment Variables

The deployed backend requires:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
AI_MODEL=gemini-2.5-flash

FRONTEND_URL=https://civic-mind-ai-nine.vercel.app

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

OFFICIAL_EMAIL=your_official_email
OFFICIAL_PASSWORD=your_official_password
```

> Never commit real environment variable values, API keys, database credentials, or passwords to GitHub.

### Frontend Environment Variable

```env
VITE_API_BASE_URL=https://civicmind-ai-xuhf.onrender.com
```

---

## 🚀 Run Locally

### Prerequisites

Install:

- Java
- Maven
- Node.js
- npm
- Git

You also need:

- MongoDB Atlas database
- Google Gemini API key

---

## ▶️ Run the Backend

Navigate to:

```bash
cd backend
```

Set the required environment variables for your system.

Then run:

```bash
mvn spring-boot:run
```

The backend uses the configured server port from `application.yml`.

---

## ▶️ Run the Frontend

Navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a local `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3188
```

Start the development server:

```bash
npm run dev
```

---

## 🔗 API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Issues

```text
GET    /api/issues
GET    /api/issues/{id}
GET    /api/issues/my
GET    /api/issues/assigned-to-me
GET    /api/issues/status/{status}
POST   /api/issues
PATCH  /api/issues/{id}/status
PATCH  /api/issues/{id}/assign
DELETE /api/issues/{id}
```

### Admin

```text
GET   /api/admin/users
GET   /api/admin/analytics
GET   /api/admin/officials
PATCH /api/admin/users/{id}/role
```

---

## ☁️ Deployment

### Frontend Deployment

The React/Vite frontend is deployed on Vercel.

Configuration:

```text
Root Directory: frontend
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Backend Deployment

The Spring Boot backend is deployed on Render using container-based deployment.

### Database

MongoDB Atlas is used as the cloud database.

---

## 🔒 Security Practices

- JWT authentication
- Role-based authorization
- Password hashing
- Protected backend routes
- Axios JWT interceptor
- Environment-based secrets
- CORS configuration
- Unique email indexing
- Sensitive password fields excluded from JSON responses

---

## 🌍 Real-World Use Cases

CivicMind AI can support civic issue management for:

- Municipal corporations
- Smart cities
- Local government bodies
- Ward-level administration
- College campuses
- Residential communities
- Public infrastructure teams
- Citizen grievance platforms

---

## 🔮 Future Enhancements

Potential future improvements:

- Image upload for civic issues
- GPS-based location tracking
- Interactive issue maps
- Email notifications
- SMS notifications
- Push notifications
- Citizen voting and issue upvoting
- Duplicate issue detection
- AI-generated issue summaries
- Multilingual reporting
- Mobile application
- SLA tracking
- Department-based official assignment
- Real-time notifications
- Advanced analytics
- Public transparency dashboard

---

## 👨‍💻 Developer

**Kothinti Tharun**

B.Tech Computer Science and Engineering Graduate

Interests:

- Full-Stack Development
- Artificial Intelligence
- Machine Learning
- Data Analytics

---

## 📄 License

This project is developed for educational, portfolio, and demonstration purposes.

---

## ⭐ Support

If you find this project useful, consider giving the repository a star.

---

<p align="center">
  Built with React, Spring Boot, MongoDB, and Gemini AI
</p>

<p align="center">
  <strong>CivicMind AI — Smarter Civic Issue Management Through AI</strong>
</p>