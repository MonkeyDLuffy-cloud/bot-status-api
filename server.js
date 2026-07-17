const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// This is a secret password so random strangers can't fake a "hello".
// You will set your own secret word on Render in Step 4.
const API_KEY = process.env.API_KEY || 'change-this-secret';

// If no "hello" for 3 minutes, we call it offline.
const OFFLINE_AFTER_MS = 3 * 60 * 1000;

let lastSeen = null; // will hold the time of the last "hello"

// Job A: the bot calls this to say "I'm alive"
app.post('/heartbeat', (req, res) => {
  const key = req.header('x-api-key');
  if (key !== API_KEY) {
    return res.status(401).json({ error: 'wrong key' });
  }
  lastSeen = Date.now();
  res.json({ ok: true });
});

// Job B: the webpage calls this to check status
app.get('/status', (req, res) => {
  if (!lastSeen) {
    return res.json({ status: 'unknown' });
  }
  const secondsAgo = Math.round((Date.now() - lastSeen) / 1000);
  const status = (Date.now() - lastSeen) <= OFFLINE_AFTER_MS ? 'online' : 'offline';
  res.json({ status, secondsAgo });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
