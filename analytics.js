const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs'); // Built-in Node module for file ops
const app = express();
const PORT = process.env.PORT || 3000; // Use env var for hosting (e.g., Vercel), default 3000 local
const SECRET_KEY = 'your-secret-key-here'; // Change to a strong key; site owners set this, agents include in headers

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// POST endpoint for logs
app.post('/log', (req, res) => {
  // Basic security: Check custom header for auth
  const authKey = req.headers['x-auth-key'];
  if (authKey !== SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Get log data from body (matches SPEC.md example)
  const logData = req.body; // e.g., { action: 'search', timestamp: '2025-12-02T12:00:00Z', success: true }

  // Append to logs.json (create if doesn't exist)
  fs.appendFile('logs.json', JSON.stringify(logData) + '\n', (err) => {
    if (err) {
      console.error('Error writing log:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    console.log('Logged action:', logData.action);
    res.status(200).json({ message: 'Logged successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`AOS Analytics server running on port ${PORT}`);
});