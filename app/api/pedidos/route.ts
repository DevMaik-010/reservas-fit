import { type NextRequest, NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"
import { PedidosDB } from "@/lib/pedidos-db"
import { getWebSocketServer } from "@/lib/websocket-server"

initializeDatabase()

// GET: Obtener todos los pedidos
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("operador-token")

    if (!token && request.nextUrl.searchParams.get("public") !== "true") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    return NextResponse.json(PedidosDB.getAll())
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 })
  }
}

// POST: Crear un nuevo pedido
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const nuevoPedido = {
      id: `pedido-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      usuarioId: "user-cliente",
      items: data.items || [],
      bebidas: data.bebidas || [],
      total: data.total || 0,
      estado: "pendiente" as const,
      fechaCreacion: new Date(),
      nombreCliente: data.nombreCliente || "Cliente",
      notas: data.notas || "",
    }

    const pedidoCreado = PedidosDB.create(nuevoPedido)

    getWebSocketServer().notifyPedidoCreated(pedidoCreado)
    console.log("Pedido creado:", pedidoCreado)

    return NextResponse.json(pedidoCreado, { status: 201 })
  } catch (error) {
    console.error("Error creando pedido:", error)
    return NextResponse.json({ error: "Error al crear el pedido" }, { status: 500 })
  }
}
