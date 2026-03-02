"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Users, Heart, MessageCircle, Leaf, Star, MapPin, Filter,
    Send, Globe, Mountain, Waves, Building2, Share2, PenLine, X, CheckCircle
} from "lucide-react"

const CATEGORY_ICONS: { [key: string]: any } = {
    Nature: Leaf,
    Beach: Waves,
    City: Building2,
    Romantic: Star,
    Adventure: Mountain,
    Culture: Globe,
}

const STYLE_COLORS: { [key: string]: string } = {
    Solo: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Couple: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    Family: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Group: "bg-blue-500/10 text-blue-400 border-blue-500/20",
}

export function TribalSyncFeed() {
    const [posts, setPosts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
    const [filter, setFilter] = useState({ category: "All", style: "All", sort: "recent" })
    const [showShareModal, setShowShareModal] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [form, setForm] = useState({
        authorName: "", destination: "", country: "", title: "",
        story: "", tags: "", category: "Nature", travelStyle: "Solo", rating: 5
    })

    const fetchPosts = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams({
                category: filter.category,
                style: filter.style,
                sort: filter.sort,
            })
            const res = await fetch(`https://tourify-backend-99ef.onrender.com/api/tribe?${params}`)
            const data = await res.json()
            setPosts(data)
        } catch (err) {
            console.error("Tribe fetch error:", err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => { fetchPosts() }, [filter])

    const handleLike = async (postId: string) => {
        if (likedPosts.has(postId)) return
        try {
            const res = await fetch(`https://tourify-backend-99ef.onrender.com/api/tribe/${postId}/like`, { method: "PUT" })
            const data = await res.json()
            setPosts(prev => prev.map(p => p._id === postId ? { ...p, likes: data.likes } : p))
            setLikedPosts(prev => new Set(prev).add(postId))
        } catch (err) {
            console.error("Like error:", err)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const payload = { ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) }
            await fetch("https://tourify-backend-99ef.onrender.com/api/tribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            setSubmitted(true)
            setTimeout(() => {
                setShowShareModal(false)
                setSubmitted(false)
                setForm({ authorName: "", destination: "", country: "", title: "", story: "", tags: "", category: "Nature", travelStyle: "Solo", rating: 5 })
                fetchPosts()
            }, 2000)
        } catch (err) {
            console.error("Submit error:", err)
        }
    }

    const totalLikes = posts.reduce((a, p) => a + p.likes, 0)
    const totalComments = posts.reduce((a, p) => a + p.comments, 0)

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            {/* Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-12">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Community Feed</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-3">
                        Tribal <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-400">Sync</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        Share your discovery with fellow explorers in serene digital spaces.
                    </p>
                </div>

                {/* Stats + CTA */}
                <div className="flex flex-col items-start lg:items-end gap-4">
                    <div className="flex gap-6">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-foreground">{posts.length}</p>
                            <p className="text-xs text-muted-foreground">Stories Shared</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-foreground">{totalLikes.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Hearts Given</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-foreground">{totalComments.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Echoes</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowShareModal(true)}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm hover:shadow-xl hover:shadow-emerald-500/20 hover:scale-105 transition-all duration-300"
                    >
                        <PenLine className="w-4 h-4" />
                        Share Your Discovery
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center mb-8">
                <Filter className="w-4 h-4 text-muted-foreground" />
                {/* Sort */}
                {[["recent", "Latest"], ["popular", "Most Loved"], ["top", "Top Rated"]].map(([val, label]) => (
                    <button key={val} onClick={() => setFilter(f => ({ ...f, sort: val }))}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${filter.sort === val ? "bg-emerald-500 text-white border-emerald-500" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"}`}>
                        {label}
                    </button>
                ))}
                <div className="w-px h-5 bg-white/10" />
                {/* Category */}
                {["All", "Nature", "Beach", "Adventure", "Culture", "Romantic"].map(cat => (
                    <button key={cat} onClick={() => setFilter(f => ({ ...f, category: cat }))}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${filter.category === cat ? "bg-teal-500 text-white border-teal-500" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"}`}>
                        {cat}
                    </button>
                ))}
                <div className="w-px h-5 bg-white/10" />
                {/* Travel Style */}
                {["All", "Solo", "Couple", "Family", "Group"].map(style => (
                    <button key={style} onClick={() => setFilter(f => ({ ...f, style }))}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${filter.style === style ? "bg-amber-500 text-white border-amber-500" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"}`}>
                        {style}
                    </button>
                ))}
            </div>

            {/* Post Feed */}
            {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="rounded-3xl bg-white/[0.03] border border-white/10 overflow-hidden animate-pulse">
                            <div className="h-52 bg-white/5" />
                            <div className="p-5 space-y-3">
                                <div className="h-4 bg-white/5 rounded-full w-3/4" />
                                <div className="h-3 bg-white/5 rounded-full w-1/2" />
                                <div className="h-16 bg-white/5 rounded-xl" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" layout>
                    <AnimatePresence mode="popLayout">
                        {posts.map((post, index) => {
                            const CategoryIcon = CATEGORY_ICONS[post.category] || Globe
                            const isLiked = likedPosts.has(post._id)
                            return (
                                <motion.article
                                    key={post._id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.06 }}
                                    className="group rounded-3xl overflow-hidden bg-white/[0.03] border border-white/10 hover:border-emerald-500/20 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/5 flex flex-col"
                                >
                                    {/* Image */}
                                    {post.image && (
                                        <div className="relative h-52 overflow-hidden shrink-0">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                                style={{ backgroundImage: `url(${post.image})` }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                                            {/* Eco badge */}
                                            {post.isEcoCertified && (
                                                <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/90 backdrop-blur-sm">
                                                    <Leaf className="w-2.5 h-2.5 text-white" />
                                                    <span className="text-[10px] font-bold text-white">Eco Certified</span>
                                                </div>
                                            )}
                                            {/* Category */}
                                            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
                                                <CategoryIcon className="w-3 h-3 text-white" />
                                                <span className="text-[10px] font-semibold text-white">{post.category}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-5 flex flex-col flex-1">
                                        {/* Author row */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 shrink-0">
                                                    {post.authorAvatar
                                                        ? <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" />
                                                        : <Users className="w-4 h-4 text-white m-auto mt-1.5" />}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-foreground">{post.authorName}</p>
                                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                        <MapPin className="w-2.5 h-2.5" />{post.destination}, {post.country}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STYLE_COLORS[post.travelStyle] || STYLE_COLORS.Solo}`}>
                                                {post.travelStyle}
                                            </span>
                                        </div>

                                        {/* Title + Story */}
                                        <h3 className="font-bold text-foreground text-base mb-2 leading-snug group-hover:text-emerald-400 transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                                            {post.story}
                                        </p>

                                        {/* Tags */}
                                        {post.tags?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {post.tags.slice(0, 3).map((tag: string) => (
                                                    <span key={tag} className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-muted-foreground">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => handleLike(post._id)}
                                                    className={`flex items-center gap-1.5 transition-all ${isLiked ? "text-rose-400" : "text-muted-foreground hover:text-rose-400"}`}
                                                >
                                                    <Heart className={`w-4 h-4 transition-all ${isLiked ? "fill-rose-400 scale-110" : ""}`} />
                                                    <span className="text-xs font-semibold">{post.likes}</span>
                                                </button>
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <MessageCircle className="w-4 h-4" />
                                                    <span className="text-xs font-semibold">{post.comments}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                                <span className="text-xs font-bold text-foreground">{post.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.article>
                            )
                        })}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={(e) => { if (e.target === e.currentTarget) setShowShareModal(false) }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-background border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            {submitted ? (
                                <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
                                        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-foreground mb-2">Discovery Shared!</h3>
                                    <p className="text-muted-foreground text-sm">Your story has been added to the Tribal Sync feed.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <PenLine className="w-5 h-5 text-emerald-500" />
                                            <h2 className="font-bold text-lg text-foreground">Share Your Discovery</h2>
                                        </div>
                                        <button type="button" onClick={() => setShowShareModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">Your Name *</label>
                                            <input required value={form.authorName} onChange={e => setForm(f => ({ ...f, authorName: e.target.value }))}
                                                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/40"
                                                placeholder="e.g. Aria Patel" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">Destination *</label>
                                            <input required value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
                                                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/40"
                                                placeholder="e.g. Leh-Ladakh" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">Country *</label>
                                            <input required value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                                                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/40"
                                                placeholder="e.g. India" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">Travel Style</label>
                                            <select value={form.travelStyle} onChange={e => setForm(f => ({ ...f, travelStyle: e.target.value }))}
                                                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground focus:outline-none focus:border-emerald-500/40">
                                                {["Solo", "Couple", "Family", "Group"].map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Story Title *</label>
                                        <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/40"
                                            placeholder="Give your discovery a soulful title..." />
                                    </div>

                                    <div>
                                        <label className="text-xs text-muted-foreground mb-1 block">Your Story *</label>
                                        <textarea required value={form.story} onChange={e => setForm(f => ({ ...f, story: e.target.value }))}
                                            rows={4}
                                            className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/40 resize-none"
                                            placeholder="Describe what you felt, saw, experienced..." />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">Category</label>
                                            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground focus:outline-none focus:border-emerald-500/40">
                                                {["Nature", "Beach", "City", "Adventure", "Culture", "Romantic"].map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">Tags (comma-separated)</label>
                                            <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                                                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/40"
                                                placeholder="Mountains, Solo, Scenic" />
                                        </div>
                                    </div>

                                    <button type="submit"
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300">
                                        <Send className="w-4 h-4" />
                                        Send to the Tribe
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
