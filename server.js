const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("✅ App online"));

app.listen(PORT, () => console.log(`Server avviato su http://localhost:${PORT}`));
