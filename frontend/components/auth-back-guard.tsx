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

function getSessionRole(): string | null {
  try {
    const raw = sessionStorage.getItem("user")
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return typeof parsed?.role === "string" ? parsed.role : null
  } catch {
    return null
  }
}

function shouldForceExpireSession() {
  if (!hasSessionAuth()) return false
  const role = getSessionRole()
  return role !== "admin"
}

function isReloadNavigation() {
  try {
    const navEntries = performance.getEntriesByType?.("navigation")
    const nav = (navEntries && navEntries[0]) as PerformanceNavigationTiming | undefined
    if (nav?.type) return nav.type === "reload"

    // Legacy fallback
    return (performance as any)?.navigation?.type === 1
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
    if (!shouldForceExpireSession()) return

    try {
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("user")
    } catch {
      // ignore
    }

    setAllowed(false)
    if (pathname !== "/login") {
      // Hard redirect is the most reliable way to ensure Back/Forward
      // doesn't reveal previous pages (avoids SPA popstate edge-cases).
      window.location.replace("/login")
      return
    }

    // Best-effort: keep the user on /login by rewriting history.
    // This prevents the next Back click from revealing a previous page.
    try {
      window.history.replaceState(null, "", "/login")
      window.history.pushState(null, "", "/login")
    } catch {
      // ignore
    }
  }, [pathname, router])

  useLayoutEffect(() => {
    // If the user refreshes/reloads, force session expiry and show /login.
    if (pathname && pathname !== "/login" && isReloadNavigation() && shouldForceExpireSession()) {
      expireSessionAndRedirect()
      return
    }
    checkAuth()
  }, [checkAuth, expireSessionAndRedirect, pathname])

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
    // Any browser Back/Forward navigation should immediately expire the session (customers only).
    // If we're already on /login, the login back-trap below will handle it.
    if (pathname !== "/login") {
      window.addEventListener("popstate", expireSessionAndRedirect)
    }
    window.addEventListener("focus", checkAuth)
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      window.removeEventListener("pageshow", onPageShow)
      if (pathname !== "/login") {
        window.removeEventListener("popstate", expireSessionAndRedirect)
      }
      window.removeEventListener("focus", checkAuth)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [checkAuth, expireSessionAndRedirect])

  useEffect(() => {
    // When on /login, disable navigating back into the app via Back button.
    if (pathname !== "/login") return

    const lockToLogin = () => {
      try {
        window.history.pushState(null, "", "/login")
      } catch {
        // ignore
      }
    }

    lockToLogin()
    window.addEventListener("popstate", lockToLogin)
    return () => window.removeEventListener("popstate", lockToLogin)
  }, [pathname])

  if (protectedRoute && !allowed) return null
  return <>{children}</>
}
