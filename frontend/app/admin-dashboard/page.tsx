"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Users, AlertTriangle, Shield, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const userData = localStorage.getItem("user")
        if (userData) {
            const parsedUser = JSON.parse(userData)
            if (parsedUser.role !== 'admin') {
                router.push("/")
            } else {
                setUser(parsedUser)
            }
        } else {
            router.push("/login")
        }
    }, [router])

    if (!user) return null

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-foreground">
                        Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Portal</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">Welcome back, {user.name}. Here is an overview of the platform.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="w-4 h-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1,248</div>
                            <p className="text-xs text-muted-foreground">+12% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">3</div>
                            <p className="text-xs text-muted-foreground">Nature Guard warnings</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Eco Certifications</CardTitle>
                            <Shield className="w-4 h-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">342</div>
                            <p className="text-xs text-muted-foreground">Verified sanctuaries</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">System Status</CardTitle>
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-500">Online</div>
                            <p className="text-xs text-muted-foreground">All services running</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </main>
    )
}
