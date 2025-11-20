import { create } from "zustand"
import type { OperadorSession } from "@/types"

interface AuthStore {
  usuario: OperadorSession | null
  rol: "publico" | "operador" | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

export const useAuthStore = create<AuthStore>((set) => ({
  usuario: null,
  rol: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (response.ok) {
      const data = await response.json()
      set({
        usuario: data,
        rol: "operador",
        isAuthenticated: true,
      })
    }
  },
  logout: () => {
    set({ usuario: null, rol: "publico", isAuthenticated: false })
  },
}))
