"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ItemPedido, DetalleBebida } from "@/types"

interface Props {
  items: ItemPedido[]
  bebidas: DetalleBebida[]
  total: number
  onRemoveItem: (id: string) => void
  onRemoveBebida: (bebidaId: number) => void
  onConfirm: () => void
}

export function CarritoResumen({ items, bebidas, total, onRemoveItem, onRemoveBebida, onConfirm }: Props) {
  const isEmpty = items.length === 0 && bebidas.length === 0

  return (
    <Card className="sticky top-24 shadow-xl">
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold text-red-500">Tu Carrito</h2>

        {isEmpty ? (
          <p className="text-gray-500 text-center py-8">Tu carrito está vacío</p>
        ) : (
          <>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="bg-gray-50 p-3 rounded-lg border-l-4 border-red-500">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm">{item.hamburguesa.nombre}</span>
                    <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700 text-xs">
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">x{item.cantidad}</p>
                  <p className="text-xs text-gray-500">
                    {item.ingredientesSeleccionados.map((i) => i.nombre).join(", ")}
                  </p>
                  <p className="font-bold text-red-500 text-sm">${item.precio.toFixed(2)}</p>
                </div>
              ))}

              {bebidas.map((bebida, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg border-l-4 border-orange-500">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm">{bebida.bebida.nombre}</span>
                    <button
                      onClick={() => onRemoveBebida(bebida.bebida.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">
                    ccc{bebida.cantidad}
                  </p>
                  <p className="font-bold text-orange-500 text-sm">${bebida.precio.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-red-500">${total.toFixed(2)}</span>
              </div>

              <Button onClick={onConfirm} className="w-full bg-red-500 hover:bg-red-600 text-white">
                Confirmar Pedido
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
