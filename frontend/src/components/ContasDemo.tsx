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

const ROTULO_GRUPO: Record<Cenario['grupo'], string> = {
  cliente: 'Quem aluga',
  parceiro: 'Empresa e banco parceiros',
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
 * Mostra primeiro as contas do perfil de quem entrou; as dos outros perfis ficam atrás de um link,
 * porque trocar de perfil é só um atalho pra testar o outro lado.
 */
export default function ContasDemo({ aoTrocar }: { aoTrocar?: () => void }) {
  const { usuario, login } = useAuth()
  const navigate = useNavigate()
  const [trocando, setTrocando] = useState<string | null>(null)
  const [mostrarOutros, setMostrarOutros] = useState(false)

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

  const meuGrupo: Cenario['grupo'] =
    usuario?.perfil === 'AGENTE_EMPRESA' || usuario?.perfil === 'AGENTE_BANCO' ? 'parceiro' : 'cliente'
  const lista = cenarios()
  const meus = lista.filter((c) => c.grupo === meuGrupo)
  const outros = lista.filter((c) => c.grupo !== meuGrupo)

  const linha = (c: Cenario) => {
    const atual = c.username === usuario?.username
    return (
      <button
        type="button"
        key={c.username}
        className={`conta-demo${atual ? ' atual' : ''}`}
        onClick={() => void entrarComo(c.username)}
        disabled={trocando !== null}
        aria-current={atual ? 'true' : undefined}
      >
        <span className="iniciais conta-demo-avatar" aria-hidden="true">
          {c.iniciais}
        </span>
        <span className="conta-demo-info">
          <span className="conta-demo-topo">
            <strong>{trocando === c.username ? 'Entrando…' : c.titulo}</strong>
            {atual && <span className="conta-demo-selo">Você está aqui</span>}
          </span>
          <span className="conta-demo-pessoa">{c.pessoa}</span>
          <span className="etiquetas">
            {c.etiquetas.map((e) => (
              <span key={e}>{e}</span>
            ))}
          </span>
        </span>
        <span className="conta-demo-seta" aria-hidden="true">
          {atual ? 'atual' : <Icone nome="seta" tamanho={16} />}
        </span>
      </button>
    )
  }

  return (
    <div className="contas-demo">
      <section className="contas-demo-grupo">
        <h3>{ROTULO_GRUPO[meuGrupo]}</h3>
        <div className="contas-demo-lista">{meus.map(linha)}</div>
      </section>

      {mostrarOutros ? (
        <section className="contas-demo-grupo">
          <h3>{ROTULO_GRUPO[meuGrupo === 'cliente' ? 'parceiro' : 'cliente']}</h3>
          <div className="contas-demo-lista">{outros.map(linha)}</div>
        </section>
      ) : (
        outros.length > 0 && (
          <button type="button" className="conta-demo-ver" onClick={() => setMostrarOutros(true)}>
            Ver contas de {meuGrupo === 'cliente' ? 'empresa e banco' : 'clientes'}
            <Icone nome="seta" tamanho={15} />
          </button>
        )
      )}
    </div>
  )
}
