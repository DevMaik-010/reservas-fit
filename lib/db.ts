import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

const dbPath = path.join(process.cwd(), "data", "pedidos.db")

// Asegurar que el directorio existe
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true })
}

export const db = new Database(dbPath)

// Habilitar foreign keys
db.pragma("foreign_keys = ON")

export function initializeDatabase() {
  // Crear tabla de pedidos
  db.exec(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id TEXT PRIMARY KEY,
      usuario_id TEXT NOT NULL,
      total REAL NOT NULL,
      estado TEXT NOT NULL CHECK(estado IN ('pendiente', 'preparando', 'listo', 'entregado')),
      fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      fecha_entrega DATETIME,
      nombre_cliente TEXT NOT NULL,
      notas TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Crear tabla de items de pedidos
  db.exec(`
    CREATE TABLE IF NOT EXISTS pedido_items (
      id TEXT PRIMARY KEY,
      pedido_id TEXT NOT NULL,
      hamburguesa_id INTEGER NOT NULL,
      hamburguesa_nombre TEXT NOT NULL,
      cantidad INTEGER NOT NULL,
      precio REAL NOT NULL,
      ingredientes_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
    )
  `)

  // Crear tabla de bebidas en pedidos
  db.exec(`
    CREATE TABLE IF NOT EXISTS pedido_bebidas (
      id TEXT PRIMARY KEY,
      pedido_id TEXT NOT NULL,
      bebida_id TEXT NOT NULL,
      bebida_nombre TEXT NOT NULL,
      cantidad INTEGER NOT NULL,
      precio REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
    )
  `)

  // Crear índices para mejor performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
    CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(fecha_creacion);
    CREATE INDEX IF NOT EXISTS idx_pedido_items_pedido ON pedido_items(pedido_id);
    CREATE INDEX IF NOT EXISTS idx_pedido_bebidas_pedido ON pedido_bebidas(pedido_id);
  `)
}
