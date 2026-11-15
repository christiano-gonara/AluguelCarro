import { Link } from 'react-router-dom'
import Icone from './Icone'

/** Rodapé comum: marca, links rápidos e os créditos das fotos dos carros. */
export default function Rodape() {
  return (
    <footer className="rodape">
      <div className="rodape-colunas">
        <div className="rodape-marca">
          <span className="marca-grande">
            <Icone nome="carro" tamanho={36} />
            Aluga.
          </span>
          <p>Alugue um carro pela internet, sem fila e sem papelada. Empresas e bancos parceiros cuidam da aprovação.</p>
        </div>
        <nav aria-label="Links rápidos" className="rodape-links">
          <span className="rodape-titulo">Links rápidos</span>
          <Link to="/">Início</Link>
          <Link to="/sobre">Como funciona</Link>
          <Link to="/pedidos">Pedidos</Link>
        </nav>
        <div className="rodape-links">
          <span className="rodape-titulo">Projeto</span>
          <span>Laboratório 02 de DIAW</span>
          <span>Engenharia de Software · PUC Minas</span>
        </div>
      </div>
      <p className="rodape-creditos">
        Fotos: Wikimedia Commons, com fundo removido, cores neutralizadas e algumas espelhadas. Toyota Corolla por
        Dinkun Chen (CC BY-SA 4.0); Fiat Argo por JasonVogel (CC BY-SA 4.0); Chevrolet Onix e Hyundai HB20 por Just a
        Man (CC BY 4.0); VW T-Cross por M 93 (CC BY-SA 3.0 DE); Jeep Compass por Kevauto (CC BY-SA 4.0).
      </p>
    </footer>
  )
}
