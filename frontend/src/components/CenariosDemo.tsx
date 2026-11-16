import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { MODO_DEMO } from '../config'
import { SENHA_DEMO } from '../demo/dados'
import { resumoDemo } from '../demo/servidor'
import Icone from './Icone'

interface Cenario {
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
      username: 'cliente.demo',
      titulo: 'Pedidos em toda situação',
      pessoa: 'Cliente de Demonstração',
      iniciais: 'CD',
      etiquetas: [plural(pedidos('cliente.demo').length, 'pedido', 'pedidos'), plural(emAnalise('cliente.demo'), 'em análise', 'em análise'), 'contrato fechado'],
    },
    {
      username: 'marina.souza',
      titulo: 'Esperando resposta',
      pessoa: 'Marina Souza',
      iniciais: 'MS',
      etiquetas: [plural(pedidos('marina.souza').length, 'pedido', 'pedidos'), plural(emAnalise('marina.souza'), 'em análise', 'em análise')],
    },
    {
      username: 'lucas.pereira',
      titulo: 'Primeira vez',
      pessoa: 'Lucas Pereira',
      iniciais: 'LP',
      etiquetas: pedidos('lucas.pereira').length ? [plural(pedidos('lucas.pereira').length, 'pedido', 'pedidos')] : ['nenhum pedido ainda'],
    },
    {
      username: 'agente.empresa',
      titulo: 'Empresa parceira',
      pessoa: 'agente.empresa',
      iniciais: 'EP',
      etiquetas: [plural(r.carrosDe('EMPRESA'), 'carro', 'carros'), plural(r.esperando, 'esperando resposta', 'esperando resposta'), 'sem parcelamento'],
    },
    {
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
 * "Cenários de uso" da versão de demonstração: cada cartão é uma conta de exemplo num estado diferente.
 * Um clique troca de conta; a atual fica marcada com "Você está aqui".
 */
export default function CenariosDemo() {
  const { usuario, login } = useAuth()
  const navigate = useNavigate()
  const [trocando, setTrocando] = useState<string | null>(null)

  if (!MODO_DEMO) return null

  async function entrarComo(username: string) {
    if (username === usuario?.username) return
    setTrocando(username)
    try {
      await login(username, SENHA_DEMO)
      navigate('/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setTrocando(null)
    }
  }

  return (
    <section className="cenarios-demo" aria-labelledby="cenarios-demo-titulo">
      <header className="cenarios-demo-topo">
        <span className="cenarios-demo-selo">PARA TESTAR</span>
        <h2 id="cenarios-demo-titulo">Cenários de uso</h2>
        <span className="suave">entra com outra conta de exemplo, cada uma num momento diferente</span>
      </header>
      <div className="cenarios-demo-grade">
        {cenarios().map((c) => {
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
  )
}
