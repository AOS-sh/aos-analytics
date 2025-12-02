const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your-secret-key-here'; // Update to a secure value

app.use(bodyParser.json());

// POST /log endpoint
app.post('/log', (req, res) => {
  const authKey = req.headers['x-auth-key'];
  if (authKey !== SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const logData = req.body;
  fs.appendFile('logs.json', JSON.stringify(logData) + '\n', (err) => {
    if (err) {
      console.error('Error writing log:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    console.log('Logged action:', logData.action);
    res.status(200).json({ message: 'Logged successfully' });
  });
});

// GET /dashboard endpoint
app.get('/dashboard', (req, res) => {
  fs.readFile('logs.json', 'utf8', (err, data) => {
    if (err || !data.trim()) {
      return res.send('<h1>AOS Analytics Dashboard</h1><p>No logs yet.</p>');
    }
    const logs = data.trim().split('\n').map(line => JSON.parse(line));
    let html = '<h1>AOS Analytics Dashboard</h1><table border="1" style="border-collapse: collapse; width: 100%;">';
    html += '<tr><th>Action</th><th>Timestamp</th><th>Success</th><th>Error Message</th><th>Agent Type</th></tr>';
    logs.forEach(log => {
      html += `<tr>
        <td>${log.action || 'N/A'}</td>
        <td>${log.timestamp || 'N/A'}</td>
        <td>${log.success}</td>
        <td>${log.error_message || 'None'}</td>
        <td>${log.agent_type || 'Unknown'}</td>
      </tr>`;
    });
    html += '</table>';
    res.send(html);
  });
});

// Optional: Handle root GET (avoids 404 on /)
app.get('/', (req, res) => {
  res.send('<h1>AOS Analytics</h1><p>Go to <a href="/dashboard">/dashboard</a> or POST to /log.</p>');
});

app.listen(PORT, () => {
  console.log(`AOS Analytics server running on port ${PORT}`);
});