import { useEffect, useState } from "react";

import "./Conferencia.css";

import LeitorQr from "../components/LeitorQr";
import { API_URL } from "../config/api";

function Conferencia() {
    const [origem, setOrigem] = useState("");
    const [destino, setDestino] = useState("");
    const [status, setStatus] = useState("Aguardando");
    const [mensagem, setMensagem] = useState("");
    const [posicaoDetectada, setPosicaoDetectada] = useState(null);
    const [confianca, setConfianca] = useState(null);
    const [carregando, setCarregando] = useState(false);
    const [simulacaoId, setSimulacaoId] = useState(null);

    const [silosDisponiveis, setSilosDisponiveis] = useState([]);
    const [carregandoSilos, setCarregandoSilos] = useState(true);
    const [erroSilos, setErroSilos] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        fetch(`${API_URL}/silos`, { signal: controller.signal })
            .then(async (resposta) => {
                const dados = await resposta.json();
                if (!resposta.ok) throw new Error(dados.mensagem || "Erro ao carregar silos.");
                return dados;
            })
            .then(setSilosDisponiveis)
            .catch((erro) => {
                if (erro.name !== "AbortError") setErroSilos("Não foi possível carregar os silos. Verifique o backend e recarregue a página.");
            })
            .finally(() => { if (!controller.signal.aborted) setCarregandoSilos(false); });
        return () => controller.abort();
    }, []);

    function lerCodigoQr(texto) {
        const codigo = texto.trim().toUpperCase();
        const silo = silosDisponiveis.find((item) => item.codigo_qr.trim().toUpperCase() === codigo);
        if (!silo) return "QR code não corresponde a um silo ativo cadastrado.";
        setDestino(String(silo.id));
        setStatus("Aguardando");
        setMensagem(`QR code lido: ${silo.nome}. Agora simule a posição.`);
        return null;
    }

    const nomeDestino = silosDisponiveis.find((silo) => String(silo.id) === destino)?.nome;

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
        setSimulacaoId(null);

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

            setPosicaoDetectada(dados.siloDetectadoId);
            setOrigem(dados.siloDetectado);
            setSimulacaoId(dados.simulacaoId);
            setConfianca(dados.confianca);
            setStatus("Em andamento");

            setMensagem(
                `Posição simulada: ${dados.siloDetectado}. Agora confirme o destino.`,
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
        if (!destino) {
            setMensagem("Selecione o silo de destino.");
            return;
        }

        if (posicaoDetectada == null) {
            setStatus("Erro");
            setMensagem(
                "A simulação não retornou siloDetectadoId. Confira a resposta de /simular.",
            );
            return;
        }

        if (!simulacaoId) {
            setStatus("Erro");
            setMensagem(
                "A simulação não retornou simulacaoId. Confira o método simularPosicao() do backend.",
            );
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
                    siloSolicitadoId: Number(destino),
                    simulacaoId,
                }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) {
                setStatus("Erro");
                setMensagem(
                    dados.mensagem || "Não foi possível validar a conferência.",
                );
            } else if (dados.status === "APROVADO") {
                setStatus("Concluída");
                setMensagem(
                    dados.mensagem || "Conferência aprovada pelo backend.",
                );
            } else if (dados.status === "DIVERGENTE") {
                setStatus("Divergência");
                setMensagem(dados.mensagem || "O carrinho está em outro silo.");
            } else {
                setStatus("Erro");
                setMensagem("O backend retornou um resultado não reconhecido.");
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
        setSimulacaoId(null);
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
                                            operacaoIniciada || carregando || carregandoSilos || !destino || status === "Concluída" || carregandoSilos
                                        }
                                    >
                                        <option value="">
                                            Selecione um silo
                                        </option>
                                        {silosDisponiveis.map((silo) => (
                                            <option key={silo.id} value={silo.id}>
                                                {silo.nome}
                                            </option>
                                        ))}
                                    </select>
                                    <small>
                                        Destino solicitado pelo operador
                                    </small>
                                </label>
                            </div>

                            {erroSilos && <p role="alert">{erroSilos}</p>}
                            {!carregandoSilos && !erroSilos && silosDisponiveis.length === 0 && <p>Nenhum silo ativo cadastrado.</p>}
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
                                            carregando || carregandoSilos || !destino || status === "Concluída"
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
                                    Identifique o destino pela câmera do celular.
                                </p>
                            </div>
                        </div>

                        <LeitorQr onLer={lerCodigoQr}
                            disabled={operacaoIniciada || carregando || carregandoSilos || silosDisponiveis.length === 0 || status === "Concluída"} />
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
                                        {nomeDestino || "Destino não definido"}
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
                            <strong>{nomeDestino || "—"}</strong>
                        </div>

                        <div className="cart-note">
                            <span>ⓘ</span>
                            <p>
                                A posição ainda é simulada pelo backend. A câmera do celular lê apenas o QR code do destino.
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
