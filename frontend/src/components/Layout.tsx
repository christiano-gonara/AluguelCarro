import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { Perfil } from '../types'

const ROTULO_PERFIL: Record<Perfil, string> = {
  CLIENTE: 'Cliente',
  AGENTE_EMPRESA: 'Agente empresa',
  AGENTE_BANCO: 'Agente banco',
}

export default function Layout() {
  const { usuario, logout, ehCliente, ehAgente } = useAuth()
  const navigate = useNavigate()

  if (!usuario) return null

  async function sair() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="app">
      <header className="topo">
        <NavLink to="/" className="marca">
          Aluguel de Carros
        </NavLink>
        <nav>
          {ehCliente && (
            <NavLink to="/" end>
              Carros
            </NavLink>
          )}
          <NavLink to="/pedidos">{ehCliente ? 'Meus pedidos' : 'Pedidos'}</NavLink>
          {ehCliente && <NavLink to="/meus-dados">Meus dados</NavLink>}
          {ehAgente && <NavLink to="/automoveis">Automóveis</NavLink>}
          {ehAgente && <NavLink to="/clientes">Clientes</NavLink>}
        </nav>
        <div className="usuario">
          <span className="usuario-nome">{usuario.username}</span>
          <span className="usuario-perfil">{ROTULO_PERFIL[usuario.perfil]}</span>
          <button className="btn fantasma" onClick={sair}>
            Sair
          </button>
        </div>
      </header>
      <main className="conteudo">
        <Outlet />
      </main>
    </div>
  )
}
