import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, paraErro } from '../api'
import CarroCard from '../components/CarroCard'
import Erro from '../components/Erro'
import type { Automovel } from '../types'

/** Tela inicial do cliente: os carros disponíveis, prontos para virar um pedido. */
export default function Catalogo() {
  const [carros, setCarros] = useState<Automovel[] | null>(null)
  const [erro, setErro] = useState<Error | null>(null)

  useEffect(() => {
    api.listarAutomoveis().then(setCarros).catch((e: unknown) => setErro(paraErro(e)))
  }, [])

  return (
    <section>
      <header className="pagina-topo">
        <h1>Escolha seu carro</h1>
        <p className="suave">O pedido passa por uma análise financeira antes do contrato.</p>
      </header>
      <Erro erro={erro} />
      {carros === null && !erro && <p>Carregando carros…</p>}
      {carros?.length === 0 && (
        <div className="vazio">
          <p>Nenhum carro cadastrado ainda. Um agente precisa cadastrar os carros na aba Automóveis.</p>
        </div>
      )}
      {carros && carros.length > 0 && (
        <div className="vitrine-grade">
          {carros.map((c) => (
            <CarroCard key={c.id} carro={c}>
              <Link className="btn" to={`/pedidos/novo?automovel=${c.id}`}>
                Alugar este carro
              </Link>
            </CarroCard>
          ))}
        </div>
      )}
    </section>
  )
}
