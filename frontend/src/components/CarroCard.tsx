import type { ReactNode } from 'react'
import type { Automovel } from '../types'
import { moeda } from '../utils/format'
import CarroIlustracao from './CarroIlustracao'
import Placa from './Placa'

export default function CarroCard({ carro, children }: { carro: Automovel; children?: ReactNode }) {
  return (
    <article className="carro-card">
      <div className="carro-vitrine">
        <CarroIlustracao chave={carro.marca + carro.modelo} />
      </div>
      <div className="carro-info">
        <p className="carro-marca">{carro.marca}</p>
        <h3 className="carro-modelo">{carro.modelo}</h3>
        <div className="carro-linha">
          <span className="suave">{carro.ano}</span>
          <Placa codigo={carro.placa} />
        </div>
        <p className="carro-preco">
          {moeda(carro.valorDiaria)}
          <span> por dia</span>
        </p>
        {children}
      </div>
    </article>
  )
}
