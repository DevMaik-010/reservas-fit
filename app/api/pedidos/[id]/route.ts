import { type NextRequest, NextResponse } from "next/server"
import type { Pedido } from "@/types"
import { initializeDatabase } from "@/lib/db"
import { PedidosDB } from "@/lib/pedidos-db"
import { getWebSocketServer } from "@/lib/websocket-server"

initializeDatabase()

// GET: Obtener un pedido por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const pedido = PedidosDB.getById(id)

    if (!pedido) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
    }

    return NextResponse.json(pedido)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener el pedido" }, { status: 500 })
  }
}

// PATCH: Actualizar estado del pedido
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.cookies.get("operador-token")

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { estado } = await request.json()

    const estadosValidos = ["pendiente", "preparando", "listo", "entregado"]
    if (!estadosValidos.includes(estado)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 })
    }

    const pedidoActualizado = PedidosDB.update(id, {
      estado: estado as Pedido["estado"],
      ...(estado === "entregado" && { fechaEntrega: new Date() }),
    })

    if (!pedidoActualizado) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
    }

    getWebSocketServer().notifyPedidoUpdated(pedidoActualizado)

    return NextResponse.json(pedidoActualizado)
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar el pedido" }, { status: 500 })
  }
}

// DELETE: Eliminar un pedido
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.cookies.get("operador-token")

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const eliminado = PedidosDB.delete(id)

    if (!eliminado) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
    }

    getWebSocketServer().notifyPedidoDeleted(id)

    return NextResponse.json({
      message: "Pedido eliminado",
      id,
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar el pedido" }, { status: 500 })
  }
}
