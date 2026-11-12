import { useEffect, useState } from 'react'
import { api, paraErro } from '../api'
import Erro from '../components/Erro'
import type { Cliente } from '../types'
import { moeda } from '../utils/format'

/** Visão dos agentes: dados de identificação e rendimentos, base da análise financeira. */
export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[] | null>(null)
  const [erro, setErro] = useState<Error | null>(null)

  useEffect(() => {
    api.listarClientes().then(setClientes).catch((e: unknown) => setErro(paraErro(e)))
  }, [])

  return (
    <section>
      <h1>Clientes</h1>
      <Erro erro={erro} />
      {clientes === null && !erro && <p>Carregando…</p>}
      {clientes?.length === 0 && <p className="suave">Nenhum cliente cadastrado.</p>}
      {clientes && clientes.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>RG</th>
              <th>Profissão</th>
              <th>Empregadores</th>
              <th>Rendimento total</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>{c.cpf}</td>
                <td>{c.rg}</td>
                <td>{c.profissao}</td>
                <td>{c.empregadores.map((e) => e.entidade).join(', ') || '—'}</td>
                <td>{moeda(c.rendimentoTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
