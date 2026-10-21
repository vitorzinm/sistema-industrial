const express = require("express");
const {
  simularPosicao,
  validarConferencia,
} = require("../controllers/conferencia.controller");

const router = express.Router();

// POST /api/conferencia/simular
router.post("/simular", simularPosicao);

// POST /api/conferencia/validar
router.post("/validar", validarConferencia);

module.exports = router;
