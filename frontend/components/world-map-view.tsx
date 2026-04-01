"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, X, Info, Star, Compass, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatINR } from "@/lib/utils"

interface Coordinates {
    lat: number
    lng: number
}

interface Destination {
    _id: string
    name: string
    country: string
    image: string
    coordinates: Coordinates
    rating: number
    price: number
    category: string
}

interface WorldMapViewProps {
    destinations: Destination[]
}

export function WorldMapView({ destinations }: WorldMapViewProps) {
    const [selectedDest, setSelectedDest] = useState<Destination | null>(null)

    // Map projection logic (Simple equirectangular for SVG)
    const getCoordinates = (lat: number, lng: number) => {
        const x = ((lng + 180) * 800) / 360
        const y = ((90 - lat) * 400) / 180
        return { x, y }
    }

    const markers = useMemo(() => {
        return destinations
            .filter((d) => d.coordinates?.lat !== undefined && d.coordinates?.lng !== undefined)
            .map((d) => ({
                ...d,
                ...getCoordinates(d.coordinates.lat, d.coordinates.lng),
            }))
    }, [destinations])

    return (
        <div className="relative w-full aspect-[2/1] bg-emerald-950/20 rounded-[2rem] border border-emerald-500/10 overflow-hidden glass-panel">
            {/* Nature Themed Map Background */}
            <svg
                viewBox="0 0 800 400"
                className="w-full h-full opacity-40 mix-blend-luminosity"
                fill="currentColor"
            >
                <path
                    d="M150,100 Q180,80 210,100 T270,100 T330,120 T390,100 T450,80 T510,100 T570,120 T630,100 T690,80"
                    stroke="rgba(16, 185, 129, 0.2)"
                    fill="none"
                    strokeWidth="0.5"
                />
                <text x="400" y="200" textAnchor="middle" className="text-[10px] fill-emerald-500/20 uppercase tracking-[1em]">The Global Trails</text>
            </svg>

            {/* Grid Overlay */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Markers */}
            <div className="absolute inset-0">
                {markers.map((marker: any) => {
                    const isSelected = selectedDest?._id === marker._id
                    return (
                        <motion.div
                            key={marker._id}
                            className="absolute cursor-pointer group z-10"
                            style={{
                                left: `${(marker.x / 800) * 100}%`,
                                top: `${(marker.y / 400) * 100}%`,
                            }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.2 }}
                            onClick={() => setSelectedDest(marker)}
                        >
                            <div className="relative -translate-x-1/2 -translate-y-1/2">
                                {/* Pulse Effect */}
                                <div className="absolute inset-0 w-4 h-4 bg-primary/40 rounded-full animate-ping" />

                                {/* Marker Dot */}
                                <div className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${isSelected ? "bg-white border-primary border-4 scale-150 shadow-[0_0_15px_rgba(16,185,129,0.8)]" : "bg-primary border-emerald-900 shadow-lg"
                                    }`} />

                                {/* Name Tag */}
                                <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md bg-background/80 backdrop-blur-md border border-border text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${isSelected ? 'opacity-100 bg-primary/90 text-primary-foreground border-transparent' : ''}`}>
                                    {marker.name}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Info Card Popover */}
            <AnimatePresence>
                {selectedDest && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-6 right-6 w-72 glass-card rounded-2xl overflow-hidden border border-primary/20 shadow-2xl z-20"
                    >
                        <div className="relative h-32">
                            <img
                                src={selectedDest.image}
                                alt={selectedDest.name}
                                className="w-full h-full object-cover"
                            />
                            <button
                                onClick={() => setSelectedDest(null)}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-primary/90 text-white text-[10px] font-bold">
                                {selectedDest.category}
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-foreground leading-tight">{selectedDest.name}</h4>
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                        <MapPin className="w-2.5 h-2.5" />
                                        {selectedDest.country}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-secondary px-1.5 py-0.5 rounded text-[10px]">
                                    <Star className="w-2.5 h-2.5 fill-primary text-primary" />
                                    {selectedDest.rating}
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 gap-3">
                                <div className="text-sm font-bold text-primary">{formatINR(selectedDest.price)}<span className="text-[10px] text-muted-foreground font-normal ml-1">/person</span></div>
                                <Link href={`/planner?destination=${encodeURIComponent(selectedDest.name)}`}>
                                    <Button size="sm" className="h-8 text-[11px] rounded-lg px-3">
                                        Go to Trail <ArrowRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Decorative Compass */}
            <div className="absolute top-6 left-6 opacity-20 hidden md:block">
                <Compass className="w-12 h-12 text-primary" />
            </div>

            {/* Tip */}
            {!selectedDest && (
                <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-foreground/5 backdrop-blur-sm border border-foreground/10 text-[10px] text-muted-foreground">
                    <Info className="w-3 h-3 text-primary" />
                    Click a marker to discover the trail
                </div>
            )}
        </div>
    )
}
