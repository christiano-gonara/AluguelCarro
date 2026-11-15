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
      <h1>Criar sua conta</h1>
      <p className="suave">Leva uns 3 minutos. Seus dados só são vistos pela empresa ou banco que for aprovar seu pedido.</p>
      <form onSubmit={enviar}>
        <fieldset>
          <legend>Como você vai entrar</legend>
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
          {enviando ? 'Criando sua conta…' : 'Criar minha conta'}
        </button>
      </form>
      <p>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  )
}
