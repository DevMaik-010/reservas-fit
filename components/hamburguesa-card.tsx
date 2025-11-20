"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { Ingrediente } from "@/types"
import {Hamburguesa} from "@/types/producto"

interface Props {
  hamburguesa: Hamburguesa
  onAddToCart: (hamburguesa: Hamburguesa, ingredientes: Ingrediente[], cantidad: number) => void
}

export function HamburguesaCard({ hamburguesa, onAddToCart }: Props) {
  const [selectedIngredientes, setSelectedIngredientes] = useState<Ingrediente[]>(hamburguesa.ingredientes)
  const [cantidad, setCantidad] = useState(1)

  const toggleIngrediente = (ingrediente: Ingrediente) => {
    setSelectedIngredientes((prev) =>
      prev.find((i) => i.id === ingrediente.id) ? prev.filter((i) => i.id !== ingrediente.id) : [...prev, ingrediente],
    )
  }

  return (
    <Card
      className={`bg-linear-to-br ${hamburguesa.bgGradient} overflow-hidden shadow-lg hover:shadow-xl transition-shadow`}
    >
      <div className="p-4 flex flex-col justify-between h-full">

        <div className="relative w-full h-60 mb-4 rounded-lg overflow-hidden bg-white">
          <Image
            src={hamburguesa.imagen || "/placeholder.svg"}
            alt={hamburguesa.nombre}
            fill
            className="object-cover"
            
          />
        </div>

        <h3 className={`text-xl font-bold ${hamburguesa.color} mb-1`}>{hamburguesa.nombre}</h3>
        <p className="text-sm text-gray-600 mb-3">{hamburguesa.descripcion}</p>

        <div className="flex gap-4 text-xs mb-4 pb-4 border-b">
          <span className="font-semibold">Cal: {hamburguesa.calorias}</span>
          <span className="font-semibold">Prot: {hamburguesa.proteina}</span>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold mb-2 text-gray-700 uppercase">Ingredientes</p>
          <div className="flex flex-wrap gap-2">
            {hamburguesa.ingredientes.map((ingrediente) => (
              <button
                key={ingrediente.id}
                onClick={() => toggleIngrediente(ingrediente)}
                className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedIngredientes.find((i) => i.id === ingrediente.id)
                    ? `${ingrediente.color} ring-2 ring-red-500`
                    : `${ingrediente.color} opacity-50`
                }`}
              >
                {ingrediente.icon} {ingrediente.nombre}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300"
            >
              -
            </button>
            <span className="w-6 text-center font-bold">{cantidad}</span>
            <button onClick={() => setCantidad(cantidad + 1)} className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300">
              +
            </button>
          </div>
          <span className="text-lg font-bold text-red-500">Bs {(hamburguesa.precio * cantidad).toFixed(2)}</span>
        </div>

        <Button
          onClick={() => onAddToCart(hamburguesa, selectedIngredientes, cantidad)}
          className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white"
        >
          Agregar al Carrito
        </Button>
      </div>
    </Card>
  )
}
