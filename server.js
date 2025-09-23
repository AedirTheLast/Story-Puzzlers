const express = require("express");
const { Client } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// Mostra se DATABASE_URL è letta correttamente
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✅ trovata" : "❌ non trovata");

// Connessione al database
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // richiesto da Supabase
  },
});

client.connect()
  .then(() => console.log("✅ Connessione al database riuscita"))
  .catch(err => console.error("❌ Errore di connessione:", err.stack));

// Rotta di test
app.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT NOW()");
    res.send(`Story Puzzlers è online 🚀<br>Database connesso: ${result.rows[0].now}`);
  } catch (err) {
    res.status(500).send("Errore database: " + err.message);
  }
});

// Avvio server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
