import { type NextRequest, NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"
import { PedidosDB } from "@/lib/pedidos-db"
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"

initializeDatabase()

export async function GET(request: NextRequest) {
  try {
    const periodo = request.nextUrl.searchParams.get("periodo") || "hoy"
    const now = new Date()
    let desde: Date, hasta: Date

    switch (periodo) {
      case "hoy":
        desde = startOfDay(now)
        hasta = endOfDay(now)
        break
      case "semana":
        desde = startOfWeek(now, { weekStartsOn: 1 })
        hasta = endOfWeek(now, { weekStartsOn: 1 })
        break
      case "mes":
        desde = startOfMonth(now)
        hasta = endOfMonth(now)
        break
      case "todo":
        desde = new Date("2000-01-01")
        hasta = new Date()
        break
      default:
        desde = startOfDay(now)
        hasta = endOfDay(now)
    }

    const stats = PedidosDB.getStatistics(desde, hasta)
    const pedidos = PedidosDB.getByDateRange(desde, hasta)

    // Agrupar por día para gráficos
    const ventasPorDia: Record<string, { fecha: string; ventas: number; cantidad: number }> = {}

    pedidos.forEach((pedido) => {
      if (pedido.estado === "entregado") {
        const fecha = new Date(pedido.fechaCreacion).toISOString().split("T")[0]
        if (!ventasPorDia[fecha]) {
          ventasPorDia[fecha] = { fecha, ventas: 0, cantidad: 0 }
        }
        ventasPorDia[fecha].ventas += pedido.total
        ventasPorDia[fecha].cantidad += 1
      }
    })

    return NextResponse.json({
      periodo,
      desde,
      hasta,
      estadisticas: stats,
      ventasPorDia: Object.values(ventasPorDia).sort((a, b) => a.fecha.localeCompare(b.fecha)),
      totalPedidosPeriodo: pedidos.length,
    })
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
