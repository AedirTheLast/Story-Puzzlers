const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Rotta di test
app.get("/", (req, res) => {
  res.send("Story Puzzlers è online 🚀");
});

// Avvio server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
