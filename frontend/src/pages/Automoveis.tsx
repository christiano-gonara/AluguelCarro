import { useCallback, useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { api, paraErro } from '../api'
import CarroCard from '../components/CarroCard'
import Erro from '../components/Erro'
import type { Automovel, TipoProprietario } from '../types'
import { anoReal, diariaSugerida, fipe, valorFipeEmNumero } from '../utils/fipe'
import type { FipeItem, FipeValor } from '../utils/fipe'
import { moeda } from '../utils/format'

interface AutomovelForm {
  matricula: string
  ano: string
  marca: string
  modelo: string
  placa: string
  valorDiaria: string
  tipoProprietario: string
}

const vazio: AutomovelForm = {
  matricula: '',
  ano: String(new Date().getFullYear()),
  marca: '',
  modelo: '',
  placa: '',
  valorDiaria: '',
  tipoProprietario: 'EMPRESA',
}

/** Agentes cadastram, alteram e removem automóveis. Marca, modelo e ano podem vir da Tabela FIPE. */
export default function Automoveis() {
  const [lista, setLista] = useState<Automovel[] | null>(null)
  const [form, setForm] = useState<AutomovelForm>(vazio)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [erro, setErro] = useState<Error | null>(null)

  const carregar = useCallback(() => {
    api.listarAutomoveis().then(setLista).catch((e: unknown) => setErro(paraErro(e)))
  }, [])

  useEffect(carregar, [carregar])

  const set = (campo: keyof AutomovelForm) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [campo]: e.target.value })

  function aplicarFipe(v: FipeValor) {
    setForm((f) => ({
      ...f,
      marca: v.Marca,
      modelo: v.Modelo,
      ano: String(anoReal(v.AnoModelo)),
      valorDiaria: String(diariaSugerida(valorFipeEmNumero(v.Valor))),
    }))
  }

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro(null)
    const corpo = {
      matricula: form.matricula,
      ano: Number(form.ano),
      marca: form.marca,
      modelo: form.modelo,
      placa: form.placa,
      valorDiaria: Number(form.valorDiaria),
      tipoProprietario: form.tipoProprietario as TipoProprietario,
    }
    try {
      if (editandoId !== null) await api.atualizarAutomovel(editandoId, corpo)
      else await api.criarAutomovel(corpo)
      setForm(vazio)
      setEditandoId(null)
      carregar()
    } catch (err) {
      setErro(paraErro(err))
    }
  }

  function editar(a: Automovel) {
    setEditandoId(a.id)
    setForm({
      matricula: a.matricula,
      ano: String(a.ano),
      marca: a.marca,
      modelo: a.modelo,
      placa: a.placa,
      valorDiaria: String(a.valorDiaria),
      tipoProprietario: a.tipoProprietario,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function excluir(id: number) {
    if (!window.confirm('Excluir este automóvel?')) return
    setErro(null)
    try {
      await api.excluirAutomovel(id)
      carregar()
    } catch (err) {
      setErro(paraErro(err))
    }
  }

  return (
    <section>
      <header className="pagina-topo">
        <h1>Automóveis</h1>
        <p className="suave">Os clientes veem estes carros no catálogo.</p>
      </header>

      <form className="painel" onSubmit={salvar}>
        <h2>{editandoId !== null ? 'Editar automóvel' : 'Cadastrar automóvel'}</h2>
        {editandoId === null && <BuscaFipe aoEscolher={aplicarFipe} />}
        <div className="grade">
          <label>Marca<input value={form.marca} onChange={set('marca')} required /></label>
          <label>Modelo<input value={form.modelo} onChange={set('modelo')} required /></label>
          <label>
            Ano
            <input type="number" min="1980" max="2100" value={form.ano} onChange={set('ano')} required />
          </label>
          <label>Placa<input value={form.placa} onChange={set('placa')} required maxLength={10} /></label>
          <label>Matrícula<input value={form.matricula} onChange={set('matricula')} required /></label>
          <label>
            Diária (R$)
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.valorDiaria}
              onChange={set('valorDiaria')}
              required
            />
          </label>
          <label>
            Proprietário
            <select value={form.tipoProprietario} onChange={set('tipoProprietario')}>
              <option value="CLIENTE">Cliente</option>
              <option value="EMPRESA">Empresa</option>
              <option value="BANCO">Banco</option>
            </select>
          </label>
        </div>
        <div className="linha">
          <button className="btn">{editandoId !== null ? 'Salvar alterações' : 'Cadastrar automóvel'}</button>
          {editandoId !== null && (
            <button
              type="button"
              className="btn secundario"
              onClick={() => {
                setEditandoId(null)
                setForm(vazio)
              }}
            >
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      <Erro erro={erro} />
      {lista === null && !erro && <p>Carregando…</p>}
      {lista?.length === 0 && (
        <div className="vazio">
          <p>Nenhum automóvel cadastrado. Use o formulário acima para cadastrar o primeiro.</p>
        </div>
      )}
      {lista && lista.length > 0 && (
        <div className="vitrine-grade">
          {lista.map((a) => (
            <CarroCard key={a.id} carro={a}>
              <p className="suave pequeno">
                Matrícula {a.matricula}, proprietário: {a.tipoProprietario.toLowerCase()}
              </p>
              <div className="linha">
                <button className="btn secundario" onClick={() => editar(a)}>
                  Editar
                </button>
                <button className="btn secundario perigo-texto" onClick={() => excluir(a.id)}>
                  Excluir
                </button>
              </div>
            </CarroCard>
          ))}
        </div>
      )}
    </section>
  )
}

/** Marca, modelo e ano em cascata a partir da Tabela FIPE. */
function BuscaFipe({ aoEscolher }: { aoEscolher: (v: FipeValor) => void }) {
  const [marcas, setMarcas] = useState<FipeItem[]>([])
  const [modelos, setModelos] = useState<FipeItem[]>([])
  const [anos, setAnos] = useState<FipeItem[]>([])
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [ano, setAno] = useState('')
  const [valor, setValor] = useState<FipeValor | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    fipe.marcas().then(setMarcas).catch((e: unknown) => setErro(paraErro(e).message))
  }, [])

  async function etapa<T>(acao: () => Promise<T>, aplicar: (r: T) => void) {
    setErro(null)
    setCarregando(true)
    try {
      aplicar(await acao())
    } catch (e) {
      setErro(paraErro(e).message)
    } finally {
      setCarregando(false)
    }
  }

  function escolherMarca(m: string) {
    setMarca(m)
    setModelo('')
    setAno('')
    setModelos([])
    setAnos([])
    setValor(null)
    if (m) void etapa(() => fipe.modelos(m), setModelos)
  }

  function escolherModelo(m: string) {
    setModelo(m)
    setAno('')
    setAnos([])
    setValor(null)
    if (m) void etapa(() => fipe.anos(marca, m), setAnos)
  }

  function escolherAno(a: string) {
    setAno(a)
    setValor(null)
    if (a)
      void etapa(
        () => fipe.valor(marca, modelo, a),
        (v) => {
          setValor(v)
          aoEscolher(v)
        },
      )
  }

  return (
    <fieldset className="fipe">
      <legend>Buscar na Tabela FIPE</legend>
      <div className="grade">
        <label>
          Marca
          <select value={marca} onChange={(e: ChangeEvent<HTMLSelectElement>) => escolherMarca(e.target.value)}>
            <option value="">{marcas.length ? 'Selecione a marca' : 'Carregando marcas…'}</option>
            {marcas.map((m) => (
              <option key={m.codigo} value={m.codigo}>
                {m.nome}
              </option>
            ))}
          </select>
        </label>
        <label>
          Modelo
          <select
            value={modelo}
            disabled={!modelos.length}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => escolherModelo(e.target.value)}
          >
            <option value="">Selecione o modelo</option>
            {modelos.map((m) => (
              <option key={m.codigo} value={m.codigo}>
                {m.nome}
              </option>
            ))}
          </select>
        </label>
        <label>
          Ano
          <select
            value={ano}
            disabled={!anos.length}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => escolherAno(e.target.value)}
          >
            <option value="">Selecione o ano</option>
            {anos.map((a) => (
              <option key={a.codigo} value={a.codigo}>
                {a.nome}
              </option>
            ))}
          </select>
        </label>
      </div>
      {carregando && <p className="suave pequeno">Consultando a Tabela FIPE…</p>}
      {erro && <p className="suave pequeno">{erro}</p>}
      {valor && (
        <p className="fipe-resultado">
          Valor FIPE de {valor.MesReferencia}: <strong>{valor.Valor}</strong>. Diária sugerida de{' '}
          {moeda(diariaSugerida(valorFipeEmNumero(valor.Valor)))}, que você pode ajustar abaixo.
        </p>
      )}
    </fieldset>
  )
}
