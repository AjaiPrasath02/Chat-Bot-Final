import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { queryDatabase } from './database.js';
import { queryLLM } from './llm.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Chatbot core logic
app.post('/chat', async (req, res) => {
  const { message } = req.body; 
  console.log('Received message:', message);

  try {
    // Send message to LLM for response
    const llmResponse = await queryLLM(message);
    console.log('LLM response:', llmResponse);

    if (llmResponse.toLowerCase().includes('invalid query')) {
      console.log('Invalid query detected.');
      res.json({ response: 'Please check the query given. Provide details according to the schema.', type: 1 });
    } else {
      console.log('Valid query:', llmResponse);
      try {
        const dbResponse = await queryDatabase(llmResponse);
        const formattedResponse = JSON.stringify(dbResponse, null, 2);
        res.json({ response: `\n${formattedResponse}`, type: 0 });
      } catch (error) {
        console.error('Error executing database query:', error);
        res.status(500).json({ response: 'An error occurred while executing the query.', type: 1 });
      }
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ response: 'An error occurred while processing your request.', type: 1 });
  }
});

// Start server
app.listen(5000, () => {
  console.log('Chatbot backend running on http://localhost:5000');
});
