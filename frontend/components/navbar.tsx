"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, Leaf, Compass, Map, User, Bell, Info, CheckCircle, AlertTriangle, LogOut, Shield, Globe, Users, Bird } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [loggedInUser, setLoggedInUser] = useState<any>(null)

  // Read user from localStorage (runs client-side only)
  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      try { setLoggedInUser(JSON.parse(stored)) } catch { setLoggedInUser(null) }
    }
    // Listen for storage changes (e.g. login/logout in another tab)
    const onStorage = () => {
      const s = localStorage.getItem("user")
      setLoggedInUser(s ? JSON.parse(s) : null)
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("https://tourify-4cuu.onrender.com/api/notifications")
        if (!res.ok) return
        const data = await res.json()
        setNotifications(Array.isArray(data) ? data : [])
      } catch {
        setNotifications([])
      }
    }
    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setLoggedInUser(null)
    router.push("/login")
  }

  // Redirect to correct dashboard based on role
  const dashboardHref = loggedInUser?.role === "admin" ? "/admin-dashboard" : "/customer-dashboard"

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/40 backdrop-blur-2xl border-b border-foreground/5 shadow-sm" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-[0.9rem] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 group-hover:rotate-6">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground/90">Tourify<span className="text-emerald-500">.ai</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/planner" icon={Compass} label="AI Planner" />
            <NavLink href="/destinations" icon={Map} label="Trails" />
            <NavLink href="/nature-guard" icon={Shield} label="Nature Guard" />
            <NavLink href="/global-sanctuary" icon={Globe} label="Sanctuary" />
            <NavLink href="/tribal-sync" icon={Users} label="Tribe" />
            <NavLink href="/wildlife-insight" icon={Bird} label="Wildlife" />
            <NavLink href="/dashboard" label="Log" />
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-foreground/70 hover:text-emerald-500 hover:bg-emerald-500/5 rounded-full transition-all relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-background" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-80 glass-panel border border-emerald-500/10 rounded-2xl p-4 shadow-2xl backdrop-blur-3xl z-[100]"
                  >
                    <div className="flex items-center justify-between mb-4 px-1">
                      <h3 className="font-bold text-sm text-foreground">Notifications</h3>
                      <button onClick={() => setShowNotifications(false)} className="text-foreground/40 hover:text-foreground transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 6).map((notif) => (
                          <div key={notif._id} className="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/[0.05] hover:border-emerald-500/20 transition-all">
                            <div className="flex gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${notif.type === 'alert' ? 'bg-amber-500/10 text-amber-500' : notif.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                {notif.type === 'alert' ? <AlertTriangle className="w-4 h-4" /> : notif.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-xs font-bold text-foreground leading-tight mb-1">{notif.title}</h4>
                                <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{notif.message}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center">
                          <p className="text-xs text-muted-foreground italic">No new trails in your stream.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ✅ Real User Section: show real user OR Sign In / Join Now */}
            <div className="flex items-center gap-3 pl-4 border-l border-foreground/10">
              {loggedInUser ? (
                <>
                  {/* Logged in: show real name + dashboard link */}
                  <Link
                    href={dashboardHref}
                    className="flex items-center gap-3 p-1.5 pr-5 rounded-full bg-foreground/[0.03] border border-foreground/[0.05] hover:bg-foreground/[0.08] hover:border-emerald-500/20 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                      {loggedInUser.name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-foreground leading-none mb-0.5">{loggedInUser.name}</span>
                      <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">
                        {loggedInUser.role === "admin" ? "Admin" : "Explorer"}
                      </span>
                    </div>
                  </Link>
                  {/* Logout button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-foreground/40 hover:text-destructive rounded-full transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </>
              ) : (
                <>
                  {/* Not logged in: show Sign In + Join Now */}
                  <Link href="/login">
                    <Button variant="ghost" className="rounded-full text-foreground/70 hover:text-foreground">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                      Join Now
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-foreground p-2 rounded-full hover:bg-foreground/5" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-6 border-t border-foreground/5 space-y-2 bg-background/95 backdrop-blur-2xl rounded-b-3xl shadow-2xl">
                <MobileLink href="/planner" icon={Compass} label="AI Planner" onClick={() => setIsOpen(false)} />
                <MobileLink href="/destinations" icon={Map} label="Trails" onClick={() => setIsOpen(false)} />
                <MobileLink href="/nature-guard" icon={Shield} label="Nature Guard" onClick={() => setIsOpen(false)} />
                <MobileLink href="/global-sanctuary" icon={Globe} label="Global Sanctuary" onClick={() => setIsOpen(false)} />
                <MobileLink href="/tribal-sync" icon={Users} label="Tribal Sync" onClick={() => setIsOpen(false)} />
                <MobileLink href="/wildlife-insight" icon={Bird} label="Wildlife Insight" onClick={() => setIsOpen(false)} />
                <MobileLink href="/dashboard" label="Travel Log" onClick={() => setIsOpen(false)} />

                <div className="pt-6 mt-4 border-t border-foreground/5 px-4 space-y-3">
                  {loggedInUser ? (
                    <>
                      <Link href={dashboardHref} onClick={() => setIsOpen(false)}>
                        <Button className="w-full justify-center rounded-full bg-emerald-600 text-white">
                          {loggedInUser.name}'s Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-center rounded-full text-destructive hover:bg-destructive/10"
                        onClick={() => { handleLogout(); setIsOpen(false) }}
                      >
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-center rounded-full">Sign In</Button>
                      </Link>
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-emerald-600 text-white rounded-full">Join Now</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

function NavLink({ href, icon: Icon, label }: { href: string; icon?: any; label: string }) {
  return (
    <Link
      href={href}
      className="text-foreground/60 hover:text-emerald-500 transition-colors flex items-center gap-2 text-sm font-medium relative group py-2"
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
      <span className="absolute -bottom-0 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full rounded-full" />
    </Link>
  )
}

function MobileLink({ href, icon: Icon, label, onClick }: { href: string; icon?: any; label: string; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-6 py-4 rounded-2xl hover:bg-emerald-500/5 text-foreground/70 hover:text-emerald-600 transition-all mx-2"
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span className="font-medium text-lg">{label}</span>
    </Link>
  )
}
