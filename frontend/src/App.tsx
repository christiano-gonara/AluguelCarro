import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Catalogo from './pages/Catalogo'
import Pedidos from './pages/Pedidos'
import PedidoForm from './pages/PedidoForm'
import PedidoDetalhe from './pages/PedidoDetalhe'
import MeusDados from './pages/MeusDados'
import Automoveis from './pages/Automoveis'
import Clientes from './pages/Clientes'

interface ProtegidaProps {
  children: ReactElement
  perfil?: 'cliente' | 'agente'
}

/** Todas as telas, exceto login e cadastro, exigem usuário autenticado. */
function Protegida({ children, perfil }: ProtegidaProps) {
  const { usuario, carregando, ehCliente, ehAgente } = useAuth()
  if (carregando) return <p className="centro">Carregando…</p>
  if (!usuario) return <Navigate to="/login" replace />
  if (perfil === 'cliente' && !ehCliente) return <Navigate to="/" replace />
  if (perfil === 'agente' && !ehAgente) return <Navigate to="/" replace />
  return children
}

/** Cliente começa pelo catálogo de carros; agente começa pela fila de pedidos. */
function Inicio() {
  const { ehCliente } = useAuth()
  return ehCliente ? <Catalogo /> : <Navigate to="/pedidos" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route
        element={
          <Protegida>
            <Layout />
          </Protegida>
        }
      >
        <Route index element={<Inicio />} />
        <Route path="pedidos" element={<Pedidos />} />
        <Route
          path="pedidos/novo"
          element={
            <Protegida perfil="cliente">
              <PedidoForm />
            </Protegida>
          }
        />
        <Route path="pedidos/:id/editar" element={<PedidoForm />} />
        <Route path="pedidos/:id" element={<PedidoDetalhe />} />
        <Route
          path="meus-dados"
          element={
            <Protegida perfil="cliente">
              <MeusDados />
            </Protegida>
          }
        />
        <Route
          path="automoveis"
          element={
            <Protegida perfil="agente">
              <Automoveis />
            </Protegida>
          }
        />
        <Route
          path="clientes"
          element={
            <Protegida perfil="agente">
              <Clientes />
            </Protegida>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
