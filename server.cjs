const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5001;

// Enable CORS for all origins (for development)
app.use(cors());

// Serve the JSON file
app.get('/api/discovery', (req, res) => {
  const dataPath = path.join(__dirname, './src/backend/data/fortnite_ugc_content.json'); // Path to your exported JSON file
  res.sendFile(dataPath);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
