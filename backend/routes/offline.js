const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getLanguagesForCountry(country) {
    const map = {
        'India': ['Hindi', 'English'],
        'Nepal': ['Nepali', 'English'],
        'Brazil': ['Portuguese', 'English'],
        'Peru': ['Spanish', 'English'],
        'Bolivia': ['Spanish', 'English'],
        'Colombia': ['Spanish', 'English'],
        'Chile': ['Spanish', 'English'],
        'Argentina': ['Spanish', 'English'],
        'Ecuador': ['Spanish', 'English'],
        'Tanzania': ['Swahili', 'English'],
        'Kenya': ['Swahili', 'English'],
        'Uganda': ['Swahili', 'English'],
        'Indonesia': ['Indonesian', 'English'],
        'Costa Rica': ['Spanish', 'English'],
        'Norway': ['Norwegian', 'English'],
        'Iceland': ['Icelandic', 'English'],
        'Canada': ['English', 'French'],
        'USA': ['English'],
        'Australia': ['English'],
        'New Zealand': ['English'],
        'China': ['Mandarin', 'English'],
        'Japan': ['Japanese', 'English'],
        'Thailand': ['Thai', 'English'],
        'Myanmar': ['Burmese', 'English'],
        'Pakistan': ['Urdu', 'English'],
        'Bhutan': ['Dzongkha', 'English'],
    };
    return map[country] || ['English'];
}

function getEmergencyContacts(country) {
    const map = {
        'India': [
            { name: 'Mountain Rescue India', number: '1800-180-1000', type: 'rescue', note: 'Toll free, 24/7' },
            { name: 'National Emergency', number: '112', type: 'police', note: 'All-in-one emergency' },
            { name: 'Ambulance (CATS)', number: '108', type: 'medical', note: 'Free ambulance service' },
            { name: 'Fire & Rescue', number: '101', type: 'fire', note: 'State fire department' },
            { name: 'Forest Dept Helpline', number: '1926', type: 'forest', note: 'Wildlife & poaching emergencies' },
            { name: 'Disaster Management', number: '1079', type: 'disaster', note: 'NDMA control room' },
        ],
        'Nepal': [
            { name: 'Nepal Police Emergency', number: '100', type: 'police', note: 'Nationwide' },
            { name: 'Tourist Police Kathmandu', number: '1144', type: 'police', note: 'English-speaking staff' },
            { name: 'Ambulance', number: '102', type: 'medical', note: 'Kathmandu valley' },
            { name: 'Nepal Red Cross', number: '+977-1-4270650', type: 'medical', note: 'Search and rescue' },
            { name: 'Himalayan Rescue Association', number: '+977-1-4440292', type: 'rescue', note: 'High-altitude rescue' },
        ],
        'Brazil': [
            { name: 'SAMU Ambulância', number: '192', type: 'medical', note: 'National ambulance' },
            { name: 'Bombeiros (Fire & Rescue)', number: '193', type: 'rescue', note: 'Fire and rescue' },
            { name: 'Polícia Militar', number: '190', type: 'police', note: 'Military police' },
            { name: 'Civil Defense', number: '199', type: 'disaster', note: 'Natural disasters' },
        ],
        'Peru': [
            { name: 'Emergency Services', number: '105', type: 'police', note: 'National police' },
            { name: 'Ambulance', number: '117', type: 'medical', note: 'SAMU Peru' },
            { name: 'SAR Peru (Mountain Rescue)', number: '+51-84-252974', type: 'rescue', note: 'Cusco region' },
        ],
        'Tanzania': [
            { name: 'Police Emergency', number: '112', type: 'police', note: 'Nationwide' },
            { name: 'Ambulance', number: '114', type: 'medical', note: 'Tanzania Red Cross +255-22-2150881' },
            { name: 'KINAPA (Kilimanjaro Parks)', number: '+255-27-2751616', type: 'forest', note: 'Kilimanjaro National Park' },
        ],
        'Kenya': [
            { name: 'Kenya Police Emergency', number: '999', type: 'police', note: 'Nationwide' },
            { name: 'Ambulance', number: '999', type: 'medical', note: 'Kenya Red Cross +254-20-3950000' },
            { name: 'Kenya Wildlife Service', number: '+254-20-2379407', type: 'forest', note: 'Wildlife emergencies' },
        ],
        'Indonesia': [
            { name: 'National Emergency', number: '112', type: 'police', note: 'All emergencies' },
            { name: 'SAR Indonesia (BASARNAS)', number: '115', type: 'rescue', note: 'Search and rescue' },
            { name: 'Ambulance', number: '118', type: 'medical', note: 'National ambulance' },
        ],
        'Norway': [
            { name: 'Main Emergency Number', number: '112', type: 'police', note: 'Police & all emergencies' },
            { name: 'Ambulance', number: '113', type: 'medical', note: 'Medical emergency' },
            { name: 'Mountain Rescue', number: '02800', type: 'rescue', note: 'Norwegian Air Ambulance' },
        ],
        'USA': [
            { name: 'Emergency Services', number: '911', type: 'rescue', note: 'Police / Fire / Medical' },
            { name: 'National Park Service', number: '1-888-653-0009', type: 'forest', note: 'Park emergencies' },
            { name: 'Search & Rescue', number: '911', type: 'rescue', note: 'County sheriff coordinates SAR' },
        ],
        'Canada': [
            { name: 'Emergency Services', number: '911', type: 'rescue', note: 'Police / Fire / Medical' },
            { name: 'Parks Canada Emergency', number: '1-877-852-3100', type: 'forest', note: 'National park rescue' },
        ],
        'Australia': [
            { name: 'Emergency Services', number: '000', type: 'rescue', note: 'Police / Fire / Ambulance' },
            { name: 'State Emergency Service', number: '132 500', type: 'disaster', note: 'Floods, storms' },
            { name: 'Parks Emergency', number: '1800 931 678', type: 'forest', note: 'National parks rescue line' },
        ],
        'New Zealand': [
            { name: 'Emergency Services', number: '111', type: 'rescue', note: 'Police / Fire / Ambulance' },
            { name: 'Land SAR NZ', number: '111', type: 'rescue', note: 'Mountain & wilderness rescue' },
        ],
    };
    return map[country] || [
        { name: 'International Emergency', number: '112', type: 'police', note: 'Works in most countries' },
        { name: 'SOS / Satellite', number: 'N/A', type: 'rescue', note: 'Use satellite communicator if available' },
    ];
}

function getFirstAidGuides(category) {
    const guides = [
        {
            id: 'altitude',
            title: 'Altitude Sickness (AMS)',
            severity: 'high',
            icon: 'Mountain',
            symptoms: ['Headache', 'Nausea / vomiting', 'Dizziness', 'Fatigue', 'Loss of appetite', 'Poor sleep'],
            steps: [
                'Stop ascending immediately — rest at current altitude',
                'Stay well-hydrated — drink 3–4L of water daily',
                'Take Ibuprofen 400mg for headache if available',
                'Descend 300–500m if symptoms persist beyond 24 hours',
                'Administer supplemental O₂ if available (2–4 L/min)',
                'Seek medical help for HACE symptoms: confusion, loss of balance, severe lethargy',
            ],
            prevention: 'Ascend no faster than 300m/day above 3,000m. Take one rest day every 3 days.',
        },
        {
            id: 'snakebite',
            title: 'Snake Bite',
            severity: 'critical',
            icon: 'AlertTriangle',
            symptoms: ['Two puncture wounds', 'Swelling and redness', 'Intense pain', 'Bruising / discoloration', 'Nausea and vomiting'],
            steps: [
                'Keep victim CALM and STILL — movement accelerates venom spread',
                'Immobilize the bitten limb BELOW heart level',
                'Remove watches, rings, tight clothing near the bite',
                'DO NOT: suck the venom, cut the wound, or apply a tourniquet',
                'Note the snake color/pattern from a safe distance (photo if possible)',
                'Carry/evacuate victim to a hospital within 2 hours for antivenom',
            ],
            prevention: 'Wear ankle-high boots. Use a trekking pole to probe ahead in brush. Avoid rocky crevices at night.',
        },
        {
            id: 'hypothermia',
            title: 'Hypothermia',
            severity: 'critical',
            icon: 'Thermometer',
            symptoms: ['Intense shivering (then stops in severe cases)', 'Confusion / slurred speech', 'Pale, cold, waxy skin', 'Loss of coordination', 'Slow pulse'],
            steps: [
                'Move victim out of wind, rain, and cold immediately',
                'Remove ALL wet clothing — replace with dry insulating layers',
                'Warm the CORE first (chest, neck, armpits, groin) — NOT the extremities',
                'Wrap in emergency foil blanket, sleeping bag, or body-to-body warmth',
                'Give warm (not hot) sweet drinks IF conscious and able to swallow',
                'Do NOT rub limbs vigorously — vasoconstriction damage',
                'Evacuate urgently — if shivering stops, condition is severe',
            ],
            prevention: 'Dress in moisture-wicking base layers. Cotton kills — avoid it. Eat high-calorie food on cold days.',
        },
        {
            id: 'dehydration',
            title: 'Severe Dehydration',
            severity: 'high',
            icon: 'Droplets',
            symptoms: ['Extreme thirst', 'Dark yellow / orange urine', 'Headache', 'Dry cracked lips', 'Confusion or dizziness'],
            steps: [
                'Stop activity immediately — move to shade and rest',
                'Drink 500ml water slowly over 20–30 minutes (not all at once)',
                'Add ORS (Oral Rehydration Salts) if available — mix with water',
                'Eat salty snacks if available to replace electrolytes',
                'Do NOT resume strenuous activity for at least 1 hour',
                'Evacuate if victim cannot keep fluids down after 30 minutes',
            ],
            prevention: 'Drink 500ml before starting. Drink 150–200ml every 20 minutes while trekking.',
        },
        {
            id: 'fracture',
            title: 'Fracture / Broken Bone',
            severity: 'high',
            icon: 'Bone',
            symptoms: ['Severe sharp pain at injury site', 'Visible swelling', 'Deformity or unnatural angle', 'Bruising', 'Inability to bear weight'],
            steps: [
                'Do NOT attempt to straighten or reset the bone',
                'Splint the limb as-is using trekking poles, sticks, or padded clothing',
                'Secure the splint above AND below the injured joint',
                'Apply a cloth-wrapped cold pack to reduce swelling',
                'Elevate the injured limb above heart level',
                'Do NOT allow victim to walk on a suspected leg fracture',
                'Organize evacuation — carry / stretcher the victim',
            ],
            prevention: 'Use trekking poles on descent. Move slowly on wet or rocky terrain. Wear rigid ankle-support boots.',
        },
        {
            id: 'heatstroke',
            title: 'Heat Stroke',
            severity: 'critical',
            icon: 'Sun',
            symptoms: ['Core temp above 40°C', 'Absence of sweating (classic type)', 'Severe confusion', 'Rapid strong pulse', 'Red hot dry skin', 'Loss of consciousness'],
            steps: [
                'CALL FOR EVACUATION IMMEDIATELY — life-threatening emergency',
                'Move victim to coolest available shade',
                'Remove outer clothing',
                'Cool rapidly: wet cloth on neck, armpits, and groin; fan aggressively',
                'Apply ice packs to neck, armpits, groin if available',
                'Do NOT give fluids if unconscious or confused',
                'Monitor every 5 minutes — can be fatal within 30 minutes if untreated',
            ],
            prevention: 'Avoid strenuous activity between 11am–3pm in summer. Wear a wide-brim hat. Drink proactively.',
        },
        {
            id: 'wildfire',
            title: 'Wildfire / Forest Fire',
            severity: 'critical',
            icon: 'Flame',
            symptoms: ['Visible smoke cloud', 'Orange sky / smell of burning', 'Wind direction shift toward you'],
            steps: [
                'Do NOT try to outrun a wildfire in the direction the wind is blowing',
                'Move PERPENDICULAR to the fire spread direction',
                'Head toward cleared terrain, bare rock, or water body',
                'Cover nose and mouth with a wet cloth to filter smoke',
                'If caught, lie face-down in the lowest point available and cover yourself',
                'Alert emergency services with your GPS location immediately',
            ],
            prevention: 'Check fire risk index before entering forest areas. Never light fires in dry periods. Have an escape route planned.',
        },
    ];

    if (category === 'Marine' || category === 'Coastal' || category === 'Island') {
        guides.push({
            id: 'drowning',
            title: 'Near-Drowning Rescue',
            severity: 'critical',
            icon: 'Waves',
            symptoms: ['Unconsciousness', 'Blue / purple lips and fingernails', 'Labored or absent breathing', 'Coughing up water'],
            steps: [
                'Do NOT jump in unless trained — use rope, branch, or floating object first',
                'Once out: lay victim on back on a hard flat surface',
                'Tilt head back and check for breathing (10 seconds)',
                'Begin CPR if no pulse: 30 chest compressions + 2 rescue breaths (cycle until EMS)',
                'Turn victim on their side if vomiting to prevent choking',
                'Seek hospital care even if victim recovers — secondary drowning risk (up to 24h later)',
            ],
            prevention: 'Never swim alone. Respect rip current advice. Wear life jacket on all water vessels.',
        });
    }

    return guides;
}

function getPhraseBook(languages) {
    const phraseSets = {
        'Hindi': [
            {
                category: 'Help!', phrases: [
                    { text: 'मुझे मदद चाहिए', phonetic: 'Mujhe madad chahiye', translation: 'I need help' },
                    { text: 'मैं खो गया हूं', phonetic: 'Main kho gaya hoon', translation: "I'm lost" },
                    { text: 'डॉक्टर बुलाओ', phonetic: 'Doctor bulao', translation: 'Call a doctor' },
                    { text: 'यह आपातकाल है', phonetic: 'Yeh aapatkaal hai', translation: 'This is an emergency' },
                    { text: 'पुलिस बुलाओ', phonetic: 'Police bulao', translation: 'Call the police' },
                ]
            },
            {
                category: 'Navigation', phrases: [
                    { text: 'सड़क कहाँ है?', phonetic: 'Sadak kahan hai?', translation: 'Where is the road?' },
                    { text: 'अस्पताल कितनी दूर है?', phonetic: 'Aspataal kitni dur hai?', translation: 'How far is the hospital?' },
                    { text: 'गाँव कहाँ है?', phonetic: 'Gaon kahan hai?', translation: 'Where is the village?' },
                    { text: 'मुझे यहाँ जाना है', phonetic: 'Mujhe yahan jana hai', translation: 'I need to go here' },
                ]
            },
            {
                category: 'Resources', phrases: [
                    { text: 'पानी मिलेगा?', phonetic: 'Paani milega?', translation: 'Can I get water?' },
                    { text: 'मुझे बहुत ठंड लग रही है', phonetic: 'Mujhe bahut thand lag rahi hai', translation: "I'm very cold" },
                    { text: 'मैं चोटिल हूं', phonetic: 'Main chhotil hoon', translation: 'I am injured' },
                    { text: 'कृपया फ़ोन करें', phonetic: 'Kripaya phone karein', translation: 'Please make a phone call' },
                ]
            },
        ],
        'Nepali': [
            {
                category: 'Help!', phrases: [
                    { text: 'मलाई मद्दत चाहियो', phonetic: 'Malai maddat chaaiyo', translation: 'I need help' },
                    { text: 'म हराएको छु', phonetic: 'Ma haraeko chhu', translation: "I'm lost" },
                    { text: 'डाक्टर बोलाउनुस्', phonetic: 'Daaktor bolaaunuhos', translation: 'Call a doctor' },
                    { text: 'खतरा छ', phonetic: 'Khatara chha', translation: 'There is danger' },
                ]
            },
            {
                category: 'Navigation', phrases: [
                    { text: 'बाटो कहाँ छ?', phonetic: 'Baato kahan chha?', translation: 'Where is the path?' },
                    { text: 'गाउँ कति टाढा छ?', phonetic: 'Gaun kati taadha chha?', translation: 'How far is the village?' },
                    { text: 'अस्पताल जानु छ', phonetic: 'Aspataal jaanu chha', translation: 'I need to go to hospital' },
                ]
            },
        ],
        'Spanish': [
            {
                category: 'Help!', phrases: [
                    { text: 'Necesito ayuda', phonetic: 'Ne-SES-ee-to ah-YOO-da', translation: 'I need help' },
                    { text: 'Estoy perdido/a', phonetic: 'Es-TOY per-DEE-do/da', translation: "I'm lost" },
                    { text: 'Llame a un médico', phonetic: 'YA-meh ah oon MED-ee-ko', translation: 'Call a doctor' },
                    { text: 'Es una emergencia', phonetic: 'Es oo-na eh-mer-HEN-sya', translation: 'This is an emergency' },
                    { text: 'Llame a la policía', phonetic: 'YA-meh ah la po-lee-SEE-ah', translation: 'Call the police' },
                ]
            },
            {
                category: 'Navigation', phrases: [
                    { text: '¿Dónde está el camino?', phonetic: 'DON-deh es-TA el ka-MEE-no', translation: 'Where is the path?' },
                    { text: '¿Cuánto falta para el pueblo?', phonetic: 'KWAN-to FAL-ta PA-ra el PWEH-blo', translation: 'How far to the village?' },
                    { text: 'Necesito ir al hospital', phonetic: 'Ne-SES-ee-to eer al os-pee-TAL', translation: 'I need to go to hospital' },
                ]
            },
            {
                category: 'Resources', phrases: [
                    { text: '¿Tiene agua?', phonetic: 'TYEH-neh AH-gwa', translation: 'Do you have water?' },
                    { text: 'Tengo frío', phonetic: 'TEN-go FREE-oh', translation: "I'm very cold" },
                    { text: 'Estoy herido/a', phonetic: 'Es-TOY eh-REE-do/da', translation: 'I am injured' },
                ]
            },
        ],
        'Swahili': [
            {
                category: 'Help!', phrases: [
                    { text: 'Ninahitaji msaada', phonetic: 'Nee-na-HEE-ta-jee mm-SA-da', translation: 'I need help' },
                    { text: 'Nimepotea', phonetic: 'Nee-meh-po-TEH-a', translation: "I'm lost" },
                    { text: 'Piga simu daktari', phonetic: 'PEE-ga SEE-moo dak-TA-ree', translation: 'Call a doctor' },
                    { text: 'Kuna hatari', phonetic: 'Koo-na ha-TA-ree', translation: 'There is danger' },
                ]
            },
            {
                category: 'Navigation', phrases: [
                    { text: 'Njia iko wapi?', phonetic: 'N-JEE-a EE-ko WA-pee', translation: 'Where is the path?' },
                    { text: 'Hospitali iko mbali?', phonetic: 'Hos-pee-TA-lee EE-ko m-BA-lee', translation: 'How far is the hospital?' },
                ]
            },
        ],
        'Portuguese': [
            {
                category: 'Help!', phrases: [
                    { text: 'Preciso de ajuda', phonetic: 'Pre-SEE-zo deh a-JU-da', translation: 'I need help' },
                    { text: 'Estou perdido/a', phonetic: 'Es-TOH per-JEE-do/da', translation: "I'm lost" },
                    { text: 'Chame um médico', phonetic: 'SHA-meh oom MED-ee-koo', translation: 'Call a doctor' },
                    { text: 'Ligue para a polícia', phonetic: 'LEE-geh PA-ra a po-LEE-sya', translation: 'Call the police' },
                ]
            },
        ],
        'Indonesian': [
            {
                category: 'Help!', phrases: [
                    { text: 'Tolong saya', phonetic: 'TO-long SA-ya', translation: 'Help me' },
                    { text: 'Saya tersesat', phonetic: 'SA-ya ter-SE-sat', translation: "I'm lost" },
                    { text: 'Panggil dokter', phonetic: 'PANG-geel DOK-ter', translation: 'Call a doctor' },
                    { text: 'Ada bahaya', phonetic: 'A-da ba-HA-ya', translation: 'There is danger' },
                ]
            },
            {
                category: 'Navigation', phrases: [
                    { text: 'Di mana jalannya?', phonetic: 'Dee MA-na ja-LAN-nya', translation: 'Where is the path?' },
                    { text: 'Rumah sakit di mana?', phonetic: 'Roo-MA sa-KIT dee MA-na', translation: 'Where is the hospital?' },
                ]
            },
        ],
    };

    const result = [];
    for (const lang of languages) {
        if (phraseSets[lang]) {
            result.push({ language: lang, sections: phraseSets[lang] });
        }
    }

    // Always have English as fallback
    if (!result.find(r => r.language === 'English')) {
        result.push({
            language: 'English', sections: [
                {
                    category: 'Universal Distress', phrases: [
                        { text: 'HELP!', phonetic: 'HELP', translation: 'Universal distress call' },
                        { text: 'SOS', phonetic: 'S-O-S', translation: 'International distress signal (3 short, 3 long, 3 short)' },
                        { text: 'EMERGENCY', phonetic: 'eh-MER-jen-see', translation: 'Emergency signal' },
                    ]
                }
            ]
        });
    }

    return result;
}

function buildDefaultOfflineSetting() {
    return {
        enabled: true,
        isPublic: true,
        packVersion: '1.2.0',
        packSizeMB: null,
    };
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// @route  GET /api/offline/destinations
// @desc   Get all destinations with offline pack metadata
router.get('/destinations', async (req, res) => {
    try {
        const [snapshot, settingsSnapshot] = await Promise.all([
            db.collection('destinations').get(),
            db.collection('offline_pack_settings').get(),
        ]);

        const settingsMap = {};
        settingsSnapshot.docs.forEach((doc) => {
            settingsMap[doc.id] = doc.data();
        });

        const destinations = snapshot.docs.map(doc => {
            const data = doc.data();
            const setting = { ...buildDefaultOfflineSetting(), ...(settingsMap[doc.id] || {}) };
            const seed = Math.abs((data.coordinates?.lat || 20) + (data.coordinates?.lng || 70));
            const defaultPackSizeMB = Math.round(80 + (seed % 120));
            const languages = getLanguagesForCountry(data.country);
            return {
                id: doc.id,
                name: data.name,
                country: data.country,
                category: data.category,
                image: data.image,
                coordinates: data.coordinates,
                packSizeMB: Number(setting.packSizeMB) || defaultPackSizeMB,
                packVersion: setting.packVersion || '1.2.0',
                languages,
                trailCount: Math.round(3 + (seed % 8)),
                speciesCount: Math.round(50 + (seed % 200)),
                emergencyContactsCount: getEmergencyContacts(data.country).length,
                firstAidGuideCount: getFirstAidGuides(data.category).length,
                access: {
                    enabled: setting.enabled !== false,
                    isPublic: setting.isPublic !== false,
                },
            };
        }).filter((dest) => dest.access.enabled && dest.access.isPublic);

        res.json(destinations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  GET /api/offline/pack/:destinationId
// @desc   Get the full offline survival pack data for a destination
router.get('/pack/:destinationId', async (req, res) => {
    try {
        const { destinationId } = req.params;
        const [doc, settingDoc] = await Promise.all([
            db.collection('destinations').doc(destinationId).get(),
            db.collection('offline_pack_settings').doc(destinationId).get(),
        ]);

        if (!doc.exists) {
            return res.status(404).json({ msg: 'Destination not found' });
        }

        const dest = { id: doc.id, ...doc.data() };
        const setting = { ...buildDefaultOfflineSetting(), ...(settingDoc.exists ? settingDoc.data() : {}) };

        if (setting.enabled === false || setting.isPublic === false) {
            return res.status(403).json({ msg: 'Offline pack access is restricted for this destination' });
        }

        const languages = getLanguagesForCountry(dest.country);

        const pack = {
            id: destinationId,
            name: dest.name,
            country: dest.country,
            category: dest.category,
            coordinates: dest.coordinates,
            packVersion: setting.packVersion || '1.2.0',
            generatedAt: new Date().toISOString(),
            emergencyContacts: getEmergencyContacts(dest.country),
            firstAid: getFirstAidGuides(dest.category),
            phrases: getPhraseBook(languages),
            languages,
            trailInfo: {
                name: dest.name,
                difficulty: dest.difficulty || 'Moderate',
                distanceKm: dest.distanceKm || 14,
                elevationGainM: dest.elevationGainM || 900,
                estimatedHours: dest.estimatedHours || 7,
                bestSeason: dest.bestSeason || 'October – April',
                warningZones: [
                    'Stay on marked trails after sunset',
                    'Carry minimum 2L of water per person',
                    'Check weather forecast before descent',
                    'Inform someone of your planned return time',
                    'Do not feed or approach wildlife',
                ],
            },
            sosConfig: {
                message: `🚨 SOS: Tourifyy traveler needs emergency assistance near ${dest.name}, ${dest.country}.`,
                coordinates: dest.coordinates,
                channels: [
                    { name: 'SMS Burst', description: 'Auto-sends GPS location to saved emergency contacts on any signal blip' },
                    { name: 'Satellite Messenger', description: 'Pair with Garmin inReach / SPOT via Bluetooth — works with zero cellular signal' },
                    { name: 'Emergency SOS via Satellite', description: 'Available on iPhone 14+ and Android devices with satellite capability' },
                ],
            },
        };

        res.json(pack);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
