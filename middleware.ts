import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const operadorToken = request.cookies.get("operador-token")

  if (pathname.startsWith("/dashboard")) {
    if (!operadorToken) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Redirigir login si ya está autenticado
  if (pathname === "/login" && operadorToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
