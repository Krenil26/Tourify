"use client"

import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

const PUBLIC_PATHS = ["/", "/login", "/signup"]

function isPublicPath(pathname: string) {
  if (pathname === "/") return true
  if (pathname.startsWith("/api")) return true
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))
}

function hasSessionAuth() {
  try {
    const token = sessionStorage.getItem("token")
    const user = sessionStorage.getItem("user")
    return Boolean(token && user)
  } catch {
    return false
  }
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  const protectedRoute = useMemo(() => {
    return Boolean(pathname && !isPublicPath(pathname))
  }, [pathname])

  const [allowed, setAllowed] = useState(() => {
    if (!pathname) return true
    if (isPublicPath(pathname)) return true
    return hasSessionAuth()
  })

  const checkAuth = useCallback(() => {
    if (!pathname || isPublicPath(pathname)) {
      setAllowed(true)
      return
    }

    const ok = hasSessionAuth()
    setAllowed(ok)
    if (!ok) router.replace("/login")
  }, [pathname, router])

  const expireSessionAndRedirect = useCallback(() => {
    try {
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("user")
    } catch {
      // ignore
    }

    setAllowed(false)
    if (pathname !== "/login") router.replace("/login")
  }, [pathname, router])

  useLayoutEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    const onPageShow = (event: PageTransitionEvent) => {
      // If the page is restored from the back/forward cache, treat it like a Back/Forward navigation.
      if (event.persisted) {
        expireSessionAndRedirect()
        return
      }
      checkAuth()
    }
    const onVisibility = () => {
      if (document.visibilityState === "visible") checkAuth()
    }

    window.addEventListener("pageshow", onPageShow)
    // Any browser Back/Forward navigation should immediately expire the session.
    window.addEventListener("popstate", expireSessionAndRedirect)
    window.addEventListener("focus", checkAuth)
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      window.removeEventListener("pageshow", onPageShow)
      window.removeEventListener("popstate", expireSessionAndRedirect)
      window.removeEventListener("focus", checkAuth)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [checkAuth, expireSessionAndRedirect])

  if (protectedRoute && !allowed) return null
  return <>{children}</>
}
