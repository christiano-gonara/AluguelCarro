import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { Perfil } from '../types'
import Icone from './Icone'
import Rodape from './Rodape'

const ROTULO_PERFIL: Record<Perfil, string> = {
  CLIENTE: 'Cliente',
  AGENTE_EMPRESA: 'Empresa parceira',
  AGENTE_BANCO: 'Banco parceiro',
}

export default function Layout() {
  const { usuario, logout, ehCliente, ehAgente, ehBanco } = useAuth()
  const navigate = useNavigate()

  if (!usuario) return null

  async function sair() {
    await logout()
    navigate('/sobre')
  }

  return (
    <div className="app">
      <header className="topo">
        <NavLink to="/" className="marca">
          <Icone nome="carro" tamanho={28} />
          Aluga.
          {ehAgente && <span className="selo-parceiros">PARCEIROS</span>}
        </NavLink>
        <nav aria-label="Principal">
          {ehCliente && (
            <NavLink to="/" end>
              Carros
            </NavLink>
          )}
          <NavLink to="/pedidos" end={!ehCliente}>
            {ehCliente ? 'Meus pedidos' : 'Pedidos'}
          </NavLink>
          {ehCliente && <NavLink to="/meus-dados">Meus dados</NavLink>}
          {ehAgente && <NavLink to="/automoveis">Carros</NavLink>}
          {ehAgente && <NavLink to="/clientes">Clientes</NavLink>}
        </nav>
        <div className="usuario">
          <span className="usuario-chip">
            <span className="icone-redondo pequeno">
              <Icone nome={ehCliente ? 'usuario' : ehBanco ? 'banco' : 'empresa'} />
            </span>
            <span className="usuario-textos">
              <span className="usuario-nome">{usuario.username}</span>
              <span className="usuario-perfil">{ROTULO_PERFIL[usuario.perfil]}</span>
            </span>
          </span>
          <button className="btn fantasma" onClick={sair}>
            <Icone nome="sair" tamanho={18} /> Sair
          </button>
        </div>
      </header>
      <main className="conteudo">
        <Outlet />
      </main>
      <Rodape />
    </div>
  )
}
