import { Ingrediente } from "./hamburguesa";

export interface Hamburguesa {
  id: number
  nombre: string
  descripcion: string
  ingredientes: { id: number; nombre: string; icon: string; color: string }[]
  calorias: number
  proteina: string
  precio: number
  imagen: string
  color: string
  bgGradient: string
}

export interface Bebida {
  id: number;
  nombre: string;
  descripcion: string;
  ingredientes: Ingrediente[];
  calorias: number;
  proteina: string;
  precio: number;
  imagen: string;
  color: string;
  bgGradient: string;
}
