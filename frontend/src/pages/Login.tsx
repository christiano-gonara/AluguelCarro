import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { paraErro } from '../api'
import { useAuth } from '../auth/AuthContext'
import Erro from '../components/Erro'

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
    </div>
  )
}
