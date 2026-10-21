const app = require("./app");
// app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}`);
});
