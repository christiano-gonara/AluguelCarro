import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Icone from '../components/Icone'
import { publico } from '../config'

/** Página 404: o endereço não existe (link antigo, digitado errado ou tela que mudou de lugar). */
export default function NaoEncontrada() {
  const navigate = useNavigate()
  const { usuario } = useAuth()

  return (
    <main className="nao-encontrada">
      <button type="button" className="btn secundario voltar" onClick={() => navigate(-1)}>
        <Icone nome="voltar" tamanho={18} /> Voltar
      </button>
      <div className="nao-encontrada-corpo">
        <p className="nao-encontrada-codigo" aria-hidden="true">
          4<img src={publico('carros/onix.png')} alt="" />4
        </p>
        <h1>Essa página saiu pra dar uma volta</h1>
        <p className="suave">
          O endereço pode estar errado, ou a página mudou de lugar. Confere o link ou volte pro começo.
        </p>
        <div className="linha">
          <Link className="btn" to={usuario ? '/' : '/sobre'}>
            Ir pro começo <Icone nome="seta" tamanho={16} />
          </Link>
          {usuario && (
            <Link className="btn secundario" to="/pedidos">
              Ver pedidos
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}
