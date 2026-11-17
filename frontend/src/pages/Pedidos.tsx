import { Fragment, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, paraErro } from '../api'
import { useAuth } from '../auth/AuthContext'
import Vazio from '../components/Vazio'
import Icone from '../components/Icone'
import { BarraTabela, ColunaOrdenavel, PaginasTabela } from '../components/Tabela'
import { useTabela } from '../utils/tabela'
import { fotoRecortada } from '../utils/fotoLocal'
import Erro from '../components/Erro'
import StatusBadge from '../components/StatusBadge'
import type { Pedido } from '../types'
import { dataBR, moeda } from '../utils/format'
import { useAvisos } from '../components/Avisos'

export default function Pedidos() {
  const avisar = useAvisos()
  const { ehCliente } = useAuth()
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null)
  const [erro, setErro] = useState<Error | null>(null)

  const carregar = useCallback(() => {
    api.listarPedidos().then(setPedidos).catch((e: unknown) => setErro(paraErro(e)))
  }, [])

  useEffect(carregar, [carregar])

  async function cancelar(id: number) {
    if (!window.confirm('Cancelar este pedido? O pedido sai da fila e não dá pra desfazer.')) return
    setErro(null)
    try {
      await api.cancelarPedido(id)
      avisar(`Pedido nº ${id} cancelado`, { texto: 'Ele continua na lista, marcado como cancelado.' })
      carregar()
    } catch (err) {
      setErro(paraErro(err))
    }
  }

  return (
    <section>
      <header className="pagina-topo">
        <h1>{ehCliente ? 'Meus pedidos' : 'Pedidos pra analisar'}</h1>
        <p className="suave">
          {ehCliente
            ? 'Veja em que pé está cada pedido.'
            : 'Aqui chegam os pedidos dos clientes. Confira a renda de cada um, responda e, se aprovar, feche o contrato.'}
        </p>
      </header>
      <Erro erro={erro} />
      {pedidos === null && !erro && <p>Carregando…</p>}
      {pedidos?.length === 0 && (
        <>
          {ehCliente ? (
            <Vazio
              icone="sacola"
              titulo="Você ainda não fez nenhum pedido"
              texto="Escolha um carro, diga os dias e mande o pedido. Ele aparece aqui pra você acompanhar."
            >
              <Link className="btn" to="/">
                Escolher um carro
              </Link>
            </Vazio>
          ) : (
            <Vazio
              icone="relogio"
              titulo="Nenhum pedido esperando sua resposta"
              texto="Quando um cliente mandar um pedido pra um carro seu, ele chega aqui."
            >
              <Link className="btn secundario" to="/automoveis">
                Ver seus carros
              </Link>
            </Vazio>
          )}
        </>
      )}
      {pedidos && pedidos.length > 0 && <TabelaPedidos pedidos={pedidos} ehCliente={ehCliente} aoCancelar={cancelar} />}
    </section>
  )
}

type CampoPedido = 'id' | 'cliente' | 'carro' | 'renda' | 'quando' | 'total' | 'situacao'

const QUEM_APROVA: Record<string, string> = { EMPRESA: 'Empresa', BANCO: 'Banco', CLIENTE: 'Cliente' }

function iniciais(nome: string): string {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')
}

function texto(p: Pedido): string {
  return `${p.id} ${p.clienteNome} ${p.automovel.marca} ${p.automovel.modelo} ${p.automovel.placa}`
}

function valor(p: Pedido, campo: CampoPedido): string | number {
  switch (campo) {
    case 'id':
      return p.id
    case 'cliente':
      return p.clienteNome
    case 'carro':
      return `${p.automovel.marca} ${p.automovel.modelo}`
    case 'renda':
      return p.clienteRendimentoTotal
    case 'quando':
      return p.dataInicio
    case 'total':
      return p.valorTotalEstimado
    case 'situacao':
      return p.status
  }
}

/** Uma tabela só, de vidro: busca, ordenação, linhas alternadas e paginação. */
function TabelaPedidos({
  pedidos,
  ehCliente,
  aoCancelar,
}: {
  pedidos: Pedido[]
  ehCliente: boolean
  aoCancelar: (id: number) => void
}) {
  const t = useTabela<Pedido, CampoPedido>(pedidos, texto, valor, { campo: 'id', crescente: false })
  const [abertos, setAbertos] = useState<Set<number>>(new Set())
  const colunas = ehCliente ? 5 : 6
  const coluna = (rotulo: string, campo: CampoPedido, className?: string) => (
    <ColunaOrdenavel
      rotulo={rotulo}
      ativa={t.ordem.campo === campo}
      crescente={t.ordem.crescente}
      aoOrdenar={() => t.ordenarPor(campo)}
      className={className}
    />
  )

  function alternar(id: number) {
    setAbertos((lista) => {
      const novo = new Set(lista)
      if (novo.has(id)) novo.delete(id)
      else novo.add(id)
      return novo
    })
  }

  return (
    <section className="tabela-vidro">
      <BarraTabela
        titulo={ehCliente ? 'Histórico' : 'Pedidos'}
        busca={t.busca}
        aoBuscar={t.buscar}
        rotuloBusca={ehCliente ? 'Buscar por carro ou placa' : 'Buscar por cliente ou carro'}
        porPagina={t.porPagina}
        aoMudarPorPagina={t.mudarPorPagina}
      >
        {ehCliente && (
          <Link className="btn" to="/">
            <Icone nome="mais" tamanho={18} /> Novo pedido
          </Link>
        )}
      </BarraTabela>
      <div className="tabela-rolagem">
        <table className="tabela-pedidos">
          <thead>
            <tr>
              {coluna('Pedido', 'id')}
              {!ehCliente && coluna('Cliente', 'cliente', 'col-cliente')}
              {coluna('Carro', 'carro')}
              {coluna('Quando', 'quando', 'col-quando')}
              {coluna('Situação', 'situacao')}
              <th scope="col" className="direita">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {t.visiveis.map((p) => {
              const aberto = p.status === 'EM_ANALISE'
              const final = p.status === 'CANCELADO' || p.status === 'CONTRATO_EXECUTADO'
              const foto = fotoRecortada(p.automovel.modelo)
              const precisaAgir = !ehCliente && (p.status === 'EM_ANALISE' || p.status === 'APROVADO_FINANCEIRAMENTE')
              const expandida = abertos.has(p.id)
              return (
                <Fragment key={p.id}>
                  <tr>
                    <td>
                      <strong>#{p.id}</strong>
                    </td>
                    {!ehCliente && (
                      <td className="col-cliente">
                        <span className="pessoa">
                          <span className="iniciais" aria-hidden="true">
                            {iniciais(p.clienteNome)}
                          </span>
                          <strong title={p.clienteNome}>{p.clienteNome}</strong>
                        </span>
                      </td>
                    )}
                    <td>
                      <span className="carro-celula">
                        <span className="carro-miniatura" aria-hidden="true">
                          {foto ? <img src={foto} alt="" /> : <Icone nome="carro" tamanho={22} />}
                        </span>
                        <span>
                          <strong title={`${p.automovel.marca} ${p.automovel.modelo}`}>
                            {p.automovel.marca} {p.automovel.modelo}
                          </strong>
                          <span className="suave pequeno">{p.automovel.placa}</span>
                        </span>
                      </span>
                    </td>
                    <td className="quando">
                      <span>{dataBR(p.dataInicio)}</span>
                      <span className="suave pequeno">a {dataBR(p.dataFim)}</span>
                    </td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="direita">
                      <span className="acoes">
                        {precisaAgir ? (
                          <Link className="btn pequeno-btn" to={`/pedidos/${p.id}`}>
                            {p.status === 'EM_ANALISE' ? 'Analisar' : 'Fechar contrato'}
                          </Link>
                        ) : (
                          <Link className="botao-icone" to={`/pedidos/${p.id}`} aria-label={`Ver pedido #${p.id}`} title="Ver">
                            <Icone nome="olho" tamanho={18} />
                          </Link>
                        )}
                        {!final && (!ehCliente || aberto) && (
                          <Link
                            className="botao-icone"
                            to={`/pedidos/${p.id}/editar`}
                            aria-label={`Mudar pedido #${p.id}`}
                            title="Mudar"
                          >
                            <Icone nome="lapis" tamanho={18} />
                          </Link>
                        )}
                        {ehCliente && !final && (
                          <button
                            type="button"
                            className="botao-icone"
                            onClick={() => aoCancelar(p.id)}
                            aria-label={`Cancelar pedido #${p.id}`}
                            title="Cancelar"
                          >
                            <Icone nome="fechar" tamanho={18} />
                          </button>
                        )}
                        <button
                          type="button"
                          className={`botao-icone seta-linha${expandida ? ' aberta' : ''}`}
                          aria-expanded={expandida}
                          aria-controls={`detalhe-${p.id}`}
                          title={expandida ? 'Fechar detalhes' : 'Ver detalhes'}
                          onClick={() => alternar(p.id)}
                        >
                          <span className="seta-simbolo" aria-hidden="true">
                            ▾
                          </span>
                          <span className="sr-only">
                            {expandida ? 'Fechar' : 'Ver'} detalhes do pedido #{p.id}
                          </span>
                        </button>
                      </span>
                    </td>
                  </tr>
                  {expandida && (
                    <tr className="linha-expandida" id={`detalhe-${p.id}`}>
                      <td colSpan={colunas}>
                        <div className="detalhe-pedido">
                          {!ehCliente && (
                            <span className="detalhe-item">
                              <span className="detalhe-rotulo">Cliente</span>
                              <strong>{p.clienteNome}</strong>
                            </span>
                          )}
                          {!ehCliente && (
                            <span className="detalhe-item">
                              <span className="detalhe-rotulo">Renda por mês</span>
                              <strong>{moeda(p.clienteRendimentoTotal)}</strong>
                            </span>
                          )}
                          <span className="detalhe-item">
                            <span className="detalhe-rotulo">Total do aluguel</span>
                            <strong>{moeda(p.valorTotalEstimado)}</strong>
                          </span>
                          <span className="detalhe-item">
                            <span className="detalhe-rotulo">Período</span>
                            <strong>
                              {dataBR(p.dataInicio)} a {dataBR(p.dataFim)}
                            </strong>
                          </span>
                          <span className="detalhe-item">
                            <span className="detalhe-rotulo">Placa</span>
                            <strong>{p.automovel.placa}</strong>
                          </span>
                          {ehCliente && (
                            <span className="detalhe-item">
                              <span className="detalhe-rotulo">Quem aprova</span>
                              <strong>{QUEM_APROVA[p.automovel.tipoProprietario] ?? '—'}</strong>
                            </span>
                          )}
                          <Link className="btn secundario pequeno-btn" to={`/pedidos/${p.id}`}>
                            Ver pedido completo
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
            {t.visiveis.length === 0 && (
              <tr>
                <td colSpan={colunas} className="suave">
                  Nenhum pedido encontrado com essa busca.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <PaginasTabela
        total={t.total}
        nome={t.total === 1 ? 'pedido' : 'pedidos'}
        pagina={t.pagina}
        totalPaginas={t.totalPaginas}
        irPara={t.irPara}
      />
    </section>
  )
}
