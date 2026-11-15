import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, paraErro } from '../api'
import { useAuth } from '../auth/AuthContext'
import ClienteForm, { paraPayload } from '../components/ClienteForm'
import Erro from '../components/Erro'
import type { ClienteForm as ClienteFormState } from '../types'

/** Consulta, atualização e exclusão do cadastro do próprio cliente (Read, Update, Delete do CRUD). */
export default function MeusDados() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [cliente, setCliente] = useState<ClienteFormState | null>(null)
  const [erro, setErro] = useState<Error | null>(null)
  const [salvo, setSalvo] = useState(false)
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)

  useEffect(() => {
    api
      .meuCadastro()
      .then((c) =>
        setCliente({
          rg: c.rg,
          cpf: c.cpf,
          nome: c.nome,
          endereco: c.endereco,
          profissao: c.profissao,
          empregadores: c.empregadores.map((e) => ({ entidade: e.entidade, rendimento: String(e.rendimento) })),
        }),
      )
      .catch((e: unknown) => setErro(paraErro(e)))
  }, [])

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!cliente) return
    setErro(null)
    setSalvo(false)
    try {
      await api.atualizarCadastro(paraPayload(cliente))
      setSalvo(true)
    } catch (err) {
      setErro(paraErro(err))
    }
  }

  async function excluir() {
    setErro(null)
    try {
      await api.excluirCadastro()
      await logout()
      navigate('/sobre')
    } catch (err) {
      setErro(paraErro(err))
    }
  }

  if (!cliente) return erro ? <Erro erro={erro} /> : <p>Carregando…</p>

  return (
    <section className="meus-dados">
      <header className="pagina-topo">
        <h1>Meus dados</h1>
        <p>É com esses dados que a empresa ou o banco aprova seus pedidos. Mantenha sempre atualizado.</p>
      </header>
      <form className="painel" onSubmit={salvar}>
        <ClienteForm
          valor={cliente}
          onChange={(c) => {
            setCliente(c)
            setSalvo(false)
          }}
        />
        <Erro erro={erro} />
        <div className="linha">
          <button className="btn">Salvar alterações</button>
          {salvo && <p className="ok">Tudo salvo.</p>}
        </div>
      </form>

      <section className="zona-cuidado">
        <div>
          <h2>Excluir minha conta</h2>
          <p className="suave">Apaga seus dados e todos os seus pedidos. Não dá pra desfazer.</p>
        </div>
        {!confirmandoExclusao ? (
          <button type="button" className="btn perigo" onClick={() => setConfirmandoExclusao(true)}>
            Excluir conta
          </button>
        ) : (
          <div className="confirmacao" role="alertdialog" aria-labelledby="confirmar-exclusao">
            <h3 id="confirmar-exclusao">Tem certeza que quer excluir sua conta?</h3>
            <div className="linha">
              <button type="button" className="btn" onClick={() => void excluir()}>
                Sim, excluir
              </button>
              <button type="button" className="btn secundario" onClick={() => setConfirmandoExclusao(false)}>
                Não, manter conta
              </button>
            </div>
          </div>
        )}
      </section>
    </section>
  )
}
