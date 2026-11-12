import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { paraErro } from '../api'
import { useAuth } from '../auth/AuthContext'
import Erro from '../components/Erro'
import Placa from '../components/Placa'

// Contas de exemplo: só aparecem se VITE_DEMO_PASSWORD estiver definida (frontend/.env.local).
// É a mesma senha de SEED_AGENT_PASSWORD no back-end; ela não fica no código-fonte.
const SENHA_DEMO = import.meta.env.VITE_DEMO_PASSWORD as string | undefined

const CONTAS_DEMO = [
  { rotulo: 'Cliente', username: 'cliente.demo' },
  { rotulo: 'Empresa', username: 'agente.empresa' },
  { rotulo: 'Banco', username: 'agente.banco' },
]

export default function Login() {
  const { usuario, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<Error | null>(null)
  const [enviando, setEnviando] = useState<string | null>(null)

  if (usuario) return <Navigate to="/" replace />

  async function entrar(u: string, s: string) {
    setErro(null)
    setEnviando(u)
    try {
      await login(u, s)
      navigate('/')
    } catch (err) {
      setErro(paraErro(err))
    } finally {
      setEnviando(null)
    }
  }

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    void entrar(username, senha)
  }

  return (
    <div className="login">
      <aside className="login-estrada">
        <Placa codigo="ALU2C26" grande />
        <h1>Alugue um carro sem sair de casa.</h1>
        <p>Faça o pedido, acompanhe a análise financeira e feche o contrato pelo navegador.</p>
        <div className="faixa" aria-hidden="true" />
      </aside>

      <main className="login-form">
        <h2>Entrar</h2>
        <form onSubmit={enviar}>
          <label>
            Usuário
            <input
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              autoComplete="username"
              required
              autoFocus
            />
          </label>
          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <Erro erro={erro} />
          <button className="btn" disabled={enviando !== null}>
            {enviando === username ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
        <p>
          Ainda não tem conta? <Link to="/registro">Cadastre-se como cliente</Link>
        </p>

        {SENHA_DEMO && (
          <div className="demo">
            <p className="suave">Entrar com uma conta de exemplo</p>
            <div className="demo-contas">
              {CONTAS_DEMO.map((conta) => (
                <button
                  type="button"
                  key={conta.username}
                  className="btn secundario"
                  disabled={enviando !== null}
                  onClick={() => void entrar(conta.username, SENHA_DEMO)}
                >
                  {enviando === conta.username ? 'Entrando…' : conta.rotulo}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
