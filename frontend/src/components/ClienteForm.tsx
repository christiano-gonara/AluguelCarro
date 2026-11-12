import type { ChangeEvent } from 'react'
import type { ClienteForm as ClienteFormState, ClienteRequest } from '../types'

const MAX_EMPREGADORES = 3

export const clienteVazio: ClienteFormState = {
  rg: '',
  cpf: '',
  nome: '',
  endereco: '',
  profissao: '',
  empregadores: [],
}

type CampoTexto = 'rg' | 'nome' | 'endereco' | 'profissao'

interface Props {
  valor: ClienteFormState
  onChange: (novo: ClienteFormState) => void
}

/** Campos de identificação do cliente + até 3 empregadores com rendimento. */
export default function ClienteForm({ valor, onChange }: Props) {
  const set = (campo: CampoTexto) => (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...valor, [campo]: e.target.value })

  function setEmpregador(i: number, campo: 'entidade' | 'rendimento', v: string) {
    const lista = valor.empregadores.map((e, idx) => (idx === i ? { ...e, [campo]: v } : e))
    onChange({ ...valor, empregadores: lista })
  }

  function adicionar() {
    if (valor.empregadores.length >= MAX_EMPREGADORES) return
    onChange({ ...valor, empregadores: [...valor.empregadores, { entidade: '', rendimento: '' }] })
  }

  function remover(i: number) {
    onChange({ ...valor, empregadores: valor.empregadores.filter((_, idx) => idx !== i) })
  }

  return (
    <>
      <div className="grade">
        <label>
          Nome completo
          <input value={valor.nome} onChange={set('nome')} required />
        </label>
        <label>
          Profissão
          <input value={valor.profissao} onChange={set('profissao')} required />
        </label>
        <label>
          RG
          <input value={valor.rg} onChange={set('rg')} required maxLength={20} />
        </label>
        <label>
          CPF (somente números)
          <input
            value={valor.cpf}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange({ ...valor, cpf: e.target.value.replace(/\D/g, '').slice(0, 11) })
            }
            required
            inputMode="numeric"
            pattern="\d{11}"
            title="11 dígitos"
          />
        </label>
        <label className="larga">
          Endereço
          <input value={valor.endereco} onChange={set('endereco')} required />
        </label>
      </div>

      <fieldset>
        <legend>
          Entidades empregadoras ({valor.empregadores.length}/{MAX_EMPREGADORES})
        </legend>
        {valor.empregadores.map((emp, i) => (
          <div className="linha" key={i}>
            <input
              placeholder="Empregador"
              value={emp.entidade}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmpregador(i, 'entidade', e.target.value)}
              required
            />
            <input
              placeholder="Rendimento mensal (R$)"
              type="number"
              min="0"
              step="0.01"
              value={emp.rendimento}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmpregador(i, 'rendimento', e.target.value)}
              required
            />
            <button type="button" className="btn secundario" onClick={() => remover(i)}>
              Remover
            </button>
          </div>
        ))}
        {valor.empregadores.length < MAX_EMPREGADORES && (
          <button type="button" className="btn secundario" onClick={adicionar}>
            + Adicionar empregador
          </button>
        )}
      </fieldset>
    </>
  )
}

/** Converte o estado do formulário no corpo esperado pela API. */
export function paraPayload(valor: ClienteFormState): ClienteRequest {
  return {
    rg: valor.rg,
    cpf: valor.cpf,
    nome: valor.nome,
    endereco: valor.endereco,
    profissao: valor.profissao,
    empregadores: valor.empregadores.map((e) => ({
      entidade: e.entidade,
      rendimento: Number(e.rendimento),
    })),
  }
}
