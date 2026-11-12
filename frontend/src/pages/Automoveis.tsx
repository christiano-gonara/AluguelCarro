import { useCallback, useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { api, paraErro } from '../api'
import { useAuth } from '../auth/AuthContext'
import Erro from '../components/Erro'
import type { Automovel, TipoProprietario } from '../types'
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

/** Todos consultam o catálogo; agentes cadastram, alteram e removem automóveis. */
export default function Automoveis() {
  const { ehAgente } = useAuth()
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
      <h1>Automóveis</h1>

      {ehAgente && (
        <form className="cartao" onSubmit={salvar}>
          <h2>{editandoId !== null ? 'Editar automóvel' : 'Novo automóvel'}</h2>
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
            <button className="btn">{editandoId !== null ? 'Salvar' : 'Cadastrar'}</button>
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
      )}

      <Erro erro={erro} />
      {lista === null && !erro && <p>Carregando…</p>}
      {lista?.length === 0 && <p className="suave">Nenhum automóvel cadastrado.</p>}
      {lista && lista.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Automóvel</th>
              <th>Ano</th>
              <th>Placa</th>
              <th>Matrícula</th>
              <th>Diária</th>
              <th>Proprietário</th>
              {ehAgente && <th />}
            </tr>
          </thead>
          <tbody>
            {lista.map((a) => (
              <tr key={a.id}>
                <td>{a.marca} {a.modelo}</td>
                <td>{a.ano}</td>
                <td>{a.placa}</td>
                <td>{a.matricula}</td>
                <td>{moeda(a.valorDiaria)}</td>
                <td>{a.tipoProprietario}</td>
                {ehAgente && (
                  <td className="acoes">
                    <button className="link" onClick={() => editar(a)}>Editar</button>
                    <button className="link" onClick={() => excluir(a.id)}>Excluir</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
