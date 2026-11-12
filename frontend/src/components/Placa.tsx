/** Placa no padrão Mercosul: faixa azul com "BRASIL" e os caracteres em destaque. */
export default function Placa({ codigo, grande = false }: { codigo: string; grande?: boolean }) {
  return (
    <span className={grande ? 'placa placa-grande' : 'placa'} aria-label={`Placa ${codigo}`}>
      <span className="placa-faixa" aria-hidden="true">BRASIL</span>
      <span className="placa-codigo">{codigo.toUpperCase()}</span>
    </span>
  )
}
