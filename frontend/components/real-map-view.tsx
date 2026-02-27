"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Star, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Fix for default marker icons in Next.js
const customIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
})

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

interface RealMapViewProps {
    destinations: Destination[]
}

// Component to handle map centering and fly-to effects
function MapController({ center }: { center: [number, number] }) {
    const map = useMap()
    useEffect(() => {
        map.flyTo(center, 4, {
            duration: 1.5
        })
    }, [center, map])
    return null
}

export default function RealMapView({ destinations }: RealMapViewProps) {
    const [mounted, setMounted] = useState(false)
    const [mapCenter, setMapCenter] = useState<[number, number]>([20, 0])
    const [mapType, setMapType] = useState<"street" | "satellite">("street")

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return (
        <div className="w-full aspect-[2/1] bg-emerald-950/20 rounded-[2rem] flex items-center justify-center border border-emerald-500/10">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground text-sm font-medium">Preparing the Earth's view...</p>
            </div>
        </div>
    )

    return (
        <div className="relative w-full aspect-[2/1] rounded-[2rem] border border-emerald-500/10 overflow-hidden shadow-2xl glass-panel group">
            {/* Map Controls Overlay */}
            <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
                <div className="flex bg-background/80 backdrop-blur-md p-1 rounded-xl border border-border shadow-lg">
                    <button
                        onClick={() => setMapType("street")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mapType === "street" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        Street
                    </button>
                    <button
                        onClick={() => setMapType("satellite")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mapType === "satellite" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        Satellite
                    </button>
                </div>
            </div>

            <MapContainer
                center={mapCenter}
                zoom={3}
                scrollWheelZoom={true}
                className="w-full h-full z-0"
                style={{ background: "#f0fdf4" }}
            >
                {/* Colorful Tile Layers */}
                {mapType === "street" ? (
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                ) : (
                    <TileLayer
                        attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                )}

                <MapController center={mapCenter} />

                {destinations.map((dest) => {
                    if (!dest.coordinates?.lat || !dest.coordinates?.lng) return null

                    return (
                        <Marker
                            key={dest._id}
                            position={[dest.coordinates.lat, dest.coordinates.lng]}
                            icon={customIcon}
                        >
                            <Popup className="premium-popup">
                                <div className="w-64 overflow-hidden rounded-xl">
                                    <div className="relative h-28">
                                        <img
                                            src={dest.image}
                                            alt={dest.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-primary/90 text-[10px] font-bold text-white">
                                            {dest.category}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-background">
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <h4 className="font-bold text-sm text-foreground leading-tight">{dest.name}</h4>
                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                    <MapPin className="w-2.5 h-2.5" />
                                                    {dest.country}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-secondary/50 px-1.5 py-0.5 rounded text-[10px]">
                                                <Star className="w-2.5 h-2.5 fill-primary text-primary" />
                                                {dest.rating}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="text-xs font-bold text-primary">${dest.price}<span className="text-[10px] text-muted-foreground font-normal ml-1">/person</span></div>
                                            <Link href={`/planner?destination=${encodeURIComponent(dest.name)}`}>
                                                <Button size="sm" className="h-7 text-[10px] rounded-lg px-3">
                                                    Plan <ArrowRight className="w-3 h-3 ml-1" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>

            {/* Custom Styles for Popup */}
            <style jsx global>{`
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          padding: 0 !important;
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: 256px !important;
        }
        .leaflet-popup-tip {
          background: hsl(var(--background)) !important;
        }
        .leaflet-container {
          font-family: var(--font-sans) !important;
        }
      `}</style>
        </div>
    )
}
