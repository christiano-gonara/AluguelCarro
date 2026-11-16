import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icone from '../components/Icone'
import { api, paraErro } from '../api'
import { useAuth } from '../auth/AuthContext'
import { CamposPessoais, CamposRenda, clienteVazio, paraPayload } from '../components/ClienteForm'
import Erro from '../components/Erro'
import type { ClienteForm as ClienteFormState } from '../types'
import { useAvisos } from '../components/Avisos'

const PASSOS = ['Acesso', 'Seus dados', 'Renda']

export default function Registro() {
  const avisar = useAvisos()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [passo, setPasso] = useState(1)
  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')
  const [cliente, setCliente] = useState<ClienteFormState>(clienteVazio)
  const [erro, setErro] = useState<Error | null>(null)
  const [enviando, setEnviando] = useState(false)
  const topo = useRef<HTMLDivElement>(null)

  // Cada passo começa do topo do cartão, pra não deixar o foco perdido lá embaixo.
  useEffect(() => {
    if (passo > 1) topo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [passo])

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro(null)
    // Os campos de cada passo ficam montados sozinhos, então o navegador valida só os da tela atual.
    if (passo < PASSOS.length) {
      setPasso(passo + 1)
      return
    }
    setEnviando(true)
    try {
      await api.registrar({ username, senha, cliente: paraPayload(cliente) })
      await login(username, senha)
      avisar('Conta criada', { texto: 'Agora é só escolher o carro.' })
      navigate('/')
    } catch (err) {
      setErro(paraErro(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="cartao cadastro" ref={topo}>
      <Link to="/login" className="btn secundario voltar">
        <Icone nome="voltar" tamanho={18} /> Voltar
      </Link>

      <header className="cadastro-topo">
        <h1>Criar sua conta</h1>
        <p className="suave">São 3 passos curtos. Seus dados só são vistos por quem for aprovar seu pedido.</p>
        <ol className="cadastro-etapas" aria-label="Etapas do cadastro">
          {PASSOS.map((rotulo, i) => {
            const numero = i + 1
            const estado = numero === passo ? 'atual' : numero < passo ? 'feita' : ''
            return (
              <li key={rotulo} className={estado}>
                <button
                  type="button"
                  onClick={() => numero < passo && setPasso(numero)}
                  disabled={numero >= passo}
                  aria-current={numero === passo ? 'step' : undefined}
                >
                  <span className="numero">{numero < passo ? '✓' : numero}</span>
                  {rotulo}
                </button>
              </li>
            )
          })}
        </ol>
      </header>

      <form className="cadastro-form" onSubmit={enviar}>
        {passo === 1 && (
          <section className="cadastro-secao">
            <h2>Como você vai entrar</h2>
            <p className="bloco-dica">Escolha um usuário e uma senha. É com isso que você entra da próxima vez.</p>
            <div className="grade">
              <label>
                Usuário
                <input
                  value={username}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  required
                  minLength={3}
                  maxLength={60}
                  autoComplete="username"
                  placeholder="ex.: maria.silva"
                  autoFocus
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
                  autoComplete="new-password"
                />
              </label>
            </div>
          </section>
        )}

        {passo === 2 && (
          <section className="cadastro-secao">
            <h2>Seus dados</h2>
            <p className="bloco-dica">Documento, nome e endereço. Só quem for analisar seu pedido vê isso.</p>
            <CamposPessoais valor={cliente} onChange={setCliente} />
          </section>
        )}

        {passo === 3 && (
          <section className="cadastro-secao">
            <h2>Quanto você ganha</h2>
            <p className="bloco-dica">
              Some até 3 fontes de renda. É a soma que a empresa ou o banco usa pra aprovar. Pode deixar em branco e
              preencher depois, em “Meus dados”.
            </p>
            <CamposRenda valor={cliente} onChange={setCliente} />
          </section>
        )}

        <Erro erro={erro} />

        <div className="cadastro-acao">
          {passo > 1 && (
            <button type="button" className="btn secundario" onClick={() => setPasso(passo - 1)}>
              Anterior
            </button>
          )}
          <button className="btn" disabled={enviando}>
            {passo < PASSOS.length ? 'Continuar' : enviando ? 'Criando sua conta…' : 'Criar minha conta'}
          </button>
        </div>

        {passo === 1 && (
          <p className="centro-texto">
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        )}
      </form>
    </div>
  )
}
