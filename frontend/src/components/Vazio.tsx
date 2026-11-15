import type { ReactNode } from 'react'
import Icone from './Icone'
import type { NomeIcone } from './Icone'

/** Tela vazia: diz por que não tem nada aqui e aponta o próximo passo. */
export default function Vazio({
  icone,
  titulo,
  texto,
  children,
}: {
  icone: NomeIcone
  titulo: string
  texto: string
  children?: ReactNode
}) {
  return (
    <div className="vazio">
      <span className="icone-redondo grande">
        <Icone nome={icone} tamanho={30} />
      </span>
      <h2>{titulo}</h2>
      <p>{texto}</p>
      {children && <div className="linha vazio-acoes">{children}</div>}
    </div>
  )
}
