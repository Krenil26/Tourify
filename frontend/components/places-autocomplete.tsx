"use client"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { MapPin } from "lucide-react"

interface PlacesAutocompleteProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
}

export function PlacesAutocomplete({ value, onChange, placeholder, className }: PlacesAutocompleteProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        if (!apiKey) return

        // Check if Google Maps script is already loaded
        if (window.google?.maps?.places) {
            setIsLoaded(true)
            return
        }

        // Load Google Places script
        const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')
        if (existingScript) {
            existingScript.addEventListener("load", () => setIsLoaded(true))
            return
        }

        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`
        script.async = true
        script.defer = true
        script.onload = () => setIsLoaded(true)
        document.head.appendChild(script)
    }, [])

    useEffect(() => {
        if (!isLoaded || !inputRef.current || autocompleteRef.current) return

        autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
            types: ["(cities)"],
            fields: ["formatted_address", "name", "geometry"],
        })

        autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current?.getPlace()
            if (place?.name) {
                // Format as "City, Country"
                const parts = place.formatted_address?.split(", ") || []
                const country = parts[parts.length - 1] || ""
                const formatted = country ? `${place.name}, ${country}` : place.name
                onChange(formatted)
            }
        })
    }, [isLoaded, onChange])

    return (
        <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <Input
                ref={inputRef}
                placeholder={placeholder || "Search for a city..."}
                className={`pl-12 h-14 bg-secondary border-0 text-foreground placeholder:text-muted-foreground rounded-xl ${className || ""}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {isLoaded && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <span className="text-[9px] text-muted-foreground/60 font-medium">Google Places</span>
                </div>
            )}
        </div>
    )
}
