"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

const PROTECTED_PREFIXES = ["/admin-dashboard", "/customer-dashboard", "/booking", "/my-bookings"]

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/"))
}

export function AuthBackGuard() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      if (!pathname || !isProtectedPath(pathname)) return

      const token = sessionStorage.getItem("token")
      const user = sessionStorage.getItem("user")

      if (!token || !user) {
        router.replace("/login")
      }
    }

    const onPageShow = () => checkAuth()
    const onVisibility = () => {
      if (document.visibilityState === "visible") checkAuth()
    }

    checkAuth()
    window.addEventListener("pageshow", onPageShow)
    window.addEventListener("focus", checkAuth)
    document.addEventListener("visibilitychange", onVisibility)

    return () => {
      window.removeEventListener("pageshow", onPageShow)
      window.removeEventListener("focus", checkAuth)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [pathname, router])

  return null
}
