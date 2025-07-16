import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

// const dbClient = new Client({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: parseInt(process.env.DB_PORT || "5432"),
// });

const dbClient = new Client({
  connectionString: process.env.DB_URL,
});

const connectToDB = async () => {
  try {
    await dbClient.connect();
    console.log(`✅ Connected to PostgreSQL database on port: ${dbClient.port}`);
  } catch (err) {
    console.error("❌ Error connecting to the database:", err);
    process.exit(1);
  }
};

const disconnectFromDB = async () => {
  try {
    await dbClient.end();
    console.log("✅ Disconnected from PostgreSQL database.");
  } catch (err) {
    console.error("❌ Error disconnecting from the database:", err);
  }
};

export { dbClient, connectToDB, disconnectFromDB };