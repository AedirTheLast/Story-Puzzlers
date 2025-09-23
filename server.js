const express = require("express");
const { PrismaClient } = require("@prisma/client");

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

// Rotta di test
app.get("/", async (req, res) => {
  let dbStatus = "Non connesso al DB";
  
  if (prisma) {
    try {
      // Test rapido di connessione
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = "DB connesso correttamente ✅";
    } catch (err) {
      dbStatus = "Errore connessione DB ❌";
    }
  }

  res.send(`Story Puzzlers è online 🚀<br>${dbStatus}`);
});

// Avvio server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
