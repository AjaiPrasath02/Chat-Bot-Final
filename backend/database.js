import sqlite3 from 'sqlite3';
import { open } from 'sqlite';  


const connectToDB = async () => {
  return open({
    filename: 'database1.db', 
    driver: sqlite3.Database
  });
};

/**
 * Execute a database query based on the query type and parameters.
 * @param {string} queryType - The type of query to execute.
 * @param {Array} [params=[]] - Parameters for the SQL query.
 * @returns {Promise} - A promise that resolves with the query results or rejects with an error.
 */
export async function queryDatabase(queryType, params = []) {
  try {
    const db = await connectToDB();
    
    // Ensure queryType is a valid SQL statement
    if (queryType.startsWith('SELECT') || queryType.startsWith('INSERT') || queryType.startsWith('UPDATE') || queryType.startsWith('DELETE')) {
      const result = await db.all(queryType, params);  // Use db.get() for a single result if applicable
      await db.close();
      return result;
    } else {
      throw new Error('Invalid SQL query');
    }
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}
