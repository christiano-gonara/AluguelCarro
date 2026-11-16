import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { MODO_DEMO } from '../config'
import { recomecarDemo } from '../demo/servidor'
import Icone from './Icone'
import { useAvisos } from './Avisos'
import type { TipoAviso } from './Avisos'

// "Sistema" do rodapé da demonstração: reúne o aviso da demo, as mensagens que a aplicação
// mostra e as telas de exceção, cada coisa na sua categoria.

const ROTULO_TIPO: Record<TipoAviso, string> = { sucesso: 'Sucesso', info: 'Aviso', cuidado: 'Atenção' }

const MENSAGENS: { tipo: TipoAviso; titulo: string; texto: string }[] = [
  { tipo: 'sucesso', titulo: 'Pedido enviado', texto: 'A empresa ou o banco responde em breve.' },
  { tipo: 'sucesso', titulo: 'Pedido aprovado', texto: 'Agora é só fechar o contrato.' },
  { tipo: 'sucesso', titulo: 'Contrato fechado', texto: 'O aluguel está confirmado.' },
  { tipo: 'sucesso', titulo: 'Carro cadastrado', texto: 'Ele já aparece no catálogo.' },
  { tipo: 'sucesso', titulo: 'Dados salvos', texto: 'Suas informações estão atualizadas.' },
  { tipo: 'info', titulo: 'Você saiu da conta', texto: 'Até a próxima!' },
  { tipo: 'cuidado', titulo: 'Sua sessão acabou', texto: 'Por segurança, entre de novo.' },
]

type Categoria = 'demo' | 'mensagens' | 'telas'

function recomecar() {
  if (!window.confirm('Voltar os dados de exemplo ao começo? Pedidos, carros e contas que você criou aqui somem.')) return
  recomecarDemo()
  window.location.hash = '#/sobre'
  window.location.reload()
}

/** Aviso fixo no rodapé, no lugar da faixa flutuante da demonstração. */
export function AvisoDemo() {
  if (!MODO_DEMO) return null
  return (
    <div className="rodape-demo">
      <span className="rodape-demo-selo">
        <Icone nome="info" tamanho={14} /> Demonstração
      </span>
      <p>Nada aqui é de verdade: os dados de exemplo ficam só neste navegador.</p>
      <button type="button" className="rodape-demo-acao" onClick={recomecar}>
        Recomeçar
      </button>
    </div>
  )
}

export default function Sistema() {
  const [aberto, setAberto] = useState(false)
  const [categoria, setCategoria] = useState<Categoria>('demo')
  const avisar = useAvisos()
  const { usuario, ehCliente } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!aberto) return
    const tecla = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false)
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [aberto])

  if (!MODO_DEMO) return null

  function abrir(caminho: string) {
    setAberto(false)
    navigate(caminho)
    window.scrollTo({ top: 0 })
  }

  const telas = [
    {
      titulo: 'Página não encontrada',
      texto: 'Endereço errado: aparece a página 404, com um jeito de voltar.',
      caminho: '/qualquer-coisa',
      acao: 'Abrir 404',
    },
    ...(usuario
      ? [
          {
            titulo: 'Pedido não encontrado',
            texto: 'O pedido não existe mais ou foi apagado.',
            caminho: '/pedidos/999',
            acao: 'Abrir detalhe',
          },
          {
            titulo: 'Tela de outro perfil',
            texto: 'Tela que não é do seu perfil: volta pra tela inicial.',
            caminho: ehCliente ? '/clientes' : '/meus-dados',
            acao: 'Abrir',
          },
        ]
      : []),
  ]

  return (
    <>
      <button type="button" className="rodape-topo" onClick={() => setAberto(true)} aria-haspopup="dialog">
        <Icone nome="info" tamanho={16} /> Sistema
      </button>

      {aberto && (
        <div className="sistema-fundo" onClick={() => setAberto(false)}>
          <div
            className="sistema-painel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sistema-titulo"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="sistema-topo">
              <div>
                <span className="cenarios-demo-selo">DEMONSTRAÇÃO</span>
                <h2 id="sistema-titulo">Sistema</h2>
              </div>
              <button type="button" className="sistema-fechar" onClick={() => setAberto(false)} aria-label="Fechar">
                <Icone nome="fechar" tamanho={20} />
              </button>
            </header>

            <div className="sistema-abas" role="tablist" aria-label="Categorias do sistema">
              <button
                type="button"
                role="tab"
                aria-selected={categoria === 'demo'}
                className={categoria === 'demo' ? 'ativa' : ''}
                onClick={() => setCategoria('demo')}
              >
                Demonstração
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={categoria === 'mensagens'}
                className={categoria === 'mensagens' ? 'ativa' : ''}
                onClick={() => setCategoria('mensagens')}
              >
                Mensagens
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={categoria === 'telas'}
                className={categoria === 'telas' ? 'ativa' : ''}
                onClick={() => setCategoria('telas')}
              >
                Telas de exceção
              </button>
            </div>

            <div className="sistema-corpo">
              {categoria === 'demo' && (
                <>
                  <p className="sistema-texto">
                    Nada aqui é de verdade. Os dados ficam neste navegador, e Recomeçar apaga o que você criou.
                  </p>
                  <ul className="sistema-lista">
                    <li>
                      Contas de exemplo, com a senha <code>demo</code>: <code>cliente.demo</code>,{' '}
                      <code>marina.souza</code>, <code>lucas.pereira</code>, <code>agente.empresa</code> e{' '}
                      <code>agente.banco</code>.
                    </li>
                    <li>Depois do login, a aba verde <strong>Cenários de uso</strong> mostra o que testar em cada tela.</li>
                    <li>O sistema completo (Spring Boot + Supabase) roda localmente, conforme o README.</li>
                  </ul>
                  <button type="button" className="btn secundario" onClick={recomecar}>
                    Recomeçar os dados de exemplo
                  </button>
                </>
              )}

              {categoria === 'mensagens' && (
                <>
                  <p className="sistema-texto">
                    Os avisos que aparecem no canto da tela. Clique em Mostrar pra ver.
                  </p>
                  <ul className="sistema-itens">
                    {MENSAGENS.map((m) => (
                      <li key={m.titulo}>
                        <span className={`sistema-tipo ${m.tipo}`}>{ROTULO_TIPO[m.tipo]}</span>
                        <div>
                          <strong>{m.titulo}</strong>
                          <span>{m.texto}</span>
                        </div>
                        <button
                          type="button"
                          className="btn secundario sistema-acao"
                          onClick={() => avisar(m.titulo, { texto: m.texto, tipo: m.tipo })}
                        >
                          Mostrar
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {categoria === 'telas' && (
                <>
                  <p className="sistema-texto">As telas que aparecem quando algo dá errado.</p>
                  <ul className="sistema-itens">
                    {telas.map((t) => (
                      <li key={t.titulo}>
                        <div>
                          <strong>{t.titulo}</strong>
                          <span>{t.texto}</span>
                        </div>
                        <button type="button" className="btn secundario sistema-acao" onClick={() => abrir(t.caminho)}>
                          {t.acao}
                        </button>
                      </li>
                    ))}
                  </ul>
                  {!usuario && (
                    <p className="sistema-texto pequeno">
                      Entre com uma conta de exemplo pra ver as exceções que dependem de um pedido ou de um perfil.
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
