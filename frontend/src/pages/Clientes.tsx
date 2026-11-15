import { useEffect, useState } from 'react'
import { api, paraErro } from '../api'
import Erro from '../components/Erro'
import type { Cliente } from '../types'
import { moeda } from '../utils/format'

/** Esconde o meio do CPF na lista: 123.456.789-00 vira ***.456.789-**. */
function cpfParcial(cpf: string): string {
  const digitos = cpf.replace(/\D/g, '')
  if (digitos.length !== 11) return cpf
  return `***.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-**`
}

function iniciais(nome: string): string {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')
}

/** Visão dos agentes: dados de identificação e renda, base da aprovação dos pedidos. */
export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[] | null>(null)
  const [erro, setErro] = useState<Error | null>(null)

  useEffect(() => {
    api.listarClientes().then(setClientes).catch((e: unknown) => setErro(paraErro(e)))
  }, [])

  return (
    <section>
      <header className="pagina-topo">
        <h1>Clientes</h1>
        <p>Todo mundo que tem conta pra alugar. A renda é a soma de até 3 lugares onde a pessoa trabalha.</p>
      </header>
      <Erro erro={erro} />
      {clientes === null && !erro && <p>Carregando…</p>}
      {clientes?.length === 0 && (
        <div className="vazio">
          <p>Nenhum cliente cadastrado ainda.</p>
        </div>
      )}
      {clientes && clientes.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>CPF</th>
              <th>RG</th>
              <th>Onde trabalha</th>
              <th className="direita">Renda por mês</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>
                  <span className="pessoa">
                    <span className="iniciais" aria-hidden="true">
                      {iniciais(c.nome)}
                    </span>
                    <span>
                      <strong>{c.nome}</strong>
                      <span className="suave pequeno">{c.profissao}</span>
                    </span>
                  </span>
                </td>
                <td className="numero">{cpfParcial(c.cpf)}</td>
                <td className="numero">{c.rg}</td>
                <td>
                  {c.empregadores.length > 0 ? (
                    <span className="etiquetas">
                      {c.empregadores.map((e) => (
                        <span key={e.entidade}>{e.entidade}</span>
                      ))}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="direita">
                  <strong>{moeda(c.rendimentoTotal)}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p className="nota">Parte do CPF fica escondida na lista, pra proteger os dados de cada pessoa.</p>
    </section>
  )
}
