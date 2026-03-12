"use client"

import { useState, useCallback } from "react"
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from "@react-google-maps/api"
import { Star, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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

interface GoogleMapViewProps {
    destinations: Destination[]
}

const mapContainerStyle = {
    width: "100%",
    height: "100%",
}

const defaultCenter = { lat: 20, lng: 0 }

const mapStyles = [
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#193341" }],
    },
    {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#2c5364" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#29768a" }, { lightness: -37 }],
    },
    {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#264e36" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#264e36" }],
    },
    {
        elementType: "labels.text.stroke",
        stylers: [{ visibility: "on" }, { color: "#000000" }, { weight: 2 }],
    },
    {
        elementType: "labels.text.fill",
        stylers: [{ color: "#ffffff" }],
    },
]

export default function GoogleMapView({ destinations }: GoogleMapViewProps) {
    const [selectedDest, setSelectedDest] = useState<Destination | null>(null)
    const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap")

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    })

    const onMapClick = useCallback(() => {
        setSelectedDest(null)
    }, [])

    if (loadError) {
        return (
            <div className="w-full aspect-[2/1] bg-emerald-950/20 rounded-[2rem] flex items-center justify-center border border-emerald-500/10">
                <p className="text-muted-foreground text-sm">Failed to load Google Maps</p>
            </div>
        )
    }

    if (!isLoaded) {
        return (
            <div className="w-full aspect-[2/1] bg-emerald-950/20 rounded-[2rem] flex items-center justify-center border border-emerald-500/10">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground text-sm font-medium">Loading Google Maps...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative w-full aspect-[2/1] rounded-[2rem] border border-emerald-500/10 overflow-hidden shadow-2xl glass-panel group">
            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <div className="flex bg-background/80 backdrop-blur-md p-1 rounded-xl border border-border shadow-lg">
                    <button
                        onClick={() => setMapType("roadmap")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mapType === "roadmap" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
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

            {/* Google Maps badge */}
            <div className="absolute bottom-4 left-4 z-10">
                <div className="bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border shadow-lg">
                    <span className="text-[10px] font-bold text-primary">Powered by Google Maps</span>
                </div>
            </div>

            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={3}
                onClick={onMapClick}
                mapTypeId={mapType}
                options={{
                    styles: mapType === "roadmap" ? mapStyles : undefined,
                    disableDefaultUI: false,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                }}
            >
                {destinations.map((dest) => {
                    if (!dest.coordinates?.lat || !dest.coordinates?.lng) return null

                    return (
                        <MarkerF
                            key={dest._id}
                            position={{ lat: dest.coordinates.lat, lng: dest.coordinates.lng }}
                            onClick={() => setSelectedDest(dest)}
                        />
                    )
                })}

                {selectedDest && (
                    <InfoWindowF
                        position={{ lat: selectedDest.coordinates.lat, lng: selectedDest.coordinates.lng }}
                        onCloseClick={() => setSelectedDest(null)}
                    >
                        <div className="w-64 overflow-hidden rounded-xl">
                            <div className="relative h-28">
                                <img
                                    src={selectedDest.image}
                                    alt={selectedDest.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-600/90 text-[10px] font-bold text-white">
                                    {selectedDest.category}
                                </div>
                            </div>
                            <div className="p-3">
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h4 className="font-bold text-sm leading-tight">{selectedDest.name}</h4>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                            <MapPin className="w-2.5 h-2.5" />
                                            {selectedDest.country}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">
                                        <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                        {selectedDest.rating}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <div className="text-xs font-bold text-emerald-600">
                                        ${selectedDest.price}
                                        <span className="text-[10px] text-gray-500 font-normal ml-1">/person</span>
                                    </div>
                                    <Link href={`/planner?destination=${encodeURIComponent(selectedDest.name)}`}>
                                        <Button size="sm" className="h-7 text-[10px] rounded-lg px-3">
                                            Plan <ArrowRight className="w-3 h-3 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </InfoWindowF>
                )}
            </GoogleMap>
        </div>
    )
}
