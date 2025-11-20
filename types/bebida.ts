export interface Bebida {
  id: number;
  nombre: string;
  descripcion: string;
  ingredientes: { nombre: string; icon: string; color: string }[];
  calorias: number;
  proteina: string;
  precio: number;
  imagen: string;
  color: string;
  bgGradient: string;
}