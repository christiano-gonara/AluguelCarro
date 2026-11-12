// Silhueta genérica de carro (perfil lateral), colorida de forma estável a partir do modelo.

const CORES = ['#0B3C8C', '#B42318', '#1E7B4A', '#5B6670', '#C98F00', '#6D3FA0', '#C2410C', '#0E7490']

function corDe(texto: string): string {
  let h = 0
  for (const c of texto) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return CORES[h % CORES.length]
}

export default function CarroIlustracao({ chave }: { chave: string }) {
  const cor = corDe(chave)
  return (
    <svg className="carro-ilustracao" viewBox="0 0 240 100" role="img" aria-hidden="true">
      <ellipse cx="122" cy="88" rx="104" ry="5" fill="rgba(31,41,51,.18)" />
      <path
        d="M18 72 L18 60 Q20 51 33 49 L70 44 Q87 27 110 25 L150 25 Q170 26 185 42 L207 46 Q223 49 225 61 L225 72 Z"
        fill={cor}
      />
      <path d="M80 44 Q93 31 110 30 L128 30 L128 44 Z" fill="#D6E4EE" />
      <path d="M134 30 L150 30 Q166 31 177 44 L134 44 Z" fill="#D6E4EE" />
      <rect x="208" y="54" width="12" height="5" rx="2" fill="#F5B700" />
      <rect x="20" y="56" width="8" height="5" rx="2" fill="#E5484D" />
      <circle cx="62" cy="73" r="14" fill="#1F2933" />
      <circle cx="62" cy="73" r="6" fill="#A7B1BA" />
      <circle cx="184" cy="73" r="14" fill="#1F2933" />
      <circle cx="184" cy="73" r="6" fill="#A7B1BA" />
    </svg>
  )
}
