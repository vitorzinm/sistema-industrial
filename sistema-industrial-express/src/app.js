const express = require("express");
const cors = require("cors");
const app = express();

const conferenciaRoutes = require("./routes/conferencia.routes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API do Sistema Industrial funcionando.",
    tecnologia: "Express.js + JavaScript",
  });
});

app.use("/api/conferencia", conferenciaRoutes);

// Resposta para rotas que não existem
app.use((req, res) => {
  res.status(404).json({ mensagem: "Rota não encontrada." });
});

module.exports = app;
