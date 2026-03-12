const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = process.env.GOOGLE_API_KEY
    ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
    : null;

// @route   POST api/spirit/chat
// @desc    Get AI Spirit response for a message (Gemini-powered with fallback)
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ msg: 'Message is required' });
        }

        const query = message.toLowerCase();

        // Search for destinations from Firestore
        const snapshot = await db.collection('destinations').get();
        const destinations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Try Gemini AI first
        if (genAI) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

                // Build context from destinations
                const destNames = destinations.map(d => d.name).join(', ');
                const destDetails = destinations.slice(0, 10).map(d =>
                    `${d.name} (${d.country}) - ${d.category} - ${d.description || 'Beautiful destination'} - $${d.price}/person`
                ).join('\n');

                const prompt = `You are "Tourify Spirit", an AI travel guide for the Tourify eco-tourism platform. You speak with a calm, nature-connected tone. You help travelers find sustainable, eco-friendly destinations.

Available destinations on our platform:
${destDetails}

User message: "${message}"

Rules:
- Keep responses concise (2-4 paragraphs max)
- Use nature-themed emojis (🏔️ 🌲 🛶 🌊 🦋 🌿)
- If the user asks about a specific destination from our list, give details about it
- If the user asks about food, suggest eco-friendly dining
- If the user asks about meditation/quiet/peace, suggest tranquil destinations
- Always suggest eco-friendly travel options
- End with a follow-up question to continue the conversation
- Do not use markdown headers or bullet points with asterisks`;

                const result = await model.generateContent(prompt);
                const aiResponse = result.response.text();

                return res.json({ role: "ai", content: aiResponse });
            } catch (aiErr) {
                console.error('Gemini AI error, falling back to keyword matching:', aiErr.message);
            }
        }

        // Fallback: Simple keyword matching
        let foundDestination = destinations.find(d =>
            query.includes(d.name.toLowerCase()) ||
            query.includes(d.country.toLowerCase()) ||
            (d.tags || []).some(tag => query.includes(tag.toLowerCase()))
        );

        let response = "";

        if (foundDestination) {
            const accommodation = foundDestination.accommodations?.[0]?.name || "Eco-certified mountain lodges";
            const rental = foundDestination.rentals?.[0]?.name || "Electric rail & hiking trails";

            response = `I sense a strong connection with ${foundDestination.name}. A truly serene choice! For a low-impact path there, I've curated this for you:\n\n🏔️ Stay: ${accommodation}\n🌲 Mobility: ${rental}\n🛶 Experience: Local ${foundDestination.category} immersion\n\nNature Insights:\n• ${foundDestination.description || "A sanctuary for the soul."}\n• Best time to breathe here: ${foundDestination.bestTime || "Anytime nature calls."}\n\nWould you like the full trail map and eco-lodging details?`;
        } else if (query.includes("meditation") || query.includes("quiet") || query.includes("peace") || query.includes("tranquil")) {
            const quietDestinations = destinations.filter(d => d.natureFocus).slice(0, 2);
            const names = quietDestinations.map(d => d.name).join(" and ");

            response = `The frequency of tranquility is high in ${names || "the hidden valleys of the world"}. These 'Quiet Trails' are designed for minimal digital noise and maximum nature immersion. Would you like me to plot a route through these specific silence sanctuaries?`;
        } else if (query.includes("food") || query.includes("eat")) {
            response = "Sustainability extends to the palate. I've found zero-waste kitchens and organic farm-to-table experiences that honor the earth. Which continent's flavors are you vibrating with currently?";
        } else {
            response = "Your spirit's request is heard. I'm currently scanning the global ley lines for a path that matches your current vibration. Could you tell me more about the environment you seek—mountains, oceans, or deep forests?";
        }

        res.json({ role: "ai", content: response });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
