import { useEffect, useState } from 'react'
import { buscarFotoCarro } from '../utils/fotoCarro'
import type { FotoCarro as Foto } from '../utils/fotoCarro'
import CarroIlustracao from './CarroIlustracao'

/** Foto real do modelo (Wikipédia); enquanto carrega, ou se não houver foto, mostra a ilustração. */
export default function FotoCarro({ marca, modelo }: { marca: string; modelo: string }) {
  const [foto, setFoto] = useState<Foto | null>(null)
  const [falhou, setFalhou] = useState(false)

  useEffect(() => {
    let ativo = true
    setFoto(null)
    setFalhou(false)
    buscarFotoCarro(marca, modelo).then((f) => {
      if (ativo) setFoto(f)
    })
    return () => {
      ativo = false
    }
  }, [marca, modelo])

  if (!foto || falhou) {
    return (
      <div className="foto-carro ilustrada">
        <CarroIlustracao chave={marca + modelo} />
      </div>
    )
  }

  return (
    <figure className="foto-carro">
      <img
        src={foto.foto}
        alt={`${marca} ${modelo}`}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFalhou(true)}
      />
      <figcaption>
        <a href={foto.pagina} target="_blank" rel="noreferrer">
          Foto: Wikipédia
        </a>
      </figcaption>
    </figure>
  )
}
