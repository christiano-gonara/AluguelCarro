import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { MODO_DEMO } from '../config'
import { QUALQUER_TELA, ROTULO_PERFIL, cenariosDaTela } from '../demo/cenarios'
import type { TelaCenarios, TipoCenario } from '../demo/cenarios'
import Icone from './Icone'

const ROTULO_TIPO: Record<TipoCenario, string> = { principal: 'Principal', alternativo: 'Alternativo', erro: 'De erro' }

function Bloco({ tela }: { tela: TelaCenarios }) {
  return (
    <section className="notch-bloco">
      <h3>{tela.titulo}</h3>
      <ul>
        {tela.cenarios.map((c) => (
          <li key={c.acao}>
            <span className={`cenario-marca ${c.tipo}`} aria-hidden="true" />
            <div>
              <span className="cenario-acao">
                <span className="sr-only">{ROTULO_TIPO[c.tipo]}: </span>
                {c.acao}
              </span>
              <span className="cenario-resultado">{c.resultado}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * "Notch" no topo da versão de demonstração: abre os cenários de uso da tela atual,
 * só do perfil de quem entrou (cliente, empresa ou banco).
 */
export default function NotchCenarios() {
  const { pathname } = useLocation()
  const { usuario } = useAuth()
  const [aberta, setAberta] = useState(false)
  const raiz = useRef<HTMLDivElement>(null)

  // fecha ao trocar de tela, com Esc ou clicando fora
  useEffect(() => setAberta(false), [pathname, usuario?.username])
  useEffect(() => {
    if (!aberta) return
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && setAberta(false)
    const fora = (e: MouseEvent) => {
      if (raiz.current && !raiz.current.contains(e.target as Node)) setAberta(false)
    }
    window.addEventListener('keydown', tecla)
    window.addEventListener('mousedown', fora)
    return () => {
      window.removeEventListener('keydown', tecla)
      window.removeEventListener('mousedown', fora)
    }
  }, [aberta])

  if (!MODO_DEMO) return null

  const tela = cenariosDaTela(pathname, usuario?.perfil ?? null)
  const perfil = usuario ? ROTULO_PERFIL[usuario.perfil] : 'Visitante'

  return (
    <div className="notch" ref={raiz}>
      <button
        type="button"
        className="notch-aba"
        aria-expanded={aberta}
        aria-controls="notch-janela"
        onClick={() => setAberta((a) => !a)}
      >
        <Icone nome="documento" tamanho={15} />
        Cenários desta tela · {perfil}
        <span className={`notch-seta${aberta ? ' aberta' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>
      {aberta && (
        <div id="notch-janela" className="notch-janela" role="dialog" aria-label="Cenários de uso desta tela">
          <div className="notch-cabecalho">
            <span className="sobretitulo">CENÁRIOS DE USO · {perfil.toUpperCase()}</span>
            <strong>O que testar nesta tela</strong>
          </div>
          <div className="cenarios-legenda" aria-hidden="true">
            <span>
              <span className="cenario-marca principal" /> Principal
            </span>
            <span>
              <span className="cenario-marca alternativo" /> Alternativo
            </span>
            <span>
              <span className="cenario-marca erro" /> De erro
            </span>
          </div>
          {tela ? <Bloco tela={tela} /> : <p className="suave">Esta tela não tem cenários próprios.</p>}
          {usuario && <Bloco tela={QUALQUER_TELA} />}
        </div>
      )}
    </div>
  )
}
