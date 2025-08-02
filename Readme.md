# CivicTrack

CivicTrack empowers citizens to easily report local issues (road damage, garbage, water leaks, etc.), track their resolution, and engage with their community. Only issues within a 3-5 km radius are visible to users, based on GPS or manual location.

## Features

- **Quick Issue Reporting:** Title, description, photos (up to 3-5), category selection, anonymous or verified reporting.
- **Supported Categories:**
  - Roads (potholes, obstructions)
  - Lighting (broken/flickering lights)
  - Water Supply (leaks, low pressure)
  - Cleanliness (overflowing bins, garbage)
  - Public Safety (open manholes, exposed wiring)
  - Obstructions (fallen trees, debris)
- **Map View:** See all issues as pins on a map, filter by status, category, and distance.
- **Status Tracking:** Issue detail pages show status change logs and timestamps.
- **Notifications:** Reporters get notified when issue status is updated.
- **Spam Control:** Flag spam/irrelevant reports; auto-hide after multiple flags.
- **Admin Tools:** Review flagged issues, analytics, ban users.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Authentication:** JWT-based
- **Geospatial:** MongoDB 2dsphere for location-based queries

## Folder Structure

```
Civic_Track/
  backend/
    Controllers/
    Middlewares/
    Models/
    Routes/
    package.json
    server.js
    .env
  frontend/
    public/
    src/
      components/
      assets/
      App.jsx
      main.jsx
    package.json
    vite.config.js
    index.html
```

## Setup Instructions

### Backend

1. `cd backend`
2. `npm install`
3. Create a `.env` file with:
   ```
   PORT=8080
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. `npm start`

### Frontend

1. `cd frontend`
2. `npm install`
3. `npm run dev`

## API Endpoints

- `POST /auth/login` — User login
- `POST /auth/register` — User registration
- `POST /issues` — Report a new issue
- `GET /issues` — List issues (with filters)
- `GET /issues/:id` — Get issue details
- `PATCH /issues/:id/status` — Update issue status
- `POST /issues/:id/flag` — Flag an issue

## Testing

Use Postman or Thunder Client to test API endpoints. See example JSON payloads in the documentation or code comments.

---
