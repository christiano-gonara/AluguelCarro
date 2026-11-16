import { useEffect, useState } from 'react'
import { api, paraErro } from '../api'
import Vazio from '../components/Vazio'
import { BarraTabela, ColunaOrdenavel, PaginasTabela } from '../components/Tabela'
import { useTabela } from '../utils/tabela'
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
        <Vazio icone="usuario" titulo="Nenhum cliente ainda" texto="Quando alguém criar uma conta pra alugar, aparece aqui." />
      )}
      {clientes && clientes.length > 0 && <TabelaClientes clientes={clientes} />}
      <p className="nota">Parte do CPF fica escondida na lista, pra proteger os dados de cada pessoa.</p>
    </section>
  )
}

type CampoCliente = 'nome' | 'renda'

function TabelaClientes({ clientes }: { clientes: Cliente[] }) {
  const t = useTabela<Cliente, CampoCliente>(
    clientes,
    (c) => `${c.nome} ${c.cpf} ${c.profissao}`,
    (c, campo) => (campo === 'nome' ? c.nome : c.rendimentoTotal),
    { campo: 'nome', crescente: true },
  )
  return (
    <section className="tabela-vidro">
      <BarraTabela
        titulo="Todos os clientes"
        busca={t.busca}
        aoBuscar={t.buscar}
        rotuloBusca="Buscar por nome ou CPF"
        porPagina={t.porPagina}
        aoMudarPorPagina={t.mudarPorPagina}
      />
      <div className="tabela-rolagem">
        <table>
          <thead>
            <tr>
              <ColunaOrdenavel
                rotulo="Cliente"
                ativa={t.ordem.campo === 'nome'}
                crescente={t.ordem.crescente}
                aoOrdenar={() => t.ordenarPor('nome')}
              />
              <th scope="col">CPF</th>
              <th scope="col">RG</th>
              <th scope="col">Onde trabalha</th>
              <ColunaOrdenavel
                rotulo="Renda por mês"
                ativa={t.ordem.campo === 'renda'}
                crescente={t.ordem.crescente}
                aoOrdenar={() => t.ordenarPor('renda')}
              />
            </tr>
          </thead>
          <tbody>
            {t.visiveis.map((c) => (
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
                <td>
                  <strong>{moeda(c.rendimentoTotal)}</strong>
                </td>
              </tr>
            ))}
            {t.visiveis.length === 0 && (
              <tr>
                <td colSpan={5} className="suave">
                  Nenhum cliente encontrado com essa busca.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <PaginasTabela
        total={t.total}
        nome={t.total === 1 ? 'cliente' : 'clientes'}
        pagina={t.pagina}
        totalPaginas={t.totalPaginas}
        irPara={t.irPara}
      />
    </section>
  )
}
