"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ItemPedido, DetalleBebida } from "@/types"

interface Props {
  items: ItemPedido[]
  bebidas: DetalleBebida[]
  total: number
  onClose: () => void
  onConfirm: () => void
}

export function ModalPedido({ items, bebidas, total, onClose, onConfirm }: Props) {
  const [nombre, setNombre] = useState("")
  const [notas, setNotas] = useState("")
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!nombre) {
      alert("Por favor completa todos los campos")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          bebidas,
          total,
          nombreCliente: nombre,
          notas,
        }),
      })

      if (response.ok) {
        alert("Pedido confirmado")
        onConfirm()
      }
    } catch (error) {
      alert("Error al confirmar pedido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-red-500">Confirmar Pedido</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
              ✕
            </button>
          </div>

          <div className="space-y-3 bg-gray-50 p-3 rounded max-h-48 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="text-sm">
                <p className="font-semibold">{item.hamburguesa.nombre}</p>
                <p className="text-gray-600 text-xs">x{item.cantidad}</p>
                <p className="font-bold text-red-500">${item.precio.toFixed(2)}</p>
              </div>
            ))}

            {bebidas.map((bebida, idx) => (
              <div key={idx} className="text-sm">
                <p className="font-semibold">{bebida.bebida.nombre}</p>
                <p className="text-gray-600 text-xs">
                  {bebida.cantidad}
                </p>
                <p className="font-bold text-orange-500">${bebida.precio.toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="text-xl font-bold flex justify-between">
            <span>Total:</span>
            <span className="text-red-500">${total.toFixed(2)}</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notas (opcional)</label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Especificaciones adicionales"
                className="w-full p-2 border rounded-md text-sm"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1 border-gray-300 bg-transparent">
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              {loading ? "Enviando..." : "Confirmar Pedido"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
