import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, paraErro } from '../api'
import Erro from '../components/Erro'
import type { Automovel } from '../types'
import { moeda } from '../utils/format'

interface PedidoFormState {
  automovelId: string
  dataInicio: string
  dataFim: string
}

const hoje = () => new Date().toISOString().slice(0, 10)

/** Serve para criar (cliente) e para modificar (cliente ou agente) um pedido. */
export default function PedidoForm() {
  const { id } = useParams()
  const editando = id !== undefined
  const navigate = useNavigate()
  const [automoveis, setAutomoveis] = useState<Automovel[]>([])
  const [form, setForm] = useState<PedidoFormState>({ automovelId: '', dataInicio: hoje(), dataFim: hoje() })
  const [erro, setErro] = useState<Error | null>(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    api.listarAutomoveis().then(setAutomoveis).catch((e: unknown) => setErro(paraErro(e)))
    if (id !== undefined) {
      api
        .buscarPedido(id)
        .then((p) =>
          setForm({ automovelId: String(p.automovel.id), dataInicio: p.dataInicio, dataFim: p.dataFim }),
        )
        .catch((e: unknown) => setErro(paraErro(e)))
    }
  }, [id])

  const carro = automoveis.find((a) => String(a.id) === form.automovelId)
  const dias = Math.max(
    0,
    (new Date(form.dataFim).getTime() - new Date(form.dataInicio).getTime()) / 86400000 + 1,
  )

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro(null)
    setEnviando(true)
    const corpo = { ...form, automovelId: Number(form.automovelId) }
    try {
      const pedido = id !== undefined ? await api.modificarPedido(id, corpo) : await api.criarPedido(corpo)
      navigate(`/pedidos/${pedido.id}`)
    } catch (err) {
      setErro(paraErro(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="cartao">
      <h1>{editando ? `Modificar pedido #${id}` : 'Novo pedido de aluguel'}</h1>
      <form onSubmit={enviar}>
        <label>
          Automóvel
          <select
            value={form.automovelId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, automovelId: e.target.value })}
            required
          >
            <option value="">Selecione…</option>
            {automoveis.map((a) => (
              <option key={a.id} value={a.id}>
                {a.marca} {a.modelo} {a.ano} · {a.placa} · {moeda(a.valorDiaria)}/dia
              </option>
            ))}
          </select>
        </label>
        <div className="grade">
          <label>
            Início
            <input
              type="date"
              value={form.dataInicio}
              min={editando ? undefined : hoje()}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, dataInicio: e.target.value })}
              required
            />
          </label>
          <label>
            Fim
            <input
              type="date"
              value={form.dataFim}
              min={form.dataInicio}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, dataFim: e.target.value })}
              required
            />
          </label>
        </div>
        {carro && dias > 0 && (
          <p className="suave">
            Valor estimado: <strong>{moeda(carro.valorDiaria * dias)}</strong> ({dias} dia
            {dias > 1 ? 's' : ''})
          </p>
        )}
        <Erro erro={erro} />
        <button className="btn" disabled={enviando}>
          {enviando ? 'Salvando…' : editando ? 'Salvar alterações' : 'Enviar pedido'}
        </button>
      </form>
    </div>
  )
}
