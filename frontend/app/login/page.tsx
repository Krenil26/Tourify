"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, ArrowLeft, Loader2, Mail, Lock, Sparkles, ShieldCheck } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/lib/api"

export default function LoginPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [errorMsg, setErrorMsg] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setErrorMsg("")

        try {
            const data = await api.auth.login(formData)

            // Store token and user data in sessionStorage for independent tab sessions
            sessionStorage.setItem("token", data.token)
            sessionStorage.setItem("user", JSON.stringify(data.user))

            toast({
                title: "Welcome back!",
                description: "You have successfully signed in.",
            })

            // Force a refresh of the navbar by redirecting and potentially triggering a custom event
            window.dispatchEvent(new Event('storage'))

            // Redirect to home so they can see their profile in the navbar
            router.push("/")
        } catch (error: any) {
            const msg = error.message || "Invalid email or password."
            setErrorMsg(msg)
            toast({
                variant: "destructive",
                title: "Login failed",
                description: msg,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#020817]">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute inset-0 grid-pattern opacity-10" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-md px-4"
            >
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-emerald-500 transition-all mb-8 group"
                >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>

                <div className="flex flex-col items-center text-center space-y-3 mb-8">
                    <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-2"
                    >
                        <Globe className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold tracking-tight text-white uppercase tracking-[0.2em] text-sm opacity-50">Welcome Back</h1>
                    <h2 className="text-4xl font-black text-foreground">Explorer <span className="text-emerald-500">SignIn</span></h2>
                </div>

                <Card className="glass-panel border-white/5 shadow-2xl overflow-hidden rounded-[2rem]">
                    <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-600" />
                    <CardHeader className="pt-8 text-center">
                        <CardTitle className="text-2xl font-bold">Access Your Account</CardTitle>
                        <CardDescription className="text-muted-foreground/60 italic">
                            Enter your credentials to continue your journey
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-5 px-8">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="explorer@tourifyy.com"
                                        required
                                        className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Secure Password</Label>
                                    <Link href="#" className="text-[10px] font-bold text-emerald-500 hover:underline">
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="pl-12 h-12 bg-white/5 border-white/10 rounded-xl focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            {errorMsg && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium px-4 py-3 rounded-xl text-center"
                                >
                                    {errorMsg}
                                </motion.div>
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-6 pb-8 px-8">
                            <Button
                                type="submit"
                                className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all rounded-2xl font-black uppercase tracking-widest text-sm relative overflow-hidden group"
                                disabled={isLoading}
                            >
                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[0%] transition-transform duration-500" />
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            Sign In <Sparkles className="w-4 h-4" />
                                        </>
                                    )}
                                </span>
                            </Button>

                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground/40 font-medium px-4 bg-white/5 py-3 rounded-xl border border-white/5">
                                <ShieldCheck className="w-4 h-4 text-emerald-500/50" />
                                <span>Secured by Tourifyy Protected Auth</span>
                            </div>

                            <div className="text-center text-sm text-muted-foreground">
                                First time here?{" "}
                                <Link href="/signup" className="text-emerald-500 hover:text-emerald-400 font-black transition-colors">
                                    Create Membership
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                {/* Optional floating elements for aesthetics */}
                <div className="mt-8 flex justify-center gap-6 opacity-30 grayscale blur-[1px]">
                    <span className="text-[10px] font-bold tracking-tighter">AI PLANNED</span>
                    <span className="text-[10px] font-bold tracking-tighter text-emerald-500">ECO FRIENDLY</span>
                    <span className="text-[10px] font-bold tracking-tighter">GLOBAL REACH</span>
                </div>
            </motion.div>
        </div>
    )
}
