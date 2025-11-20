"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface Estadisticas {
  totalPedidos: number
  pedidosEntregados: number
  gananciasTotales: number
  gananciasPendientes: number
  ticketPromedio: number
}

interface VentasDia {
  fecha: string
  ventas: number
  cantidad: number
}

export default function VentasPage() {
  const [periodo, setPeriodo] = useState<"hoy" | "semana" | "mes" | "todo">("hoy")
  const [stats, setStats] = useState<Estadisticas | null>(null)
  const [ventasPorDia, setVentasPorDia] = useState<VentasDia[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEstadisticas = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/estadisticas?periodo=${periodo}`)
        const data = await response.json()
        setStats(data.estadisticas)
        setVentasPorDia(data.ventasPorDia)
      } catch (error) {
        console.error("Error cargando estadísticas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEstadisticas()
  }, [periodo])

  const labelsPeriodo = {
    hoy: "Hoy",
    semana: "Esta Semana",
    mes: "Este Mes",
    todo: "Todas las Ventas",
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Reportes de Ventas</h1>
          <p className="text-red-100">Análisis detallado de ingresos y pedidos</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Filtro de periodo */}
        <div className="flex gap-2 flex-wrap">
          {(["hoy", "semana", "mes", "todo"] as const).map((p) => (
            <Button
              key={p}
              onClick={() => setPeriodo(p)}
              variant={periodo === p ? "default" : "outline"}
              className={`${
                periodo === p ? "bg-red-500 hover:bg-red-600 text-white" : "border-gray-300 hover:border-red-500"
              }`}
            >
              {labelsPeriodo[p]}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando estadísticas...</p>
          </div>
        ) : stats ? (
          <>
            {/* KPIs principales */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="border-l-4 border-l-red-500 bg-red-50">
                <div className="p-4">
                  <p className="text-xs text-gray-600 font-medium">Total Pedidos</p>
                  <p className="text-2xl font-bold text-red-500 mt-1">{stats.totalPedidos}</p>
                </div>
              </Card>

              <Card className="border-l-4 border-l-green-500 bg-green-50">
                <div className="p-4">
                  <p className="text-xs text-gray-600 font-medium">Entregados</p>
                  <p className="text-2xl font-bold text-green-500 mt-1">{stats.pedidosEntregados}</p>
                </div>
              </Card>

              <Card className="border-l-4 border-l-orange-500 bg-orange-50">
                <div className="p-4">
                  <p className="text-xs text-gray-600 font-medium">Ganancias Totales</p>
                  <p className="text-2xl font-bold text-orange-500 mt-1">${stats.gananciasTotales.toFixed(2)}</p>
                </div>
              </Card>

              <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
                <div className="p-4">
                  <p className="text-xs text-gray-600 font-medium">Ticket Promedio</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">${stats.ticketPromedio.toFixed(2)}</p>
                </div>
              </Card>

              <Card className="border-l-4 border-l-purple-500 bg-purple-50">
                <div className="p-4">
                  <p className="text-xs text-gray-600 font-medium">Pendientes de Entrega</p>
                  <p className="text-2xl font-bold text-purple-500 mt-1">${stats.gananciasPendientes.toFixed(2)}</p>
                </div>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Gráfico de línea - Ventas por día */}
              <Card>
                <div className="p-4">
                  <h2 className="text-lg font-bold mb-4">Ventas por Día</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={ventasPorDia}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                      <Legend />
                      <Line type="monotone" dataKey="ventas" stroke="#ef4444" name="Ventas ($)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Gráfico de barras - Cantidad de pedidos por día */}
              <Card>
                <div className="p-4">
                  <h2 className="text-lg font-bold mb-4">Pedidos Entregados por Día</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ventasPorDia}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="cantidad" fill="#f97316" name="Cantidad de Pedidos" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Desglose adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <div className="p-4">
                  <h2 className="text-lg font-bold mb-4">Resumen Financiero</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">Ganancias Completadas:</span>
                      <span className="font-bold text-green-500">${stats.gananciasTotales.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">Ganancias Pendientes:</span>
                      <span className="font-bold text-yellow-600">${stats.gananciasPendientes.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t-2">
                      <span className="text-gray-800 font-bold">Total Esperado:</span>
                      <span className="font-bold text-red-500">
                        ${(stats.gananciasTotales + stats.gananciasPendientes).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-4">
                  <h2 className="text-lg font-bold mb-4">Métricas Clave</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">Total de Pedidos:</span>
                      <span className="font-bold">{stats.totalPedidos}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">Pedidos Entregados:</span>
                      <span className="font-bold text-green-500">{stats.pedidosEntregados}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">Ticket Promedio:</span>
                      <span className="font-bold">${stats.ticketPromedio.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t-2">
                      <span className="text-gray-800 font-bold">Tasa de Entrega:</span>
                      <span className="font-bold text-blue-500">
                        {stats.totalPedidos > 0 ? ((stats.pedidosEntregados / stats.totalPedidos) * 100).toFixed(1) : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Botón de descarga o reportes */}
            <div className="flex gap-2">
              <Button className="bg-red-500 hover:bg-red-600 text-white">Descargar Reporte</Button>
              <Button variant="outline" onClick={() => (window.location.href = "/dashboard")}>
                Volver al Dashboard
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay datos disponibles</p>
          </div>
        )}
      </div>
    </main>
  )
}
