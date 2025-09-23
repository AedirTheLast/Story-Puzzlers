const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { Client } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// Mostra se DATABASE_URL è letta correttamente
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✅ trovata" : "❌ non trovata");

// Prisma (per connettersi a Supabase)
let prisma;
try {
  prisma = new PrismaClient();
  console.log("Prisma inizializzato ✅");
} catch (err) {
  console.error("Prisma non inizializzato:", err.message);
}

// Connessione diretta al database PostgreSQL (per test rapido)
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
  let dbStatus = "Non connesso al DB";

  // Verifica connessione con Prisma
  if (prisma) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = "DB connesso correttamente con Prisma ✅";
    } catch (err) {
      dbStatus = "Errore connessione DB Prisma ❌";
    }
  }

  // Verifica connessione diretta a PostgreSQL
  try {
    const result = await client.query("SELECT NOW()");
    dbStatus += `<br>DB Postgres connesso: ${result.rows[0].now}`;
  } catch (err) {
    dbStatus += `<br>Errore DB Postgres: ${err.message}`;
  }

  res.send(`Story Puzzlers è online 🚀<br>${dbStatus}`);
});

// Avvio server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
