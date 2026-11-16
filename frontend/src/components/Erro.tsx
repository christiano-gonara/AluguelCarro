import { ApiError } from '../api'
import Icone from './Icone'

/** Troca as mensagens técnicas mais comuns por frases simples. */
const AMIGAVEIS: Record<string, string> = {
  'Usuário ou senha inválidos': 'Usuário ou senha não conferem. Confere se o Caps Lock está ligado.',
  'A data final não pode ser anterior à data inicial': 'A devolução está antes da retirada. Escolha uma data de devolução depois da retirada.',
  'Failed to fetch': 'Não deu pra falar com o servidor. Confere se o back-end está rodando.',
  'Acesso negado': 'Você não tem permissão pra fazer isso com esta conta.',
  'Dados inválidos': 'Alguns campos precisam de ajuste:',
  'Pedido não encontrado': 'Esse pedido não existe ou foi apagado.',
  'Automóvel não encontrado': 'Esse carro não está mais no catálogo.',
  'Nome de usuário já está em uso': 'Esse nome de usuário já está em uso. Tente outro.',
  'Já existe um cliente com este CPF': 'Já tem uma conta com esse CPF. Que tal entrar?',
  'Já existe um automóvel com esta placa': 'Já tem um carro cadastrado com essa placa.',
  'Já existe um automóvel com esta matrícula': 'Já tem um carro cadastrado com essa matrícula.',
  'Automóvel está vinculado a pedidos de aluguel': 'Esse carro já aparece em pedidos, então não dá pra apagar.',
  'Não é possível excluir o cadastro: há contrato de aluguel executado':
    'Você tem um contrato fechado, então a conta não pode ser apagada agora.',
  'Somente pedidos em análise podem ser avaliados': 'Esse pedido já foi respondido.',
  'O cliente só pode modificar pedidos em análise': 'Só dá pra mudar o pedido enquanto ele está em análise.',
  'O contrato só pode ser executado após parecer financeiro positivo': 'Primeiro o pedido precisa ser aprovado.',
}

function mensagemAmigavel(mensagem: string): string {
  if (/^Pedido já está /.test(mensagem) || / não pode ser modificado$/.test(mensagem))
    return 'Esse pedido já foi encerrado, então não dá pra mudar mais nada nele.'
  return AMIGAVEIS[mensagem] ?? mensagem
}

export default function Erro({ erro }: { erro: Error | null }) {
  if (!erro) return null
  const detalhes = erro instanceof ApiError ? erro.detalhes : []
  return (
    <div className="erro" role="alert">
      <Icone nome="info" />
      <div>
        <strong>{mensagemAmigavel(erro.message)}</strong>
        {detalhes.length > 0 && (
          <ul>
            {detalhes.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
