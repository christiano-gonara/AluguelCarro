import type { ReactNode } from 'react'
import type { Automovel } from '../types'
import { moeda } from '../utils/format'
import FotoCarro from './FotoCarro'
import Icone from './Icone'
import Placa from './Placa'

const ROTULO_FROTA: Record<Automovel['tipoProprietario'], string> = {
  EMPRESA: 'Empresa',
  BANCO: 'Banco',
  CLIENTE: 'Cliente',
}

export default function CarroCard({ carro, children }: { carro: Automovel; children?: ReactNode }) {
  return (
    <article className="carro-card">
      <div className="carro-vitrine">
        <FotoCarro marca={carro.marca} modelo={carro.modelo} />
      </div>
      <div className="carro-info">
        <div className="carro-topo">
          <p className="carro-marca">{carro.marca}</p>
          <span className="chip-frota" title="Quem aprova o aluguel deste carro">
            <Icone nome={carro.tipoProprietario === 'BANCO' ? 'banco' : 'empresa'} tamanho={14} />
            {ROTULO_FROTA[carro.tipoProprietario]}
          </span>
        </div>
        <h3 className="carro-modelo">{carro.modelo}</h3>
        <div className="carro-linha">
          <span className="suave">{carro.ano}</span>
          <Placa codigo={carro.placa} />
        </div>
        <div className="carro-rodape">
          <p className="carro-preco">
            <span>por dia</span>
            {moeda(carro.valorDiaria)}
          </p>
          {children}
        </div>
      </div>
    </article>
  )
}
