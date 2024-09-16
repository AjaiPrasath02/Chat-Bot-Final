import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables from .env file
dotenv.config();

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI('AIzaSyBxxLjQUNWm1axTxk6g2nIXT2a_KdYtHoQ');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function queryLLM(message) {
  try {
    const schema1 = `
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        product_name TEXT UNIQUE,
        price REAL,
        quantity INTEGER
    );`;
    const schema2=`
     CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );`;
    const schema3=`
    CREATE TABLE IF NOT EXISTS chat_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                chat_text TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
    `

    const prompt = schema1 +schema2+schema3+ message + " Generate only a SQL query based on this schema, without any extra information. If the query is invalid, respond with 'Invalid Query'.";

    // Use the Gemini API to process the prompt
    const result = await model.generateContent(prompt);
    const query = result.response.text().replace(/```/g, '').trim();

    console.log('LLM generated query:', query);

    // Check for invalid query response
    if (query.toLowerCase().includes('invalid query') || query.toLowerCase().includes('error')) {
      return 'Invalid Query';
    }

    // Remove any leading or trailing non-SQL content
    const cleanedQuery = query.replace(/^[a-zA-Z]+\s+/i, '').trim();

    return cleanedQuery;
  } catch (error) {
    console.error('Error querying LLM:', error);
    return 'An error occurred while processing your request.';
  }
}
