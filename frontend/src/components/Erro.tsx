import { ApiError } from '../api'

export default function Erro({ erro }: { erro: Error | null }) {
  if (!erro) return null
  const detalhes = erro instanceof ApiError ? erro.detalhes : []
  return (
    <div className="erro" role="alert">
      <strong>{erro.message}</strong>
      {detalhes.length > 0 && (
        <ul>
          {detalhes.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
