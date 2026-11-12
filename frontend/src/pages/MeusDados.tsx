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
    if (!window.confirm('Excluir seu cadastro e todos os seus pedidos? Esta ação não pode ser desfeita.')) return
    setErro(null)
    try {
      await api.excluirCadastro()
      await logout()
      navigate('/login')
    } catch (err) {
      setErro(paraErro(err))
    }
  }

  if (!cliente) return erro ? <Erro erro={erro} /> : <p>Carregando…</p>

  return (
    <div className="cartao">
      <h1>Meus dados</h1>
      <form onSubmit={salvar}>
        <ClienteForm
          valor={cliente}
          onChange={(c) => {
            setCliente(c)
            setSalvo(false)
          }}
        />
        <Erro erro={erro} />
        {salvo && <p className="ok">Dados atualizados.</p>}
        <div className="linha">
          <button className="btn">Salvar</button>
          <button type="button" className="btn perigo" onClick={excluir}>
            Excluir meu cadastro
          </button>
        </div>
      </form>
    </div>
  )
}
