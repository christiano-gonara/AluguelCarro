import { useState } from 'react'
import { recomecarDemo } from '../demo/servidor'
import Icone from './Icone'

/** Faixa fixa que só aparece na versão de demonstração (GitHub Pages). */
export default function FaixaDemo() {
  const [aberta, setAberta] = useState(true)

  function recomecar() {
    if (!window.confirm('Voltar os dados de exemplo ao começo? Pedidos, carros e contas que você criou aqui somem.')) return
    recomecarDemo()
    window.location.hash = '#/sobre'
    window.location.reload()
  }

  if (!aberta)
    return (
      <button type="button" className="faixa-demo fechada" onClick={() => setAberta(true)} aria-label="Sobre a demonstração">
        <Icone nome="info" tamanho={18} />
      </button>
    )

  return (
    <aside className="faixa-demo" aria-label="Versão de demonstração">
      <Icone nome="info" tamanho={18} />
      <p>
        <strong>Demonstração.</strong> Nada aqui é de verdade: os dados ficam só neste navegador. Troque de conta em <strong>Cenários de uso</strong>, no fim da página.
      </p>
      <button type="button" className="faixa-demo-acao" onClick={recomecar}>
        Recomeçar
      </button>
      <button type="button" className="faixa-demo-fechar" onClick={() => setAberta(false)} aria-label="Esconder aviso">
        <Icone nome="fechar" tamanho={18} />
      </button>
    </aside>
  )
}
