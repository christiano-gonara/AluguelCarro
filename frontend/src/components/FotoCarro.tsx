import { useEffect, useState } from 'react'
import { buscarFotoCarro } from '../utils/fotoCarro'
import { fotoRecortada } from '../utils/fotoLocal'
import type { FotoCarro as Foto } from '../utils/fotoCarro'
import CarroIlustracao from './CarroIlustracao'

/**
 * Foto do carro. Os modelos mais comuns usam um recorte sem fundo (public/carros);
 * os outros buscam a foto na Wikipédia e, enquanto carrega ou se não houver foto, mostram a ilustração.
 */
export default function FotoCarro({ marca, modelo }: { marca: string; modelo: string }) {
  const recorte = fotoRecortada(modelo)
  if (recorte) {
    return (
      <figure className="foto-carro recorte">
        <img src={recorte} alt={`${marca} ${modelo}`} loading="lazy" />
      </figure>
    )
  }
  return <FotoWikipedia marca={marca} modelo={modelo} />
}

function FotoWikipedia({ marca, modelo }: { marca: string; modelo: string }) {
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
