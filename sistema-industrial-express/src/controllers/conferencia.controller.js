const conferenciaService = require("../services/conferencia.service");

class ConferenciaController {
  async simular(req, res) {
    try {
      const resultado = await conferenciaService.simularPosicao();
      return res.status(200).json(resultado);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        mensagem: error.message || "Erro ao simular posição",
      });
    }
  }

  async validar(req, res) {
    try {
      const { siloSolicitadoId } = req.body;
      const resultado = await conferenciaService.validar(siloSolicitadoId);

      return res.status(200).json(resultado);
    } catch (error) {
      console.error(error);
      return res.status(error.statusCode || 500).json({
        mensagem: error.message || "Erro ao validar conferência",
      });
    }
  }

  async historico(req, res) {
    try {
      const historico = await conferenciaService.listarHistorico();
      return res.status(200).json(historico);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        mensagem: "Erro ao consultar histórico",
      });
    }
  }
}

module.exports = new ConferenciaController();
