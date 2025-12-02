require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your-secret-key-here'; // Change to secure value

app.use(bodyParser.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// POST /log endpoint
app.post('/log', async (req, res) => {
  const authKey = req.headers['x-auth-key'];
  if (authKey !== SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const logData = req.body;
  try {
    const { data, error } = await supabase
      .from('logs')
      .insert([logData]); // Insert the JSON payload as row
    if (error) throw error;
    console.log('Logged action:', logData.action);
    res.status(200).json({ message: 'Logged successfully' });
  } catch (err) {
    console.error('Error logging:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /dashboard endpoint
app.get('/dashboard', async (req, res) => {
  try {
    const { data: logs, error } = await supabase
      .from('logs')
      .select('*')
      .order('timestamp', { ascending: false }); // Latest first
    if (error) throw error;
    if (!logs || logs.length === 0) {
      return res.send('<h1>AOS Analytics Dashboard</h1><p>No logs yet.</p>');
    }
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
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).send('<h1>Error loading dashboard</h1>');
  }
});

// Optional root handler
app.get('/', (req, res) => {
  res.send('<h1>AOS Analytics</h1><p>Go to <a href="/dashboard">/dashboard</a> or POST to /log.</p>');
});

app.listen(PORT, () => {
  console.log(`AOS Analytics server running on port ${PORT}`);
});