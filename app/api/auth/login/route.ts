import { type NextRequest, NextResponse } from "next/server"

const OPERADORES = [
  {
    id: "1",
    email: "operador@example.com",
    password: "123456",
    nombre: "Juan Operador",
  },
  {
    id: "2",
    email: "admin@example.com",
    password: "admin123",
    nombre: "Admin",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const operador = OPERADORES.find((op) => op.email === email && op.password === password)

    if (!operador) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const response = NextResponse.json({
      id: operador.id,
      email: operador.email,
      nombre: operador.nombre,
      rol: "operador",
      token: `token_${operador.id}_${Date.now()}`,
    })

    response.cookies.set("operador-token", `token_${operador.id}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}
