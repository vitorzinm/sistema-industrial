import { useEffect, useMemo, useState } from 'react'
import './historico.css'

const API_URL = 'http://localhost:3000/api/conferencia'

function formatarSilo(valor) {
    if (typeof valor === 'string' && valor.trim()) return valor.startsWith('SILO-') ? valor : valor
    return Number.isInteger(Number(valor)) && valor !== null && valor !== ''
        ? `SILO-${String(Number(valor)).padStart(3, '0')}`
        : 'Não informado'
}

function formatarDataHora(valor) {
    if (!valor) return { data: '—', hora: '—' }

    const data = new Date(valor)
    if (Number.isNaN(data.getTime())) return { data: '—', hora: '—' }

    return {
        data: data.toLocaleDateString('pt-BR'),
        hora: data.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        }),
    }
}

function adaptarRegistro(registro) {
    const { data, hora } = formatarDataHora(registro.dataHora || registro.data_hora)
    const statusVisual = {
        APROVADO: 'Concluída',
        DIVERGENTE: 'Atenção',
        POSICAO_DESCONHECIDA: 'Pendente',
        SILO_INVALIDO: 'Atenção',
        ERRO: 'Informativo',
    }[registro.status] || 'Informativo'

    const statusTexto = {
        APROVADO: 'Aprovada',
        DIVERGENTE: 'Divergente',
        POSICAO_DESCONHECIDA: 'Posição desconhecida',
        SILO_INVALIDO: 'Silo inválido',
        ERRO: 'Erro',
    }[registro.status] || registro.status || 'Sem status'

    const solicitado = formatarSilo(registro.siloSolicitado ?? registro.silo_solicitado ?? registro.siloSolicitadoId)
    const detectado = formatarSilo(registro.siloDetectado ?? registro.silo_detectado ?? registro.siloDetectadoId)

    return {
        id: `CF-${String(registro.id).padStart(4, '0')}`,
        silo: solicitado,
        codigo: solicitado !== 'Não informado' ? solicitado.replace('SILO-', 'S-') : '—',
        tipo: `Conferência ${statusTexto.toLowerCase()}`,
        responsavel: 'Sistema de simulação',
        data,
        hora,
        status: statusVisual,
        statusTexto,
        statusOriginal: registro.status,
        detalhe: `Destino solicitado: ${solicitado}. Posição detectada: ${detectado}. ${registro.mensagem || ''}`.trim(),
        dataHora: registro.dataHora,
    }
}

function Historico() {
    const [registros, setRegistros] = useState([])
    const [busca, setBusca] = useState('')
    const [filtro, setFiltro] = useState('Todos')
    const [selecionado, setSelecionado] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')

    async function carregarHistorico() {
        setCarregando(true)
        setErro('')

        try {
            const resposta = await fetch(`${API_URL}/historico`)
            const dados = await resposta.json()

            if (!resposta.ok) {
                throw new Error(dados.mensagem || 'Não foi possível carregar o histórico.')
            }

            const lista = Array.isArray(dados) ? dados : (dados.registros || [])
            setRegistros(lista.map(adaptarRegistro))
        } catch (error) {
            setErro(`Não foi possível conectar ao backend: ${error.message}`)
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        carregarHistorico()
    }, [])

    const filtrados = useMemo(() => {
        const termo = busca.trim().toLowerCase()

        return registros.filter((item) => {
            const correspondeBusca =
                !termo ||
                [item.id, item.silo, item.codigo, item.tipo, item.responsavel, item.detalhe]
                    .some((valor) => String(valor).toLowerCase().includes(termo))

            const correspondeFiltro =
                filtro === 'Todos' ||
                (filtro === 'Aprovadas' && item.statusOriginal === 'APROVADO') ||
                (filtro === 'Divergentes' && item.statusOriginal === 'DIVERGENTE') ||
                (filtro === 'Posição desconhecida' && item.statusOriginal === 'POSICAO_DESCONHECIDA') ||
                (filtro === 'Erros' && ['ERRO', 'SILO_INVALIDO'].includes(item.statusOriginal))

            return correspondeBusca && correspondeFiltro
        })
    }, [busca, filtro, registros])

    const aprovadas = registros.filter((item) => item.statusOriginal === 'APROVADO').length
    const divergentes = registros.filter((item) => item.statusOriginal === 'DIVERGENTE').length
    const atencao = registros.filter((item) =>
        ['POSICAO_DESCONHECIDA', 'SILO_INVALIDO', 'ERRO'].includes(item.statusOriginal),
    ).length

    return (
        <main className="historico-page">
            <div className="historico-heading">
                <div>
                    <span className="historico-eyebrow">OPERAÇÃO / AUDITORIA</span>
                    <h1>Histórico</h1>
                    <p>Consulte as tentativas de conferência registradas pelo backend.</p>
                </div>
                <div className="historico-total">
                    <span>REGISTROS EXIBIDOS</span>
                    <strong>{filtrados.length.toString().padStart(2, '0')}</strong>
                </div>
            </div>

            <section className="historico-summary">
                <article>
                    <span className="historico-summary-icon">◷</span>
                    <div>
                        <small>Tentativas registradas</small>
                        <strong>{registros.length}</strong>
                        <span>retornadas pela API</span>
                    </div>
                </article>
                <article>
                    <span className="historico-summary-icon green">✓</span>
                    <div>
                        <small>Conferências aprovadas</small>
                        <strong>{aprovadas}</strong>
                        <span>destino corresponde à posição</span>
                    </div>
                </article>
                <article>
                    <span className="historico-summary-icon amber">!</span>
                    <div>
                        <small>Divergências / erros</small>
                        <strong>{divergentes + atencao}</strong>
                        <span>tentativas que exigem atenção</span>
                    </div>
                </article>
            </section>

            <section className="historico-panel">
                <div className="historico-panel-heading">
                    <div>
                        <h2>Registro de conferências</h2>
                        <p>Os dados são carregados da API Express.</p>
                    </div>
                    <span className="historico-live-dot"><i /> Histórico do backend</span>
                </div>

                <div className="historico-filters">
                    <label className="historico-search">
                        <span aria-hidden="true">⌕</span>
                        <input
                            value={busca}
                            onChange={(event) => setBusca(event.target.value)}
                            placeholder="Buscar por silo, registro ou detalhe..."
                        />
                    </label>
                    <label className="historico-filter-label">
                        <span>Resultado</span>
                        <select value={filtro} onChange={(event) => setFiltro(event.target.value)}>
                            <option>Todos</option>
                            <option>Aprovadas</option>
                            <option>Divergentes</option>
                            <option>Posição desconhecida</option>
                            <option>Erros</option>
                        </select>
                    </label>
                    <button className="historico-refresh" type="button" onClick={carregarHistorico} disabled={carregando}>
                        {carregando ? 'Atualizando...' : 'Atualizar'}
                    </button>
                </div>

                {erro && <div className="historico-error" role="alert">{erro}</div>}

                <div className="historico-list">
                    {carregando ? (
                        <div className="historico-empty">
                            <strong>Carregando histórico...</strong>
                            <p>Aguarde enquanto consultamos o backend.</p>
                        </div>
                    ) : filtrados.map((item) => (
                        <article className="historico-entry" key={item.id}>
                            <div className={`historico-entry-icon ${item.status.toLowerCase()}`}>
                                {item.statusOriginal === 'APROVADO'
                                    ? '✓'
                                    : item.statusOriginal === 'DIVERGENTE' || item.statusOriginal === 'SILO_INVALIDO'
                                      ? '!'
                                      : item.statusOriginal === 'POSICAO_DESCONHECIDA'
                                        ? '◷'
                                        : '+'}
                            </div>
                            <div className="historico-entry-main">
                                <div className="historico-entry-title">
                                    <h3>{item.tipo}</h3>
                                    <span className={`historico-status ${item.status.toLowerCase()}`}>
                                        {item.statusTexto}
                                    </span>
                                </div>
                                <p>{item.detalhe}</p>
                                <div className="historico-entry-meta">
                                    <span>▤ {item.silo} <small>({item.codigo})</small></span>
                                    <span>♙ {item.responsavel}</span>
                                    <span>◷ {item.data} · {item.hora}</span>
                                </div>
                            </div>
                            <button
                                className="historico-detail-button"
                                type="button"
                                onClick={() => setSelecionado(selecionado === item.id ? null : item.id)}
                            >
                                {selecionado === item.id ? 'Fechar' : 'Detalhes'}{' '}
                                <span>{selecionado === item.id ? '−' : '+'}</span>
                            </button>
                            {selecionado === item.id && (
                                <div className="historico-detail">
                                    <strong>Registro {item.id}</strong>
                                    <p>{item.detalhe}</p>
                                    <span>Responsável: {item.responsavel} · Data: {item.data} às {item.hora}</span>
                                </div>
                            )}
                        </article>
                    ))}

                    {!carregando && !erro && filtrados.length === 0 && (
                        <div className="historico-empty">
                            <span>⌕</span>
                            <strong>Nenhuma conferência encontrada</strong>
                            <p>Faça uma conferência ou ajuste os filtros.</p>
                        </div>
                    )}
                </div>

                <div className="historico-footer">
                    <span>Exibindo {filtrados.length} de {registros.length} registros retornados pela API</span>
                    <button type="button" onClick={() => { setBusca(''); setFiltro('Todos') }}>
                        Limpar filtros
                    </button>
                </div>
            </section>
        </main>
    )
}

export default Historico
