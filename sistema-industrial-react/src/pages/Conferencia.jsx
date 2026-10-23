import { useState } from "react";
import "./Conferencia.css";

const silosDisponiveis = [
    "SILO-001",
    "SILO-002",
    "SILO-003",
    "SILO-004",
    "SILO-005",
    "SILO-006",
];

function Conferencia() {
    const [origem, setOrigem] = useState("SILO-001");
    const [destino, setDestino] = useState("");
    const [status, setStatus] = useState("Aguardando");
    const [mensagem, setMensagem] = useState("");

    function iniciarConferencia(event) {
        event.preventDefault();

        if (!destino) {
            setMensagem("Selecione ou informe o silo de destino.");
            return;
        }

        if (origem === destino) {
            setMensagem("O silo de destino deve ser diferente da origem.");
            return;
        }

        setMensagem("");
        setStatus("Em andamento");
    }

    function concluirConferencia() {
        setOrigem(destino);
        setDestino("");
        setStatus("Concluída");
        setMensagem("Conferência demonstrativa concluída com sucesso.");
    }

    function reiniciarConferencia() {
        setDestino("");
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
                    className={`conference-status ${operacaoIniciada ? "running" : status === "Concluída" ? "completed" : ""}`}
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
                                <p>Informe a origem e o silo de destino.</p>
                            </div>
                        </div>

                        <form onSubmit={iniciarConferencia}>
                            <div className="conference-fields">
                                <label className="conference-field">
                                    <span>Silo de origem</span>
                                    <select
                                        value={origem}
                                        onChange={(event) =>
                                            setOrigem(event.target.value)
                                        }
                                        disabled={operacaoIniciada}
                                    >
                                        {silosDisponiveis.map((silo) => (
                                            <option key={silo} value={silo}>
                                                {silo}
                                            </option>
                                        ))}
                                    </select>
                                    <small>
                                        Posição atual informada para o carrinho
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
                                        disabled={operacaoIniciada}
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
                                        Destino da próxima conferência
                                    </small>
                                </label>
                            </div>

                            {mensagem && (
                                <div
                                    className={`conference-message ${status === "Concluída" ? "success" : ""}`}
                                >
                                    {mensagem}
                                </div>
                            )}

                            <div className="conference-form-actions">
                                {!operacaoIniciada ? (
                                    <button
                                        className="conference-primary-button"
                                        type="submit"
                                    >
                                        {status === "Concluída"
                                            ? "＋ Nova conferência"
                                            : "▶ Iniciar conferência"}
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className="conference-secondary-button"
                                            type="button"
                                            onClick={reiniciarConferencia}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            className="conference-primary-button"
                                            type="button"
                                            onClick={concluirConferencia}
                                        >
                                            ✓ Confirmar chegada
                                        </button>
                                    </>
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
                                        "O leitor de câmera ainda não foi integrado. Selecione o silo manualmente acima.",
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
                                className={`cart-status-dot ${operacaoIniciada ? "active" : ""}`}
                            />
                        </div>

                        <div className="cart-visual">
                            <div className="cart-track">
                                <div className="cart-location">
                                    <span className="cart-location-dot" />
                                    <span>{origem}</span>
                                </div>

                                <div
                                    className={`cart-line ${operacaoIniciada ? "moving" : ""}`}
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
                                {operacaoIniciada
                                    ? "Em deslocamento (simulado)"
                                    : "Aguardando comando"}
                            </strong>
                        </div>

                        <div className="cart-info-row">
                            <span>Origem</span>
                            <strong>{origem}</strong>
                        </div>

                        <div className="cart-info-row">
                            <span>Destino</span>
                            <strong>{destino || "—"}</strong>
                        </div>

                        <div className="cart-note">
                            <span>ⓘ</span>
                            <p>
                                A posição do carrinho ainda não é obtida por
                                sensores. O deslocamento é apenas visual e
                                demonstrativo.
                            </p>
                        </div>
                    </article>

                    <article className="conference-tip">
                        <span className="conference-tip-icon">✦</span>
                        <div>
                            <h3>Próxima etapa</h3>
                            <p>
                                Integrar os silos cadastrados e o estado do
                                carrinho à API do backend.
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
