import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import { queryDatabase } from './database.js';
import { queryLLM } from './llm.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Register new users
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    await queryDatabase(query, [username, email, hashedPassword]);

    res.json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Registration failed.' });
  }
});

// User login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Get the user's hashed password from the database
    const query = `SELECT id, password FROM users WHERE email = ?`;
    const user = await queryDatabase(query, [email]);

    if (user.length === 0) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Compare the entered password with the hashed password
    const isValidPassword = await bcrypt.compare(password, user[0].password);

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid password.' });
    }

    // User authenticated, send user ID
    res.json({ message: 'Login successful.', userId: user[0].id });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Login failed.' });
  }
});

// Store chat history
app.post('/chat', async (req, res) => {
  const { message, userId } = req.body;
  console.log('Received message:', message);

  try {
    const llmResponse = await queryLLM(message);
    console.log('LLM response:', llmResponse);

    if (llmResponse.toLowerCase().includes('invalid query')) {
      res.json({ response: 'Invalid query, please give a valid query based on schema', type: 1 });
    } else {
      const dbResponse = await queryDatabase(llmResponse);

      // Save chat history
      const chatQuery = `INSERT INTO chat_history (user_id, user_text, bot_text) VALUES (?, ?, ?)`;
      const formattedResponse = JSON.stringify(dbResponse, null, 2);
      await queryDatabase(chatQuery, [userId, message, formattedResponse]);

      res.json({ response: formattedResponse});
    }
  } catch (error) {
    console.error('Error during chat:', error);
    res.status(500).json({ response: 'An error occurred.'});
  }
});

app.post('/chathistory', async (req, res) => {
  const { userId } = req.body; // Destructuring userId from the request body
  console.log(userId);
  const chatQuery = `SELECT user_text, bot_text FROM chat_history WHERE user_id = ?`;
  try {
    const dbResponse = await queryDatabase(chatQuery, [userId]);
    // Map dbResponse to the desired format
    const formattedResponse = dbResponse.flatMap(row => [
      { text: row.user_text, user: 'User' },
      { text: row.bot_text, user: 'Chatbot' }
    ]);
    console.log(formattedResponse);
    res.json({ response: formattedResponse, type: 0 });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
