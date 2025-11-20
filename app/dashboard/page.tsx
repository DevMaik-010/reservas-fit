"use client"

import { useState, useEffect, useCallback } from "react"
import { PedidoCard } from "@/components/pedido-card"
import { EstadisticasResumen } from "@/components/estadisticas-resumen"
import { usePedidosWebSocket } from "@/hooks/use-pedidos-websocket"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Pedido } from "@/types"

export default function DashboardPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [filtro, setFiltro] = useState<Pedido["estado"] | "todos">("pendiente")
  const [loading, setLoading] = useState(true)

  const handleWebSocketUpdate = useCallback((event: string, data: any) => {
    console.log("[Dashboard] WS Event:", event, data)

    if (event === "pedido:creado") {
      setPedidos((prev) => [data, ...prev])
    } else if (event === "pedido:actualizado") {
      setPedidos((prev) => prev.map((p) => (p.id === data.id ? data : p)))
    } else if (event === "pedido:eliminado") {
      setPedidos((prev) => prev.filter((p) => p.id !== data.id))
    }
  }, [])

  usePedidosWebSocket(handleWebSocketUpdate)

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await fetch("/api/pedidos")
        const data = await response.json()
        setPedidos(data)
      } catch (error) {
        console.error("Error cargando pedidos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPedidos()
  }, [])

  const pedidosFiltrados = filtro === "todos" ? pedidos : pedidos.filter((p) => p.estado === filtro)

  const handleActualizarEstado = async (pedidoId: string, nuevoEstado: Pedido["estado"]) => {
    try {
      const response = await fetch(`/api/pedidos/${pedidoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      })

      if (response.ok) {
        const data = await response.json()
        setPedidos(pedidos.map((p) => (p.id === pedidoId ? data : p)))
      }
    } catch (error) {
      console.error("Error actualizando pedido:", error)
    }
  }

  const handleEliminarPedido = async (pedidoId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este pedido?")) return

    try {
      const response = await fetch(`/api/pedidos/${pedidoId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPedidos(pedidos.filter((p) => p.id !== pedidoId))
      }
    } catch (error) {
      console.error("Error eliminando pedido:", error)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Operador</h1>
            <p className="text-red-100">Gestión de pedidos en tiempo real</p>
          </div>
          <div className="flex gap-2">
            <Link href="/ventas">
              <Button className="bg-white text-red-500 hover:bg-red-50">Ver Reportes de Ventas</Button>
            </Link>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-white text-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        <EstadisticasResumen pedidos={pedidos} />

        <div className="flex gap-2 flex-wrap">
          {(["pendiente", "preparando", "listo", "entregado", "todos"] as const).map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltro(estado)}
              className={`px-4 py-2 rounded-full font-medium transition-colors capitalize ${
                filtro === estado
                  ? "bg-red-500 text-white"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-red-500"
              }`}
            >
              {estado === "todos" ? "Todos" : estado}
              {estado !== "todos" && (
                <span className="ml-2 text-xs bg-opacity-80 px-2 py-1 rounded-full">
                  {pedidos.filter((p) => p.estado === estado).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Cargando pedidos...</p>
            </div>
          ) : pedidosFiltrados.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 text-lg">No hay pedidos con estado "{filtro}"</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pedidosFiltrados
                .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
                .map((pedido) => (
                  <PedidoCard
                    key={pedido.id}
                    pedido={pedido}
                    onActualizarEstado={handleActualizarEstado}
                    onEliminar={handleEliminarPedido}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
