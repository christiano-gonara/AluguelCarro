import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './auth/AuthContext'
import { AvisosProvider } from './components/Avisos'
import FaixaDemo from './components/FaixaDemo'
import NotchCenarios from './components/NotchCenarios'
import { MODO_DEMO } from './config'
import './styles/index.css'

const raiz = document.getElementById('root')
if (!raiz) throw new Error('Elemento #root não encontrado')

// No GitHub Pages não há servidor pra responder /pedidos etc., então a demonstração usa endereços com # (/#/pedidos).
const Roteador = MODO_DEMO ? HashRouter : BrowserRouter

// Na demonstração o topo ganha um respiro pra notch de cenários.
if (MODO_DEMO) document.body.classList.add('modo-demo')

createRoot(raiz).render(
  <StrictMode>
    <Roteador>
      <AvisosProvider>
        <AuthProvider>
          <App />
          {MODO_DEMO && <NotchCenarios />}
          {MODO_DEMO && <FaixaDemo />}
        </AuthProvider>
      </AvisosProvider>
    </Roteador>
  </StrictMode>,
)
