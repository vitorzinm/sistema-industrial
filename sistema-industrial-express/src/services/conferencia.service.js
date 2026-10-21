class ConferenciaService {
  constructor() {
    this.posicaoDetectada = null;
    this.confianca = 0;
    this.totalSilos = 0;
  }

  // Simula a posição atual do carrinho.
  sortearPosicao(totalSilos = 10) {
    if (!Number.isInteger(totalSilos) || totalSilos < 1) {
      return {
        erro: "A quantidade de silos deve ser um inteiro positivo.",
      };
    }

    this.totalSilos = totalSilos;
    this.posicaoDetectada = Math.floor(Math.random() * this.totalSilos) + 1;

    // Confiança fictícia: não representa uma câmera real.
    this.confianca = 0.98;

    return {
      status: "POSICAO_SIMULADA",
      mensagem: "Nova posição simulada.",
      siloDetectado: this.posicaoDetectada,
      totalSilos: this.totalSilos,
      confianca: this.confianca,
    };
  }

  // Confere o destino solicitado com a posição detectada.
  validar(siloSolicitado) {
    if (!Number.isInteger(siloSolicitado) || siloSolicitado < 1) {
      return {
        status: "ERRO",
        mensagem: "O silo solicitado deve ser um número inteiro positivo.",
      };
    }

    if (this.totalSilos === 0 || this.posicaoDetectada === null) {
      return {
        status: "POSICAO_DESCONHECIDA",
        mensagem: "Simule a posição do carrinho antes de conferir.",
      };
    }

    if (siloSolicitado > this.totalSilos) {
      return {
        status: "SILO_INVALIDO",
        mensagem: `O silo solicitado não existe. Existem ${this.totalSilos} silos cadastrados.`,
        siloSolicitado,
        totalSilos: this.totalSilos,
      };
    }

    if (this.confianca < 0.85) {
      return {
        status: "POSICAO_DESCONHECIDA",
        mensagem: "A confiança da detecção está abaixo do mínimo permitido.",
      };
    }

    const corresponde = siloSolicitado === this.posicaoDetectada;

    return {
      status: corresponde ? "APROVADO" : "DIVERGENTE",
      siloSolicitado,
      siloDetectado: this.posicaoDetectada,
      mensagem: corresponde
        ? "Conferência aprovada!"
        : "Conferência bloqueada: os silos são diferentes.",
    };
  }
}

module.exports = new ConferenciaService();
