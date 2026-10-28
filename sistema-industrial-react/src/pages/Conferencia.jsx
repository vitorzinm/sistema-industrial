import { useState } from "react";
import "./Conferencia.css";

const API_URL = "http://localhost:3000/api/conferencia";

const silosDisponiveis = Array.from(
    { length: 10 },
    (_, i) => `SILO-${String(i + 1).padStart(3, "0")}`,
);

function numeroDoSilo(silo) {
    return Number(silo.replace("SILO-", ""));
}

function nomeDoSilo(numero) {
    return `SILO-${String(numero).padStart(3, "0")}`;
}

function Conferencia() {
    const [origem, setOrigem] = useState("");
    const [destino, setDestino] = useState("");
    const [status, setStatus] = useState("Aguardando");
    const [mensagem, setMensagem] = useState("");
    const [posicaoDetectada, setPosicaoDetectada] = useState(null);
    const [confianca, setConfianca] = useState(null);
    const [carregando, setCarregando] = useState(false);

    async function iniciarConferencia(event) {
        event.preventDefault();

        if (!destino) {
            setMensagem("Selecione o silo de destino.");
            return;
        }

        setCarregando(true);
        setMensagem("");
        setPosicaoDetectada(null);
        setConfianca(null);

        try {
            const resposta = await fetch(`${API_URL}/simular`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ totalSilos: 10 }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.mensagem || "Não foi possível simular a posição.",
                );
            }

            setPosicaoDetectada(dados.siloDetectado);
            setOrigem(nomeDoSilo(dados.siloDetectado));
            setConfianca(dados.confianca);
            setStatus("Em andamento");
            setMensagem(
                `Posição simulada: ${nomeDoSilo(dados.siloDetectado)}. Agora confirme o destino.`,
            );
        } catch (erro) {
            setStatus("Erro");
            setMensagem(
                `Não foi possível conectar ao backend: ${erro.message}`,
            );
        } finally {
            setCarregando(false);
        }
    }

    async function concluirConferencia() {
        if (!destino || posicaoDetectada === null) {
            setMensagem("Simule a posição e selecione um silo de destino.");
            return;
        }

        setCarregando(true);
        setMensagem("");

        try {
            const resposta = await fetch(`${API_URL}/validar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    siloSolicitadoId: numeroDoSilo(destino),
                }),
            });

            const dados = await resposta.json();

            if (
                resposta.ok &&
                dados.status !== "DIVERGENTE" &&
                dados.status !== "POSICAO_DESCONHECIDA"
            ) {
                setStatus("Concluída");
                setMensagem(
                    dados.mensagem || "Conferência aprovada pelo backend.",
                );
            } else {
                setStatus("Divergência");
                setMensagem(
                    dados.mensagem || "A conferência não foi aprovada.",
                );
            }
        } catch (erro) {
            setStatus("Erro");
            setMensagem(
                `Não foi possível conectar ao backend: ${erro.message}`,
            );
        } finally {
            setCarregando(false);
        }
    }

    function reiniciarConferencia() {
        setDestino("");
        setOrigem("");
        setPosicaoDetectada(null);
        setConfianca(null);
        setStatus("Aguardando");
        setMensagem("");
    }

    const operacaoIniciada = status === "Em andamento";

    return (
        <main className="conference-page">
            <section className="conference-heading">
                <div>
                    <span className="conference-eyebrow">
                        OPERAÇÃO INDUSTRIAL
                    </span>
                    <h1>Conferência de silos</h1>
                    <p>Defina o destino e acompanhe a operação do carrinho.</p>
                </div>

                <div
                    className={`conference-status ${
                        operacaoIniciada
                            ? "running"
                            : status === "Concluída"
                              ? "completed"
                              : ""
                    }`}
                >
                    <span className="conference-status-dot" />
                    {status}
                </div>
            </section>

            <section className="conference-layout">
                <div className="conference-main-column">
                    <article className="conference-card">
                        <div className="conference-card-heading">
                            <div className="conference-step">01</div>
                            <div>
                                <h2>Definir percurso</h2>
                                <p>Informe o silo de destino.</p>
                            </div>
                        </div>

                        <form onSubmit={iniciarConferencia}>
                            <div className="conference-fields">
                                <label className="conference-field">
                                    <span>Posição detectada do carrinho</span>
                                    <input
                                        value={origem || "Ainda não simulada"}
                                        readOnly
                                    />
                                    <small>
                                        Posição informada pelo backend
                                    </small>
                                </label>

                                <div className="conference-route-arrow">→</div>

                                <label className="conference-field">
                                    <span>Silo de destino</span>
                                    <select
                                        value={destino}
                                        onChange={(event) => {
                                            setDestino(event.target.value);
                                            setMensagem("");
                                        }}
                                        disabled={
                                            operacaoIniciada || carregando
                                        }
                                    >
                                        <option value="">
                                            Selecione um silo
                                        </option>
                                        {silosDisponiveis.map((silo) => (
                                            <option key={silo} value={silo}>
                                                {silo}
                                            </option>
                                        ))}
                                    </select>
                                    <small>
                                        Destino solicitado pelo operador
                                    </small>
                                </label>
                            </div>

                            {mensagem && (
                                <div
                                    className={`conference-message ${
                                        status === "Concluída" ? "success" : ""
                                    }`}
                                    role="status"
                                >
                                    {mensagem}
                                </div>
                            )}

                            {confianca !== null && (
                                <p>
                                    Confiança informada:{" "}
                                    {(confianca * 100).toFixed(0)}%
                                </p>
                            )}

                            <div className="conference-form-actions">
                                {!operacaoIniciada ? (
                                    <button
                                        className="conference-primary-button"
                                        type="submit"
                                        disabled={
                                            carregando || status === "Concluída"
                                        }
                                    >
                                        {carregando
                                            ? "Processando..."
                                            : "▶ Simular posição"}
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className="conference-secondary-button"
                                            type="button"
                                            onClick={reiniciarConferencia}
                                            disabled={carregando}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            className="conference-primary-button"
                                            type="button"
                                            onClick={concluirConferencia}
                                            disabled={carregando}
                                        >
                                            {carregando
                                                ? "Validando..."
                                                : "✓ Validar destino"}
                                        </button>
                                    </>
                                )}

                                {status === "Concluída" && (
                                    <button
                                        className="conference-primary-button"
                                        type="button"
                                        onClick={reiniciarConferencia}
                                    >
                                        + Nova conferência
                                    </button>
                                )}

                                {status === "Divergência" && (
                                    <button
                                        className="conference-primary-button"
                                        type="button"
                                        onClick={reiniciarConferencia}
                                    >
                                        Tentar novamente
                                    </button>
                                )}

                                {status === "Erro" && (
                                    <button
                                        className="conference-secondary-button"
                                        type="button"
                                        onClick={reiniciarConferencia}
                                    >
                                        Reiniciar
                                    </button>
                                )}
                            </div>
                        </form>
                    </article>

                    <article className="conference-card">
                        <div className="conference-card-heading">
                            <div className="conference-step">02</div>
                            <div>
                                <h2>Identificação do silo</h2>
                                <p>
                                    Área preparada para a futura leitura de QR
                                    Code.
                                </p>
                            </div>
                        </div>

                        <div className="qr-placeholder">
                            <div className="qr-frame">
                                <div className="qr-corner top-left" />
                                <div className="qr-corner top-right" />
                                <div className="qr-corner bottom-left" />
                                <div className="qr-center">▦</div>
                            </div>

                            <h3>Leitor de QR Code</h3>
                            <p>
                                A leitura pela câmera será integrada em uma
                                próxima etapa.
                            </p>
                            <button
                                type="button"
                                className="conference-secondary-button"
                                onClick={() =>
                                    setMensagem(
                                        "O leitor de câmera ainda não foi integrado. Selecione o silo manualmente.",
                                    )
                                }
                            >
                                <span>▣</span> Leitor indisponível
                            </button>
                        </div>
                    </article>
                </div>

                <aside className="conference-side-column">
                    <article className="conference-card cart-card">
                        <div className="conference-card-heading">
                            <div>
                                <h2>Movimentação do carrinho</h2>
                                <p>Acompanhamento da operação</p>
                            </div>
                            <span
                                className={`cart-status-dot ${
                                    operacaoIniciada ? "active" : ""
                                }`}
                            />
                        </div>

                        <div className="cart-visual">
                            <div className="cart-track">
                                <div className="cart-location">
                                    <span className="cart-location-dot" />
                                    <span>
                                        {origem || "Posição desconhecida"}
                                    </span>
                                </div>

                                <div
                                    className={`cart-line ${
                                        operacaoIniciada ? "moving" : ""
                                    }`}
                                >
                                    <span className="cart-symbol">▰</span>
                                </div>

                                <div className="cart-location destination">
                                    <span className="cart-location-dot" />
                                    <span>
                                        {destino || "Destino não definido"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="cart-info-row">
                            <span>Status</span>
                            <strong>
                                {status === "Em andamento"
                                    ? "Aguardando validação"
                                    : status === "Divergência"
                                      ? "Operação bloqueada"
                                      : status}
                            </strong>
                        </div>

                        <div className="cart-info-row">
                            <span>Origem detectada</span>
                            <strong>{origem || "—"}</strong>
                        </div>

                        <div className="cart-info-row">
                            <span>Destino solicitado</span>
                            <strong>{destino || "—"}</strong>
                        </div>

                        <div className="cart-note">
                            <span>ⓘ</span>
                            <p>
                                A posição ainda é simulada pelo backend. Nenhum
                                sensor ou câmera está conectado.
                            </p>
                        </div>
                    </article>

                    <article className="conference-tip">
                        <span className="conference-tip-icon">✦</span>
                        <div>
                            <h3>Próxima etapa</h3>
                            <p>
                                Integrar os silos cadastrados e o histórico de
                                conferências à API.
                            </p>
                        </div>
                    </article>
                </aside>
            </section>

            <footer className="conference-footer">
                <span>SiloCheck · Módulo de conferência</span>
                <span>Modo de demonstração</span>
            </footer>
        </main>
    );
}

export default Conferencia;
