require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('./models/Destination');

const sampleDestinations = [
    {
        name: "Olympic Forest",
        country: "USA",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
        rating: 4.9,
        reviews: 1240,
        price: 850,
        category: "Nature",
        tags: ["Forest", "Quiet", "Hiking"],
        bestTime: "Jun - Sep",
        flightTime: "5h",
        description: "Majestic moss-covered trees and misty trails in the heart of Washington state.",
        natureFocus: true,
        coordinates: { lat: 47.9691, lng: -123.4981 },
        accommodations: [
            { name: "Cedar Creek Lodge", type: "Resort", pricePerNight: 250, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" },
            { name: "Mossy River Cabin", type: "Villa", pricePerNight: 180, image: "https://images.unsplash.com/photo-1464146072230-91cabc9fa7c0?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Subaru Outback AWD", pricePerDay: 75 },
            { vehicleType: "Bike", name: "Mountain Trail Bike", pricePerDay: 35 }
        ]
    },
    {
        name: "Maldives Atolls",
        country: "Maldives",
        image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
        rating: 5.0,
        reviews: 850,
        price: 2500,
        category: "Beach",
        tags: ["Luxury", "Crystal Clear", "Relaxation"],
        bestTime: "Nov - Apr",
        flightTime: "11h",
        description: "Turquoise lagoons and overwater villas that define pure serenity.",
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
        name: "Tokyo Ginza",
        country: "Japan",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
        rating: 4.8,
        reviews: 3200,
        price: 1800,
        category: "City",
        tags: ["Culture", "Neon Lights", "Foodie"],
        bestTime: "Oct - Nov",
        flightTime: "14h",
        description: "The pulsar of high-tech living blended with ancient Japanese tradition.",
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
        name: "Santorini Mist",
        country: "Greece",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
        rating: 4.9,
        reviews: 2100,
        price: 2200,
        category: "Romantic",
        tags: ["Scenic", "Architecture", "Sunset"],
        bestTime: "May - Oct",
        flightTime: "10h",
        description: "Breathtaking white-washed buildings overlooking the blue Aegean Sea.",
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
        name: "Kashmir Valley",
        country: "India",
        image: "https://images.unsplash.com/photo-1566833917812-70678b4791ea?w=800&q=80",
        rating: 5.0,
        reviews: 2800,
        price: 550,
        category: "Nature",
        tags: ["Mountains", "Serene", "Paradise"],
        bestTime: "Mar - Oct",
        flightTime: "3h",
        description: "The 'Heaven on Earth' with breathtaking landscapes, Dal Lake, and snow-capped peaks.",
        natureFocus: true,
        coordinates: { lat: 34.0837, lng: 74.7973 },
        accommodations: [
            { name: "The Khyber Himalayan Resort", type: "Resort", pricePerNight: 280, image: "https://images.unsplash.com/photo-1445013115711-d138677c77f0?w=400&q=80" },
            { name: "Dal Lake Houseboat", type: "Villa", pricePerNight: 120, image: "https://images.unsplash.com/photo-1598301257982-0cf014dabbcd?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Mahindra Scorpio 4x4", pricePerDay: 60 },
            { vehicleType: "Bike", name: "Royal Enfield Himalayan", pricePerDay: 45 }
        ]
    },
    {
        name: "Kerala Backwaters",
        country: "India",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
        rating: 4.9,
        reviews: 4200,
        price: 600,
        category: "Nature",
        tags: ["Backwaters", "Relaxation", "Greenery"],
        bestTime: "Sep - Mar",
        flightTime: "4h",
        description: "A tranquil journey through a network of canals, rivers, and lakes in 'God's Own Country'.",
        natureFocus: true,
        coordinates: { lat: 9.4981, lng: 76.3329 },
        accommodations: [
            { name: "Kumarakom Lake Resort", type: "Resort", pricePerNight: 320, image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&q=80" },
            { name: "Emerald Alleppey Houseboat", type: "Villa", pricePerNight: 180, image: "https://images.unsplash.com/photo-1593693411515-c202e974fe00?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Toyota Innova Crysta", pricePerDay: 55 },
            { vehicleType: "Bike", name: "Hero Xpulse 200", pricePerDay: 25 }
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
        tags: ["Beach", "Party", "Culture"],
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
        name: "Munnar Tea Gardens",
        country: "India",
        image: "https://images.unsplash.com/photo-1593693164020-2c1844b37a28?w=800&q=80",
        rating: 4.9,
        reviews: 4800,
        price: 350,
        category: "Nature",
        tags: ["Tea Gardens", "Greenery", "Serene"],
        bestTime: "Sep - Mar",
        flightTime: "4h",
        description: "Rolling hills covered in vibrant green tea plantations, a paradise for nature lovers.",
        natureFocus: true,
        coordinates: { lat: 10.0889, lng: 77.0595 },
        accommodations: [
            { name: "Tea County Munnar", type: "Hotel", pricePerNight: 150, image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=400&q=80" },
            { name: "Mountain View Cottage", type: "Villa", pricePerNight: 110, image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Bike", name: "Royal Enfield Classic 350", pricePerDay: 20 },
            { vehicleType: "Car", name: "Maruti Swift", pricePerDay: 30 }
        ]
    },
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
        description: "A cold desert mountain valley high in the Himalayas, known for its moon-like landscapes.",
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
        tags: ["Lakes", "Passes", "Spirituality"],
        bestTime: "May - Sep",
        flightTime: "1.5h",
        description: "Dramatic landscapes and crystal clear lakes under a deep blue sky.",
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
        name: "Amalfi Coast",
        country: "Italy",
        image: "https://images.unsplash.com/photo-1633321088355-d0f81137ca3b?w=800&q=80",
        rating: 4.8,
        reviews: 2800,
        price: 3200,
        category: "Romantic",
        tags: ["Luxury", "Coastal", "Scenic"],
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
        name: "Banff National Park",
        country: "Canada",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
        rating: 5.0,
        reviews: 8200,
        price: 2100,
        category: "Nature",
        tags: ["Mountains", "Lakes", "Wilderness"],
        bestTime: "Jun - Aug",
        flightTime: "12h",
        description: "Breathtaking turquoise lakes surrounded by the majestic Canadian Rockies.",
        natureFocus: true,
        coordinates: { lat: 51.4968, lng: -115.9281 },
        accommodations: [
            { name: "Fairmont Banff Springs", type: "Resort", pricePerNight: 650, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" },
            { name: "Moraine Lake Lodge", type: "Hotel", pricePerNight: 500, image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Ford Explorer 4x4", pricePerDay: 110 },
            { vehicleType: "Bike", name: "Giant Mountain Bike", pricePerDay: 40 }
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
            { name: " التقليدية Ryokan", type: "Villa", pricePerNight: 350, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Bike", name: "City Cruiser", pricePerDay: 15 }
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
        tags: ["Inca", "History", "Trekking"],
        bestTime: "May - Oct",
        flightTime: "24h",
        description: "The lost city of the Incas, hidden high in the Andes mountains.",
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
        name: "Serengeti Safari",
        country: "Tanzania",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
        rating: 4.9,
        reviews: 3200,
        price: 3500,
        category: "Nature",
        tags: ["Wildlife", "Safari", "Savannah"],
        bestTime: "Jun - Oct",
        flightTime: "18h",
        description: "Witness the Great Migration and the majestic wildlife of the African savannah.",
        natureFocus: true,
        coordinates: { lat: -2.3333, lng: 34.8333 },
        accommodations: [
            { name: "Four Seasons Safari Lodge", type: "Resort", pricePerNight: 1800, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80" },
            { name: "Serengeti Tented Camp", type: "Villa", pricePerNight: 800, image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=400&q=80" }
        ],
        rentals: [
            { vehicleType: "Car", name: "Land Rover Defender 4x4", pricePerDay: 200 }
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
        description: "The world's largest coral reef system, a paradise for divers and ocean lovers.",
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
        name: "Tulum Ruins",
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
