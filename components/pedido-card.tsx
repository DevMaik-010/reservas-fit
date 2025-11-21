"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Pedido } from "@/types"

interface Props {
  pedido: Pedido
  onActualizarEstado: (pedidoId: string, estado: Pedido["estado"]) => void
  onEliminar: (pedidoId: string) => void
}

export function PedidoCard({ pedido, onActualizarEstado, onEliminar }: Props) {
  const estadoColores: Record<Pedido["estado"], string> = {
    pendiente: "bg-yellow-100 text-yellow-800 border-l-yellow-500",
    preparando: "bg-blue-100 text-blue-800 border-l-blue-500",
    listo: "bg-green-100 text-green-800 border-l-green-500",
    entregado: "bg-gray-100 text-gray-800 border-l-gray-500",
  }

  const estadoSiguiente: Record<Pedido["estado"], Pedido["estado"] | null> = {
    pendiente: "preparando",
    preparando: "listo",
    listo: "entregado",
    entregado: null,
  }

  const siguienteEstado = estadoSiguiente[pedido.estado]

  return (
    <Card className={`border-l-4 ${estadoColores[pedido.estado]} overflow-hidden`}>
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold">{pedido.nombreCliente}</h3>
            
            <p className="text-xs text-gray-500 mt-1">ID: {pedido.id.substring(0, 8)}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${estadoColores[pedido.estado]}`}>
            {pedido.estado}
          </span>
        </div>

        <div className="bg-white bg-opacity-50 rounded p-3 space-y-2">
          <p className="font-semibold text-sm">Detalle del Pedido:</p>

          {pedido.items.map((item, idx) => (
            <div key={idx} className="text-sm border-l-2 border-gray-300 pl-2">
              <p className="font-medium">{item.hamburguesa.nombre}</p>
              <p className="text-xs text-gray-600">
                Cantidad: {item.cantidad} x Bs{item.hamburguesa.precio}
              </p>
              <p className="text-xs text-gray-500">
                Ingredientes: {item.ingredientesSeleccionados.map((i) => i.nombre).join(", ")}
              </p>
            </div>
          ))}

          {pedido.bebidas.map((bebida, idx) => (
            <div key={idx} className="text-sm border-l-2 border-gray-300 pl-2">
              <p className="font-medium">{bebida.bebida.nombre}</p>
              <p className="text-xs text-gray-600">
                {bebida.cantidad} - Bs {bebida.precio.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {pedido.notas && (
          <div className="bg-blue-50 p-2 rounded">
            <p className="text-xs font-semibold text-blue-900">Notas:</p>
            <p className="text-xs text-blue-800">{pedido.notas}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <p className="text-xs text-gray-600">Total</p>
            <p className="text-xl font-bold text-red-500">Bs {pedido.total.toFixed(2)}</p>
          </div>

          <div className="flex gap-2">
            {siguienteEstado && (
              <Button
                onClick={() => onActualizarEstado(pedido.id, siguienteEstado)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm"
              >
                {siguienteEstado === "preparando"
                  ? "Preparar"
                  : siguienteEstado === "listo"
                    ? "Marcar Listo"
                    : "Entregar"}
              </Button>
            )}
            <Button
              onClick={() => onEliminar(pedido.id)}
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50 text-sm"
            >
              Eliminar
            </Button>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-right">{new Date(pedido.fechaCreacion).toLocaleString("es-ES")}</p>
      </div>
    </Card>
  )
}
