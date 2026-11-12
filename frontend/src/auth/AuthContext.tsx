import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { api, definirAoPerderSessao } from '../api'
import type { Usuario } from '../types'

interface AuthValor {
  usuario: Usuario | null
  carregando: boolean
  login: (username: string, senha: string) => Promise<Usuario>
  logout: () => Promise<void>
  ehCliente: boolean
  ehAgente: boolean
  ehBanco: boolean
}

const AuthContext = createContext<AuthValor | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)

  // Restaura a sessão ao abrir a aplicação
  useEffect(() => {
    api
      .me()
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setCarregando(false))
  }, [])

  useEffect(() => {
    definirAoPerderSessao(() => setUsuario(null))
  }, [])

  const login = useCallback(async (username: string, senha: string) => {
    const u = await api.login(username, senha)
    setUsuario(u)
    return u
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } finally {
      setUsuario(null)
    }
  }, [])

  const valor = useMemo<AuthValor>(
    () => ({
      usuario,
      carregando,
      login,
      logout,
      ehCliente: usuario?.perfil === 'CLIENTE',
      ehAgente: usuario?.perfil === 'AGENTE_EMPRESA' || usuario?.perfil === 'AGENTE_BANCO',
      ehBanco: usuario?.perfil === 'AGENTE_BANCO',
    }),
    [usuario, carregando, login, logout],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthValor {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
