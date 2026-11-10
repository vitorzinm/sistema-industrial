const db = require("../config/database");
const { randomUUID } = require("node:crypto");
const conferenciaRepository = require("../repository/conferencia.repository");

class ConferenciaService {
  constructor() {
    this.simulacaoAtual = null;
  }

  async simularPosicao() {
    const silos = await conferenciaRepository.listarSilos();

    if (silos.length === 0) {
      const erro = new Error("Nenhum silo ativo cadastrado.");
      erro.statusCode = 404;
      throw erro;
    }

    const indice = Math.floor(Math.random() * silos.length);
    const siloDetectado = silos[indice];

    this.simulacaoAtual = {
      id: randomUUID(),
      siloDetectadoId: siloDetectado.id,
      confianca: 0.98,
      criadaEm: Date.now(),
      emValidacao: false,
    };

    return {
      simulacaoId: this.simulacaoAtual.id,
      siloDetectadoId: siloDetectado.id,
      siloDetectado: siloDetectado.nome,
      confianca: this.simulacaoAtual.confianca,
      mensagem: "Posição simulada com sucesso.",
    };
  }

  async validar(siloSolicitadoId, simulacaoId) {
    const criarErro = (mensagem, statusCode) => {
      const erro = new Error(mensagem);
      erro.statusCode = statusCode;
      return erro;
    };

    if (!Number.isInteger(siloSolicitadoId) || siloSolicitadoId < 1) {
      throw criarErro("Informe um ID de silo válido.", 400);
    }

    const simulacao = this.simulacaoAtual;

    if (!simulacao) {
      throw criarErro("Simule a posição antes de validar.", 409);
    }

    if (simulacaoId !== simulacao.id) {
      throw criarErro(
        "A posição foi atualizada. Faça uma nova simulação.",
        409,
      );
    }

    if (Date.now() - simulacao.criadaEm > 5 * 60 * 1000) {
      this.simulacaoAtual = null;

      throw criarErro("A simulação expirou. Simule a posição novamente.", 409);
    }

    if (simulacao.emValidacao) {
      throw criarErro("Esta conferência já está sendo validada.", 409);
    }

    simulacao.emValidacao = true;

    try {
      const siloSolicitado = await db("silos")
        .where({
          id: siloSolicitadoId,
          status: "ATIVO",
        })
        .first();

      if (!siloSolicitado) {
        throw criarErro("Silo solicitado não encontrado ou inativo.", 404);
      }

      const siloDetectado = await db("silos")
        .where({
          id: simulacao.siloDetectadoId,
          status: "ATIVO",
        })
        .first();

      if (!siloDetectado) {
        throw criarErro(
          "O silo detectado não está mais disponível. Simule novamente.",
          409,
        );
      }

      if (this.simulacaoAtual?.id !== simulacao.id) {
        throw criarErro(
          "A posição foi atualizada. Faça uma nova simulação.",
          409,
        );
      }

      // Usa a posição já simulada, sem realizar outro sorteio.
      const aprovado = siloDetectado.id === siloSolicitado.id;
      const status = aprovado ? "APROVADO" : "DIVERGENTE";

      const mensagem = aprovado
        ? "Silo confirmado. Conferência aprovada."
        : `Divergência: solicitado ${siloSolicitado.nome}, detectado ${siloDetectado.nome}.`;

      const conferencia = {
        silo_solicitado_id: siloSolicitado.id,
        silo_detectado_id: siloDetectado.id,
        status,
        mensagem,
        confianca: simulacao.confianca,
      }

      const [conferenciaId] = await conferenciaRepository.inserirConferencias(conferencia);


      // Impede reutilizar uma simulação já registrada.
      if (this.simulacaoAtual?.id === simulacao.id) {
        this.simulacaoAtual = null;
      }

      return {
        id: conferenciaId,
        siloSolicitado: siloSolicitado.nome,
        siloDetectado: siloDetectado.nome,
        siloDetectadoId: siloDetectado.id,
        status,
        mensagem,
        confianca: simulacao.confianca,
        dataHora: new Date().toISOString(),
      };
    } finally {
      simulacao.emValidacao = false;
    }
  }

  async listarSilos() {
    return conferenciaRepository.listarSilos();
  }

  async listarHistorico() {
    return db("conferencias")
      .leftJoin(
        "silos as solicitado",
        "conferencias.silo_solicitado_id",
        "solicitado.id",
      )
      .leftJoin(
        "silos as detectado",
        "conferencias.silo_detectado_id",
        "detectado.id",
      )
      .select(
        "conferencias.id",
        "solicitado.nome as siloSolicitado",
        "detectado.nome as siloDetectado",
        "conferencias.status",
        "conferencias.mensagem",
        "conferencias.confianca",
        "conferencias.data_hora as dataHora",
      )
      .orderBy("conferencias.data_hora", "desc");
  }
}

module.exports = new ConferenciaService();
