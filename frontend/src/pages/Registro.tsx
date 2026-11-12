import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, paraErro } from '../api'
import { useAuth } from '../auth/AuthContext'
import ClienteForm, { clienteVazio, paraPayload } from '../components/ClienteForm'
import Erro from '../components/Erro'
import type { ClienteForm as ClienteFormState } from '../types'

export default function Registro() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')
  const [cliente, setCliente] = useState<ClienteFormState>(clienteVazio)
  const [erro, setErro] = useState<Error | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro(null)
    setEnviando(true)
    try {
      await api.registrar({ username, senha, cliente: paraPayload(cliente) })
      await login(username, senha)
      navigate('/')
    } catch (err) {
      setErro(paraErro(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="cartao">
      <h1>Cadastro de cliente</h1>
      <form onSubmit={enviar}>
        <fieldset>
          <legend>Acesso</legend>
          <div className="grade">
            <label>
              Usuário
              <input
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={60}
              />
            </label>
            <label>
              Senha (mín. 6 caracteres)
              <input
                type="password"
                value={senha}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
                required
                minLength={6}
                maxLength={72}
              />
            </label>
          </div>
        </fieldset>
        <ClienteForm valor={cliente} onChange={setCliente} />
        <Erro erro={erro} />
        <button className="btn" disabled={enviando}>
          {enviando ? 'Cadastrando…' : 'Cadastrar'}
        </button>
      </form>
      <p>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  )
}
