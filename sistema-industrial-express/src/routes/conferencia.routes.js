const express = require("express");
const controller = require("../controllers/conferencia.controller");

const router = express.Router();

router.post("/simular", (req, res) => controller.simular(req, res));
router.post("/validar", (req, res) => controller.validar(req, res));
router.get("/historico", (req, res) => controller.historico(req, res));

module.exports = router;
