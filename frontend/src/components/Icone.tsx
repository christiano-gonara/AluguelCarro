// Ícones do coolicons (estilo duocolor, de Kryston Schwarze, licença MIT): https://coolicons.cool
// O traço principal segue a cor do texto (currentColor); o secundário fica no verde-oliva de destaque.

export type NomeIcone = 'busca' | 'sacola' | 'usuario' | 'documento' | 'escudo' | 'chave' | 'cadeado' | 'email' | 'empresa' | 'banco' | 'calendario' | 'carro' | 'relogio' | 'cartao' | 'info' | 'seta' | 'setaCima' | 'mais' | 'sair' | 'github'

const DESENHOS: Record<NomeIcone, { primario: string[]; secundario: string[] }> = {
  busca: { primario: ["M3 10C3 13.86599 6.13401 17 10 17C13.86599 17 17 13.86599 17 10C17 6.13401 13.86599 3 10 3C6.13401 3 3 6.13401 3 10Z"], secundario: ["M15 15L21 21"] },
  sacola: { primario: ["M5 8C5 6.89543 5.89543 6 7 6H17C18.10457 6 19 6.89543 19 8V19C19 20.10457 18.10457 21 17 21H7C5.89543 21 5 20.10457 5 19Z"], secundario: ["M9 6C9 4.34315 10.34315 3 12 3C13.65685 3 15 4.34315 15 6"] },
  usuario: { primario: ["M8 7C8 9.20914 9.79086 11 12 11C14.20914 11 16 9.20914 16 7C16 4.79086 14.20914 3 12 3C9.79086 3 8 4.79086 8 7Z"], secundario: ["M6 21C6 17.68629 8.68629 15 12 15C15.31371 15 18 17.68629 18 21"] },
  documento: { primario: ["M13 3H7C5.89543 3 5 3.89543 5 5V19C5 20.10457 5.89543 21 7 21H17C18.10457 21 19 20.10457 19 19V9M13 3L19 9M13 3V7C13 8.10457 13.89543 9 15 9H19"], secundario: ["M9 13H15M9 17H15"] },
  escudo: { primario: ["M12 3H18C19.10457 3 20 3.89543 20 5V10C20 15.5 16.5 19 12 21C7.5 19 4 15.5 4 10V5C4 3.89543 4.89543 3 6 3H12Z"], secundario: ["M9 11L11 13L15 9"] },
  chave: { primario: ["M12 12L21 3M3 16C3 18.76142 5.23858 21 8 21C10.76142 21 13 18.76142 13 16C13 13.23858 10.76142 11 8 11C5.23858 11 3 13.23858 3 16Z"], secundario: ["M16 8L18 10M19 5L21 7"] },
  cadeado: { primario: ["M4 12C4 10.89543 4.89543 10 6 10H18C19.10457 10 20 10.89543 20 12V19C20 20.10457 19.10457 21 18 21H6C4.89543 21 4 20.10457 4 19Z"], secundario: ["M9 10V6C9 4.34315 10.34315 3 12 3C13.65685 3 15 4.34315 15 6V10"] },
  email: { primario: ["M12 19H5C3.89543 19 3 18.10457 3 17V7C3 5.89543 3.89543 5 5 5H19C20.10457 5 21 5.89543 21 7V17C21 18.10457 20.10457 19 19 19H12"], secundario: ["M4 6L8 10C8.64029 10.64029 9.35971 11 10 11H14C14.64029 11 15.35971 10.64029 16 10L20 6"] },
  empresa: { primario: ["M3 20H21M12 20V6C12 4.89543 11.10457 4 10 4H7C5.89543 4 5 4.89543 5 6V20"], secundario: ["M12 10.6L12.75061 9.99951C13.48105 9.41516 14.51895 9.41516 15.24939 9.99951L18.24939 12.39951C18.72382 12.77906 19 13.35368 19 13.96125V20"] },
  banco: { primario: ["M12 7H3L12 3L21 7H12ZM3 21H21"], secundario: ["M6 11V17M10 11V17M14 11V17M18 11V17"] },
  calendario: { primario: ["M4 7C4 5.89543 4.89543 5 6 5H18C19.10457 5 20 5.89543 20 7V19C20 20.10457 19.10457 21 18 21H6C4.89543 21 4 20.10457 4 19ZM8 3V5M16 3V5M4 9H20"], secundario: ["M9 15L11 17L15 13"] },
  carro: { primario: ["M5 18C3.89543 18 3 17.10457 3 16V12L7 8C7.64029 7.35971 8.35971 7 9 7H12C12.64029 7 13.35971 7.35971 14 8L18 12H19C20.10457 12 21 12.89543 21 14V16C21 17.10457 20.10457 18 19 18M9 18H15M3 12H18M10 7V12"], secundario: ["M5 18C5 19.10457 5.89543 20 7 20C8.10457 20 9 19.10457 9 18C9 16.89543 8.10457 16 7 16C5.89543 16 5 16.89543 5 18ZM15 18C15 19.10457 15.89543 20 17 20C18.10457 20 19 19.10457 19 18C19 16.89543 18.10457 16 17 16C15.89543 16 15 16.89543 15 18Z"] },
  relogio: { primario: ["M3 12C3 16.97056 7.02944 21 12 21C16.97056 21 21 16.97056 21 12C21 7.02944 16.97056 3 12 3C7.02944 3 3 7.02944 3 12Z"], secundario: ["M12 7V12H17"] },
  cartao: { primario: ["M3 7C3 5.89543 3.89543 5 5 5H19C20.10457 5 21 5.89543 21 7V17C21 18.10457 20.10457 19 19 19H5C3.89543 19 3 18.10457 3 17ZM3 9H21"], secundario: ["M7 15H11"] },
  info: { primario: ["M3 12C3 16.97056 7.02944 21 12 21C16.97056 21 21 16.97056 21 12C21 7.02944 16.97056 3 12 3C7.02944 3 3 7.02944 3 12Z"], secundario: ["M12 8H12.01M12 11V16"] },
  seta: { primario: ["M14 17L19 12L14 7M19 12H5"], secundario: [] },
  setaCima: { primario: ["M17 10L12 5L7 10M12 5V19"], secundario: [] },
  mais: { primario: ["M6 12H18M12 6V18"], secundario: [] },
  sair: { primario: ["M14 17V19C14 20.10457 13.10457 21 12 21H5C3.89543 21 3 20.10457 3 19V5C3 3.89543 3.89543 3 5 3H12C13.10457 3 14 3.89543 14 5V7"], secundario: ["M18 15L21 12M21 12L18 9M21 12H11"] },
  github: { primario: ["M9 21V18C9 17 9 16 10 15C7 15 4 13 4 9C4 7.7 4.5 6.7 5 6C4.6 5 4.6 4 5 3C5 3 6.5 3 9 4C11 3.5 13 3.5 15 4C17.5 3 19 3 19 3C19.4 4 19.4 5 19 6C19.5 6.7 20 7.7 20 9C20 13 17 15 14 15C15 16 15 17 15 18V21"], secundario: ["M9 19C5 20 5 16 3 16"] },
}

const TRACO = {
  fill: 'none',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export default function Icone({ nome, tamanho = 20 }: { nome: NomeIcone; tamanho?: number }) {
  const { primario, secundario } = DESENHOS[nome]
  return (
    <svg className="icone" width={tamanho} height={tamanho} viewBox="0 0 24 24" aria-hidden="true">
      {secundario.map((d) => (
        <path key={d} d={d} stroke="#B5C98A" {...TRACO} />
      ))}
      {primario.map((d) => (
        <path key={d} d={d} stroke="currentColor" {...TRACO} />
      ))}
    </svg>
  )
}
