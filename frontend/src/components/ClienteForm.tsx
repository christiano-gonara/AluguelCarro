import type { ChangeEvent } from 'react'
import type { ClienteForm as ClienteFormState, ClienteRequest } from '../types'
import { moeda } from '../utils/format'

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

/** Identificação do cliente, só os campos (sem título): cada tela decide como agrupar. */
export function CamposPessoais({ valor, onChange }: Props) {
  const set = (campo: CampoTexto) => (e: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...valor, [campo]: e.target.value })

  return (
    <div className="grade">
      <label className="larga">
        Nome completo
        <input value={valor.nome} onChange={set('nome')} required autoComplete="name" />
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
          placeholder="00000000000"
        />
      </label>
      <label>
        RG
        <input value={valor.rg} onChange={set('rg')} required maxLength={20} />
      </label>
      <label className="larga">
        Profissão
        <input value={valor.profissao} onChange={set('profissao')} required />
      </label>
      <label className="larga">
        Endereço
        <input value={valor.endereco} onChange={set('endereco')} required autoComplete="street-address" />
      </label>
    </div>
  )
}

/** Até 3 empregadores com rendimento, só os campos (sem título). */
export function CamposRenda({ valor, onChange }: Props) {
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

  const rendaTotal = valor.empregadores.reduce((soma, e) => soma + (Number(e.rendimento) || 0), 0)

  return (
    <>
      {valor.empregadores.map((emp, i) => (
        <div className="empregador" key={i}>
          <div className="empregador-topo">
            <span>Trabalho {i + 1}</span>
            <button type="button" className="link" onClick={() => remover(i)}>
              Remover
            </button>
          </div>
          <div className="grade">
            <label>
              Onde você trabalha
              <input
                placeholder="Empresa, estágio, freela…"
                value={emp.entidade}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmpregador(i, 'entidade', e.target.value)}
                required
              />
            </label>
            <label>
              Quanto ganha por mês (R$)
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                value={emp.rendimento}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmpregador(i, 'rendimento', e.target.value)}
                required
              />
            </label>
          </div>
        </div>
      ))}
      {valor.empregadores.length < MAX_EMPREGADORES && (
        <button type="button" className="btn secundario adicionar-trabalho" onClick={adicionar}>
          + Adicionar trabalho ({valor.empregadores.length} de {MAX_EMPREGADORES})
        </button>
      )}
      {rendaTotal > 0 && (
        <p className="renda-total">
          Renda total por mês: <strong>{moeda(rendaTotal)}</strong>
        </p>
      )}
    </>
  )
}

/** Os dois blocos juntos, como aparecem em "Meus dados". */
export default function ClienteForm({ valor, onChange }: Props) {
  return (
    <>
      <fieldset>
        <legend>Seus dados</legend>
        <p className="bloco-dica">Documento, nome e endereço. Só quem for analisar seu pedido vê isso.</p>
        <CamposPessoais valor={valor} onChange={onChange} />
      </fieldset>

      <fieldset>
        <legend>
          Quanto você ganha ({valor.empregadores.length} de {MAX_EMPREGADORES})
        </legend>
        <p className="bloco-dica">Até 3 fontes de renda. É a soma que a empresa ou o banco usa pra aprovar o pedido.</p>
        <CamposRenda valor={valor} onChange={onChange} />
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
