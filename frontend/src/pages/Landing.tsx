import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import Icone from '../components/Icone'
import type { NomeIcone } from '../components/Icone'
import Rodape from '../components/Rodape'

// Página pública: explica o sistema para quem ainda não tem conta.

const LETREIRO: { icone: NomeIcone; texto: string }[] = [
  { icone: 'documento', texto: 'Tudo pela internet' },
  { icone: 'escudo', texto: 'Aprovação por empresas e bancos' },
  { icone: 'carro', texto: 'Preço baseado na tabela FIPE' },
  { icone: 'banco', texto: 'Dá pra parcelar pelo banco' },
  { icone: 'relogio', texto: 'Acompanhe cada etapa do pedido' },
  { icone: 'calendario', texto: 'Mudou de ideia? Dá pra alterar' },
]

const PASSOS: { icone: NomeIcone; titulo: string; texto: string }[] = [
  { icone: 'usuario', titulo: 'Cadastre-se', texto: 'Crie sua conta com seus dados e quanto você ganha por mês.' },
  { icone: 'carro', titulo: 'Escolha e peça', texto: 'Escolha o carro e as datas. O preço aparece na hora.' },
  { icone: 'escudo', titulo: 'Aprovação', texto: 'Uma empresa ou um banco confere seus dados e responde.' },
  { icone: 'chave', titulo: 'Contrato fechado', texto: 'Aprovou? O contrato é fechado e o carro é seu nos dias combinados.' },
]

const DIARIAS = [
  { nome: 'Chevrolet Onix', valor: 170 },
  { nome: 'Hyundai HB20', valor: 175 },
  { nome: 'Fiat Argo', valor: 180 },
  { nome: 'Volkswagen T-Cross', valor: 260 },
  { nome: 'Toyota Corolla', valor: 320 },
  { nome: 'Jeep Compass', valor: 340 },
]
const MAIOR_DIARIA = Math.max(...DIARIAS.map((d) => d.valor))

const DUVIDAS = [
  {
    pergunta: 'Preciso de cadastro para alugar?',
    resposta:
      'Sim. Pra alugar, você cria uma conta com usuário e senha. No cadastro a gente pede RG, CPF, nome, endereço, profissão e até 3 lugares onde você trabalha, com quanto ganha em cada um.',
  },
  {
    pergunta: 'Quem decide se o pedido é aprovado?',
    resposta:
      'Uma empresa ou um banco parceiro. Eles olham sua renda e dizem se aprovam ou não. Se aprovarem, o contrato é fechado.',
  },
  {
    pergunta: 'Posso mudar ou cancelar o pedido?',
    resposta:
      'Mudar o carro ou as datas dá enquanto o pedido estiver em análise. Cancelar dá até o contrato ser fechado.',
  },
  {
    pergunta: 'Dá pra parcelar pelo banco?',
    resposta:
      'Quando o carro é de um banco parceiro, ele pode oferecer um parcelamento junto, com valor, juros por mês e número de parcelas. Tudo aparece na página do seu pedido.',
  },
]

function TituloSecao({ children }: { children: string }) {
  return (
    <div className="titulo-secao">
      <h2>{children}</h2>
    </div>
  )
}

export default function Landing() {
  const { usuario } = useAuth()
  if (usuario) return <Navigate to="/" replace />

  return (
    <div className="landing">
      <section className="landing-hero">
        <header className="topo topo-publico">
          <Link to="/sobre" className="marca">
            <Icone nome="carro" tamanho={28} />
            Aluga.
          </Link>
          <nav aria-label="Principal">
            <a href="#o-que-e">O que é</a>
            <a href="#para-quem">Para quem</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#quanto-custa">Preços</a>
            <a href="#duvidas">Dúvidas</a>
          </nav>
          <div className="usuario">
            <Link to="/login" className="link-claro">
              Entrar
            </Link>
            <Link to="/registro" className="btn secundario">
              Criar conta
            </Link>
          </div>
        </header>

        <div className="landing-hero-conteudo">
          <div className="landing-hero-texto">
            <span className="selo">
              <Icone nome="chave" tamanho={16} />
              Tudo pelo celular ou computador
            </span>
            <h1>Aluguel de carros sem sair de casa</h1>
            <p>
              Você escolhe o carro, diz quando quer pegar e devolver, e acompanha tudo por aqui até o contrato ficar
              pronto.
            </p>
            <div className="linha">
              <Link to="/registro" className="btn">
                Criar minha conta <Icone nome="seta" tamanho={18} />
              </Link>
              <a href="#como-funciona" className="link-claro">
                Ver como funciona
              </a>
            </div>
          </div>
          <article className="vidro landing-hero-card">
            <img src="/carros/tcross.png" alt="Volkswagen T-Cross" className="carro-recorte" />
            <span className="suave pequeno">Acompanhe seu pedido</span>
            <h2>Volkswagen T-Cross</h2>
            <ol className="etapas compactas">
              <li className="etapa feita">
                <span className="etapa-numero">1</span>Pedido enviado
              </li>
              <li className="etapa atual">
                <span className="etapa-numero">2</span>Esperando aprovação
              </li>
              <li className="etapa">
                <span className="etapa-numero">3</span>Contrato fechado
              </li>
            </ol>
          </article>
        </div>
      </section>

      <section className="letreiro" aria-label="Destaques do serviço">
        <div className="letreiro-trilho">
          {[0, 1].map((copia) => (
            <ul key={copia} aria-hidden={copia === 1}>
              {LETREIRO.map((item) => (
                <li key={item.texto}>
                  <Icone nome={item.icone} tamanho={28} />
                  {item.texto}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      <section id="o-que-e" className="secao duas-colunas">
        <div>
          <span className="sobretitulo">O QUE É</span>
          <h2 className="titulo-grande">Um jeito simples de alugar um carro.</h2>
        </div>
        <div className="texto-grande">
          <p>
            Aqui você encontra o carro, faz o pedido e acompanha tudo num lugar só. Mudou de ideia? Dá pra alterar ou
            cancelar enquanto o pedido ainda está em análise.
          </p>
          <p className="suave">
            Depois que você envia, uma empresa ou um banco parceiro confere sua renda pra aprovar o aluguel. Deu tudo
            certo? O contrato é fechado e o carro fica com você nos dias que escolheu.
          </p>
        </div>
      </section>

      <section id="para-quem" className="secao">
        <TituloSecao>Para quem é</TituloSecao>
        <p className="secao-intro">
          São dois caminhos: o de quem aluga e o de quem aprova. Cada pessoa entra com o próprio login e só vê o que é
          dela.
        </p>
        <div className="dividido">
          <span className="dividido-ou" aria-hidden="true">
            OU
          </span>
          <article className="dividido-lado">
            <div className="card-cabecalho">
              <span className="icone-redondo">
                <Icone nome="usuario" tamanho={26} />
              </span>
              <div>
                <h3>Você, que vai alugar</h3>
                <span className="sobretitulo">CLIENTE</span>
              </div>
            </div>
            <ol className="lista-numerada">
              <li>Cria a conta com seus dados</li>
              <li>Escolhe o carro e os dias</li>
              <li>Manda o pedido e acompanha</li>
              <li>Recebe a resposta e o contrato</li>
            </ol>
            <p className="nota">
              <Icone nome="info" /> Começa em poucos minutos, direto pelo navegador.
            </p>
          </article>
          <article className="dividido-lado">
            <div className="card-cabecalho">
              <span className="icone-redondo">
                <Icone nome="empresa" tamanho={26} />
              </span>
              <div>
                <h3>Empresa ou banco parceiro</h3>
                <span className="sobretitulo">QUEM APROVA</span>
              </div>
            </div>
            <ol className="lista-numerada">
              <li>Cadastra os carros com preço pela FIPE</li>
              <li>Recebe os pedidos</li>
              <li>Confere a renda e aprova ou recusa</li>
              <li>Fecha o contrato</li>
            </ol>
            <p className="nota">
              <Icone nome="info" /> Se for banco, ainda pode oferecer parcelamento.
            </p>
          </article>
        </div>
      </section>

      <section id="como-funciona" className="secao">
        <TituloSecao>Como funciona</TituloSecao>
        <ol className="passos">
          {PASSOS.map((p, i) => (
            <li key={p.titulo}>
              <span className="icone-redondo">
                <Icone nome={p.icone} tamanho={26} />
              </span>
              <span className="sobretitulo">PASSO {i + 1}</span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="quanto-custa" className="secao">
        <TituloSecao>Quanto custa</TituloSecao>
        <p className="secao-intro">
          Sem surpresa: o preço de cada dia depende só do valor do carro. Dá pra ver tudo antes de criar a conta.
        </p>
        <div className="precos">
          <article className="vidro preco-regra">
            <span className="sobretitulo">COMO A GENTE COBRA</span>
            <strong className="numero-grande">0,3%</strong>
            <p>do preço do carro na tabela FIPE vira o valor da diária.</p>
            <p className="suave">
              Um carro de R$ 60 mil na FIPE sai por <strong>R$ 180 por dia</strong>. Carro mais caro, diária maior.
              Simples assim.
            </p>
          </article>
          <article className="vidro preco-grafico">
            <h3>Compare as diárias</h3>
            <p className="suave">Quanto custa um dia com cada carro, do mais barato ao mais caro.</p>
            <figure
              className="barras"
              role="img"
              aria-label={DIARIAS.map((d) => `${d.nome}: R$ ${d.valor}`).join(', ')}
            >
              {DIARIAS.map((d) => (
                <div className="barra-linha" key={d.nome}>
                  <span>{d.nome}</span>
                  <span className="barra-trilho">
                    <span className="barra" style={{ width: `${(d.valor / MAIOR_DIARIA) * 100}%` }} />
                  </span>
                  <strong>R$ {d.valor}</strong>
                </div>
              ))}
            </figure>
            <div className="exemplo">
              <span>
                <Icone nome="calendario" /> Exemplo: 5 dias com o Onix
              </span>
              <strong>R$ 850</strong>
            </div>
          </article>
        </div>
      </section>

      <section id="duvidas" className="secao estreita">
        <TituloSecao>Perguntas frequentes</TituloSecao>
        <div className="duvidas">
          {DUVIDAS.map((d, i) => (
            <details key={d.pergunta} open={i === 0}>
              <summary>
                {d.pergunta}
                <Icone nome="mais" tamanho={22} />
              </summary>
              <p>{d.resposta}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="secao">
        <article className="vidro chamada-final">
          <img src="/carros/hb20.png" alt="Hyundai HB20" className="carro-recorte" />
          <div>
            <h2 className="titulo-grande">Pronto pra escolher seu carro?</h2>
            <p className="texto-grande">Crie sua conta em poucos minutos e faça seu primeiro pedido hoje.</p>
            <div className="linha">
              <Link to="/registro" className="btn">
                Criar minha conta <Icone nome="seta" tamanho={18} />
              </Link>
              <Link to="/login" className="btn secundario">
                Já tenho conta
              </Link>
            </div>
          </div>
        </article>
      </section>

      <Rodape />
    </div>
  )
}
