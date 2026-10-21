const conferenciaService = require("../services/conferencia.service");

function simularPosicao(req, res) {
  const { totalSilos = 10 } = req.body || {};

  const resultado = conferenciaService.sortearPosicao(totalSilos);

  if (resultado.erro) {
    return res.status(400).json(resultado);
  }

  return res.status(200).json(resultado);
}

function validarConferencia(req, res) {
  const { siloSolicitado } = req.body || {};

  const resultado = conferenciaService.validar(siloSolicitado);

  if (resultado.status === "ERRO" || resultado.status === "SILO_INVALIDO") {
    return res.status(400).json(resultado);
  }

  if (resultado.status === "POSICAO_DESCONHECIDA") {
    return res.status(409).json(resultado);
  }

  return res.status(200).json(resultado);
}

module.exports = {
  simularPosicao,
  validarConferencia,
};
