import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { paraErro } from '../api'
import { useAuth } from '../auth/AuthContext'
import Erro from '../components/Erro'

// Atalho para demonstração: só aparece se VITE_DEMO_PASSWORD estiver definida (veja frontend/.env.example).
// A senha não fica no código-fonte; ela é a mesma SEED_AGENT_PASSWORD usada no back-end.
const SENHA_DEMO = import.meta.env.VITE_DEMO_PASSWORD as string | undefined

const CONTAS_DEMO = [
  { rotulo: 'Agente (empresa)', username: 'agente.empresa' },
  { rotulo: 'Agente (banco)', username: 'agente.banco' },
]

export default function Login() {
  const { usuario, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<Error | null>(null)
  const [enviando, setEnviando] = useState(false)

  if (usuario) return <Navigate to="/" replace />

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro(null)
    setEnviando(true)
    try {
      await login(username, senha)
      navigate('/')
    } catch (err) {
      setErro(paraErro(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="cartao estreito">
      <h1>Entrar</h1>
      <p className="suave">O acesso ao sistema exige cadastro e login.</p>
      <form onSubmit={enviar}>
        <label>
          Usuário
          <input
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
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
            required
          />
        </label>
        <Erro erro={erro} />
        <button className="btn" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
      <p>
        Ainda não tem cadastro? <Link to="/registro">Cadastre-se como cliente</Link>
      </p>

      {SENHA_DEMO && (
        <div className="demo">
          <p className="suave">
            <span aria-hidden="true">🧪</span> Contas de exemplo (clique para preencher)
          </p>
          <div className="linha">
            {CONTAS_DEMO.map((conta) => (
              <button
                type="button"
                key={conta.username}
                className="btn secundario"
                onClick={() => {
                  setUsername(conta.username)
                  setSenha(SENHA_DEMO)
                }}
              >
                {conta.rotulo}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
