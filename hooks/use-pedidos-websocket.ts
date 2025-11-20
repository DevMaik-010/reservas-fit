"use client"

import { useEffect, useRef } from "react"

export function usePedidosWebSocket(onUpdate: (event: string, data: any) => void) {
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Determinar el protocolo y host
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const host = window.location.host

    const wsUrl = `${protocol}//${host}/api/ws/pedidos`

    console.log("[WS Hook] Conectando a:", wsUrl)

    ws.current = new WebSocket(wsUrl)

    ws.current.onopen = () => {
      console.log("[WS Hook] Conectado")
    }

    ws.current.onmessage = (event) => {
      try {
        const { event: msgEvent, data, timestamp } = JSON.parse(event.data)
        console.log("[WS Hook] Mensaje recibido:", msgEvent, data)
        onUpdate(msgEvent, data)
      } catch (error) {
        console.error("[WS Hook] Error parseando mensaje:", error)
      }
    }

    ws.current.onerror = (error) => {
      console.error("[WS Hook] Error:", error)
    }

    ws.current.onclose = () => {
      console.log("[WS Hook] Desconectado")
    }

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [onUpdate])

  return ws.current
}
