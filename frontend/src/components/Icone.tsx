// Ícones de traço com miolo preenchido em verde-oliva translúcido (estilo duocolor).
// O traço segue a cor do texto (currentColor); o preenchimento é sempre o verde de destaque.

export type NomeIcone =
  | 'busca'
  | 'sacola'
  | 'usuario'
  | 'documento'
  | 'escudo'
  | 'chave'
  | 'cadeado'
  | 'email'
  | 'empresa'
  | 'banco'
  | 'calendario'
  | 'carro'
  | 'relogio'
  | 'cartao'
  | 'info'
  | 'seta'
  | 'mais'
  | 'sair'

const PREENCHIMENTO = { fill: '#8FA36A', fillOpacity: 0.45, stroke: 'none' } as const
const TRACO = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

function desenho(nome: NomeIcone) {
  switch (nome) {
    case 'busca':
      return (
        <>
          <circle cx="11" cy="11" r="6.5" {...PREENCHIMENTO} />
          <circle cx="11" cy="11" r="6.5" {...TRACO} />
          <path d="M20 20l-4.2-4.2" {...TRACO} />
        </>
      )
    case 'sacola':
      return (
        <>
          <path d="M5 8h14l-1.2 12H6.2z" {...PREENCHIMENTO} />
          <path d="M5 8h14l-1.2 12H6.2z" {...TRACO} />
          <path d="M9 8V7a3 3 0 0 1 6 0v1" {...TRACO} />
        </>
      )
    case 'usuario':
      return (
        <>
          <circle cx="12" cy="8.5" r="3.8" {...PREENCHIMENTO} />
          <circle cx="12" cy="8.5" r="3.8" {...TRACO} />
          <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" {...TRACO} />
        </>
      )
    case 'documento':
      return (
        <>
          <path d="M6 3h8l4 4v14H6z" {...PREENCHIMENTO} />
          <path d="M6 3h8l4 4v14H6z" {...TRACO} />
          <path d="M14 3v4h4M9 12h6M9 16h4" {...TRACO} />
        </>
      )
    case 'escudo':
      return (
        <>
          <path d="M12 3l7 3v5.5c0 4.3-3 8-7 9.5-4-1.5-7-5.2-7-9.5V6z" {...PREENCHIMENTO} />
          <path d="M12 3l7 3v5.5c0 4.3-3 8-7 9.5-4-1.5-7-5.2-7-9.5V6z" {...TRACO} />
          <path d="M9 12l2.2 2.2L15.5 10" {...TRACO} />
        </>
      )
    case 'chave':
      return (
        <>
          <circle cx="8" cy="15" r="4" {...PREENCHIMENTO} />
          <circle cx="8" cy="15" r="4" {...TRACO} />
          <path d="M11 12l9-9M16.5 6.5l2.5 2.5M14.5 8.5l1.5 1.5" {...TRACO} />
        </>
      )
    case 'cadeado':
      return (
        <>
          <rect x="5" y="10.5" width="14" height="10" rx="2.5" {...PREENCHIMENTO} />
          <rect x="5" y="10.5" width="14" height="10" rx="2.5" {...TRACO} />
          <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5M12 15v2" {...TRACO} />
        </>
      )
    case 'email':
      return (
        <>
          <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" {...PREENCHIMENTO} />
          <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" {...TRACO} />
          <path d="M4 7l8 6 8-6" {...TRACO} />
        </>
      )
    case 'empresa':
      return (
        <>
          <path d="M5 21V5l8-2v18z" {...PREENCHIMENTO} />
          <path d="M5 21V5l8-2v18M13 9h6v12M3 21h18M8 8h2M8 12h2M8 16h2M16 13h1M16 17h1" {...TRACO} />
        </>
      )
    case 'banco':
      return (
        <>
          <path d="M3 9l9-5 9 5z" {...PREENCHIMENTO} />
          <path d="M3 9l9-5 9 5zM5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 21h18" {...TRACO} />
        </>
      )
    case 'calendario':
      return (
        <>
          <rect x="4" y="5.5" width="16" height="15" rx="2.5" {...PREENCHIMENTO} />
          <rect x="4" y="5.5" width="16" height="15" rx="2.5" {...TRACO} />
          <path d="M8 3.5v4M16 3.5v4M4 10.5h16" {...TRACO} />
        </>
      )
    case 'carro':
      return (
        <>
          <path d="M3.5 16v-3.5L6 7.5h12l2.5 5V16z" {...PREENCHIMENTO} />
          <path d="M3.5 16v-3.5L6 7.5h12l2.5 5V16zM3.5 12.5h17" {...TRACO} />
          <circle cx="7.5" cy="17" r="1.8" {...TRACO} />
          <circle cx="16.5" cy="17" r="1.8" {...TRACO} />
        </>
      )
    case 'relogio':
      return (
        <>
          <circle cx="12" cy="12" r="8.5" {...PREENCHIMENTO} />
          <circle cx="12" cy="12" r="8.5" {...TRACO} />
          <path d="M12 7.5V12l3 2" {...TRACO} />
        </>
      )
    case 'cartao':
      return (
        <>
          <rect x="3" y="6" width="18" height="12" rx="2.5" {...PREENCHIMENTO} />
          <rect x="3" y="6" width="18" height="12" rx="2.5" {...TRACO} />
          <path d="M3 10h18M7 14.5h3" {...TRACO} />
        </>
      )
    case 'info':
      return (
        <>
          <circle cx="12" cy="12" r="9" {...PREENCHIMENTO} />
          <circle cx="12" cy="12" r="9" {...TRACO} />
          <path d="M12 11v5M12 8h.01" {...TRACO} />
        </>
      )
    case 'seta':
      return <path d="M5 12h14M13 6l6 6-6 6" {...TRACO} />
    case 'mais':
      return <path d="M12 5v14M5 12h14" {...TRACO} />
    case 'sair':
      return (
        <>
          <path d="M14 4H6v16h8" {...TRACO} />
          <path d="M10 12h10M16 8l4 4-4 4" {...TRACO} />
        </>
      )
  }
}

export default function Icone({ nome, tamanho = 20 }: { nome: NomeIcone; tamanho?: number }) {
  return (
    <svg className="icone" width={tamanho} height={tamanho} viewBox="0 0 24 24" aria-hidden="true">
      {desenho(nome)}
    </svg>
  )
}
