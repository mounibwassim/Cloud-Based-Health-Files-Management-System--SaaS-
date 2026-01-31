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
## API Endpoints
- `GET /api/states`: List all states.
- `GET /api/states/:id`: Get state details.
- `GET /api/states/:stateId/files/:fileType/records`: Get records.
- `POST /api/records`: Create record.
- `PUT /api/records/:id`: Update record.
- `DELETE /api/records/:id`: Delete record.
- `GET /api/export`: Export CSV.
