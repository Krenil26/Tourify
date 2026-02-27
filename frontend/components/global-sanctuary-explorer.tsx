"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe, Leaf, Star, MapPin, Clock, DollarSign, Filter, Search, ChevronRight, Mountain, Waves, Building2, Compass, Users, Loader2 } from "lucide-react"
import Link from "next/link"

const CONTINENT_COLORS: { [key: string]: string } = {
    "Asia": "from-amber-500/20 to-orange-500/10 border-amber-500/20",
    "Europe": "from-blue-500/20 to-indigo-500/10 border-blue-500/20",
    "North America": "from-emerald-500/20 to-teal-500/10 border-emerald-500/20",
    "South America": "from-green-500/20 to-lime-500/10 border-green-500/20",
    "Africa": "from-red-500/20 to-rose-500/10 border-red-500/20",
    "Oceania": "from-cyan-500/20 to-sky-500/10 border-cyan-500/20",
    "Other": "from-purple-500/20 to-violet-500/10 border-purple-500/20",
}

const CONTINENT_EMOJI: { [key: string]: string } = {
    "Asia": "🌏",
    "Europe": "🌍",
    "North America": "🌎",
    "South America": "🌿",
    "Africa": "🦁",
    "Oceania": "🐠",
    "Other": "🌐",
}

const CATEGORY_ICONS: { [key: string]: any } = {
    Nature: Leaf,
    Beach: Waves,
    City: Building2,
    Romantic: Star,
    Adventure: Mountain,
    Culture: Globe,
}

export function GlobalSanctuaryExplorer() {
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedContinent, setSelectedContinent] = useState("All")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [viewMode, setViewMode] = useState<"continents" | "grid">("continents")

    useEffect(() => {
        const fetchSanctuary = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/sanctuary")
                const json = await res.json()
                setData(json)
            } catch (err) {
                console.error("Sanctuary fetch error:", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchSanctuary()
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Globe className="w-12 h-12 text-emerald-500" />
                </motion.div>
                <p className="text-muted-foreground text-sm font-medium">Mapping global sanctuaries...</p>
            </div>
        )
    }

    const allDestinations: any[] = data?.all || []
    const continents = Object.keys(data?.grouped || {})
    const categories = data?.stats?.categories || []

    // Filtering
    const filtered = allDestinations.filter(d => {
        const matchSearch = !searchQuery ||
            d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.tags?.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchCat = selectedCategory === "All" || d.category === selectedCategory
        const matchContinent = selectedContinent === "All" || (() => {
            const cm: { [key: string]: string } = {
                'USA': 'North America', 'Canada': 'North America', 'Mexico': 'North America',
                'Peru': 'South America', 'Brazil': 'South America',
                'India': 'Asia', 'Japan': 'Asia', 'Maldives': 'Asia',
                'Greece': 'Europe', 'Italy': 'Europe', 'France': 'Europe',
                'Tanzania': 'Africa', 'Kenya': 'Africa',
                'Australia': 'Oceania', 'New Zealand': 'Oceania',
            }
            return (cm[d.country] || 'Other') === selectedContinent
        })()
        return matchSearch && matchCat && matchContinent
    })

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* Hero Header */}
            <div className="text-center mb-14">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4"
                >
                    <Globe className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Global Sanctuary Network</span>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-6xl font-bold text-foreground mb-4"
                >
                    {data?.stats?.total || 0}+ Protected{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Sanctuaries</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground text-lg max-w-2xl mx-auto"
                >
                    Access our global network of eco-certified parks, retreats and natural wonders across {data?.stats?.countries} countries.
                </motion.p>

                {/* Live Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap items-center justify-center gap-6 mt-8"
                >
                    {[
                        { label: "Destinations", value: data?.stats?.total, icon: Globe },
                        { label: "Nature-Focused", value: data?.stats?.protected, icon: Leaf },
                        { label: "Countries", value: data?.stats?.countries, icon: MapPin },
                        { label: "Continents", value: continents.length, icon: Compass },
                    ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10">
                            <Icon className="w-4 h-4 text-emerald-500" />
                            <div>
                                <span className="text-xl font-bold text-foreground">{value}</span>
                                <span className="text-xs text-muted-foreground ml-1.5">{label}</span>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search sanctuaries, countries, or activities..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-emerald-500/40 transition-colors"
                    />
                </div>
                {/* View Toggle */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode("continents")}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${viewMode === "continents" ? "bg-emerald-500 text-white border-emerald-500" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"}`}
                    >
                        By Continent
                    </button>
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${viewMode === "grid" ? "bg-emerald-500 text-white border-emerald-500" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"}`}
                    >
                        All Grid
                    </button>
                </div>
            </div>

            {/* Category & Continent Filters */}
            <div className="flex flex-wrap gap-2 mb-10">
                <Filter className="w-4 h-4 text-muted-foreground mt-1.5" />
                {["All", ...categories].map((cat: string) => (
                    <button
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); setViewMode("grid") }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${selectedCategory === cat && viewMode === "grid"
                            ? "bg-teal-500 text-white border-teal-500"
                            : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
                <div className="w-px h-6 bg-white/10 mx-2 self-center" />
                {["All", ...continents].map(cont => (
                    <button
                        key={cont}
                        onClick={() => { setSelectedContinent(cont); setViewMode("grid") }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${selectedContinent === cont && viewMode === "grid"
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                            }`}
                    >
                        {CONTINENT_EMOJI[cont] || "🌐"} {cont}
                    </button>
                ))}
            </div>

            {/* CONTINENT VIEW */}
            <AnimatePresence mode="wait">
                {viewMode === "continents" && (
                    <motion.div key="continents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                        {Object.entries(data?.grouped || {}).map(([continent, dests]: any, ci) => (
                            <motion.div
                                key={continent}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: ci * 0.05 }}
                            >
                                {/* Continent Header */}
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${CONTINENT_COLORS[continent]} flex items-center justify-center text-xl border`}>
                                            {CONTINENT_EMOJI[continent]}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-foreground">{continent}</h2>
                                            <p className="text-xs text-muted-foreground">{dests.length} sanctuaries</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setSelectedContinent(continent); setViewMode("grid") }}
                                        className="text-xs text-emerald-500 font-semibold hover:underline flex items-center gap-1"
                                    >
                                        View all <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Continent Cards - horizontal scroll on mobile */}
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {dests.slice(0, 4).map((dest: any, idx: number) => (
                                        <SanctuaryCard key={dest._id} dest={dest} index={idx} />
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* GRID VIEW */}
                {viewMode === "grid" && (
                    <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-muted-foreground">
                                Showing <span className="text-foreground font-semibold">{filtered.length}</span> sanctuaries
                            </p>
                            <button onClick={() => { setSelectedCategory("All"); setSelectedContinent("All"); setSearchQuery(""); setViewMode("continents") }}
                                className="text-xs text-emerald-500 font-semibold hover:underline">
                                Reset filters
                            </button>
                        </div>
                        {filtered.length === 0 ? (
                            <div className="py-20 text-center">
                                <Globe className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                                <p className="text-muted-foreground">No sanctuaries found for this search.</p>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {filtered.map((dest, idx) => (
                                    <SanctuaryCard key={dest._id} dest={dest} index={idx} />
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function SanctuaryCard({ dest, index }: { dest: any; index: number }) {
    const CategoryIcon = CATEGORY_ICONS[dest.category] || Globe
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
        >
            <Link href={`/destinations`} className="block group">
                <div className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                            style={{ backgroundImage: `url(${dest.image})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        {/* Nature badge */}
                        {dest.natureFocus && (
                            <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-emerald-500/90 backdrop-blur-sm flex items-center gap-1">
                                <Leaf className="w-2.5 h-2.5 text-white" />
                                <span className="text-[10px] font-bold text-white">Eco</span>
                            </div>
                        )}
                        {/* Category */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                            <CategoryIcon className="w-3 h-3 text-white" />
                            <span className="text-[10px] font-semibold text-white">{dest.category}</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h3 className="font-bold text-foreground text-sm leading-tight">{dest.name}</h3>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-2.5 h-2.5" /> {dest.country}
                                </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                <span className="text-xs font-bold text-foreground">{dest.rating}</span>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                            {dest.tags?.slice(0, 2).map((tag: string) => (
                                <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-muted-foreground border border-white/10">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span className="text-[11px]">{dest.bestTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3 text-emerald-500" />
                                <span className="text-xs font-bold text-foreground">{dest.price}</span>
                                <span className="text-[10px] text-muted-foreground">/trip</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
