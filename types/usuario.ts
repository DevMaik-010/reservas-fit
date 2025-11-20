export interface Usuario {
  id: string
  email: string
  nombre: string
  rol: "publico" | "operador"
  fechaCreacion: Date
}

export interface OperadorSession {
  id: string
  email: string
  nombre: string
  rol: "operador"
  token: string
}
