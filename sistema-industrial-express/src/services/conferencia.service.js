const db = require("../config/database");

class ConferenciaService {
  async simularPosicao(totalSilos = 10) {
    const silos = await db("silos").where({ status: "ATIVO" }).orderBy("id");

    if (silos.length === 0) {
      throw new Error("Nenhum silo ativo cadastrado");
    }

    const indice = Math.floor(Math.random() * silos.length);
    const siloDetectado = silos[indice];

    return {
      siloDetectadoId: siloDetectado.id,
      siloDetectado: siloDetectado.nome,
      confianca: 0.98,
      mensagem: "Posição simulada com sucesso",
    };
  }

  async validar(siloSolicitadoId) {
    if (!siloSolicitadoId) {
      const erro = new Error("Informe o ID do silo solicitado");
      erro.statusCode = 400;
      throw erro;
    }

    const siloSolicitado = await db("silos")
      .where({ id: siloSolicitadoId, status: "ATIVO" })
      .first();

    if (!siloSolicitado) {
      const erro = new Error("Silo solicitado não encontrado ou inativo");
      erro.statusCode = 404;
      throw erro;
    }

    const silos = await db("silos").where({ status: "ATIVO" }).orderBy("id");

    if (silos.length === 0) {
      throw new Error("Nenhum silo ativo cadastrado");
    }

    // Simulação provisória da posição do carrinho
    const indice = Math.floor(Math.random() * silos.length);
    const siloDetectado = silos[indice];

    const aprovado = siloDetectado.id === siloSolicitado.id;
    const status = aprovado ? "APROVADO" : "DIVERGENTE";
    const mensagem = aprovado
      ? "Silo confirmado. Conferência aprovada."
      : `Divergência: solicitado ${siloSolicitado.nome}, detectado ${siloDetectado.nome}.`;

    const [conferenciaId] = await db("conferencias").insert({
      silo_solicitado_id: siloSolicitado.id,
      silo_detectado_id: siloDetectado.id,
      status,
      mensagem,
      confianca: 0.98,
    });

    return {
      id: conferenciaId,
      siloSolicitado: siloSolicitado.nome,
      siloDetectado: siloDetectado.nome,
      status,
      mensagem,
      confianca: 0.98,
      dataHora: new Date().toISOString(),
    };
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
