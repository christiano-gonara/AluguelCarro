import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { Perfil } from '../types'

const ROTULO_PERFIL: Record<Perfil, string> = {
  CLIENTE: 'Cliente',
  AGENTE_EMPRESA: 'Agente (empresa)',
  AGENTE_BANCO: 'Agente (banco)',
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
        <strong className="marca">🚗 Aluguel de Carros</strong>
        <nav>
          <NavLink to="/" end>Pedidos</NavLink>
          {ehCliente && <NavLink to="/pedidos/novo">Novo pedido</NavLink>}
          <NavLink to="/automoveis">Automóveis</NavLink>
          {ehCliente && <NavLink to="/meus-dados">Meus dados</NavLink>}
          {ehAgente && <NavLink to="/clientes">Clientes</NavLink>}
        </nav>
        <div className="usuario">
          <span>
            {usuario.username} · {ROTULO_PERFIL[usuario.perfil]}
          </span>
          <button className="btn secundario" onClick={sair}>Sair</button>
        </div>
      </header>
      <main className="conteudo">
        <Outlet />
      </main>
    </div>
  )
}
