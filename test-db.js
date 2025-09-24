require("dotenv").config();
const { Client } = require("pg");

(async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("✅ Connessione riuscita!");
    const res = await client.query("SELECT NOW()");
    console.log("Risultato query:", res.rows[0]);
  } catch (err) {
    console.error("❌ Errore di connessione:", err);
  } finally {
    await client.end();
  }
})();
