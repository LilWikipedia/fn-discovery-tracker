// server/index.ts
import express from 'express';
import path from 'path';
import fs from 'fs/promises';

const app = express();

app.get('/api/discovery-data', async (req, res) => {
  try {
    // Read the latest export file
    const exportsDir = path.join(__dirname, 'exports');
    const files = await fs.readdir(exportsDir);
    const latestFile = files
      .filter(file => file.endsWith('.json'))
      .sort()
      .reverse()[0];

    if (!latestFile) {
      return res.status(404).json({ error: 'No data available' });
    }

    const data = await fs.readFile(
      path.join(exportsDir, latestFile),
      'utf-8'
    );
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch discovery data' });
  }
});

app.listen(3001, () => {
  console.log('API server running on port 3001');
});
