require("dotenv").config(); // Carica variabili da .env
const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = process.env.PORT || 3000;

// Controllo variabile d'ambiente DATABASE_URL
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✅ trovata" : "❌ non trovata");

// Inizializzazione Prisma
let prisma;
try {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
  console.log("Prisma inizializzato ✅");

  // Test rapido di connessione
  prisma.$queryRaw`SELECT 1`
    .then(() => console.log("Connessione al database funzionante ✅"))
    .catch(err => console.error("Errore test DB ❌", err.stack));
} catch (err) {
  console.error("Prisma non inizializzato:", err.message);
}

// Rotta principale di test
app.get("/", async (req, res) => {
  if (!prisma) return res.status(500).send("Prisma non inizializzato ❌");

  try {
    const result = await prisma.$queryRaw`SELECT NOW()`;
    res.send(`Story Puzzlers è online 🚀<br>Database connesso: ${result[0].now}`);
  } catch (err) {
    res.status(500).send("Errore database: " + err.message);
  }
});

// Avvio server
const server = app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});

// Gestione chiusura server e Prisma
const gracefulShutdown = async () => {
  console.log("\nChiusura server...");
  if (prisma) {
    await prisma.$disconnect();
    console.log("Prisma disconnesso ✅");
  }
  server.close(() => {
    console.log("Server chiuso ✅");
    process.exit(0);
  });
};

// Cattura interruzioni del processo (CTRL+C, kill)
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
