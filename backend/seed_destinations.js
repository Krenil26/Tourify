require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('./models/Destination');

const sampleDestinations = [
    // ── BEACH (7 places) ──
    {
        name: "Maldives Atolls",
        country: "Maldives",
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
        rating: 5.0,
        reviews: 2100,
        price: 2500,
        category: "Beach",
        tags: ["Tropical", "Crystal Clear", "Relaxation"],
        bestTime: "Nov - Apr",
        flightTime: "11h",
        description: "Turquoise lagoons and overwater villas that define pure tropical serenity.",
        natureFocus: true,
        coordinates: { lat: 3.2028, lng: 73.2207 },
        accommodations: [
            { name: "Azure Water Villas", type: "Resort", pricePerNight: 850, image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&q=80" },
            { name: "Coral Reef Retreat", type: "Hotel", pricePerNight: 450, image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Scooter", name: "Island Hop Scooter", pricePerDay: 25 }
        ]
    },
    {
        name: "Goa Sands",
        country: "India",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
        rating: 4.7,
        reviews: 8500,
        price: 450,
        category: "Beach",
        tags: ["Party", "Coastal", "Culture"],
        bestTime: "Nov - Feb",
        flightTime: "2h",
        description: "Pristine beaches, vibrant nightlife, and a unique blend of Indian and Portuguese culture.",
        natureFocus: true,
        coordinates: { lat: 15.2993, lng: 74.1240 },
        accommodations: [
            { name: "Taj Exotica Resort & Spa", type: "Resort", pricePerNight: 400, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80" },
            { name: "Anjuna Beach Hut", type: "Hotel", pricePerNight: 80, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Scooter", name: "Honda Activa", pricePerDay: 10 },
            { vehicleType: "Car", name: "Mahindra Thar Convertible", pricePerDay: 40 }
        ]
    },
    {
        name: "Tulum Riviera",
        country: "Mexico",
        image: "https://images.unsplash.com/photo-1504730655501-24c39ac53f0e?w=800&q=80",
        rating: 4.7,
        reviews: 5800,
        price: 1500,
        category: "Beach",
        tags: ["History", "Cenotes", "Coastal"],
        bestTime: "Nov - Apr",
        flightTime: "6h",
        description: "Ancient Mayan ruins overlooking turquoise Caribbean waters and white sand beaches.",
        natureFocus: true,
        coordinates: { lat: 20.2151, lng: -87.4297 },
        accommodations: [
            { name: "Azulik Tulum", type: "Resort", pricePerNight: 750, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" },
            { name: "Casa Malca", type: "Hotel", pricePerNight: 600, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Bike", name: "Beach Cruiser", pricePerDay: 20 },
            { vehicleType: "Car", name: "Jeep Wrangler", pricePerDay: 85 }
        ]
    },
    {
        name: "Bali Beaches",
        country: "Indonesia",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
        rating: 4.8,
        reviews: 11200,
        price: 800,
        category: "Beach",
        tags: ["Surfing", "Temples", "Tropical"],
        bestTime: "Apr - Oct",
        flightTime: "10h",
        description: "Stunning volcanic beaches, world-class surfing, and enchanting temple sunsets.",
        natureFocus: true,
        coordinates: { lat: -8.3405, lng: 115.0920 },
        accommodations: [
            { name: "AYANA Resort Bali", type: "Resort", pricePerNight: 350, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" },
            { name: "Uluwatu Cliff Villa", type: "Villa", pricePerNight: 200, image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Scooter", name: "Honda Vario", pricePerDay: 8 },
            { vehicleType: "Car", name: "Toyota Avanza", pricePerDay: 35 }
        ]
    },
    {
        name: "Zanzibar Island",
        country: "Tanzania",
        image: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80",
        rating: 4.6,
        reviews: 3400,
        price: 1200,
        category: "Beach",
        tags: ["Spice Island", "Snorkeling", "Exotic"],
        bestTime: "Jun - Oct",
        flightTime: "8h",
        description: "Spice-scented island with powdery white sands and turquoise Indian Ocean waters.",
        natureFocus: true,
        coordinates: { lat: -6.1659, lng: 39.2026 },
        accommodations: [
            { name: "Zuri Zanzibar", type: "Resort", pricePerNight: 400, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" },
            { name: "Stone Town Beach House", type: "Hotel", pricePerNight: 120, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Bike", name: "Island Cruiser", pricePerDay: 15 }
        ]
    },
    {
        name: "Phuket Paradise",
        country: "Thailand",
        image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80",
        rating: 4.7,
        reviews: 14500,
        price: 650,
        category: "Beach",
        tags: ["Island Hopping", "Nightlife", "Thai Food"],
        bestTime: "Nov - Mar",
        flightTime: "6h",
        description: "Thailand's largest island with dramatic limestone cliffs and warm Andaman Sea waters.",
        natureFocus: true,
        coordinates: { lat: 7.8804, lng: 98.3923 },
        accommodations: [
            { name: "Banyan Tree Phuket", type: "Resort", pricePerNight: 500, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" },
            { name: "Kata Beach Inn", type: "Hotel", pricePerNight: 80, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Scooter", name: "Honda Click", pricePerDay: 8 },
            { vehicleType: "Car", name: "Toyota Fortuner", pricePerDay: 60 }
        ]
    },
    {
        name: "Seychelles Islands",
        country: "Seychelles",
        image: "https://images.unsplash.com/photo-1589979481223-deb893043163?w=800&q=80",
        rating: 4.9,
        reviews: 2800,
        price: 3200,
        category: "Beach",
        tags: ["Exclusive", "Wildlife", "Paradise"],
        bestTime: "Apr - May",
        flightTime: "9h",
        description: "Pristine granite boulder beaches surrounded by lush tropical jungle and rare wildlife.",
        natureFocus: true,
        coordinates: { lat: -4.6796, lng: 55.4920 },
        accommodations: [
            { name: "Four Seasons Seychelles", type: "Resort", pricePerNight: 1200, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" },
            { name: "Praslin Beach Villa", type: "Villa", pricePerNight: 600, image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Mini Moke", pricePerDay: 50 }
        ]
    },

    // ── CITY (6 places) ──
    {
        name: "Tokyo Ginza",
        country: "Japan",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
        rating: 4.8,
        reviews: 9200,
        price: 1800,
        category: "City",
        tags: ["Neon Lights", "Foodie", "Tech"],
        bestTime: "Oct - Nov",
        flightTime: "14h",
        description: "The pulse of high-tech living blended with ancient Japanese tradition and neon lights.",
        natureFocus: false,
        coordinates: { lat: 35.6722, lng: 139.7667 },
        accommodations: [
            { name: "The Park Hyatt Tokyo", type: "Hotel", pricePerNight: 550, image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&q=80" },
            { name: "Ginza Boutique Inn", type: "Hotel", pricePerNight: 280, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Toyota Prius Hybrid", pricePerDay: 90 },
            { vehicleType: "Bike", name: "City Cruiser Bike", pricePerDay: 20 }
        ]
    },
    {
        name: "New York City",
        country: "USA",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
        rating: 4.8,
        reviews: 22000,
        price: 2800,
        category: "City",
        tags: ["Skyline", "Broadway", "Iconic"],
        bestTime: "Sep - Nov",
        flightTime: "16h",
        description: "The city that never sleeps — iconic skyline, Broadway, Central Park, and world-class dining.",
        natureFocus: false,
        coordinates: { lat: 40.7128, lng: -74.0060 },
        accommodations: [
            { name: "The Plaza Hotel", type: "Hotel", pricePerNight: 800, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "SoHo Grand Hotel", type: "Hotel", pricePerNight: 450, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Tesla Model 3", pricePerDay: 120 },
            { vehicleType: "Bike", name: "Citi Bike", pricePerDay: 15 }
        ]
    },
    {
        name: "Dubai Marina",
        country: "UAE",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
        rating: 4.7,
        reviews: 15800,
        price: 2200,
        category: "City",
        tags: ["Futuristic", "Shopping", "Desert"],
        bestTime: "Nov - Mar",
        flightTime: "4h",
        description: "Futuristic skyline rising from the desert with luxury shopping and world-record architecture.",
        natureFocus: false,
        coordinates: { lat: 25.2048, lng: 55.2708 },
        accommodations: [
            { name: "Burj Al Arab", type: "Hotel", pricePerNight: 2000, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "JW Marriott Marquis", type: "Hotel", pricePerNight: 350, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Range Rover Sport", pricePerDay: 200 }
        ]
    },
    {
        name: "London Westminster",
        country: "United Kingdom",
        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
        rating: 4.8,
        reviews: 18500,
        price: 2400,
        category: "City",
        tags: ["Historic", "Theatre", "Royal"],
        bestTime: "May - Sep",
        flightTime: "9h",
        description: "Royal palaces, world-class museums, West End theatre, and centuries of living history.",
        natureFocus: false,
        coordinates: { lat: 51.5074, lng: -0.1278 },
        accommodations: [
            { name: "The Savoy", type: "Hotel", pricePerNight: 700, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "Covent Garden Boutique", type: "Hotel", pricePerNight: 300, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Mini Cooper", pricePerDay: 80 },
            { vehicleType: "Bike", name: "Santander Cycle", pricePerDay: 10 }
        ]
    },
    {
        name: "Singapore Marina Bay",
        country: "Singapore",
        image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",
        rating: 4.9,
        reviews: 12600,
        price: 2000,
        category: "City",
        tags: ["Garden City", "Clean", "Foodie"],
        bestTime: "Feb - Apr",
        flightTime: "5.5h",
        description: "A garden city of the future — stunning skyline, hawker food, and lush green spaces.",
        natureFocus: false,
        coordinates: { lat: 1.2839, lng: 103.8607 },
        accommodations: [
            { name: "Marina Bay Sands", type: "Hotel", pricePerNight: 600, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "Raffles Hotel", type: "Hotel", pricePerNight: 900, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "BMW 3 Series", pricePerDay: 100 }
        ]
    },
    {
        name: "Barcelona Gothic Quarter",
        country: "Spain",
        image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
        rating: 4.7,
        reviews: 14200,
        price: 1400,
        category: "City",
        tags: ["Architecture", "Tapas", "Mediterranean"],
        bestTime: "May - Jun",
        flightTime: "10h",
        description: "Gaudi's masterpieces, gothic lanes, tapas culture, and vibrant Mediterranean energy.",
        natureFocus: false,
        coordinates: { lat: 41.3851, lng: 2.1734 },
        accommodations: [
            { name: "Hotel Arts Barcelona", type: "Hotel", pricePerNight: 500, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "Gothic Quarter B&B", type: "Hotel", pricePerNight: 150, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Scooter", name: "Vespa Sprint", pricePerDay: 30 },
            { vehicleType: "Bike", name: "Bicing City Bike", pricePerDay: 10 }
        ]
    },

    // ── ROMANTIC (6 places) ──
    {
        name: "Santorini Caldera",
        country: "Greece",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
        rating: 4.9,
        reviews: 3200,
        price: 2200,
        category: "Romantic",
        tags: ["Sunset", "Scenic", "Architecture"],
        bestTime: "May - Oct",
        flightTime: "10h",
        description: "Breathtaking white-washed buildings and sunsets overlooking the blue Aegean Sea.",
        natureFocus: true,
        coordinates: { lat: 36.3932, lng: 25.4615 },
        accommodations: [
            { name: "Oia Sunset Villas", type: "Villa", pricePerNight: 600, image: "https://images.unsplash.com/photo-1515404929826-76fff9fef204?w=400&q=80" },
            { name: "Aegean Dream Hotel", type: "Hotel", pricePerNight: 350, image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Scooter", name: "Vespa Classic", pricePerDay: 40 },
            { vehicleType: "Car", name: "Mini Cooper Convertible", pricePerDay: 120 }
        ]
    },
    {
        name: "Amalfi Coast",
        country: "Italy",
        image: "https://images.unsplash.com/photo-1633321088355-d0f81137ca3b?w=800&q=80",
        rating: 4.8,
        reviews: 2800,
        price: 3200,
        category: "Romantic",
        tags: ["Coastal", "Scenic", "Italian"],
        bestTime: "May - Sep",
        flightTime: "10h",
        description: "Colorful villages perched on cliffs over the shimmering Mediterranean Sea.",
        natureFocus: true,
        coordinates: { lat: 40.6333, lng: 14.6033 },
        accommodations: [
            { name: "Le Sirenuse", type: "Hotel", pricePerNight: 1200, image: "https://images.unsplash.com/photo-1512918766671-ad650b9b734d?w=400&q=80" },
            { name: "Positano Cliff Villa", type: "Villa", pricePerNight: 800, image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Scooter", name: "Vespa Primavera", pricePerDay: 60 },
            { vehicleType: "Car", name: "Alfa Romeo Spider", pricePerDay: 250 }
        ]
    },
    {
        name: "Paris City of Love",
        country: "France",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
        rating: 4.9,
        reviews: 25000,
        price: 2600,
        category: "Romantic",
        tags: ["Eiffel Tower", "Bistros", "Art"],
        bestTime: "Apr - Jun",
        flightTime: "9h",
        description: "The Eiffel Tower, candlelit bistros, Seine river cruises, and timeless charm.",
        natureFocus: false,
        coordinates: { lat: 48.8566, lng: 2.3522 },
        accommodations: [
            { name: "Le Meurice", type: "Hotel", pricePerNight: 1000, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "Montmartre Boutique", type: "Hotel", pricePerNight: 300, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Bike", name: "Velib City Bike", pricePerDay: 10 },
            { vehicleType: "Car", name: "Citroen DS3", pricePerDay: 80 }
        ]
    },
    {
        name: "Venice Canals",
        country: "Italy",
        image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80",
        rating: 4.8,
        reviews: 18000,
        price: 2500,
        category: "Romantic",
        tags: ["Gondola", "Historic", "Canals"],
        bestTime: "Sep - Nov",
        flightTime: "10h",
        description: "Gondola rides through ancient canals, baroque architecture, and enchanting piazzas.",
        natureFocus: false,
        coordinates: { lat: 45.4408, lng: 12.3155 },
        accommodations: [
            { name: "Gritti Palace", type: "Hotel", pricePerNight: 900, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "San Marco Suite", type: "Villa", pricePerNight: 400, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: []
    },
    {
        name: "Udaipur Lake Palace",
        country: "India",
        image: "https://images.unsplash.com/photo-1585128903994-9788298932a4?w=800&q=80",
        rating: 4.9,
        reviews: 7600,
        price: 550,
        category: "Romantic",
        tags: ["Palace", "Lakes", "Royal"],
        bestTime: "Oct - Mar",
        flightTime: "1.5h",
        description: "The Venice of the East — floating palaces, serene lakes, and royal Rajasthani charm.",
        natureFocus: false,
        coordinates: { lat: 24.5854, lng: 73.7125 },
        accommodations: [
            { name: "Taj Lake Palace", type: "Resort", pricePerNight: 500, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "Amet Haveli", type: "Hotel", pricePerNight: 120, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Maruti Ertiga", pricePerDay: 30 },
            { vehicleType: "Bike", name: "Royal Enfield Classic", pricePerDay: 15 }
        ]
    },
    {
        name: "Bruges Old Town",
        country: "Belgium",
        image: "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=800&q=80",
        rating: 4.7,
        reviews: 5400,
        price: 1300,
        category: "Romantic",
        tags: ["Medieval", "Chocolate", "Canals"],
        bestTime: "Apr - Sep",
        flightTime: "10h",
        description: "Medieval cobblestone streets, chocolateries, canal-side walks, and fairytale architecture.",
        natureFocus: false,
        coordinates: { lat: 51.2093, lng: 3.2247 },
        accommodations: [
            { name: "Hotel Duc de Bourgogne", type: "Hotel", pricePerNight: 250, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "Canal View B&B", type: "Hotel", pricePerNight: 120, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Bike", name: "Dutch City Bike", pricePerDay: 12 }
        ]
    },

    // ── LUXURY (6 places) ──
    {
        name: "Bora Bora Lagoon",
        country: "French Polynesia",
        image: "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=800&q=80",
        rating: 5.0,
        reviews: 4200,
        price: 5500,
        category: "Luxury",
        tags: ["Overwater Villa", "Exclusive", "Lagoon"],
        bestTime: "May - Oct",
        flightTime: "24h",
        description: "Overwater bungalows floating on a turquoise lagoon with a volcanic island backdrop.",
        natureFocus: true,
        coordinates: { lat: -16.5004, lng: -151.7415 },
        accommodations: [
            { name: "Four Seasons Bora Bora", type: "Resort", pricePerNight: 2500, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" },
            { name: "Conrad Bora Bora", type: "Resort", pricePerNight: 1800, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Bike", name: "Island Beach Cruiser", pricePerDay: 25 }
        ]
    },
    {
        name: "Monaco Riviera",
        country: "Monaco",
        image: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80",
        rating: 4.9,
        reviews: 3800,
        price: 6500,
        category: "Luxury",
        tags: ["Casino", "Superyachts", "Glamour"],
        bestTime: "May - Sep",
        flightTime: "10h",
        description: "Glamorous principality with superyachts, Monte Carlo casino, and Formula 1 heritage.",
        natureFocus: false,
        coordinates: { lat: 43.7384, lng: 7.4246 },
        accommodations: [
            { name: "Hotel de Paris", type: "Hotel", pricePerNight: 3000, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "Fairmont Monte Carlo", type: "Hotel", pricePerNight: 1500, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Ferrari 488 Spider", pricePerDay: 500 }
        ]
    },
    {
        name: "Swiss Alps Zermatt",
        country: "Switzerland",
        image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
        rating: 4.9,
        reviews: 6200,
        price: 4800,
        category: "Luxury",
        tags: ["Alps", "Skiing", "Chalets"],
        bestTime: "Dec - Mar",
        flightTime: "9h",
        description: "Iconic Matterhorn views, world-class skiing, and luxurious alpine chalets.",
        natureFocus: true,
        coordinates: { lat: 46.0207, lng: 7.7491 },
        accommodations: [
            { name: "The Omnia Zermatt", type: "Hotel", pricePerNight: 1200, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "Riffelalp Resort", type: "Resort", pricePerNight: 900, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Audi Q7 Quattro", pricePerDay: 200 }
        ]
    },
    {
        name: "Dubai Palm Jumeirah",
        country: "UAE",
        image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&q=80",
        rating: 4.8,
        reviews: 9800,
        price: 3800,
        category: "Luxury",
        tags: ["Ultra-Luxury", "Private Beach", "Fine Dining"],
        bestTime: "Nov - Mar",
        flightTime: "4h",
        description: "Man-made island paradise with ultra-luxury resorts, private beaches, and fine dining.",
        natureFocus: false,
        coordinates: { lat: 25.1124, lng: 55.1390 },
        accommodations: [
            { name: "Atlantis The Royal", type: "Resort", pricePerNight: 2000, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "One&Only The Palm", type: "Resort", pricePerNight: 1500, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Lamborghini Huracan", pricePerDay: 600 }
        ]
    },
    {
        name: "Tuscany Villas",
        country: "Italy",
        image: "https://images.unsplash.com/photo-1523528283115-9bf9b1699245?w=800&q=80",
        rating: 4.8,
        reviews: 5600,
        price: 3500,
        category: "Luxury",
        tags: ["Vineyards", "Wine", "Countryside"],
        bestTime: "May - Oct",
        flightTime: "10h",
        description: "Rolling vineyards, Renaissance art, farm-to-table cuisine, and elegant countryside estates.",
        natureFocus: true,
        coordinates: { lat: 43.7711, lng: 11.2486 },
        accommodations: [
            { name: "Castello di Casole", type: "Resort", pricePerNight: 1000, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "Villa Cora Florence", type: "Villa", pricePerNight: 800, image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Fiat 500 Convertible", pricePerDay: 70 },
            { vehicleType: "Bike", name: "Tuscany E-Bike", pricePerDay: 30 }
        ]
    },
    {
        name: "Maldives Private Island",
        country: "Maldives",
        image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
        rating: 5.0,
        reviews: 1500,
        price: 8500,
        category: "Luxury",
        tags: ["Private Island", "Butler Service", "Underwater Dining"],
        bestTime: "Nov - Apr",
        flightTime: "11h",
        description: "Your own private island with butler service, underwater dining, and infinite ocean views.",
        natureFocus: true,
        coordinates: { lat: 4.1755, lng: 73.5093 },
        accommodations: [
            { name: "Soneva Fushi", type: "Resort", pricePerNight: 3000, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" },
            { name: "Velaa Private Island", type: "Resort", pricePerNight: 4000, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: []
    },

    // ── ADVENTURE (7 places) ──
    {
        name: "Spiti Valley",
        country: "India",
        image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&q=80",
        rating: 5.0,
        reviews: 1200,
        price: 700,
        category: "Adventure",
        tags: ["High Altitude", "Remote", "Monasteries"],
        bestTime: "Jun - Sep",
        flightTime: "12h (Road)",
        description: "A cold desert mountain valley high in the Himalayas with moon-like landscapes.",
        natureFocus: true,
        coordinates: { lat: 32.2461, lng: 78.0349 },
        accommodations: [
            { name: "Spiti Sarai", type: "Hotel", pricePerNight: 80, image: "https://images.unsplash.com/photo-1563911519451-85bc963b61fa?w=400&q=80" },
            { name: "Kaza Homestay", type: "Villa", pricePerNight: 40, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Bike", name: "Royal Enfield Himalayan", pricePerDay: 35 },
            { vehicleType: "Car", name: "Toyota Fortuner 4x4", pricePerDay: 100 }
        ]
    },
    {
        name: "Ladakh Heights",
        country: "India",
        image: "https://images.unsplash.com/photo-1581791538302-03537b9c97bf?w=800&q=80",
        rating: 4.9,
        reviews: 4500,
        price: 800,
        category: "Adventure",
        tags: ["Lakes", "Passes", "Biking"],
        bestTime: "May - Sep",
        flightTime: "1.5h",
        description: "Dramatic landscapes and crystal clear lakes under a deep blue sky in the Himalayas.",
        natureFocus: true,
        coordinates: { lat: 34.1526, lng: 77.5770 },
        accommodations: [
            { name: "The Grand Dragon Ladakh", type: "Hotel", pricePerNight: 200, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" },
            { name: "Nubra Organic Retreat", type: "Resort", pricePerNight: 150, image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Bike", name: "KTM Adventure 390", pricePerDay: 40 },
            { vehicleType: "Car", name: "Mahindra Scorpio 4x4", pricePerDay: 70 }
        ]
    },
    {
        name: "Machu Picchu",
        country: "Peru",
        image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80",
        rating: 5.0,
        reviews: 12000,
        price: 2500,
        category: "Adventure",
        tags: ["Inca Trail", "Trekking", "History"],
        bestTime: "May - Oct",
        flightTime: "24h",
        description: "The lost city of the Incas, hidden high in the Andes mountains — a trekker's dream.",
        natureFocus: true,
        coordinates: { lat: -13.1631, lng: -72.5450 },
        accommodations: [
            { name: "Belmond Sanctuary Lodge", type: "Resort", pricePerNight: 1500, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "Aguas Calientes Boutique", type: "Hotel", pricePerNight: 250, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Toyota Hilux 4x4", pricePerDay: 120 }
        ]
    },
    {
        name: "Great Barrier Reef",
        country: "Australia",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
        rating: 4.8,
        reviews: 7400,
        price: 2800,
        category: "Adventure",
        tags: ["Diving", "Coral", "Marine Life"],
        bestTime: "Jun - Oct",
        flightTime: "20h",
        description: "The world's largest coral reef system — a paradise for divers and ocean explorers.",
        natureFocus: true,
        coordinates: { lat: -18.2871, lng: 147.6992 },
        accommodations: [
            { name: "Qualia Hamilton Island", type: "Resort", pricePerNight: 1200, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "Reef View Hotel", type: "Hotel", pricePerNight: 400, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Bike", name: "Island Beach Cruiser", pricePerDay: 30 }
        ]
    },
    {
        name: "Patagonia Glaciers",
        country: "Argentina",
        image: "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800&q=80",
        rating: 4.9,
        reviews: 3600,
        price: 3000,
        category: "Adventure",
        tags: ["Glaciers", "Trekking", "Wilderness"],
        bestTime: "Oct - Mar",
        flightTime: "30h",
        description: "Jagged peaks, ancient glaciers, and endless windswept steppe at the end of the world.",
        natureFocus: true,
        coordinates: { lat: -50.3400, lng: -72.2648 },
        accommodations: [
            { name: "Explora Patagonia", type: "Resort", pricePerNight: 800, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" },
            { name: "EcoCamp Torres", type: "Hotel", pricePerNight: 350, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Toyota Hilux 4x4", pricePerDay: 150 }
        ]
    },
    {
        name: "Iceland Ring Road",
        country: "Iceland",
        image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80",
        rating: 4.9,
        reviews: 5800,
        price: 3200,
        category: "Adventure",
        tags: ["Northern Lights", "Geysers", "Road Trip"],
        bestTime: "Jun - Aug",
        flightTime: "14h",
        description: "Volcanoes, geysers, northern lights, and black sand beaches on a road trip of a lifetime.",
        natureFocus: true,
        coordinates: { lat: 64.9631, lng: -19.0208 },
        accommodations: [
            { name: "Ion Adventure Hotel", type: "Hotel", pricePerNight: 400, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "Reykjavik Cottage", type: "Villa", pricePerNight: 200, image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Land Cruiser 4x4", pricePerDay: 180 }
        ]
    },
    {
        name: "Kilimanjaro Summit",
        country: "Tanzania",
        image: "https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?w=800&q=80",
        rating: 5.0,
        reviews: 4100,
        price: 2400,
        category: "Adventure",
        tags: ["Summit", "Climbing", "Africa"],
        bestTime: "Jan - Mar",
        flightTime: "10h",
        description: "Africa's highest peak — a bucket-list climb through five distinct climate zones.",
        natureFocus: true,
        coordinates: { lat: -3.0674, lng: 37.3556 },
        accommodations: [
            { name: "Kilimanjaro Mountain Lodge", type: "Hotel", pricePerNight: 250, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "Base Camp Tents", type: "Hotel", pricePerNight: 80, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Land Rover Defender", pricePerDay: 120 }
        ]
    },

    // ── CULTURE (6 places) ──
    {
        name: "Varanasi Ghats",
        country: "India",
        image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80",
        rating: 4.8,
        reviews: 9500,
        price: 300,
        category: "Culture",
        tags: ["Spiritual", "Ancient", "Ganges"],
        bestTime: "Oct - Mar",
        flightTime: "2h",
        description: "One of the oldest living cities in the world, radiating spiritual energy along the holy Ganges.",
        natureFocus: false,
        coordinates: { lat: 25.3176, lng: 83.0061 },
        accommodations: [
            { name: "BrijRama Palace", type: "Hotel", pricePerNight: 350, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "Ganges View Stay", type: "Hotel", pricePerNight: 120, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Bike", name: "Royal Enfield Bullet", pricePerDay: 15 },
            { vehicleType: "Scooter", name: "Honda Activa", pricePerDay: 8 }
        ]
    },
    {
        name: "Kyoto Arashiyama",
        country: "Japan",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
        rating: 4.9,
        reviews: 5400,
        price: 1900,
        category: "Culture",
        tags: ["Zen", "Temples", "Gardens"],
        bestTime: "Apr - May",
        flightTime: "13h",
        description: "A transcendental experience walking through bamboo groves and ancient shrines.",
        natureFocus: true,
        coordinates: { lat: 35.0094, lng: 135.6667 },
        accommodations: [
            { name: "Hoshinoya Kyoto", type: "Resort", pricePerNight: 900, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" },
            { name: "Traditional Ryokan", type: "Villa", pricePerNight: 350, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Bike", name: "City Cruiser", pricePerDay: 15 }
        ]
    },
    {
        name: "Petra Rose City",
        country: "Jordan",
        image: "https://images.unsplash.com/photo-1579606032821-4e6161c81571?w=800&q=80",
        rating: 4.9,
        reviews: 8200,
        price: 1200,
        category: "Culture",
        tags: ["Ancient", "UNESCO", "Desert"],
        bestTime: "Mar - May",
        flightTime: "6h",
        description: "Ancient Nabataean city carved into rose-red cliffs — one of the New Seven Wonders.",
        natureFocus: false,
        coordinates: { lat: 30.3285, lng: 35.4444 },
        accommodations: [
            { name: "Movenpick Resort Petra", type: "Resort", pricePerNight: 250, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "Petra Guest House", type: "Hotel", pricePerNight: 100, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Toyota Prado 4x4", pricePerDay: 80 }
        ]
    },
    {
        name: "Angkor Wat",
        country: "Cambodia",
        image: "https://images.unsplash.com/photo-1600100397608-93461ed2bd4d?w=800&q=80",
        rating: 4.9,
        reviews: 11000,
        price: 600,
        category: "Culture",
        tags: ["Temples", "Khmer", "UNESCO"],
        bestTime: "Nov - Feb",
        flightTime: "7h",
        description: "The world's largest religious monument — a sprawling Khmer temple complex at sunrise.",
        natureFocus: false,
        coordinates: { lat: 13.4125, lng: 103.8670 },
        accommodations: [
            { name: "Raffles Grand Hotel d'Angkor", type: "Hotel", pricePerNight: 400, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "Siem Reap Boutique", type: "Hotel", pricePerNight: 60, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Scooter", name: "Honda Dream", pricePerDay: 8 },
            { vehicleType: "Bike", name: "Temple Cruiser", pricePerDay: 5 }
        ]
    },
    {
        name: "Marrakech Medina",
        country: "Morocco",
        image: "https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=800&q=80",
        rating: 4.7,
        reviews: 7800,
        price: 850,
        category: "Culture",
        tags: ["Souks", "Spices", "Exotic"],
        bestTime: "Mar - May",
        flightTime: "12h",
        description: "Vibrant souks, ornate palaces, aromatic spice markets, and the call to prayer at dusk.",
        natureFocus: false,
        coordinates: { lat: 31.6295, lng: -7.9811 },
        accommodations: [
            { name: "La Mamounia", type: "Resort", pricePerNight: 600, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "Riad Yasmine", type: "Hotel", pricePerNight: 80, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Dacia Duster", pricePerDay: 30 }
        ]
    },
    {
        name: "Rome Colosseum",
        country: "Italy",
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
        rating: 4.8,
        reviews: 20000,
        price: 1600,
        category: "Culture",
        tags: ["Roman Empire", "Art", "History"],
        bestTime: "Apr - Jun",
        flightTime: "9h",
        description: "The Eternal City — walk through gladiatorial arenas, Renaissance art, and ancient ruins.",
        natureFocus: false,
        coordinates: { lat: 41.8902, lng: 12.4922 },
        accommodations: [
            { name: "Hotel Hassler Roma", type: "Hotel", pricePerNight: 800, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80" },
            { name: "Trastevere Apartment", type: "Villa", pricePerNight: 150, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Scooter", name: "Vespa Primavera", pricePerDay: 40 },
            { vehicleType: "Bike", name: "City E-Bike", pricePerDay: 15 }
        ]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        await Destination.deleteMany({});
        console.log('Cleared existing destinations.');

        await Destination.insertMany(sampleDestinations);
        console.log('Added sample nature destinations!');

        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
