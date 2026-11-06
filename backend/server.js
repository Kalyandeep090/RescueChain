const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const alertRoutes = require('./routes/alertRoutes');

dotenv.config();

// Initialize Firebase Admin
const serviceAccount = require('./config/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/alerts', alertRoutes);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'RescueChain Backend is running.' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Since we are mocking Firebase real-time listeners for the demo without keys,
// we will set up a simple SSE (Server-Sent Events) or basic polling mechanism later if needed.
// For now, REST API will be the primary communication.
