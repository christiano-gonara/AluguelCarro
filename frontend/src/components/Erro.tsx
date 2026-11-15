import { ApiError } from '../api'
import Icone from './Icone'

/** Troca as mensagens técnicas mais comuns por frases simples. */
const AMIGAVEIS: Record<string, string> = {
  'Usuário ou senha inválidos': 'Usuário ou senha não conferem. Confere se o Caps Lock está ligado.',
  'A data final não pode ser anterior à data inicial': 'A devolução está antes da retirada. Escolha uma data de devolução depois da retirada.',
  'Failed to fetch': 'Não deu pra falar com o servidor. Confere se o back-end está rodando.',
}

function mensagemAmigavel(mensagem: string): string {
  return AMIGAVEIS[mensagem] ?? mensagem
}

export default function Erro({ erro }: { erro: Error | null }) {
  if (!erro) return null
  const detalhes = erro instanceof ApiError ? erro.detalhes : []
  return (
    <div className="erro" role="alert">
      <Icone nome="info" />
      <div>
        <strong>{mensagemAmigavel(erro.message)}</strong>
        {detalhes.length > 0 && (
          <ul>
            {detalhes.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
