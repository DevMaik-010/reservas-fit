import type { Hamburguesa, Ingrediente } from "./hamburguesa"
import type { Bebida } from "./bebida"

export interface ItemPedido {
  id: string
  hamburguesa: Hamburguesa
  ingredientesSeleccionados: Ingrediente[]
  cantidad: number
  precio: number
}

export interface DetalleBebida {
  bebida: Bebida
  cantidad: number
  precio: number
}

export interface Pedido {
  id: string
  usuarioId: string
  items: ItemPedido[]
  bebidas: DetalleBebida[]
  total: number
  estado: "pendiente" | "preparando" | "listo" | "entregado"
  fechaCreacion: Date
  fechaEntrega?: Date
  nombreCliente: string
  notas?: string
}
