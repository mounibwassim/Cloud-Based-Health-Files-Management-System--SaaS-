# Health Files Management System (Algeria)

A full-stack web application to manage health files for 60 Algerian states.
Built with React (Frontend), Node.js/Express (Backend), and PostgreSQL.

## Project Structure
- `frontend/`: React + Tailwind CSS client.
- `backend/`: Node.js + Express API server.
- `deployment/`: Database schema and seed SQL files.

## Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)

## Setup & Running Locally

### 1. Database Setup
1. Create a PostgreSQL database (e.g., `health_files_db`).
2. Run the schema migration:
   ```bash
   psql -U postgres -d health_files_db -f deployment/schema.sql
   ```
3. Seed the initial data (States 1-60, File Types):
   ```bash
   psql -U postgres -d health_files_db -f deployment/seed.sql
   ```
4. Verify data:
   ```sql
   SELECT count(*) FROM states; -- Should be 60
   ```

### 2. Backend Setup
1. Navigate to backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment:
   Update `.env` file if your database credentials differ:
   ```
   DATABASE_URL=postgres://postgres:password@localhost:5432/health_files_db
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm start
   ```
   API will run at `http://localhost:5000`.

### 3. Frontend Setup
1. Navigate to frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   App will run at `http://localhost:5173`.

## Features
- **States List**: Grid view of all 60 states.
- **State Details**: Access to Surgery, IVF, Eye, and Labs files.
- **Records Management**: Table view with Search, Sort by Date, and Pagination.
- **CRUD**: Add, Edit, Delete records safely.
- **Export**: Download CSV of records for any file type.
- **Localization**: Dates displayed in `Asia/Kuala_Lumpur` timezone (as requested).

## API Endpoints
- `GET /api/states`: List all states.
- `GET /api/states/:id`: Get state details.
- `GET /api/states/:stateId/files/:fileType/records`: Get records.
- `POST /api/records`: Create record.
- `PUT /api/records/:id`: Update record.
- `DELETE /api/records/:id`: Delete record.
- `GET /api/export`: Export CSV.
