const express = require("express");
const router = express.Router();
const { db } = require('../firebase');
const jwt = require("jsonwebtoken");

// Middleware to authenticate user
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

// Create a new booking (Firestore)
router.post("/", authenticate, async (req, res) => {
    try {
        const { destination, travelers, budget, startDate, endDate, styles, itinerary, totalCost, userName, userEmail } = req.body;

        const bookingData = {
            userId: req.user.id,
            userName: userName || req.user.name || "Explorer",
            userEmail: userEmail || req.user.email || "unknown@tourify.ai",
            destination,
            travelers,
            budget,
            startDate,
            endDate,
            styles,
            itinerary,
            totalCost,
            status: "pending",
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('bookings').add(bookingData);
        res.status(201).json({ id: docRef.id, ...bookingData });
    } catch (err) {
        console.error("Booking error:", err);
        res.status(500).json({ message: "Server error creating booking", error: err.message });
    }
});

// Get user's bookings
router.get("/my", authenticate, async (req, res) => {
    try {
        const snapshot = await db.collection('bookings')
            .where('userId', '==', req.user.id)
            .orderBy('createdAt', 'desc')
            .get();

        const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(bookings);
    } catch (err) {
        console.error("Fetch bookings error:", err);
        res.status(500).json({ message: "Server error fetching bookings", error: err.message });
    }
});

// Admin: Get all bookings
router.get("/all", authenticate, async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
        const snapshot = await db.collection('bookings')
            .orderBy('createdAt', 'desc')
            .get();

        const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Server error fetching all bookings", error: err.message });
    }
});

// Admin: Update booking status
router.put("/:id/status", authenticate, async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
    try {
        const { status } = req.body;
        const { id } = req.params;

        await db.collection('bookings').doc(id).update({ status, updatedAt: new Date().toISOString() });
        res.json({ message: "Booking status updated", id, status });
    } catch (err) {
        res.status(500).json({ message: "Server error updating status", error: err.message });
    }
});

module.exports = router;
