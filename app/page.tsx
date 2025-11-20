import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex flex-col items-center gap-8 px-4 max-w-2xl">
        <h1 className="text-5xl font-bold text-red-500 text-balance">Order & Reserva</h1>
        <p className="text-xl text-gray-700 text-center text-pretty">Tu plataforma de hamburguesas personalizadas</p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link href="/reserva" className="flex-1">
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white py-6 text-lg">Realizar Pedido</Button>
          </Link>
          <Link href="/login" className="flex-1">
            <Button
              variant="outline"
              className="w-full py-6 text-lg border-red-500 text-red-500 hover:bg-red-50 bg-transparent"
            >
              Operador - Login
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
