require("dotenv").config(); // Carica variabili da .env
const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = process.env.PORT || 3000;

// Controllo variabile d'ambiente DATABASE_URL
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✅ trovata" : "❌ non trovata");

// Inizializzazione Prisma
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

console.log("Prisma inizializzato ✅");

// Rotta principale di test
app.get("/", async (req, res) => {
  try {
    // Esegui query raw in modo sicuro
    const result = await prisma.$queryRawUnsafe("SELECT NOW()");
    res.send(`Story Puzzlers è online 🚀<br>Database connesso: ${result[0].now}`);
  } catch (err) {
    console.error("Errore DB ❌", err.stack);
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
  await prisma.$disconnect();
  console.log("Prisma disconnesso ✅");
  server.close(() => {
    console.log("Server chiuso ✅");
    process.exit(0);
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
