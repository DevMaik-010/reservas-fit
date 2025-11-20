import type { Pedido } from "@/types"

// En producción, esto sería reemplazado con una BD real (Supabase, PostgreSQL, etc)
let pedidosDB: Pedido[] = []

export const PedidosStore = {
  // Obtener todos los pedidos
  getAll: (): Pedido[] => {
    return pedidosDB
  },

  // Obtener un pedido por ID
  getById: (id: string): Pedido | undefined => {
    return pedidosDB.find((p) => p.id === id)
  },

  // Crear un nuevo pedido
  create: (pedido: Pedido): Pedido => {
    pedidosDB.push(pedido)
    return pedido
  },

  // Actualizar un pedido
  update: (id: string, data: Partial<Pedido>): Pedido | undefined => {
    const index = pedidosDB.findIndex((p) => p.id === id)
    if (index === -1) return undefined

    pedidosDB[index] = { ...pedidosDB[index], ...data }
    return pedidosDB[index]
  },

  // Eliminar un pedido
  delete: (id: string): boolean => {
    const index = pedidosDB.findIndex((p) => p.id === id)
    if (index === -1) return false

    pedidosDB.splice(index, 1)
    return true
  },

  // Limpiar todos los pedidos (para testing)
  clear: (): void => {
    pedidosDB = []
  },
}
