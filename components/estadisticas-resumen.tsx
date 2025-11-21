"use client"

import { Card } from "@/components/ui/card"
import type { Pedido } from "@/types"

interface Props {
  pedidos: Pedido[]
}

export function EstadisticasResumen({ pedidos }: Props) {
  const totalPedidos = pedidos.length
  const pedidosPendientes = pedidos.filter((p) => p.estado === "pendiente").length
  const pedidosPreparando = pedidos.filter((p) => p.estado === "preparando").length
  const pedidosListos = pedidos.filter((p) => p.estado === "listo").length
  const ingresoTotal = pedidos.reduce((sum, p) => sum + p.total, 0)

  const stats = [
    {
      label: "Total Pedidos",
      valor: totalPedidos,
      color: "bg-blue-50 border-l-blue-500",
      icon: "📋",
    },
    {
      label: "Pendientes",
      valor: pedidosPendientes,
      color: "bg-yellow-50 border-l-yellow-500",
      icon: "⏳",
    },
    {
      label: "Preparando",
      valor: pedidosPreparando,
      color: "bg-orange-50 border-l-orange-500",
      icon: "👨‍🍳",
    },
    {
      label: "Listos",
      valor: pedidosListos,
      color: "bg-green-50 border-l-green-500",
      icon: "✅",
    },
    {
      label: "Ingreso Total",
      valor: `Bs ${ingresoTotal.toFixed(2)}`,
      color: "bg-purple-50 border-l-purple-500",
      icon: "💰",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className={`border-l-4 ${stat.color}`}>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-red-500 mt-1">{stat.valor}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
