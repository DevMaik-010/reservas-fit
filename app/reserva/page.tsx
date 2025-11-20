"use client";

import { useState } from "react";
import { HamburguesaCard } from "@/components/hamburguesa-card";
import { CarritoResumen } from "@/components/carrito-resumen";
import { ModalPedido } from "@/components/modal-pedido";
import type { Hamburguesa, Bebida, ItemPedido, DetalleBebida } from "@/types";

import { productos } from "@/data/productos";
import { bebidas } from "@/data/bebidas";
import Image from "next/image";
import toast from 'react-hot-toast';

export default function ReservaPage() {
  const [items, setItems] = useState<ItemPedido[]>([]);
  const [bebidasDetalle, setBebidasDetalle] = useState<DetalleBebida[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleAddItem = (
    hamburguesa: Hamburguesa,
    ingredientesSeleccionados: any[],
    cantidad: number
  ) => {
    const newItem: ItemPedido = {
      id: `${hamburguesa.id}-${Date.now()}`,
      hamburguesa,
      ingredientesSeleccionados,
      cantidad,
      precio: hamburguesa.precio * cantidad,
    };
    setItems([...items, newItem]);

    toast.success("Hamburguesa agregada al carrito");
  };

  const handleAddBebida = (bebida: Bebida, cantidad: number) => {
    const newBebida: DetalleBebida = {
      bebida,
      cantidad,
      precio: bebida.precio * cantidad,
    };
    setBebidasDetalle([...bebidasDetalle, newBebida]);
    toast.success("Bebida agregada al carrito");
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleRemoveBebida = (bebidaId: number) => {
    setBebidasDetalle(
      bebidasDetalle.filter((b) => !(b.bebida.id === bebidaId))
    );
  };

  const total =
    items.reduce((sum, item) => sum + item.precio, 0) +
    bebidas.reduce((sum, bebida) => sum + bebida.precio, 0);

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
      <header className="bg-red-500 text-white p-4 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Order & Reserva</h1>
          <p className="text-red-100">Personaliza tu hamburguesa</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Nuestras Hamburguesas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {productos.map((hamburguesa) => (
                <HamburguesaCard
                  key={hamburguesa.id}
                  hamburguesa={hamburguesa}
                  onAddToCart={handleAddItem}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bebidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bebidas.map((bebida) => (
                <div
                  key={bebida.id}
                  className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500"
                >
                  <div className="flex flex-col justify-center items-center gap-y-4">

                    <Image
                      src={bebida.imagen}
                      alt={bebida.nombre}

                      width={200}
                      height={150}
                    />

                    <h3 className="font-bold text-lg mb-2">{bebida.nombre}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {bebida.descripcion}
                    </p>
                    <p>Precio: Bs {bebida.precio}</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleAddBebida(bebida, 1)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <CarritoResumen
            items={items}
            bebidas={bebidasDetalle}
            total={total}
            onRemoveItem={handleRemoveItem}
            onRemoveBebida={handleRemoveBebida}
            onConfirm={() => setShowModal(true)}
          />
        </aside>
      </div>

      {showModal && (
        <ModalPedido
          items={items}
          bebidas={bebidasDetalle}
          total={total}
          onClose={() => setShowModal(false)}
          onConfirm={() => {
            setShowModal(false);
            setItems([]);
            setBebidasDetalle([]);
          }}
        />
      )}
    </main>
  );
}
