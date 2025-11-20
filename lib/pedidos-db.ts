import { db } from "./db"
import type { Pedido, ItemPedido, DetalleBebida } from "@/types"

export const PedidosDB = {
  getAll: (): Pedido[] => {
    const stmt = db.prepare(`
      SELECT 
        p.id, p.usuario_id, p.total, p.estado, 
        p.fecha_creacion, p.fecha_entrega, 
        p.nombre_cliente, p.notas
      FROM pedidos p
      ORDER BY p.fecha_creacion DESC
    `)

    const pedidos = stmt.all() as any[]
    return pedidos.map((p) => enrichPedido(p))
  },

  getById: (id: string): Pedido | null => {
    const stmt = db.prepare(`
      SELECT 
        p.id, p.usuario_id, p.total, p.estado, 
        p.fecha_creacion, p.fecha_entrega, 
        p.nombre_cliente, p.notas
      FROM pedidos p
      WHERE p.id = ?
    `)

    const pedido = stmt.get(id) as any
    return pedido ? enrichPedido(pedido) : null
  },

  create: (pedido: Pedido): Pedido => {
    const stmt = db.prepare(`
      INSERT INTO pedidos (
        id, usuario_id, total, estado, 
        fecha_creacion, nombre_cliente, notas
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      pedido.id,
      pedido.usuarioId,
      pedido.total,
      pedido.estado,
      pedido.fechaCreacion.toISOString(),
      pedido.nombreCliente,
      
      pedido.notas || null,
    )

    // Insertar items
    for (const item of pedido.items) {
      const itemStmt = db.prepare(`
        INSERT INTO pedido_items (
          id, pedido_id, hamburguesa_id, hamburguesa_nombre, 
          cantidad, precio, ingredientes_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `)

      itemStmt.run(
        `item-${pedido.id}-${Math.random()}`,
        pedido.id,
        item.hamburguesa.id,
        item.hamburguesa.nombre,
        item.cantidad,
        item.precio,
        JSON.stringify(item.ingredientesSeleccionados),
      )
    }

    // Insertar bebidas
    for (const bebida of pedido.bebidas) {
      const bebidaStmt = db.prepare(`
        INSERT INTO pedido_bebidas (
          id, pedido_id, bebida_id, bebida_nombre, cantidad, precio
        ) VALUES (?, ?, ?, ?, ?, ?)
      `)

      bebidaStmt.run(
        `bebida-${pedido.id}-${Math.random()}`,
        pedido.id,
        bebida.bebida.id,
        bebida.bebida.nombre,
        
        bebida.cantidad,
        bebida.precio,
      )
    }

    return pedido
  },

  update: (id: string, data: Partial<Pedido>): Pedido | null => {
    const updates: string[] = []
    const values: any[] = []

    if (data.estado !== undefined) {
      updates.push("estado = ?")
      values.push(data.estado)
    }

    if (data.fechaEntrega !== undefined) {
      updates.push("fecha_entrega = ?")
      values.push(data.fechaEntrega?.toISOString() || null)
    }

    if (updates.length === 0) return this.getById(id)

    values.push(id)
    const stmt = db.prepare(`UPDATE pedidos SET ${updates.join(", ")} WHERE id = ?`)
    stmt.run(...values)

    return this.getById(id)
  },

  delete: (id: string): boolean => {
    const stmt = db.prepare("DELETE FROM pedidos WHERE id = ?")
    const result = stmt.run(id)
    return (result.changes || 0) > 0
  },

  getStatistics: (desde?: Date, hasta?: Date) => {
    let query = `
      SELECT 
        COUNT(*) as total_pedidos,
        COUNT(CASE WHEN estado = 'entregado' THEN 1 END) as pedidos_entregados,
        SUM(CASE WHEN estado = 'entregado' THEN total ELSE 0 END) as ganancias_totales,
        SUM(CASE WHEN estado NOT IN ('entregado') THEN total ELSE 0 END) as ganancias_pendientes,
        AVG(CASE WHEN estado = 'entregado' THEN total ELSE NULL END) as ticket_promedio
      FROM pedidos
    `

    const params: any[] = []
    if (desde && hasta) {
      query += ` WHERE fecha_creacion BETWEEN ? AND ?`
      params.push(desde.toISOString(), hasta.toISOString())
    }

    const stmt = db.prepare(query)
    const result = stmt.get(...params) as any

    return {
      totalPedidos: result.total_pedidos || 0,
      pedidosEntregados: result.pedidos_entregados || 0,
      gananciasTotales: result.ganancias_totales || 0,
      gananciasPendientes: result.ganancias_pendientes || 0,
      ticketPromedio: result.ticket_promedio || 0,
    }
  },

  getByDateRange: (desde: Date, hasta: Date): Pedido[] => {
    const stmt = db.prepare(`
      SELECT 
        p.id, p.usuario_id, p.total, p.estado, 
        p.fecha_creacion, p.fecha_entrega, 
        p.nombre_cliente, p.notas
      FROM pedidos p
      WHERE p.fecha_creacion BETWEEN ? AND ?
      ORDER BY p.fecha_creacion DESC
    `)

    const pedidos = stmt.all(desde.toISOString(), hasta.toISOString()) as any[]
    return pedidos.map((p) => enrichPedido(p))
  },
}

function enrichPedido(p: any): Pedido {
  const items = db.prepare("SELECT * FROM pedido_items WHERE pedido_id = ?").all(p.id) as any[]

  const bebidas = db.prepare("SELECT * FROM pedido_bebidas WHERE pedido_id = ?").all(p.id) as any[]

  return {
    id: p.id,
    usuarioId: p.usuario_id,
    items: items.map((i) => ({
      id: i.id,
      hamburguesa: {
        id: i.hamburguesa_id,
        nombre: i.hamburguesa_nombre,
      } as any,
      ingredientesSeleccionados: JSON.parse(i.ingredientes_json || "[]"),
      cantidad: i.cantidad,
      precio: i.precio,
    })) as ItemPedido[],
    bebidas: bebidas.map((b) => ({
      bebida: {
        id: b.bebida_id,
        nombre: b.bebida_nombre,
      } as any,
      
      cantidad: b.cantidad,
      precio: b.precio,
    })) as DetalleBebida[],
    total: p.total,
    estado: p.estado,
    fechaCreacion: new Date(p.fecha_creacion),
    fechaEntrega: p.fecha_entrega ? new Date(p.fecha_entrega) : undefined,
    nombreCliente: p.nombre_cliente,
    
    notas: p.notas,
  }
}
