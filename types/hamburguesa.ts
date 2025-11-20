export interface Ingrediente {
  id: number
  nombre: string
  icon: string
  color: string
}

export interface Hamburguesa {
  id: number
  nombre: string
  descripcion: string
  ingredientes: Ingrediente[]
  calorias: number
  proteina: string
  precio: number
  imagen: string
  color: string
  bgGradient: string
}
