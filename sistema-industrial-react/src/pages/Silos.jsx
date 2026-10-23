import "./Silos.css";

const silos = [
    {
        id: "S-001",
        nome: "Silo 01",
        produto: "Milho",
        capacidade: 120,
        atual: 84,
        status: "Conferido",
        ultima: "Hoje, 08:42",
    },
    {
        id: "S-002",
        nome: "Silo 02",
        produto: "Soja",
        capacidade: 100,
        atual: 67,
        status: "Pendente",
        ultima: "Ontem, 16:18",
    },
    {
        id: "S-003",
        nome: "Silo 03",
        produto: "Milho",
        capacidade: 150,
        atual: 121,
        status: "Conferido",
        ultima: "Hoje, 09:15",
    },
    {
        id: "S-004",
        nome: "Silo 04",
        produto: "Trigo",
        capacidade: 90,
        atual: 28,
        status: "Atenção",
        ultima: "Ontem, 14:03",
    },
    {
        id: "S-005",
        nome: "Silo 05",
        produto: "Soja",
        capacidade: 110,
        atual: 76,
        status: "Pendente",
        ultima: "—",
    },
];

function Silos() {
    return (
        <main className="silos-page">
            <div className="silos-heading">
                <div>
                    <span className="silos-eyebrow">OPERAÇÃO / INVENTÁRIO</span>
                    <h1>Silos</h1>
                    <p>
                        Acompanhe os silos cadastrados e o estado de cada
                        conferência.
                    </p>
                </div>
                <button
                    className="silos-primary-button"
                    type="button"
                    onClick={() =>
                        window.alert(
                            "Cadastro de silo será disponibilizado em uma próxima etapa.",
                        )
                    }
                >
                    <span aria-hidden="true">＋</span> Novo silo
                </button>
            </div>

            <section className="silos-summary" aria-label="Resumo dos silos">
                <article className="silos-summary-card">
                    <span className="silos-summary-icon">▤</span>
                    <div>
                        <span>Total de silos</span>
                        <strong>05</strong>
                        <small>cadastrados no sistema</small>
                    </div>
                </article>
                <article className="silos-summary-card">
                    <span className="silos-summary-icon green">✓</span>
                    <div>
                        <span>Conferidos</span>
                        <strong>02</strong>
                        <small>com conferência concluída</small>
                    </div>
                </article>
                <article className="silos-summary-card">
                    <span className="silos-summary-icon amber">◷</span>
                    <div>
                        <span>Pendentes</span>
                        <strong>02</strong>
                        <small>aguardando conferência</small>
                    </div>
                </article>
                <article className="silos-summary-card">
                    <span className="silos-summary-icon red">!</span>
                    <div>
                        <span>Em atenção</span>
                        <strong>01</strong>
                        <small>requer verificação</small>
                    </div>
                </article>
            </section>

            <section className="silos-table-panel">
                <div className="silos-panel-heading">
                    <div>
                        <h2>Inventário de silos</h2>
                        <p>Visualização demonstrativa dos registros</p>
                    </div>
                    <span className="silos-count">5 silos</span>
                </div>
                <div className="silos-table-wrap">
                    <table className="silos-table">
                        <thead>
                            <tr>
                                <th>SILO</th>
                                <th>PRODUTO</th>
                                <th>CAPACIDADE (t)</th>
                                <th>OCUPAÇÃO</th>
                                <th>STATUS</th>
                                <th>ÚLTIMA CONFERÊNCIA</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {silos.map((silo) => {
                                const percentual = Math.round(
                                    (silo.atual / silo.capacidade) * 100,
                                );
                                return (
                                    <tr key={silo.id}>
                                        <td>
                                            <div className="silos-name">
                                                <span className="silos-row-icon">
                                                    ▤
                                                </span>
                                                <div>
                                                    <strong>{silo.nome}</strong>
                                                    <small>{silo.id}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{silo.produto}</td>
                                        <td>{silo.capacidade} t</td>
                                        <td>
                                            <div className="silos-occupancy">
                                                <div className="silos-occupancy-track">
                                                    <span
                                                        style={{
                                                            width: `${percentual}%`,
                                                        }}
                                                    />
                                                </div>
                                                <small>
                                                    {percentual}% · {silo.atual}{" "}
                                                    t
                                                </small>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className={`silos-status ${silo.status.toLowerCase().replace("ã", "a")}`}
                                            >
                                                {silo.status}
                                            </span>
                                        </td>
                                        <td className="silos-last-check">
                                            {silo.ultima}
                                        </td>
                                        <td>
                                            <button
                                                className="silos-more"
                                                type="button"
                                                aria-label={`Opções de ${silo.nome}`}
                                                onClick={() =>
                                                    window.alert(
                                                        `${silo.nome} (${silo.id})\\nProduto: ${silo.produto}\\nCapacidade: ${silo.capacidade} toneladas\\nOcupação: ${percentual}%`,
                                                    )
                                                }
                                            >
                                                ⋯
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="silos-table-footer">
                    <span>
                        Dados ilustrativos para estruturação da interface.
                        Nenhuma alteração foi feita no backend.
                    </span>
                    <span>1–5 de 5 silos</span>
                </div>
            </section>
        </main>
    );
}

export default Silos;
