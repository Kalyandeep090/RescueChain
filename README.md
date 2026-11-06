# RescueChain - Full-Stack Emergency Coordination Platform

RescueChain is a cloud-based real-time emergency coordination platform designed for crowd disaster management, specifically tailored for Indian mass gatherings.

## Features
- **Real-Time Map Dashboard**: Instant alerting using Indian geo-coordinates.
- **Automated Severity Classification**: NLP-based heuristic classification of incident severity (Critical, High, Medium, Low).
- **Role-Based Workflows**: Separate functionalities for Command Center Admin, Police, Medical, and Volunteers.
- **Full-Stack Architecture**: Node.js/Express backend communicating with a React.js (Vite) frontend.
- **Premium UI**: Clean, modern White + Red emergency response theme.

## Project Structure
- `/frontend` - React.js (Vite) application
- `/backend` - Node.js + Express REST API

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Node.js server:
   ```bash
   npm start
   # Or for development: node server.js
   ```
   The backend will run on `http://localhost:5000`.

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

### 3. Usage
- Open `http://localhost:5173` in your browser.
- Navigate to the **Live Map** to click and create a new incident. 
- Ensure both the backend and frontend servers are running simultaneously so the frontend can `fetch` data from the backend's REST API.

## Real-Time "Mock" Mode
Currently, the application runs in a local mock-mode, utilizing an in-memory database on the backend and polling on the frontend to simulate real-time synchronization without requiring actual Firebase Service Account credentials.
