
import { GoogleGenerativeAI } from "@google/generative-ai";


// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI('AIzaSyBxxLjQUNWm1axTxk6g2nIXT2a_KdYtHoQ'); // Make sure to use environment variable for API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function queryLLM(message) {
  try {
    // Updated schema to include all tables
    const schema = `
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_name TEXT UNIQUE NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        sales_date DATE NOT NULL
    );`;

    const prompt = schema + '\nPrompt: ' + message + '.\nGenerate a sqlite query based on this schema, without any extra information. If the prompt is irrelevant to the given schema, give response as "Invalid Query" only.';

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
