import "./visaoGeral.css";

const indicadores = [
    {
        titulo: "Total de silos",
        valor: "24",
        detalhe: "Silos cadastrados no sistema",
        icone: "▤",
        classe: "orange",
    },
    {
        titulo: "Conferências hoje",
        valor: "18",
        detalhe: "12 concluídas com sucesso",
        icone: "✓",
        classe: "green",
    },
    {
        titulo: "Pendências",
        valor: "03",
        detalhe: "Aguardando conferência",
        icone: "◷",
        classe: "yellow",
    },
    {
        titulo: "Carrinho",
        valor: "Operacional",
        detalhe: "Posição simulada pelo sistema",
        icone: "↔",
        classe: "blue",
    },
];

const silos = [
    { id: "SILO-001", nome: "Silo 01", status: "Conferido", classe: "success" },
    { id: "SILO-002", nome: "Silo 02", status: "Pendente", classe: "warning" },
    { id: "SILO-003", nome: "Silo 03", status: "Conferido", classe: "success" },
    {
        id: "SILO-004",
        nome: "Silo 04",
        status: "Em andamento",
        classe: "progress",
    },
];

const atividades = [
    {
        silo: "SILO-001",
        acao: "Conferência concluída",
        horario: "08:42",
        status: "Sucesso",
    },
    {
        silo: "SILO-003",
        acao: "Conferência concluída",
        horario: "08:25",
        status: "Sucesso",
    },
    {
        silo: "SILO-004",
        acao: "Conferência iniciada",
        horario: "08:10",
        status: "Em andamento",
    },
];

function VisaoGeral({ onNavigate }) {
    return (
        <main className="overview">
            <section className="overview-heading">
                <div>
                    <span className="eyebrow">PAINEL DE CONTROLE</span>
                    <h1>Visão geral</h1>
                </div>
                <button
                    className="overview-primary-button"
                    type="button"
                    onClick={() => onNavigate("Conferência")}
                >
                    <span>＋</span>
                    Nova conferência
                </button>
            </section>

            <section className="overview-stats">
                {indicadores.map((item) => (
                    <article className="overview-stat-card" key={item.titulo}>
                        <div className={`overview-stat-icon ${item.classe}`}>
                            {item.icone}
                        </div>

                        <p className="overview-stat-title">{item.titulo}</p>
                        <h2>{item.valor}</h2>
                        <p className="overview-stat-detail">{item.detalhe}</p>
                    </article>
                ))}
            </section>

            <section className="overview-content-grid">
                <article className="overview-panel silo-panel">
                    <div className="overview-panel-heading">
                        <div>
                            <h2>Situação dos silos</h2>
                            <p>Resumo dos últimos registros</p>
                        </div>

                        <button
                            className="overview-text-button"
                            type="button"
                            onClick={() => onNavigate("Silos")}
                        >
                            Ver todos ↗
                        </button>
                    </div>

                    <div className="silo-list">
                        {silos.map((silo) => (
                            <div className="silo-row" key={silo.id}>
                                <div className="silo-symbol">▤</div>

                                <div className="silo-information">
                                    <strong>{silo.nome}</strong>
                                    <span>{silo.id}</span>
                                </div>

                                <span className={`silo-status ${silo.classe}`}>
                                    <span className="status-indicator" />
                                    {silo.status}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="overview-panel-footer">
                        <span>Exibindo 4 silos de 24</span>
                        <div className="overview-progress">
                            <div />
                        </div>
                    </div>
                </article>

                <article className="overview-panel activity-panel">
                    <div className="overview-panel-heading">
                        <div>
                            <h2>Atividade recente</h2>
                            <p>Últimas movimentações registradas</p>
                        </div>

                        <span className="activity-live">
                            <span className="status-indicator" />
                            Hoje
                        </span>
                    </div>

                    <div className="activity-list">
                        {atividades.map((atividade, index) => (
                            <div
                                className="activity-row"
                                key={`${atividade.silo}-${index}`}
                            >
                                <div className="activity-timeline">
                                    <span
                                        className={`activity-icon ${atividade.status === "Sucesso" ? "success" : "progress"}`}
                                    >
                                        {atividade.status === "Sucesso"
                                            ? "✓"
                                            : "↻"}
                                    </span>
                                    {index < atividades.length - 1 && (
                                        <span className="activity-line" />
                                    )}
                                </div>

                                <div className="activity-information">
                                    <strong>{atividade.acao}</strong>
                                    <span>{atividade.silo}</span>
                                </div>

                                <time>{atividade.horario}</time>
                            </div>
                        ))}
                    </div>

                    <button
                        className="overview-history-link"
                        type="button"
                        onClick={() => onNavigate("Histórico")}
                    >
                        Consultar histórico completo <span>→</span>
                    </button>
                </article>
            </section>

            <section className="overview-bottom-banner">
                <div className="banner-icon">↗</div>

                <div>
                    <h2>Pronto para iniciar uma conferência?</h2>
                    <p>
                        Selecione o silo de destino e acompanhe o processo de
                        conferência.
                    </p>
                </div>

                <button type="button" onClick={() => onNavigate("Conferência")}>
                    Acessar conferência →
                </button>
            </section>

            <footer className="overview-footer">
                <span>SiloCheck · Sistema de conferência de silos</span>
                <span>
                    Dados demonstrativos · Integração com backend pendente
                </span>
            </footer>
        </main>
    );
}

export default VisaoGeral;
