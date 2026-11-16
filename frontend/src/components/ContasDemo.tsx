import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { MODO_DEMO } from '../config'
import { SENHA_DEMO } from '../demo/dados'
import { resumoDemo } from '../demo/servidor'
import Icone from './Icone'

interface Cenario {
  grupo: 'cliente' | 'parceiro'
  username: string
  titulo: string
  pessoa: string
  iniciais: string
  etiquetas: string[]
}

function plural(n: number, um: string, varios: string): string {
  return `${n} ${n === 1 ? um : varios}`
}

function cenarios(): Cenario[] {
  const r = resumoDemo()
  const pedidos = (u: string) => r.pedidosDe(u)
  const emAnalise = (u: string) => pedidos(u).filter((p) => p.status === 'EM_ANALISE').length
  const lista: Cenario[] = [
    {
      grupo: 'cliente',
      username: 'cliente.demo',
      titulo: 'Pedidos em toda situação',
      pessoa: 'Cliente de Demonstração',
      iniciais: 'CD',
      etiquetas: [plural(pedidos('cliente.demo').length, 'pedido', 'pedidos'), plural(emAnalise('cliente.demo'), 'em análise', 'em análise'), 'contrato fechado'],
    },
    {
      grupo: 'cliente',
      username: 'marina.souza',
      titulo: 'Esperando resposta',
      pessoa: 'Marina Souza',
      iniciais: 'MS',
      etiquetas: [plural(pedidos('marina.souza').length, 'pedido', 'pedidos'), plural(emAnalise('marina.souza'), 'em análise', 'em análise')],
    },
    {
      grupo: 'cliente',
      username: 'lucas.pereira',
      titulo: 'Primeira vez',
      pessoa: 'Lucas Pereira',
      iniciais: 'LP',
      etiquetas: pedidos('lucas.pereira').length ? [plural(pedidos('lucas.pereira').length, 'pedido', 'pedidos')] : ['nenhum pedido ainda'],
    },
    {
      grupo: 'parceiro',
      username: 'agente.empresa',
      titulo: 'Empresa parceira',
      pessoa: 'agente.empresa',
      iniciais: 'EP',
      etiquetas: [plural(r.carrosDe('EMPRESA'), 'carro', 'carros'), plural(r.esperando, 'esperando resposta', 'esperando resposta'), 'sem parcelamento'],
    },
    {
      grupo: 'parceiro',
      username: 'agente.banco',
      titulo: 'Banco parceiro',
      pessoa: 'agente.banco',
      iniciais: 'BP',
      etiquetas: [plural(r.carrosDe('BANCO'), 'carro', 'carros'), plural(r.esperando, 'esperando resposta', 'esperando resposta'), 'com parcelamento'],
    },
  ]
  return lista.filter((c) => r.existe(c.username))
}

/**
 * Contas de exemplo da demonstração, cada uma num momento diferente. Fica dentro da notch do topo.
 * As do perfil de quem entrou aparecem primeiro; um clique troca de conta e a atual fica com "Você está aqui".
 */
export default function ContasDemo({ aoTrocar }: { aoTrocar?: () => void }) {
  const { usuario, login } = useAuth()
  const navigate = useNavigate()
  const [trocando, setTrocando] = useState<string | null>(null)

  if (!MODO_DEMO) return null

  async function entrarComo(username: string) {
    if (username === usuario?.username) return
    setTrocando(username)
    try {
      await login(username, SENHA_DEMO)
      aoTrocar?.()
      navigate('/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setTrocando(null)
    }
  }

  const meuGrupo = usuario?.perfil === 'AGENTE_EMPRESA' || usuario?.perfil === 'AGENTE_BANCO' ? 'parceiro' : 'cliente'
  const lista = cenarios()
  const grupos = (meuGrupo === 'cliente' ? (['cliente', 'parceiro'] as const) : (['parceiro', 'cliente'] as const)).map((g) => ({
    g,
    titulo: g === 'cliente' ? 'Quem aluga' : 'Empresa e banco parceiros',
    contas: lista.filter((c) => c.grupo === g),
  }))

  return (
    <div className="contas-demo">
      {grupos.map(({ g, titulo, contas }) => (
        <section key={g} className="contas-demo-grupo">
          <h3>{titulo}</h3>
          <div className="cenarios-demo-grade">
            {contas.map((c) => {
              const atual = c.username === usuario?.username
              return (
                <button
                  type="button"
                  key={c.username}
                  className={`cenario-demo${atual ? ' atual' : ''}`}
                  onClick={() => void entrarComo(c.username)}
                  disabled={trocando !== null}
                  aria-current={atual ? 'true' : undefined}
                >
                  <span className="iniciais">{c.iniciais}</span>
                  <span className="cenario-demo-textos">
                    <strong>{trocando === c.username ? 'Entrando…' : c.titulo}</strong>
                    <span className="cenario-demo-pessoa">{c.pessoa}</span>
                    <span className="etiquetas">
                      {c.etiquetas.map((e) => (
                        <span key={e}>{e}</span>
                      ))}
                    </span>
                    {atual && (
                      <span className="cenario-demo-aqui">
                        <Icone nome="escudo" tamanho={16} /> Você está aqui
                      </span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
