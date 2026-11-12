import { useCallback, useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, paraErro } from '../api'
import { useAuth } from '../auth/AuthContext'
import Erro from '../components/Erro'
import StatusBadge from '../components/StatusBadge'
import type { Pedido, TipoProprietario } from '../types'
import { dataBR, moeda } from '../utils/format'

const PROPRIEDADES: Record<TipoProprietario, string> = {
  CLIENTE: 'Cliente',
  EMPRESA: 'Empresa',
  BANCO: 'Banco',
}

export default function PedidoDetalhe() {
  const { id } = useParams()
  const { ehAgente, ehBanco } = useAuth()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [erro, setErro] = useState<Error | null>(null)

  const carregar = useCallback(() => {
    if (id === undefined) return
    api.buscarPedido(id).then(setPedido).catch((e: unknown) => setErro(paraErro(e)))
  }, [id])

  useEffect(carregar, [carregar])

  if (erro && !pedido) return <Erro erro={erro} />
  if (!pedido) return <p>Carregando…</p>

  return (
    <section className="cartao">
      <div className="cabecalho">
        <h1>Pedido #{pedido.id}</h1>
        <StatusBadge status={pedido.status} />
      </div>

      <dl className="detalhes">
        <dt>Cliente</dt>
        <dd>
          {pedido.clienteNome}
          {ehAgente && <> · rendimento total {moeda(pedido.clienteRendimentoTotal)}</>}
        </dd>
        <dt>Automóvel</dt>
        <dd>
          {pedido.automovel.marca} {pedido.automovel.modelo} {pedido.automovel.ano} · placa{' '}
          {pedido.automovel.placa} · matrícula {pedido.automovel.matricula}
        </dd>
        <dt>Período</dt>
        <dd>
          {dataBR(pedido.dataInicio)} a {dataBR(pedido.dataFim)}
        </dd>
        <dt>Valor estimado</dt>
        <dd>{moeda(pedido.valorTotalEstimado)}</dd>
        {pedido.parecer && (
          <>
            <dt>Parecer financeiro</dt>
            <dd>{pedido.parecer}</dd>
          </>
        )}
        {pedido.propriedadeRegistrada && (
          <>
            <dt>Automóvel registrado em nome de</dt>
            <dd>{PROPRIEDADES[pedido.propriedadeRegistrada]}</dd>
          </>
        )}
        {pedido.credito && (
          <>
            <dt>Contrato de crédito</dt>
            <dd>
              {pedido.credito.banco}: {moeda(pedido.credito.valor)} em {pedido.credito.parcelas}x, juros de{' '}
              {pedido.credito.taxaJurosMensal}% a.m.
            </dd>
          </>
        )}
      </dl>

      <Erro erro={erro} />

      {ehAgente && pedido.status === 'EM_ANALISE' && (
        <Avaliacao pedidoId={pedido.id} aoConcluir={carregar} aoErro={setErro} />
      )}
      {ehAgente && pedido.status === 'APROVADO_FINANCEIRAMENTE' && (
        <Execucao pedidoId={pedido.id} ehBanco={ehBanco} aoConcluir={carregar} aoErro={setErro} />
      )}

      <p>
        <Link to="/">← Voltar aos pedidos</Link>
      </p>
    </section>
  )
}

interface AcaoProps {
  pedidoId: number
  aoConcluir: () => void
  aoErro: (erro: Error | null) => void
}

function Avaliacao({ pedidoId, aoConcluir, aoErro }: AcaoProps) {
  const [parecer, setParecer] = useState('')

  async function avaliar(aprovado: boolean) {
    aoErro(null)
    try {
      await api.avaliarPedido(pedidoId, { aprovado, parecer })
      aoConcluir()
    } catch (err) {
      aoErro(paraErro(err))
    }
  }

  return (
    <fieldset>
      <legend>Análise financeira</legend>
      <label>
        Parecer
        <textarea
          value={parecer}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setParecer(e.target.value)}
          rows={3}
          maxLength={1000}
        />
      </label>
      <div className="linha">
        <button className="btn" disabled={!parecer.trim()} onClick={() => avaliar(true)}>
          Aprovar
        </button>
        <button className="btn perigo" disabled={!parecer.trim()} onClick={() => avaliar(false)}>
          Reprovar
        </button>
      </div>
    </fieldset>
  )
}

interface CreditoForm {
  valor: string
  taxaJurosMensal: string
  parcelas: string
}

function Execucao({ pedidoId, ehBanco, aoConcluir, aoErro }: AcaoProps & { ehBanco: boolean }) {
  const [propriedade, setPropriedade] = useState<TipoProprietario>('EMPRESA')
  const [comCredito, setComCredito] = useState(false)
  const [credito, setCredito] = useState<CreditoForm>({ valor: '', taxaJurosMensal: '', parcelas: '' })

  async function executar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    aoErro(null)
    try {
      await api.executarPedido(pedidoId, {
        propriedade,
        credito: comCredito
          ? {
              valor: Number(credito.valor),
              taxaJurosMensal: Number(credito.taxaJurosMensal),
              parcelas: Number(credito.parcelas),
            }
          : null,
      })
      aoConcluir()
    } catch (err) {
      aoErro(paraErro(err))
    }
  }

  const campo = (nome: keyof CreditoForm) => (e: ChangeEvent<HTMLInputElement>) =>
    setCredito({ ...credito, [nome]: e.target.value })

  return (
    <form onSubmit={executar}>
      <fieldset>
        <legend>Execução do contrato</legend>
        <label>
          Automóvel registrado como propriedade de
          <select
            value={propriedade}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setPropriedade(e.target.value as TipoProprietario)}
          >
            {(Object.keys(PROPRIEDADES) as TipoProprietario[]).map((valor) => (
              <option key={valor} value={valor}>
                {PROPRIEDADES[valor]}
              </option>
            ))}
          </select>
        </label>
        {ehBanco && (
          <label className="check">
            <input
              type="checkbox"
              checked={comCredito}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setComCredito(e.target.checked)}
            />
            Associar contrato de crédito deste banco
          </label>
        )}
        {comCredito && (
          <div className="grade">
            <label>
              Valor (R$)
              <input type="number" min="0.01" step="0.01" required value={credito.valor} onChange={campo('valor')} />
            </label>
            <label>
              Juros (% a.m.)
              <input
                type="number"
                min="0"
                step="0.001"
                required
                value={credito.taxaJurosMensal}
                onChange={campo('taxaJurosMensal')}
              />
            </label>
            <label>
              Parcelas
              <input
                type="number"
                min="1"
                max="120"
                required
                value={credito.parcelas}
                onChange={campo('parcelas')}
              />
            </label>
          </div>
        )}
        <button className="btn">Executar contrato</button>
      </fieldset>
    </form>
  )
}
