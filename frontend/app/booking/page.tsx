"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import {
    CheckCircle2, Clock, MapPin, Calendar, Users, Wallet,
    ArrowRight, Plane, Hotel, Utensils, Camera, ShoppingBag,
    ShieldCheck, AlertCircle, ChevronRight, Download, Share2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

const BACKEND = "https://tourify-4cuu.onrender.com"

export default function BookingPage() {
    const router = useRouter()
    const [bookingData, setBookingData] = useState<any>(null)
    const [user, setUser] = useState<any>(null)
    const [token, setToken] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [paymentState, setPaymentState] = useState<"idle" | "processing" | "success">("idle")
    const [submitted, setSubmitted] = useState(false)
    const [bookingId, setBookingId] = useState<string>("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const id = urlParams.get("id")

        const storedUser = sessionStorage.getItem("user")
        const storedToken = sessionStorage.getItem("token")

        if (!storedUser || !storedToken) {
            router.push("/login")
            return
        }

        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setToken(storedToken)

        if (id) {
            // Fetch existing booking
            setBookingId(id)
            fetch(`${BACKEND}/api/bookings/my`, {
                headers: { "Authorization": `Bearer ${storedToken}` }
            })
                .then(res => res.json())
                .then(data => {
                    const found = data.find((b: any) => b.id === id)
                    if (found) {
                        setBookingData(found)
                        setSubmitted(true)
                    }
                    setLoading(false)
                })
                .catch(err => {
                    console.error("Fetch error:", err)
                    setLoading(false)
                })
        } else {
            const storedBooking = sessionStorage.getItem("pending_booking")
            if (storedBooking) {
                setBookingData(JSON.parse(storedBooking))
            } else {
                router.push("/planner")
            }
            setLoading(false)
        }
    }, [router])

    const handleConfirmBooking = async () => {
        setPaymentState("processing")
        setIsSubmitting(true)

        // Mock Payment Gateway processing time
        await new Promise(resolve => setTimeout(resolve, 2500))
        setPaymentState("success")

        try {
            const response = await fetch(`${BACKEND}/api/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    destination: bookingData.destination,
                    travelers: bookingData.travelers,
                    budget: bookingData.budget,
                    startDate: bookingData.startDate,
                    endDate: bookingData.endDate,
                    styles: bookingData.styles,
                    itinerary: bookingData.itinerary,
                    totalCost: bookingData.budget * bookingData.travelers, // Example calc
                    userName: user.name,
                    userEmail: user.email
                })
            })

            if (response.ok) {
                const result = await response.json()
                setBookingId(result.id)
                setSubmitted(true)
                sessionStorage.removeItem("pending_booking")
            } else {
                alert("Failed to create booking. Please try again.")
            }
        } catch (err) {
            console.error("Booking error:", err)
            alert("An error occurred. Check your connection.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading || !bookingData || !user) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-background">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const budgetNum = Number(bookingData.budget) || 0
    const travelersNum = Number(bookingData.travelers) || 0
    const totalBillNum = budgetNum * travelersNum

    const breakdown = [
        { label: "Flights", value: Math.round(totalBillNum * 0.4) },
        { label: "Hotels", value: Math.round(totalBillNum * 0.3) },
        { label: "Activities", value: Math.round(totalBillNum * 0.15) },
        { label: "Food & Others", value: Math.round(totalBillNum * 0.15) },
    ]

    const handleDownloadPDF = () => {
        try {
            const doc = new jsPDF()

            // Brand colors
            const brandColor = [16, 185, 129] // Emerald 500

            // Header Section
            doc.setFillColor(brandColor[0], brandColor[1], brandColor[2])
            doc.rect(0, 0, 210, 40, 'F')
            doc.setTextColor(255, 255, 255)
            doc.setFontSize(24)
            doc.setFont('helvetica', 'bold')
            doc.text("Tourifyy", 14, 25)

            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            doc.text("Booking Invoice & Trip Outline", 14, 32)

            doc.setFontSize(10)
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 196, 25, { align: 'right' })
            doc.text(`Booking ID: ${bookingId || "TF-X" + Math.floor(Math.random() * 10000)}`, 196, 32, { align: 'right' })

            // Customer Details
            doc.setTextColor(60, 60, 60)
            doc.setFontSize(12)
            doc.setFont('helvetica', 'bold')
            doc.text("Billed To:", 14, 55)
            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            doc.text(`Name: ${user?.name || "Customer"}`, 14, 62)
            doc.text(`Email: ${user?.email || "N/A"}`, 14, 68)

            // Trip Summary
            doc.setFontSize(12)
            doc.setFont('helvetica', 'bold')
            doc.text("Trip Summary:", 120, 55)
            doc.setFontSize(10)
            doc.setFont('helvetica', 'normal')
            doc.text(`Destination: ${bookingData.destination}`, 120, 62)
            doc.text(`Dates: ${bookingData.startDate || 'TBD'} to ${bookingData.endDate || 'TBD'}`, 120, 68)
            doc.text(`Travelers: ${bookingData.travelers} Persons`, 120, 74)
            doc.text(`Status: ${(bookingData.status || "Pending").toUpperCase()}`, 120, 80)

            // Pricing Breakdown Table
            doc.setFontSize(14)
            doc.setFont('helvetica', 'bold')
            doc.text("Cost Breakdown", 14, 100)

            const tableColumn = ["Description", "Amount (INR)"]
            const tableRows = breakdown.map(item => [item.label, `Rs. ${item.value.toLocaleString()}`])

            autoTable(doc, {
                startY: 105,
                head: [tableColumn],
                body: tableRows,
                theme: 'striped',
                headStyles: { fillColor: brandColor as [number, number, number], halign: 'left' },
                bodyStyles: { halign: 'left' },
                alternateRowStyles: { fillColor: [245, 250, 248] },
                margin: { left: 14 }
            })

            const finalY = (doc as any).lastAutoTable?.finalY || 150

            // Total
            doc.setFontSize(12)
            doc.setFont('helvetica', 'bold')
            doc.text(`Total Paid: Rs. ${totalBillNum.toLocaleString()}`, 196, finalY + 10, { align: 'right' })

            // Detailed Day-wise Itinerary
            if (bookingData.itinerary) {
                doc.setFontSize(14)
                doc.setFont('helvetica', 'bold')
                doc.text("Detailed Day-wise Itinerary", 14, finalY + 30)

                const itinColumns = ["Time", "Activity / Place", "Cost (INR)"]
                const itinRows: any[] = []

                const itineraryArr = Array.isArray(bookingData.itinerary)
                    ? bookingData.itinerary
                    : typeof bookingData.itinerary === 'string'
                        ? bookingData.itinerary.split('\n')
                            .filter((line: string) => line.trim().length > 0)
                            .map((line: string, idx: number) => ({ day: idx + 1, title: line.trim(), activities: [], date: "TBD" }))
                        : []

                itineraryArr.forEach((day: any) => {
                    // Day header row
                    itinRows.push([
                        { content: `Day ${day.day}: ${day.title || day.description || 'Activities'}${day.date ? '  —  ' + day.date : ''}`, colSpan: 3, styles: { fillColor: brandColor as [number, number, number], textColor: [255, 255, 255] as [number, number, number], fontStyle: 'bold' as const, fontSize: 10, halign: 'left' as const } }
                    ])
                    // Activity rows
                    if (day.activities && day.activities.length > 0) {
                        day.activities.forEach((act: any) => {
                            itinRows.push([
                                act.time || "",
                                act.activity || "",
                                act.cost ? `Rs. ${act.cost}` : "Free"
                            ])
                        })
                    } else {
                        itinRows.push(["", "Explore & enjoy the destination", "—"])
                    }
                })

                if (itinRows.length > 0) {
                    autoTable(doc, {
                        startY: finalY + 35,
                        head: [itinColumns],
                        body: itinRows,
                        theme: 'striped',
                        headStyles: { fillColor: [40, 40, 40] as [number, number, number], textColor: [255, 255, 255] as [number, number, number], fontStyle: 'bold' },
                        bodyStyles: { fontSize: 9 },
                        alternateRowStyles: { fillColor: [245, 250, 248] },
                        margin: { left: 14 },
                        columnStyles: {
                            0: { cellWidth: 30 },
                            1: { cellWidth: 'auto' },
                            2: { cellWidth: 30, halign: 'right' }
                        }
                    })
                }
            }

            // Footer
            doc.setFontSize(10)
            doc.setTextColor(150, 150, 150)
            const pageHeight = doc.internal.pageSize.getHeight()
            doc.text("Thank you for choosing Tourifyy for your ecological travel.", 105, pageHeight - 15, { align: 'center' })

            // Save
            doc.save(`Tourifyy_Invoice_${bookingId || "Ticket"}.pdf`)
        } catch (error) {
            console.error("PDF generation error:", error)
            alert("Could not generate PDF. Please try again or contact support.")
        }
    }

    return (
        <main className="min-h-screen bg-background text-foreground overflow-hidden px-4 sm:px-6 lg:px-8">
            <Navbar />

            <div className="pt-24 pb-16 max-w-5xl mx-auto">
                {!submitted ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Header */}
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Review Your Booking</h1>
                            <p className="text-muted-foreground italic">Complete your reservation for the luxury eco-trail.</p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Trip Info */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="glass-card rounded-[2rem] p-8 border-emerald-500/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <Plane className="w-24 h-24 rotate-12" />
                                    </div>

                                    <div className="flex flex-wrap gap-8 items-center mb-8">
                                        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-500/20">
                                            <MapPin className="w-8 h-8 text-emerald-500" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Destination</div>
                                            <div className="text-2xl font-bold">{bookingData.destination}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                        <div className="space-y-1">
                                            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" /> Start Date
                                            </div>
                                            <div className="text-sm font-semibold">{bookingData.startDate || "TBD"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" /> End Date
                                            </div>
                                            <div className="text-sm font-semibold">{bookingData.endDate || "TBD"}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                <Users className="w-3.5 h-3.5" /> Travelers
                                            </div>
                                            <div className="text-sm font-semibold">{bookingData.travelers} Persons</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Detailed Itinerary Summary */}
                                <div className="glass-card rounded-[2.5rem] p-8 border-white/5 space-y-4">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-emerald-500" /> Planned Itinerary
                                    </h3>
                                    <div className="space-y-4">
                                        {bookingData.itinerary?.map((day: any) => (
                                            <div key={day.day} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 font-bold text-emerald-500">
                                                    {day.day}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="text-sm font-bold text-white uppercase tracking-tight">{day.title}</div>
                                                        {day.date && (
                                                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-md font-medium border border-emerald-500/10">
                                                                {day.date}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-white/40">{day.activities?.length || 0} activities planned</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Billing */}
                            <div className="space-y-6">
                                <div className="glass-card rounded-[2.5rem] p-8 border-emerald-500/20 bg-emerald-500/[0.02]">
                                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                        <Wallet className="w-5 h-5 text-emerald-500" /> Bill Summary
                                    </h3>

                                    <div className="space-y-4 mb-8">
                                        {breakdown.map((item) => (
                                            <div key={item.label} className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">{item.label}</span>
                                                <span className="font-semibold">₹{item.value.toLocaleString()}</span>
                                            </div>
                                        ))}
                                        <div className="h-px bg-white/10 my-4" />
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold">Total Amount</span>
                                            <span className="text-xl font-bold ml-1 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
                                                ₹{totalBillNum.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-6 flex gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                        <p className="text-[11px] text-amber-500/80 leading-relaxed font-medium">
                                            You will be charged securely via our gateway now. This booking requires admin approval. If rejected, your payment will be fully refunded within 3-5 business days.
                                        </p>
                                    </div>

                                    <Button
                                        className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/25 group transition-all relative overflow-hidden"
                                        disabled={isSubmitting || paymentState !== "idle"}
                                        onClick={handleConfirmBooking}
                                    >
                                        <span className="relative z-10 flex items-center justify-center">
                                            {paymentState === "processing" ? "Processing Secure Payment..." : isSubmitting ? "Creating Request..." : "Pay ₹" + (totalBillNum).toLocaleString() + " & Request Booking"}
                                            {paymentState === "idle" && !isSubmitting && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
                                        </span>
                                        {paymentState === "processing" && (
                                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                        )}
                                    </Button>
                                </div>

                                <div className="text-center p-4">
                                    <p className="text-[10px] text-muted-foreground">
                                        By confirming, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Eco-Travel Guidelines</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-xl mx-auto text-center space-y-8 py-12"
                    >
                        <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold mb-3">
                                {new URLSearchParams(window.location.search).get("id") ? "Booking Details" : "Booking Request Sent!"}
                            </h1>
                            <p className="text-muted-foreground italic">
                                {new URLSearchParams(window.location.search).get("id")
                                    ? `Reviewing your ecological trail for ${bookingData.destination}.`
                                    : `Your ecological trail for ${bookingData.destination} is processing.`}
                            </p>
                        </div>

                        <div className="glass-card rounded-[2.5rem] p-8 border-white/5 space-y-6">
                            <div className="space-y-2">
                                <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Booking ID</div>
                                <div className="text-xl font-mono text-emerald-400 font-bold">{bookingId || "TF-2026-XXXX"}</div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bookingData.status === 'approved' ? 'bg-emerald-500/10' : bookingData.status === 'rejected' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                                            <Clock className={`w-4 h-4 ${bookingData.status === 'approved' ? 'text-emerald-500' : bookingData.status === 'rejected' ? 'text-red-500' : 'text-amber-500'}`} />
                                        </div>
                                        <span className="text-sm font-semibold">Approval Status</span>
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${bookingData.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : bookingData.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                        {bookingData.status || "Pending"}
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-white/40 leading-relaxed px-4">
                                {bookingData.status === 'approved'
                                    ? "Your itinerary has been approved and payment is verified! Check your email for trail details."
                                    : bookingData.status === 'rejected'
                                        ? "Unfortunately, your request couldn't be approved at this time. A refund has been automatically initiated and will reflect in 3-5 days."
                                        : "Payment successful! Our curators are now reviewing your itinerary to ensure it meets our sustainability standards. You'll be notified via email once approved."}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
                            <Button variant="outline" className="rounded-xl px-8 h-12" onClick={() => router.push("/customer-dashboard")}>
                                Go to Dashboard
                            </Button>
                            <Button
                                onClick={handleDownloadPDF}
                                className="rounded-xl px-8 h-12 bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Invoice PDF
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>

            <Footer />
        </main>
    )
}
