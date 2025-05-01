-require('dotenv').config();
const express = require('express');
const { createClient } = require('@libsql/client');

const app = express();
const port = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Turso connection details from environment variables
const TURSO_CONNECTION_STRING = process.env.TURSO_CONNECTION_STRING;
const TURSO_AUTH_TOKEN = process.env.eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDYwNTY1NjksImlkIjoiYmNjZjk0MGEtOWYyZC00OWYwLWE1YTAtOTBkNzdjZDZhN2NhIiwicmlkIjoiMTUzMGQ3N2MtNDVhNS00ODk4LThiYzgtZWVjNGFmYTFjYWQ4In0.bOZKNwHZGZXXIsw8abQ8sy7v05kQVPYYIPv9b6h1toNXyYJoJwYBWicEuGrxUWkcS_phKiDxAKOZHcyqaVRNCw;

// Create Turso client
const client = createClient({
  url: TURSO_CONNECTION_STRING,
  authToken: TURSO_AUTH_TOKEN,
});

// Initialize database schema
async function initializeSchema() {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL
      );
    `);
    console.log('Database schema initialized');
  } catch (error) {
    console.error('Error initializing database schema:', error);
  }
}

// Basic test route
app.get('/', (req, res) => {
  res.send('Turso backend is running');
});

// Get all items
app.get('/items', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM items;');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Create a new item
app.post('/items', async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Missing name or description' });
  }
  try {
    await client.execute('INSERT INTO items (name, description) VALUES (?, ?);', [name, description]);
    res.status(201).json({ message: 'Item created' });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Update an item by id
app.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: 'Missing name or description' });
  }
  try {
    const result = await client.execute(
      'UPDATE items SET name = ?, description = ? WHERE id = ?;',
      [name, description, id]
    );
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item updated' });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete an item by id
app.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.execute('DELETE FROM items WHERE id = ?;', [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Start server after initializing schema
initializeSchema().then(() => {
  app.listen(port, () => {
    console.log(`Turso backend listening at http://localhost:${port}`);
  });
});
