require('dotenv').config({ path: './backend/.env' });
const { db } = require('./firebase');

const destinations = [
    // ── BEACH (7 places) ──
    {
        name: 'Maldives Atolls',
        country: 'Maldives',
        category: 'Beach',
        price: 350000,
        rating: 5.0,
        reviews: 2100,
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
        description: 'Crystal clear lagoons and overwater villas that define pure tropical serenity.',
        tags: ['Tropical', 'Crystal Clear', 'Relaxation'],
        bestTime: 'Nov - Apr',
        flightTime: '4h (from DXB)',
        natureFocus: true,
        coordinates: { lat: 3.2028, lng: 73.2207 }
    },
    {
        name: 'Goa Sands',
        country: 'India',
        category: 'Beach',
        price: 25000,
        rating: 4.7,
        reviews: 8500,
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
        description: 'Pristine beaches, vibrant nightlife, and a unique blend of Indian and Portuguese culture.',
        tags: ['Party', 'Coastal', 'Culture'],
        bestTime: 'Nov - Feb',
        flightTime: '2h (from BOM)',
        natureFocus: true,
        coordinates: { lat: 15.2993, lng: 74.1240 }
    },
    {
        name: 'Tulum Riviera',
        country: 'Mexico',
        category: 'Beach',
        price: 95000,
        rating: 4.7,
        reviews: 5800,
        image: 'https://images.unsplash.com/photo-1504730655501-24c39ac53f0e?w=800&q=80',
        description: 'Ancient Mayan ruins overlooking turquoise Caribbean waters and white sand beaches.',
        tags: ['History', 'Cenotes', 'Coastal'],
        bestTime: 'Nov - Apr',
        flightTime: '6h (from LAX)',
        natureFocus: true,
        coordinates: { lat: 20.2151, lng: -87.4297 }
    },
    {
        name: 'Bali Beaches',
        country: 'Indonesia',
        category: 'Beach',
        price: 55000,
        rating: 4.8,
        reviews: 11200,
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
        description: 'Stunning volcanic beaches, world-class surfing, and enchanting temple sunsets.',
        tags: ['Surfing', 'Temples', 'Tropical'],
        bestTime: 'Apr - Oct',
        flightTime: '5h (from SIN)',
        natureFocus: true,
        coordinates: { lat: -8.3405, lng: 115.0920 }
    },
    {
        name: 'Zanzibar Island',
        country: 'Tanzania',
        category: 'Beach',
        price: 78000,
        rating: 4.6,
        reviews: 3400,
        image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&q=80',
        description: 'Spice-scented island with powdery white sands and turquoise Indian Ocean waters.',
        tags: ['Spice Island', 'Snorkeling', 'Exotic'],
        bestTime: 'Jun - Oct',
        flightTime: '1h (from DAR)',
        natureFocus: true,
        coordinates: { lat: -6.1659, lng: 39.2026 }
    },
    {
        name: 'Phuket Paradise',
        country: 'Thailand',
        category: 'Beach',
        price: 42000,
        rating: 4.7,
        reviews: 14500,
        image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80',
        description: 'Thailand\'s largest island with dramatic limestone cliffs and warm Andaman Sea waters.',
        tags: ['Island Hopping', 'Nightlife', 'Thai Food'],
        bestTime: 'Nov - Mar',
        flightTime: '1.5h (from BKK)',
        natureFocus: true,
        coordinates: { lat: 7.8804, lng: 98.3923 }
    },
    {
        name: 'Seychelles Islands',
        country: 'Seychelles',
        category: 'Beach',
        price: 210000,
        rating: 4.9,
        reviews: 2800,
        image: 'https://images.unsplash.com/photo-1589979481223-deb893043163?w=800&q=80',
        description: 'Pristine granite boulder beaches surrounded by lush tropical jungle and rare wildlife.',
        tags: ['Exclusive', 'Wildlife', 'Paradise'],
        bestTime: 'Apr - May',
        flightTime: '4.5h (from DXB)',
        natureFocus: true,
        coordinates: { lat: -4.6796, lng: 55.4920 }
    },

    // ── CITY (6 places) ──
    {
        name: 'Tokyo Ginza',
        country: 'Japan',
        category: 'City',
        price: 120000,
        rating: 4.8,
        reviews: 9200,
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
        description: 'The pulse of high-tech living blended with ancient Japanese tradition and neon lights.',
        tags: ['Neon Lights', 'Foodie', 'Tech'],
        bestTime: 'Oct - Nov',
        flightTime: '14h (from DEL)',
        natureFocus: false,
        coordinates: { lat: 35.6722, lng: 139.7667 }
    },
    {
        name: 'New York City',
        country: 'USA',
        category: 'City',
        price: 185000,
        rating: 4.8,
        reviews: 22000,
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
        description: 'The city that never sleeps — iconic skyline, Broadway, Central Park, and world-class dining.',
        tags: ['Skyline', 'Broadway', 'Iconic'],
        bestTime: 'Sep - Nov',
        flightTime: '16h (from DEL)',
        natureFocus: false,
        coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    {
        name: 'Dubai Marina',
        country: 'UAE',
        category: 'City',
        price: 145000,
        rating: 4.7,
        reviews: 15800,
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
        description: 'Futuristic skyline rising from the desert with luxury shopping and world-record architecture.',
        tags: ['Futuristic', 'Shopping', 'Desert'],
        bestTime: 'Nov - Mar',
        flightTime: '4h (from BOM)',
        natureFocus: false,
        coordinates: { lat: 25.2048, lng: 55.2708 }
    },
    {
        name: 'London Westminster',
        country: 'United Kingdom',
        category: 'City',
        price: 160000,
        rating: 4.8,
        reviews: 18500,
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
        description: 'Royal palaces, world-class museums, West End theatre, and centuries of living history.',
        tags: ['Historic', 'Theatre', 'Royal'],
        bestTime: 'May - Sep',
        flightTime: '9h (from DEL)',
        natureFocus: false,
        coordinates: { lat: 51.5074, lng: -0.1278 }
    },
    {
        name: 'Singapore Marina Bay',
        country: 'Singapore',
        category: 'City',
        price: 130000,
        rating: 4.9,
        reviews: 12600,
        image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
        description: 'A garden city of the future — stunning skyline, hawker food, and lush green spaces.',
        tags: ['Garden City', 'Clean', 'Foodie'],
        bestTime: 'Feb - Apr',
        flightTime: '5.5h (from DEL)',
        natureFocus: false,
        coordinates: { lat: 1.2839, lng: 103.8607 }
    },
    {
        name: 'Barcelona Gothic Quarter',
        country: 'Spain',
        category: 'City',
        price: 95000,
        rating: 4.7,
        reviews: 14200,
        image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
        description: 'Gaudi\'s masterpieces, gothic lanes, tapas culture, and vibrant Mediterranean energy.',
        tags: ['Architecture', 'Tapas', 'Mediterranean'],
        bestTime: 'May - Jun',
        flightTime: '10h (from DEL)',
        natureFocus: false,
        coordinates: { lat: 41.3851, lng: 2.1734 }
    },

    // ── ROMANTIC (6 places) ──
    {
        name: 'Santorini Caldera',
        country: 'Greece',
        category: 'Romantic',
        price: 215000,
        rating: 4.9,
        reviews: 3200,
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
        description: 'Breathtaking white-washed buildings and sunsets overlooking the blue Aegean Sea.',
        tags: ['Sunset', 'Scenic', 'Architecture'],
        bestTime: 'May - Oct',
        flightTime: '10h (from DEL)',
        natureFocus: true,
        coordinates: { lat: 36.3932, lng: 25.4615 }
    },
    {
        name: 'Amalfi Coast',
        country: 'Italy',
        category: 'Romantic',
        price: 195000,
        rating: 4.8,
        reviews: 2800,
        image: 'https://images.unsplash.com/photo-1633321088355-d0f81137ca3b?w=800&q=80',
        description: 'Colorful villages perched on cliffs over the shimmering Mediterranean Sea.',
        tags: ['Coastal', 'Scenic', 'Italian'],
        bestTime: 'May - Sep',
        flightTime: '10h (from DEL)',
        natureFocus: true,
        coordinates: { lat: 40.6333, lng: 14.6033 }
    },
    {
        name: 'Paris City of Love',
        country: 'France',
        category: 'Romantic',
        price: 175000,
        rating: 4.9,
        reviews: 25000,
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
        description: 'The Eiffel Tower, candlelit bistros, Seine river cruises, and timeless charm.',
        tags: ['Eiffel Tower', 'Bistros', 'Art'],
        bestTime: 'Apr - Jun',
        flightTime: '9h (from DEL)',
        natureFocus: false,
        coordinates: { lat: 48.8566, lng: 2.3522 }
    },
    {
        name: 'Venice Canals',
        country: 'Italy',
        category: 'Romantic',
        price: 165000,
        rating: 4.8,
        reviews: 18000,
        image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80',
        description: 'Gondola rides through ancient canals, baroque architecture, and enchanting piazzas.',
        tags: ['Gondola', 'Historic', 'Canals'],
        bestTime: 'Sep - Nov',
        flightTime: '10h (from DEL)',
        natureFocus: false,
        coordinates: { lat: 45.4408, lng: 12.3155 }
    },
    {
        name: 'Udaipur Lake Palace',
        country: 'India',
        category: 'Romantic',
        price: 35000,
        rating: 4.9,
        reviews: 7600,
        image: 'https://images.unsplash.com/photo-1585128903994-9788298932a4?w=800&q=80',
        description: 'The Venice of the East — floating palaces, serene lakes, and royal Rajasthani charm.',
        tags: ['Palace', 'Lakes', 'Royal'],
        bestTime: 'Oct - Mar',
        flightTime: '1.5h (from DEL)',
        natureFocus: false,
        coordinates: { lat: 24.5854, lng: 73.7125 }
    },
    {
        name: 'Bruges Old Town',
        country: 'Belgium',
        category: 'Romantic',
        price: 88000,
        rating: 4.7,
        reviews: 5400,
        image: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=800&q=80',
        description: 'Medieval cobblestone streets, chocolateries, canal-side walks, and fairytale architecture.',
        tags: ['Medieval', 'Chocolate', 'Canals'],
        bestTime: 'Apr - Sep',
        flightTime: '10h (from DEL)',
        natureFocus: false,
        coordinates: { lat: 51.2093, lng: 3.2247 }
    },

    // ── LUXURY (6 places) ──
    {
        name: 'Bora Bora Lagoon',
        country: 'French Polynesia',
        category: 'Luxury',
        price: 450000,
        rating: 5.0,
        reviews: 4200,
        image: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=800&q=80',
        description: 'Overwater bungalows floating on a turquoise lagoon with a volcanic island backdrop.',
        tags: ['Overwater Villa', 'Exclusive', 'Lagoon'],
        bestTime: 'May - Oct',
        flightTime: '24h (from DEL)',
        natureFocus: true,
        coordinates: { lat: -16.5004, lng: -151.7415 }
    },
    {
        name: 'Monaco Riviera',
        country: 'Monaco',
        category: 'Luxury',
        price: 520000,
        rating: 4.9,
        reviews: 3800,
        image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80',
        description: 'Glamorous principality with superyachts, Monte Carlo casino, and Formula 1 heritage.',
        tags: ['Casino', 'Superyachts', 'Glamour'],
        bestTime: 'May - Sep',
        flightTime: '10h (from DEL)',
        natureFocus: false,
        coordinates: { lat: 43.7384, lng: 7.4246 }
    },
    {
        name: 'Swiss Alps Zermatt',
        country: 'Switzerland',
        category: 'Luxury',
        price: 380000,
        rating: 4.9,
        reviews: 6200,
        image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
        description: 'Iconic Matterhorn views, world-class skiing, and luxurious alpine chalets.',
        tags: ['Alps', 'Skiing', 'Chalets'],
        bestTime: 'Dec - Mar',
        flightTime: '9h (from DEL)',
        natureFocus: true,
        coordinates: { lat: 46.0207, lng: 7.7491 }
    },
    {
        name: 'Dubai Palm Jumeirah',
        country: 'UAE',
        category: 'Luxury',
        price: 290000,
        rating: 4.8,
        reviews: 9800,
        image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&q=80',
        description: 'Man-made island paradise with ultra-luxury resorts, private beaches, and fine dining.',
        tags: ['Ultra-Luxury', 'Private Beach', 'Fine Dining'],
        bestTime: 'Nov - Mar',
        flightTime: '4h (from BOM)',
        natureFocus: false,
        coordinates: { lat: 25.1124, lng: 55.1390 }
    },
    {
        name: 'Tuscany Villas',
        country: 'Italy',
        category: 'Luxury',
        price: 265000,
        rating: 4.8,
        reviews: 5600,
        image: 'https://images.unsplash.com/photo-1523528283115-9bf9b1699245?w=800&q=80',
        description: 'Rolling vineyards, Renaissance art, farm-to-table cuisine, and elegant countryside estates.',
        tags: ['Vineyards', 'Wine', 'Countryside'],
        bestTime: 'May - Oct',
        flightTime: '10h (from DEL)',
        natureFocus: true,
        coordinates: { lat: 43.7711, lng: 11.2486 }
    },
    {
        name: 'Maldives Private Island',
        country: 'Maldives',
        category: 'Luxury',
        price: 680000,
        rating: 5.0,
        reviews: 1500,
        image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80',
        description: 'Your own private island with butler service, underwater dining, and infinite ocean views.',
        tags: ['Private Island', 'Butler Service', 'Underwater Dining'],
        bestTime: 'Nov - Apr',
        flightTime: '4h (from DXB)',
        natureFocus: true,
        coordinates: { lat: 4.1755, lng: 73.5093 }
    },

    // ── ADVENTURE (7 places) ──
    {
        name: 'Spiti Valley',
        country: 'India',
        category: 'Adventure',
        price: 28000,
        rating: 5.0,
        reviews: 1200,
        image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&q=80',
        description: 'A cold desert mountain valley high in the Himalayas with moon-like landscapes.',
        tags: ['High Altitude', 'Remote', 'Monasteries'],
        bestTime: 'Jun - Sep',
        flightTime: '12h (Road)',
        natureFocus: true,
        coordinates: { lat: 32.2461, lng: 78.0349 }
    },
    {
        name: 'Ladakh Heights',
        country: 'India',
        category: 'Adventure',
        price: 35000,
        rating: 4.9,
        reviews: 4500,
        image: 'https://images.unsplash.com/photo-1581791538302-03537b9c97bf?w=800&q=80',
        description: 'Dramatic landscapes and crystal clear lakes under a deep blue sky in the Himalayas.',
        tags: ['Lakes', 'Passes', 'Biking'],
        bestTime: 'May - Sep',
        flightTime: '1.5h (from DEL)',
        natureFocus: true,
        coordinates: { lat: 34.1526, lng: 77.5770 }
    },
    {
        name: 'Machu Picchu',
        country: 'Peru',
        category: 'Adventure',
        price: 165000,
        rating: 5.0,
        reviews: 12000,
        image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80',
        description: 'The lost city of the Incas, hidden high in the Andes mountains — a trekker\'s dream.',
        tags: ['Inca Trail', 'Trekking', 'History'],
        bestTime: 'May - Oct',
        flightTime: '24h (from DEL)',
        natureFocus: true,
        coordinates: { lat: -13.1631, lng: -72.5450 }
    },
    {
        name: 'Great Barrier Reef',
        country: 'Australia',
        category: 'Adventure',
        price: 195000,
        rating: 4.8,
        reviews: 7400,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
        description: 'The world\'s largest coral reef system — a paradise for divers and ocean explorers.',
        tags: ['Diving', 'Coral', 'Marine Life'],
        bestTime: 'Jun - Oct',
        flightTime: '20h (from DEL)',
        natureFocus: true,
        coordinates: { lat: -18.2871, lng: 147.6992 }
    },
    {
        name: 'Patagonia Glaciers',
        country: 'Argentina',
        category: 'Adventure',
        price: 225000,
        rating: 4.9,
        reviews: 3600,
        image: 'https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800&q=80',
        description: 'Jagged peaks, ancient glaciers, and endless windswept steppe at the end of the world.',
        tags: ['Glaciers', 'Trekking', 'Wilderness'],
        bestTime: 'Oct - Mar',
        flightTime: '30h (from DEL)',
        natureFocus: true,
        coordinates: { lat: -50.3400, lng: -72.2648 }
    },
    {
        name: 'Iceland Ring Road',
        country: 'Iceland',
        category: 'Adventure',
        price: 245000,
        rating: 4.9,
        reviews: 5800,
        image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80',
        description: 'Volcanoes, geysers, northern lights, and black sand beaches on a road trip of a lifetime.',
        tags: ['Northern Lights', 'Geysers', 'Road Trip'],
        bestTime: 'Jun - Aug',
        flightTime: '14h (from DEL)',
        natureFocus: true,
        coordinates: { lat: 64.9631, lng: -19.0208 }
    },
    {
        name: 'Kilimanjaro Summit',
        country: 'Tanzania',
        category: 'Adventure',
        price: 185000,
        rating: 5.0,
        reviews: 4100,
        image: 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?w=800&q=80',
        description: 'Africa\'s highest peak — a bucket-list climb through five distinct climate zones.',
        tags: ['Summit', 'Climbing', 'Africa'],
        bestTime: 'Jan - Mar',
        flightTime: '10h (from DEL)',
        natureFocus: true,
        coordinates: { lat: -3.0674, lng: 37.3556 }
    },

    // ── CULTURE (6 places) ──
    {
        name: 'Varanasi Ghats',
        country: 'India',
        category: 'Culture',
        price: 12000,
        rating: 4.8,
        reviews: 9500,
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
        description: 'One of the oldest living cities in the world, radiating spiritual energy along the holy Ganges.',
        tags: ['Spiritual', 'Ancient', 'Ganges'],
        bestTime: 'Oct - Mar',
        flightTime: '2h (from DEL)',
        natureFocus: false,
        coordinates: { lat: 25.3176, lng: 83.0061 }
    },
    {
        name: 'Kyoto Arashiyama',
        country: 'Japan',
        category: 'Culture',
        price: 125000,
        rating: 4.9,
        reviews: 5400,
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
        description: 'A transcendental experience walking through bamboo groves and ancient shrines.',
        tags: ['Zen', 'Temples', 'Gardens'],
        bestTime: 'Apr - May',
        flightTime: '13h (from DEL)',
        natureFocus: true,
        coordinates: { lat: 35.0094, lng: 135.6667 }
    },
    {
        name: 'Petra Rose City',
        country: 'Jordan',
        category: 'Culture',
        price: 85000,
        rating: 4.9,
        reviews: 8200,
        image: 'https://images.unsplash.com/photo-1579606032821-4e6161c81571?w=800&q=80',
        description: 'Ancient Nabataean city carved into rose-red cliffs — one of the New Seven Wonders.',
        tags: ['Ancient', 'UNESCO', 'Desert'],
        bestTime: 'Mar - May',
        flightTime: '6h (from DEL)',
        natureFocus: false,
        coordinates: { lat: 30.3285, lng: 35.4444 }
    },
    {
        name: 'Angkor Wat',
        country: 'Cambodia',
        category: 'Culture',
        price: 45000,
        rating: 4.9,
        reviews: 11000,
        image: 'https://images.unsplash.com/photo-1600100397608-93461ed2bd4d?w=800&q=80',
        description: 'The world\'s largest religious monument — a sprawling Khmer temple complex at sunrise.',
        tags: ['Temples', 'Khmer', 'UNESCO'],
        bestTime: 'Nov - Feb',
        flightTime: '7h (from DEL)',
        natureFocus: false,
        coordinates: { lat: 13.4125, lng: 103.8670 }
    },
    {
        name: 'Marrakech Medina',
        country: 'Morocco',
        category: 'Culture',
        price: 55000,
        rating: 4.7,
        reviews: 7800,
        image: 'https://images.unsplash.com/photo-1597211833712-5e41faa202ea?w=800&q=80',
        description: 'Vibrant souks, ornate palaces, aromatic spice markets, and the call to prayer at dusk.',
        tags: ['Souks', 'Spices', 'Exotic'],
        bestTime: 'Mar - May',
        flightTime: '12h (from DEL)',
        natureFocus: false,
        coordinates: { lat: 31.6295, lng: -7.9811 }
    },
    {
        name: 'Rome Colosseum',
        country: 'Italy',
        category: 'Culture',
        price: 110000,
        rating: 4.8,
        reviews: 20000,
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
        description: 'The Eternal City — walk through gladiatorial arenas, Renaissance art, and ancient ruins.',
        tags: ['Roman Empire', 'Art', 'History'],
        bestTime: 'Apr - Jun',
        flightTime: '9h (from DEL)',
        natureFocus: false,
        coordinates: { lat: 41.8902, lng: 12.4922 }
    }
];

const wildlife = [
    {
        name: 'Snow Leopard',
        scientificName: 'Panthera uncia',
        type: 'Fauna',
        species: 'Mammal',
        image: 'https://images.unsplash.com/photo-1551085254-e96b210db58a?w=800&q=80',
        description: 'The ghost of the mountains, rarely seen and endlessly mystifying.',
        habitat: ['Mountain', 'Alpine'],
        foundIn: ['India', 'Nepal', 'Bhutan'],
        conservationStatus: 'Vulnerable',
        isEndangered: true,
        funFact: 'A snow leopard cannot roar — it makes a unique sound called a "chuff".',
        bestSpottingTime: 'Feb – Apr',
        tags: ['Apex Predator', 'Himalayan', 'Elusive'],
        sightings: 312,
    },
    {
        name: 'Bengal Tiger',
        scientificName: 'Panthera tigris tigris',
        type: 'Fauna',
        species: 'Mammal',
        image: 'https://images.unsplash.com/photo-1615457015775-60ed4b5d3be1?w=800&q=80',
        description: "India's national animal and a keystone species.",
        habitat: ['Forest', 'Mangrove', 'Grassland'],
        foundIn: ['India', 'Bangladesh'],
        conservationStatus: 'Endangered',
        isEndangered: true,
        funFact: "Each tiger's stripe pattern is unique, like a human fingerprint.",
        bestSpottingTime: 'Mar – Jun',
        tags: ['Apex Predator', 'Iconic', 'Jungle'],
        sightings: 879,
    },
    {
        name: 'Japanese Macaque',
        scientificName: 'Macaca fuscata',
        type: 'Fauna',
        species: 'Primate',
        image: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=800&q=80',
        description: "Famous for bathing in hot springs during winter.",
        habitat: ['Forest', 'Mountain', 'Hot Spring'],
        foundIn: ['Japan'],
        conservationStatus: 'Least Concern',
        isEndangered: false,
        funFact: 'These monkeys learn new behaviours socially and pass them down generations.',
        bestSpottingTime: 'Dec – Mar',
        tags: ['Primate', 'Japan', 'Onsen'],
        sightings: 1540,
    },
    {
        name: 'Manta Ray',
        scientificName: 'Mobula alfredi',
        type: 'Fauna',
        species: 'Marine',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
        description: 'Graceful giants of the ocean, with wingspans reaching 7 metres.',
        habitat: ['Ocean', 'Coral Reef', 'Lagoon'],
        foundIn: ['Maldives', 'Australia'],
        conservationStatus: 'Vulnerable',
        isEndangered: true,
        funFact: 'Manta rays have the largest brain-to-body ratio of any fish on Earth.',
        bestSpottingTime: 'May – Nov',
        tags: ['Marine', 'Dive', 'Gentle Giant'],
        sightings: 986,
    },
    {
        name: 'Cherry Blossom',
        scientificName: 'Prunus serrulata',
        type: 'Flora',
        species: 'Tree',
        image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&q=80',
        description: "Japan's most iconic bloom. A symbol of the transient beauty of life.",
        habitat: ['Temperate Forest', 'Urban Park'],
        foundIn: ['Japan'],
        conservationStatus: 'Least Concern',
        isEndangered: false,
        funFact: 'Hanami (flower viewing) has been practiced in Japan for over 1,000 years.',
        bestSpottingTime: 'Mar – May',
        tags: ['Sakura', 'Japan', 'Spring', 'Iconic'],
        sightings: 8870,
    }
];

const tribePosts = [
    {
        authorName: "Ariana Kwesi",
        authorAvatar: "https://i.pravatar.cc/150?img=47",
        destination: "Spiti Valley",
        country: "India",
        image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&q=80",
        title: "The Moon on Earth — My Spiti Pilgrimage",
        story: "Seven days at 14,000 feet. No WiFi. Just the sound of ancient monasteries humming in the wind.",
        tags: ["High Altitude", "Spiritual", "Offbeat"],
        likes: 342,
        comments: 48,
        category: "Adventure",
        isEcoCertified: true,
        travelStyle: "Solo",
        rating: 5.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        authorName: "Luca Fontana",
        authorAvatar: "https://i.pravatar.cc/150?img=12",
        destination: "Amalfi Coast",
        country: "Italy",
        image: "https://images.unsplash.com/photo-1633321088355-d0f81137ca3b?w=800&q=80",
        title: "Lemons, Sea, and Slow Time",
        story: "We drove a Vespa along the cliffside roads at golden hour. Every turn revealed a colour more vivid than the last.",
        tags: ["Scenic", "Luxury", "Coastal"],
        likes: 518,
        comments: 63,
        category: "Romantic",
        isEcoCertified: false,
        travelStyle: "Couple",
        rating: 4.9,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        authorName: "Kai Tanaka",
        authorAvatar: "https://i.pravatar.cc/150?img=68",
        destination: "Kyoto Arashiyama",
        country: "Japan",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
        title: "Walking the Bamboo Silence",
        story: "I arrived at dawn before the crowds. The bamboo grove makes a sound unlike anything else on earth — a deep, whispering creak.",
        tags: ["Zen", "Temples", "Forest"],
        likes: 764,
        comments: 92,
        category: "Culture",
        isEcoCertified: true,
        travelStyle: "Solo",
        rating: 5.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

const notifications = [
    {
        title: "Eco-Trail Tip",
        message: "New nature trails have been added to your Santorini guide! Check them out now.",
        type: "info",
        isRead: false,
        createdAt: new Date().toISOString(),
    },
    {
        title: "Achievement Unlocked",
        message: "You've explored 5 different biomes this month. You're a true Earth Guardian!",
        type: "success",
        isRead: false,
        createdAt: new Date().toISOString(),
    },
    {
        title: "Weather Alert",
        message: "Upcoming rain in Munnar might affect trail accessibility. Plan accordingly.",
        type: "alert",
        isRead: false,
        createdAt: new Date().toISOString(),
    }
];

const seedData = async () => {
    try {
        console.log('Starting Master Firebase Seed...');

        // 1. Seed Destinations
        console.log('Seeding Destinations...');
        const destRef = db.collection('destinations');
        const destSnapshot = await destRef.get();
        const destBatch = db.batch();
        destSnapshot.docs.forEach(doc => destBatch.delete(doc.ref));
        await destBatch.commit();

        const destInsertBatch = db.batch();
        destinations.forEach(dest => {
            const ref = destRef.doc();
            destInsertBatch.set(ref, dest);
        });
        await destInsertBatch.commit();
        console.log(`✅ ${destinations.length} Destinations seeded.`);

        // 2. Seed Wildlife
        console.log('Seeding Wildlife...');
        const wildRef = db.collection('wildlife');
        const wildSnapshot = await wildRef.get();
        const wildBatch = db.batch();
        wildSnapshot.docs.forEach(doc => wildBatch.delete(doc.ref));
        await wildBatch.commit();

        const wildInsertBatch = db.batch();
        wildlife.forEach(w => {
            const ref = wildRef.doc();
            wildInsertBatch.set(ref, w);
        });
        await wildInsertBatch.commit();
        console.log(`✅ ${wildlife.length} Wildlife entries seeded.`);

        // 3. Seed Tribe Posts
        console.log('Seeding Tribe Posts...');
        const tribeRef = db.collection('tribePosts');
        const tribeSnapshot = await tribeRef.get();
        const tribeBatch = db.batch();
        tribeSnapshot.docs.forEach(doc => tribeBatch.delete(doc.ref));
        await tribeBatch.commit();

        const tribeInsertBatch = db.batch();
        tribePosts.forEach(post => {
            const ref = tribeRef.doc();
            tribeInsertBatch.set(ref, post);
        });
        await tribeInsertBatch.commit();
        console.log(`✅ ${tribePosts.length} Tribe posts seeded.`);

        // 4. Seed Notifications
        console.log('Seeding Notifications...');
        const notifRef = db.collection('notifications');
        const notifSnapshot = await notifRef.get();
        const notifBatch = db.batch();
        notifSnapshot.docs.forEach(doc => notifBatch.delete(doc.ref));
        await notifBatch.commit();

        const notifInsertBatch = db.batch();
        notifications.forEach(n => {
            const ref = notifRef.doc();
            notifInsertBatch.set(ref, n);
        });
        await notifInsertBatch.commit();
        console.log(`✅ ${notifications.length} Notifications seeded.`);

        console.log('Master Firebase Seed Completed Successfully! 🚀');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during master seed:', error);
        process.exit(1);
    }
};

seedData();
