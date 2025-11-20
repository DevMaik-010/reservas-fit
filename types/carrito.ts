import type { ItemPedido, DetalleBebida } from "./pedido"

export interface Carrito {
  items: ItemPedido[]
  bebidas: DetalleBebida[]
  total: number
}
