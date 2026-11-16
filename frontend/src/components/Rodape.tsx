import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Icone from './Icone'
import Sistema, { AvisoDemo } from './Sistema'

const REPOSITORIO = 'https://github.com/christiano-gonara/AluguelCarro'

/** Rodapé em vidro: marca, links do perfil logado, ajuda, "voltar ao topo" e os créditos. */
export default function Rodape() {
  const { usuario, ehCliente, ehAgente } = useAuth()

  function voltarAoTopo() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="rodape">
      <div className="rodape-brilho" aria-hidden="true" />
      <div className="rodape-marca-dagua" aria-hidden="true">
        Aluga.
      </div>

      <div className="rodape-vidro">
        <div className="rodape-colunas">
          <div className="rodape-marca">
            <span className="marca-grande">
              <Icone nome="carro" tamanho={36} />
              Aluga.
            </span>
            <p>Alugue um carro pela internet, sem fila e sem papelada. Empresas e bancos parceiros cuidam da aprovação.</p>
            <div className="rodape-sociais">
              <a href={REPOSITORIO} target="_blank" rel="noreferrer" aria-label="Código do projeto no GitHub">
                <Icone nome="github" />
              </a>
            </div>
          </div>

          {!usuario && (
            <nav aria-label="Começar" className="rodape-links">
              <span className="rodape-titulo">Começar</span>
              <Link to="/registro">Criar conta</Link>
              <Link to="/login">Entrar</Link>
            </nav>
          )}
          {ehCliente && (
            <nav aria-label="Pra quem aluga" className="rodape-links">
              <span className="rodape-titulo">Pra quem aluga</span>
              <Link to="/">Catálogo</Link>
              <Link to="/pedidos">Meus pedidos</Link>
              <Link to="/meus-dados">Meus dados</Link>
            </nav>
          )}
          {ehAgente && (
            <nav aria-label="Pra parceiros" className="rodape-links">
              <span className="rodape-titulo">Pra parceiros</span>
              <Link to="/pedidos">Pedidos pra analisar</Link>
              <Link to="/automoveis">Seus carros</Link>
              <Link to="/clientes">Clientes</Link>
            </nav>
          )}
          <nav aria-label="Ajuda" className="rodape-links">
            <span className="rodape-titulo">Ajuda</span>
            <Link to="/sobre" state={{ secao: 'como-funciona' }}>
              Como funciona
            </Link>
            <Link to="/sobre" state={{ secao: 'quanto-custa' }}>
              Preços
            </Link>
            <Link to="/sobre" state={{ secao: 'duvidas' }}>
              Perguntas frequentes
            </Link>
          </nav>
        </div>

        <div className="rodape-fim">
          <div className="rodape-base">
            <span>© 2026 Aluga. · Laboratório 02 de DIAW · Engenharia de Software · PUC Minas</span>
            <div className="rodape-base-acoes">
              <Sistema />
              <button type="button" className="rodape-topo" onClick={voltarAoTopo}>
                Voltar ao topo <Icone nome="setaCima" tamanho={18} />
              </button>
            </div>
          </div>
          <AvisoDemo />
        </div>
      </div>

      <p className="rodape-creditos">
        Fotos: Wikimedia Commons, com fundo removido, cores neutralizadas e algumas espelhadas. Toyota Corolla por
        Dinkun Chen (CC BY-SA 4.0); Fiat Argo por JasonVogel (CC BY-SA 4.0); Chevrolet Onix e Hyundai HB20 por Just a
        Man (CC BY 4.0); VW T-Cross por M 93 (CC BY-SA 3.0 DE); Jeep Compass por Kevauto (CC BY-SA 4.0). Ícones:
        coolicons, de Kryston Schwarze (MIT).
      </p>
    </footer>
  )
}
