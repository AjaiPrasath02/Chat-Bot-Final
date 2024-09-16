import sqlite3

def create_database():
    try:
        # Connect to the SQLite database
        conn = sqlite3.connect('D:/C5i/Gladwin/C5i/backend/database.db')
        cursor = conn.cursor()

        # Create tables
        cursor.executescript('''
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_name TEXT UNIQUE NOT NULL,
                price REAL NOT NULL,
                quantity INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS chat_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                chat_text TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        ''')

        # Insert some initial data into the products table
        cursor.execute('''
            INSERT INTO products (product_name, price, quantity) VALUES
                ('Laptop', 999.99, 10),
                ('Smartphone', 499.99, 25),
                ('Headphones', 149.99, 50)
            ON CONFLICT(product_name) DO NOTHING;
        ''')

        # Commit the changes and close the connection
        conn.commit()
        print('Database created and initial data inserted.')
    except sqlite3.Error as e:
        print('Error creating database:', e)
    finally:
        if conn:
            conn.close()

# Run the function to create the database
create_database()
