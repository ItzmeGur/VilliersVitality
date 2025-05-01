-require('dotenv').config(); // Loads environment variables from a .env file into process.env
const express = require('express'); // Import Express framework
const { createClient } = require('@libsql/client'); // Import the client constructor for Turso (libSQL)

const app = express(); // Create an instance of the Express app
const port = process.env.PORT || 3001; // Define the port to listen on, defaulting to 3001 if not set

// Middleware to parse JSON bodies
app.use(express.json()); // Allows Express to parse incoming requests with JSON payloads

// Turso connection details from environment variables
const TURSO_CONNECTION_STRING = process.env.TURSO_CONNECTION_STRING; // Get the database URL from env
const TURSO_AUTH_TOKEN = process.env.eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDYwNTY1NjksImlkIjoiYmNjZjk0MGEtOWYyZC00OWYwLWE1YTAtOTBkNzdjZDZhN2NhIiwicmlkIjoiMTUzMGQ3N2MtNDVhNS00ODk4LThiYzgtZWVjNGFmYTFjYWQ4In0.bOZKNwHZGZXXIsw8abQ8sy7v05kQVPYYIPv9b6h1toNXyYJoJwYBWicEuGrxUWkcS_phKiDxAKOZHcyqaVRNCw; // WARNING: Avoid hardcoding or exposing tokens; use env variable keys!

// Create Turso client
const client = createClient({ // Initialize connection to Turso database
  url: TURSO_CONNECTION_STRING,
  authToken: TURSO_AUTH_TOKEN,
});

// Initialize database schema
async function initializeSchema() {
  try {
    await client.execute(` // Create table if it doesn't already exist
      CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL
      );
    `);
    console.log('Database schema initialized'); // Log success
  } catch (error) {
    console.error('Error initializing database schema:', error); // Log any errors
  }
}

// Basic test route
app.get('/', (req, res) => { // Root route to test if server is working
  res.send('Turso backend is running');
});

// Get all items
app.get('/items', async (req, res) => { // Fetch all records from items table
  try {
    const result = await client.execute('SELECT * FROM items;');
    res.json(result.rows); // Send the rows as JSON
  } catch (error) {
    console.error('Error fetching items:', error); // Log errors
    res.status(500).json({ error: 'Failed to fetch items' }); // Respond with 500 on error
  }
});

// Create a new item
app.post('/items', async (req, res) => { // Handle POST request to add new item
  const { name, description } = req.body; // Extract name and description from request body
  if (!name || !description) { // Validate input
    return res.status(400).json({ error: 'Missing name or description' });
  }
  try {
    await client.execute('INSERT INTO items (name, description) VALUES (?, ?);', [name, description]); // Insert into DB
    res.status(201).json({ message: 'Item created' }); // Respond with 201 status
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// Update an item by id
app.put('/items/:id', async (req, res) => { // PUT endpoint to update existing item
  const { id } = req.params; // Get item ID from route params
  const { name, description } = req.body; // Get updated data
  if (!name || !description) {
    return res.status(400).json({ error: 'Missing name or description' }); // Validate input
  }
  try {
    const result = await client.execute( // Execute update query
      'UPDATE items SET name = ?, description = ? WHERE id = ?;',
      [name, description, id]
    );
    if (result.changes === 0) { // Check if any row was updated
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item updated' }); // Send success response
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Delete an item by id
app.delete('/items/:id', async (req, res) => { // DELETE endpoint to remove item
  const { id } = req.params; // Get item ID
  try {
    const result = await client.execute('DELETE FROM items WHERE id = ?;', [id]); // Execute deletion
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Item not found' }); // Item didn't exist
    }
    res.json({ message: 'Item deleted' }); // Successful deletion
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Start server after initializing schema
initializeSchema().then(() => { // Ensure DB schema is set up before starting server
  app.listen(port, () => {
    console.log(`Turso backend listening at http://localhost:${port}`); // Log server URL
  });
});
