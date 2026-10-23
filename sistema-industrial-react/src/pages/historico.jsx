import { useMemo, useState } from "react";
import "./historico.css";

const registros = [
    {
        id: "CF-1048",
        silo: "Silo 03",
        codigo: "S-003",
        tipo: "Conferência concluída",
        responsavel: "Operador A",
        data: "23/10/2026",
        hora: "09:15",
        status: "Concluída",
        detalhe: "Quantidade conferida e registrada.",
    },
    {
        id: "CF-1047",
        silo: "Silo 01",
        codigo: "S-001",
        tipo: "Conferência concluída",
        responsavel: "Operador B",
        data: "23/10/2026",
        hora: "08:42",
        status: "Concluída",
        detalhe: "Conferência finalizada sem divergências.",
    },
    {
        id: "CF-1046",
        silo: "Silo 04",
        codigo: "S-004",
        tipo: "Divergência identificada",
        responsavel: "Operador A",
        data: "22/10/2026",
        hora: "14:03",
        status: "Atenção",
        detalhe: "Quantidade registrada precisa de revisão.",
    },
    {
        id: "CF-1045",
        silo: "Silo 02",
        codigo: "S-002",
        tipo: "Conferência iniciada",
        responsavel: "Operador C",
        data: "22/10/2026",
        hora: "11:26",
        status: "Pendente",
        detalhe: "Conferência aguardando conclusão.",
    },
    {
        id: "CF-1044",
        silo: "Silo 05",
        codigo: "S-005",
        tipo: "Silo cadastrado",
        responsavel: "Administrador",
        data: "21/10/2026",
        hora: "16:10",
        status: "Informativo",
        detalhe: "Registro ilustrativo de cadastro.",
    },
];

function Historico() {
    const [busca, setBusca] = useState("");
    const [filtro, setFiltro] = useState("Todos");
    const [selecionado, setSelecionado] = useState(null);

    const filtrados = useMemo(
        () =>
            registros.filter((item) => {
                const termo = busca.trim().toLowerCase();
                const correspondeBusca =
                    !termo ||
                    [
                        item.id,
                        item.silo,
                        item.codigo,
                        item.tipo,
                        item.responsavel,
                    ].some((v) => v.toLowerCase().includes(termo));
                const correspondeFiltro =
                    filtro === "Todos" || item.status === filtro;
                return correspondeBusca && correspondeFiltro;
            }),
        [busca, filtro],
    );

    return (
        <main className="historico-page">
            <div className="historico-heading">
                <div>
                    <span className="historico-eyebrow">
                        OPERAÇÃO / AUDITORIA
                    </span>
                    <h1>Histórico</h1>
                    <p>
                        Consulte as atividades e os registros recentes do
                        sistema.
                    </p>
                </div>
                <div className="historico-total">
                    <span>REGISTROS EXIBIDOS</span>
                    <strong>
                        {filtrados.length.toString().padStart(2, "0")}
                    </strong>
                </div>
            </div>

            <section className="historico-summary">
                <article>
                    <span className="historico-summary-icon">◷</span>
                    <div>
                        <small>Atividades registradas</small>
                        <strong>128</strong>
                        <span>no período demonstrativo</span>
                    </div>
                </article>
                <article>
                    <span className="historico-summary-icon green">✓</span>
                    <div>
                        <small>Conferências concluídas</small>
                        <strong>96</strong>
                        <span>registros de conclusão</span>
                    </div>
                </article>
                <article>
                    <span className="historico-summary-icon amber">!</span>
                    <div>
                        <small>Precisam de atenção</small>
                        <strong>04</strong>
                        <span>itens para revisar</span>
                    </div>
                </article>
            </section>

            <section className="historico-panel">
                <div className="historico-panel-heading">
                    <div>
                        <h2>Registro de atividades</h2>
                        <p>
                            Dados ilustrativos para a interface; ainda não
                            conectados ao backend.
                        </p>
                    </div>
                    <span className="historico-live-dot">
                        <i /> Histórico local
                    </span>
                </div>
                <div className="historico-filters">
                    <label className="historico-search">
                        <span aria-hidden="true">⌕</span>
                        <input
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            placeholder="Buscar por silo, registro ou responsável..."
                        />
                    </label>
                    <label className="historico-filter-label">
                        <span>Status</span>
                        <select
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        >
                            <option>Todos</option>
                            <option>Concluída</option>
                            <option>Atenção</option>
                            <option>Pendente</option>
                            <option>Informativo</option>
                        </select>
                    </label>
                </div>
                <div className="historico-list">
                    {filtrados.map((item) => (
                        <article className="historico-entry" key={item.id}>
                            <div
                                className={`historico-entry-icon ${item.status.toLowerCase()}`}
                            >
                                {item.status === "Concluída"
                                    ? "✓"
                                    : item.status === "Atenção"
                                      ? "!"
                                      : item.status === "Pendente"
                                        ? "◷"
                                        : "＋"}
                            </div>
                            <div className="historico-entry-main">
                                <div className="historico-entry-title">
                                    <h3>{item.tipo}</h3>
                                    <span
                                        className={`historico-status ${item.status.toLowerCase()}`}
                                    >
                                        {item.status}
                                    </span>
                                </div>
                                <p>{item.detalhe}</p>
                                <div className="historico-entry-meta">
                                    <span>
                                        ▤ {item.silo}{" "}
                                        <small>({item.codigo})</small>
                                    </span>
                                    <span>♙ {item.responsavel}</span>
                                    <span>
                                        ◷ {item.data} · {item.hora}
                                    </span>
                                </div>
                            </div>
                            <button
                                className="historico-detail-button"
                                type="button"
                                onClick={() =>
                                    setSelecionado(
                                        selecionado === item.id
                                            ? null
                                            : item.id,
                                    )
                                }
                            >
                                {selecionado === item.id
                                    ? "Fechar"
                                    : "Detalhes"}{" "}
                                <span>
                                    {selecionado === item.id ? "−" : "＋"}
                                </span>
                            </button>
                            {selecionado === item.id && (
                                <div className="historico-detail">
                                    <strong>Registro {item.id}</strong>
                                    <p>{item.detalhe}</p>
                                    <span>
                                        Responsável: {item.responsavel} · Data:{" "}
                                        {item.data} às {item.hora}
                                    </span>
                                </div>
                            )}
                        </article>
                    ))}
                    {filtrados.length === 0 && (
                        <div className="historico-empty">
                            <span>⌕</span>
                            <strong>Nenhum registro encontrado</strong>
                            <p>
                                Tente mudar o termo da busca ou o filtro de
                                status.
                            </p>
                        </div>
                    )}
                </div>
                <div className="historico-footer">
                    <span>
                        Exibindo {filtrados.length} de {registros.length}{" "}
                        registros de demonstração
                    </span>
                    <button
                        type="button"
                        onClick={() => {
                            setBusca("");
                            setFiltro("Todos");
                        }}
                    >
                        Limpar filtros
                    </button>
                </div>
            </section>
        </main>
    );
}

export default Historico;
