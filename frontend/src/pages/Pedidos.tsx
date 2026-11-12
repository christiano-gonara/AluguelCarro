import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, paraErro } from '../api'
import { useAuth } from '../auth/AuthContext'
import Erro from '../components/Erro'
import StatusBadge from '../components/StatusBadge'
import type { Pedido } from '../types'
import { dataBR, moeda } from '../utils/format'

export default function Pedidos() {
  const { ehCliente } = useAuth()
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null)
  const [erro, setErro] = useState<Error | null>(null)

  const carregar = useCallback(() => {
    api.listarPedidos().then(setPedidos).catch((e: unknown) => setErro(paraErro(e)))
  }, [])

  useEffect(carregar, [carregar])

  async function cancelar(id: number) {
    if (!window.confirm('Cancelar este pedido?')) return
    setErro(null)
    try {
      await api.cancelarPedido(id)
      carregar()
    } catch (err) {
      setErro(paraErro(err))
    }
  }

  return (
    <section>
      <header className="pagina-topo">
        <h1>{ehCliente ? 'Meus pedidos' : 'Pedidos de aluguel'}</h1>
        <p className="suave">
          {ehCliente
            ? 'Acompanhe aqui a análise e o contrato de cada pedido.'
            : 'Pedidos em análise aguardam o seu parecer financeiro.'}
        </p>
      </header>
      <Erro erro={erro} />
      {pedidos === null && !erro && <p>Carregando…</p>}
      {pedidos?.length === 0 && (
        <div className="vazio">
          {ehCliente ? (
            <p>
              Você ainda não fez nenhum pedido. <Link to="/">Escolha um carro no catálogo</Link> para começar.
            </p>
          ) : (
            <p>Nenhum pedido para analisar no momento.</p>
          )}
        </div>
      )}
      {pedidos && pedidos.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>#</th>
              {!ehCliente && <th>Cliente</th>}
              <th>Automóvel</th>
              <th>Período</th>
              <th>Valor estimado</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => {
              const aberto = p.status === 'EM_ANALISE'
              const final = p.status === 'CANCELADO' || p.status === 'CONTRATO_EXECUTADO'
              return (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  {!ehCliente && <td>{p.clienteNome}</td>}
                  <td>
                    {p.automovel.marca} {p.automovel.modelo} ({p.automovel.placa})
                  </td>
                  <td>
                    {dataBR(p.dataInicio)} a {dataBR(p.dataFim)}
                  </td>
                  <td>{moeda(p.valorTotalEstimado)}</td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="acoes">
                    <Link to={`/pedidos/${p.id}`}>Ver</Link>
                    {!final && (!ehCliente || aberto) && <Link to={`/pedidos/${p.id}/editar`}>Editar</Link>}
                    {ehCliente && !final && (
                      <button className="link" onClick={() => cancelar(p.id)}>
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </section>
  )
}
