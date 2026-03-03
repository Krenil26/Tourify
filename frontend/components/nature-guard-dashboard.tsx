"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cloud, Wind, Droplets, Eye, Leaf, ShieldCheck, AlertTriangle, CheckCircle, RefreshCw, Thermometer, Globe, TreeDeciduous, Bird } from "lucide-react"
import { Button } from "@/components/ui/button"

const alertColors: { [key: string]: string } = {
    Clear: "text-emerald-400",
    Low: "text-amber-400",
    Moderate: "text-red-400",
}

const alertBg: { [key: string]: string } = {
    Clear: "bg-emerald-500/10 border-emerald-500/20",
    Low: "bg-amber-500/10 border-amber-500/20",
    Moderate: "bg-red-500/10 border-red-500/20",
}

const alertIcons: { [key: string]: any } = {
    Clear: CheckCircle,
    Low: AlertTriangle,
    Moderate: AlertTriangle,
}

const ecosystemColors: { [key: string]: string } = {
    Thriving: "text-emerald-400",
    Stable: "text-teal-400",
    Stressed: "text-amber-400",
}

const trailColors: { [key: string]: string } = {
    Excellent: "bg-emerald-500",
    Good: "bg-teal-500",
    Fair: "bg-amber-500",
    Caution: "bg-red-500",
}

export function NatureGuardDashboard() {
    const [guardData, setGuardData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedDestination, setSelectedDestination] = useState<any>(null)
    const [lastUpdated, setLastUpdated] = useState<string>("")
    const [filterAlert, setFilterAlert] = useState<string>("All")

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("https://tourify-4euu.onrender.com/api/nature-guard")
            const data = await res.json()
            setGuardData(data)
            setSelectedDestination(data[0] || null)
            setLastUpdated(new Date().toLocaleTimeString())
        } catch (err) {
            console.error("Nature Guard fetch error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 60000) // refresh every minute
        return () => clearInterval(interval)
    }, [])

    const filtered = filterAlert === "All" ? guardData : guardData.filter(d => d.alert.level === filterAlert)

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Cloud className="w-12 h-12 text-emerald-500" />
                </motion.div>
                <p className="text-muted-foreground text-sm font-medium">Scanning global ecosystems...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Live Monitoring</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                        Nature <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Guard</span>
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg max-w-xl">
                        Real-time weather and ecosystem health for every destination on your journey.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">Updated: {lastUpdated}</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchData}
                        className="rounded-full border-white/10 gap-2"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Alert Filter Tabs */}
            <div className="flex items-center gap-2 mb-8 flex-wrap">
                {["All", "Clear", "Low", "Moderate"].map(level => (
                    <button
                        key={level}
                        onClick={() => setFilterAlert(level)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${filterAlert === level
                            ? "bg-emerald-500 text-white border-emerald-500"
                            : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                            }`}
                    >
                        {level}
                    </button>
                ))}
            </div>

            <div className="grid lg:grid-cols-[1fr_380px] gap-8">

                {/* Left: Destination Grid */}
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 content-start">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((dest, index) => {
                            const AlertIcon = alertIcons[dest.alert.level] || CheckCircle
                            const isSelected = selectedDestination?._id === dest._id
                            return (
                                <motion.div
                                    key={dest._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.04 }}
                                    onClick={() => setSelectedDestination(dest)}
                                    className={`cursor-pointer rounded-3xl p-5 border transition-all duration-300 ${isSelected
                                        ? "bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/10"
                                        : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06]"
                                        }`}
                                >
                                    {/* Destination Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="font-bold text-foreground text-sm leading-tight">{dest.name}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                <Globe className="w-3 h-3" /> {dest.country}
                                            </p>
                                        </div>
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${alertBg[dest.alert.level]}`}>
                                            <AlertIcon className={`w-4 h-4 ${alertColors[dest.alert.level]}`} />
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                        <div className="flex items-center gap-1.5">
                                            <Thermometer className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                            <span className="text-xs text-muted-foreground">{dest.weather.tempC}°C</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Droplets className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                            <span className="text-xs text-muted-foreground">{dest.weather.humidity}%</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Wind className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                                            <span className="text-xs text-muted-foreground">{dest.weather.windKmh} km/h</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Leaf className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                            <span className={`text-xs font-semibold ${ecosystemColors[dest.ecosystem.status]}`}>
                                                {dest.ecosystem.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Trail Condition Bar */}
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Trail</span>
                                            <span className="text-[10px] font-bold text-foreground/80">{dest.ecosystem.trailCondition}</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                                            <div className={`h-full ${trailColors[dest.ecosystem.trailCondition]} rounded-full transition-all`}
                                                style={{ width: dest.ecosystem.trailCondition === "Excellent" ? "100%" : dest.ecosystem.trailCondition === "Good" ? "75%" : dest.ecosystem.trailCondition === "Fair" ? "50%" : "25%" }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>

                {/* Right: Detail Panel */}
                <AnimatePresence mode="wait">
                    {selectedDestination && (
                        <motion.div
                            key={selectedDestination._id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="sticky top-28 self-start space-y-4"
                        >

                            {/* Alert Banner */}
                            <div className={`rounded-2xl p-4 border flex items-start gap-3 ${alertBg[selectedDestination.alert.level]}`}>
                                {(() => {
                                    const AI = alertIcons[selectedDestination.alert.level] || CheckCircle
                                    return <AI className={`w-5 h-5 mt-0.5 shrink-0 ${alertColors[selectedDestination.alert.level]}`} />
                                })()}
                                <div>
                                    <p className={`font-bold text-sm ${alertColors[selectedDestination.alert.level]}`}>
                                        {selectedDestination.alert.level} Alert
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                        {selectedDestination.alert.message}
                                    </p>
                                </div>
                            </div>

                            {/* Weather Card */}
                            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <Cloud className="w-4 h-4 text-sky-400" />
                                    <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Weather Conditions</h3>
                                </div>
                                <div className="flex items-end gap-3 mb-6">
                                    <span className="text-6xl font-bold text-foreground">{selectedDestination.weather.tempC}°</span>
                                    <div className="pb-2">
                                        <p className="text-muted-foreground font-medium">{selectedDestination.weather.condition}</p>
                                        <p className="text-xs text-muted-foreground">{selectedDestination.weather.tempF}°F</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { icon: Droplets, label: "Humidity", value: `${selectedDestination.weather.humidity}%`, color: "text-blue-400" },
                                        { icon: Wind, label: "Wind", value: `${selectedDestination.weather.windKmh} km/h`, color: "text-sky-400" },
                                        { icon: Eye, label: "Visibility", value: `${selectedDestination.weather.visibilityKm} km`, color: "text-purple-400" },
                                    ].map(({ icon: Icon, label, value, color }) => (
                                        <div key={label} className="text-center p-3 rounded-xl bg-white/5">
                                            <Icon className={`w-4 h-4 mx-auto mb-1.5 ${color}`} />
                                            <p className="text-foreground font-bold text-sm">{value}</p>
                                            <p className="text-muted-foreground text-[10px]">{label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Ecosystem Card */}
                            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <TreeDeciduous className="w-4 h-4 text-emerald-500" />
                                    <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Ecosystem Health</h3>
                                </div>

                                <div className="space-y-4">
                                    {/* Air Quality */}
                                    <div>
                                        <div className="flex justify-between mb-1.5">
                                            <span className="text-xs text-muted-foreground">Air Quality Index</span>
                                            <span className={`text-xs font-bold ${selectedDestination.ecosystem.airQualityIndex < 50 ? "text-emerald-400" : "text-amber-400"}`}>
                                                {selectedDestination.ecosystem.airQualityLabel} ({selectedDestination.ecosystem.airQualityIndex})
                                            </span>
                                        </div>
                                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${selectedDestination.ecosystem.airQualityIndex < 50 ? "bg-emerald-500" : "bg-amber-500"}`}
                                                style={{ width: `${Math.min(selectedDestination.ecosystem.airQualityIndex, 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Wildlife Safety */}
                                    <div>
                                        <div className="flex justify-between mb-1.5">
                                            <span className="text-xs text-muted-foreground">Wildlife Safety</span>
                                            <span className="text-xs font-bold text-emerald-400">
                                                {selectedDestination.ecosystem.wildlifeSafetyScore}/100
                                            </span>
                                        </div>
                                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-emerald-500 transition-all"
                                                style={{ width: `${selectedDestination.ecosystem.wildlifeSafetyScore}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Status Tags */}
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${alertBg.Clear} ${alertColors.Clear}`}>
                                            {selectedDestination.ecosystem.status}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold border bg-sky-500/10 border-sky-500/20 text-sky-400">
                                            Trail: {selectedDestination.ecosystem.trailCondition}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Wildlife Insight chip */}
                            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                                    <Bird className="w-5 h-5 text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-foreground">Wildlife Sentinels Active</p>
                                    <p className="text-[11px] text-muted-foreground">AI monitors local fauna activity every 60 seconds.</p>
                                </div>
                                <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    )
}
