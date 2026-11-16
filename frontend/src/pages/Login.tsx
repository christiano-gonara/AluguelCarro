import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { paraErro } from '../api'
import { useAuth } from '../auth/AuthContext'
import Erro from '../components/Erro'
import Icone from '../components/Icone'

// Contas de exemplo: só aparecem se VITE_DEMO_PASSWORD estiver definida (frontend/.env.local).
// É a mesma senha de SEED_AGENT_PASSWORD no back-end; ela não fica no código-fonte.
const SENHA_DEMO = import.meta.env.VITE_DEMO_PASSWORD as string | undefined

const CONTAS_DEMO = [
  { rotulo: 'Cliente', detalhe: 'aluga carros', icone: 'usuario', username: 'cliente.demo' },
  { rotulo: 'Empresa', detalhe: 'aprova pedidos', icone: 'empresa', username: 'agente.empresa' },
  { rotulo: 'Banco', detalhe: 'aprova e parcela', icone: 'banco', username: 'agente.banco' },
] as const

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
      <header className="login-topo">
        <div className="topo-esquerda">
          <Link to="/sobre" className="btn secundario voltar">
            <Icone nome="voltar" tamanho={18} /> Voltar
          </Link>
          <Link to="/sobre" className="marca">
            <Icone nome="carro" tamanho={28} />
            Aluga.
          </Link>
        </div>
        <Link to="/registro" className="btn secundario">
          Criar conta
        </Link>
      </header>

      <div className="login-corpo">
        <aside className="login-estrada">
          <h1>Bem-vindo de volta</h1>
          <p>Entre pra escolher seu carro e acompanhar seus pedidos.</p>
          <div className="selos">
            <span className="selo">
              <Icone nome="documento" /> Tudo pela internet
            </span>
            <span className="selo">
              <Icone nome="escudo" /> Aprovação por parceiros
            </span>
            <span className="selo">
              <Icone nome="chave" /> Sem papelada
            </span>
          </div>
          <img src="/carros/tcross.png" alt="" className="carro-recorte" />
        </aside>

        <main className="login-form vidro">
          <div className="card-cabecalho">
            <span className="icone-redondo">
              <Icone nome="usuario" tamanho={26} />
            </span>
            <div>
              <h2>Entrar</h2>
              <p className="suave">Use seu usuário e senha.</p>
            </div>
          </div>
          <form onSubmit={enviar}>
            <label>
              Usuário
              <input
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="ex.: cliente.demo"
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
              {enviando === username ? 'Entrando…' : 'Entrar'} <Icone nome="seta" tamanho={18} />
            </button>
          </form>
          <p className="centro-texto">
            Ainda não tem conta? <Link to="/registro">Cadastre-se como cliente</Link>
          </p>

          {SENHA_DEMO && (
            <div className="demo">
              <p className="suave">ou entre com uma conta de exemplo</p>
              <div className="demo-contas">
                {CONTAS_DEMO.map((conta) => (
                  <button
                    type="button"
                    key={conta.username}
                    className="demo-conta"
                    disabled={enviando !== null}
                    onClick={() => void entrar(conta.username, SENHA_DEMO)}
                  >
                    <Icone nome={conta.icone} tamanho={24} />
                    <strong>{enviando === conta.username ? 'Entrando…' : conta.rotulo}</strong>
                    <span>{conta.detalhe}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
