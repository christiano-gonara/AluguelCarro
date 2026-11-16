import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import Icone from './Icone'
import type { NomeIcone } from './Icone'

// Avisos do sistema: mensagens curtas que aparecem no canto da tela depois de uma ação
// ("Pedido enviado", "Carro salvo"...) e somem sozinhas. Erros de formulário continuam no próprio formulário.

export type TipoAviso = 'sucesso' | 'info' | 'cuidado'

interface Aviso {
  id: number
  tipo: TipoAviso
  titulo: string
  texto?: string
}

type Avisar = (titulo: string, opcoes?: { texto?: string; tipo?: TipoAviso }) => void

const AvisosContext = createContext<Avisar>(() => {})

const ICONE: Record<TipoAviso, NomeIcone> = { sucesso: 'escudo', info: 'info', cuidado: 'info' }
const DURACAO = 4500

function CartaoAviso({ aviso, fechar }: { aviso: Aviso; fechar: (id: number) => void }) {
  useEffect(() => {
    const t = setTimeout(() => fechar(aviso.id), DURACAO)
    return () => clearTimeout(t)
  }, [aviso.id, fechar])

  return (
    <div className={`notificacao ${aviso.tipo}`} role={aviso.tipo === 'cuidado' ? 'alert' : 'status'}>
      <span className="notificacao-icone">
        <Icone nome={ICONE[aviso.tipo]} />
      </span>
      <div className="notificacao-textos">
        <strong>{aviso.titulo}</strong>
        {aviso.texto && <span>{aviso.texto}</span>}
      </div>
      <button type="button" className="notificacao-fechar" onClick={() => fechar(aviso.id)} aria-label="Fechar aviso">
        <Icone nome="fechar" tamanho={18} />
      </button>
    </div>
  )
}

export function AvisosProvider({ children }: { children: ReactNode }) {
  const [avisos, setAvisos] = useState<Aviso[]>([])
  const proximo = useRef(1)

  const fechar = useCallback((id: number) => setAvisos((lista) => lista.filter((a) => a.id !== id)), [])

  const avisar = useCallback<Avisar>((titulo, opcoes = {}) => {
    const aviso: Aviso = { id: proximo.current++, tipo: opcoes.tipo ?? 'sucesso', titulo, texto: opcoes.texto }
    // no máximo 3 na tela: o mais antigo sai primeiro
    setAvisos((lista) => [...lista.slice(-2), aviso])
  }, [])

  const valor = useMemo(() => avisar, [avisar])

  return (
    <AvisosContext.Provider value={valor}>
      {children}
      <div className="notificacoes" aria-live="polite">
        {avisos.map((a) => (
          <CartaoAviso key={a.id} aviso={a} fechar={fechar} />
        ))}
      </div>
    </AvisosContext.Provider>
  )
}

export function useAvisos(): Avisar {
  return useContext(AvisosContext)
}
