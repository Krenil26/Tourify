"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Map, Compass, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CustomerDashboard() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const userData = localStorage.getItem("user")
        if (userData) {
            setUser(JSON.parse(userData))
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
                        My <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Dashboard</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">Welcome back, {user.name}. Ready for your next adventure?</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Compass className="w-5 h-5 text-emerald-500" />
                                AI Planner
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">Generate sustainable itineraries tailored for you.</p>
                            <Link href="/planner">
                                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">Plan a Trip</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Map className="w-5 h-5 text-teal-500" />
                                Saved Trails
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">View your bookmarked destinations and routes.</p>
                            <Link href="/destinations">
                                <Button variant="outline" className="w-full border-border/50 hover:bg-muted/50">Explore Trails</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-500" />
                                Nature Guard
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">Check live ecosystem health before you travel.</p>
                            <Link href="/nature-guard">
                                <Button variant="outline" className="w-full border-border/50 hover:bg-muted/50">Check Status</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Footer />
        </main>
    )
}
