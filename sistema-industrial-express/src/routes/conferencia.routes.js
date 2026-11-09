const express = require("express");
const controller = require("../controllers/conferencia.controller");

const router = express.Router();

router.post("/simular", controller.simular);
router.post("/validar", controller.validar);
router.get("/historico", controller.historico);

module.exports = router;
