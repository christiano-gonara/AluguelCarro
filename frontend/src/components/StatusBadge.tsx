import type { StatusPedido } from '../types'
import { STATUS_ROTULO } from '../utils/format'

export default function StatusBadge({ status }: { status: StatusPedido }) {
  return <span className={`badge ${status}`}>{STATUS_ROTULO[status]}</span>
}
