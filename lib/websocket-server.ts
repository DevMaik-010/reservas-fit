import { WebSocketServer, WebSocket } from "ws"
import type { Server as HTTPServer } from "http"

export class PedidosWebSocketServer {
  private wss: WebSocketServer | null = null
  private static instance: PedidosWebSocketServer

  static getInstance(): PedidosWebSocketServer {
    if (!PedidosWebSocketServer.instance) {
      PedidosWebSocketServer.instance = new PedidosWebSocketServer()
    }
    return PedidosWebSocketServer.instance
  }

  initialize(server: HTTPServer) {
    if (this.wss) return

    this.wss = new WebSocketServer({ server, path: "/api/ws/pedidos" })

    this.wss.on("connection", (ws) => {
      console.log("[WS] Cliente conectado")

      ws.on("close", () => {
        console.log("[WS] Cliente desconectado")
      })

      ws.on("error", (error) => {
        console.error("[WS] Error:", error)
      })
    })
  }

  broadcast(event: string, data: any) {
    if (!this.wss) return

    const message = JSON.stringify({ event, data, timestamp: new Date().toISOString() })

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
  }

  notifyPedidoCreated(pedido: any) {
    this.broadcast("pedido:creado", pedido)
  }

  notifyPedidoUpdated(pedido: any) {
    this.broadcast("pedido:actualizado", pedido)
  }

  notifyPedidoDeleted(pedidoId: string) {
    this.broadcast("pedido:eliminado", { id: pedidoId })
  }
}

export function getWebSocketServer(): PedidosWebSocketServer {
  return PedidosWebSocketServer.getInstance()
}
