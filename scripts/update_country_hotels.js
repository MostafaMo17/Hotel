const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../js/data.js');
const raw = fs.readFileSync(dataFile, 'utf8');

const jsonStr = raw.substring(raw.indexOf('{'), raw.lastIndexOf('}') + 1);
const data = JSON.parse(jsonStr);

// 1. PARIS HOTELS
const parisHotels = [
  {
    id: "paris-ritz",
    name: "Ritz Paris",
    stars: 5,
    pricePerNight: 1100,
    rating: 5.0,
    reviewsCount: 3950,
    lat: 48.8681,
    lng: 2.3292,
    image: "https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=1200&q=85",
    description: "The grand dame of Place Vendôme, legendary home of Coco Chanel and Ernest Hemingway, offering imperial French suites, Bar Hemingway, and an indoor subterranean Roman pool.",
    address: "15 Place Vendôme, 75001 Paris, France",
    airportName: "Paris Charles de Gaulle Airport (CDG)",
    airportDistanceKm: 31,
    airportDistance: "31 km to Charles de Gaulle Airport (CDG)",
    amenities: [
      "Place Vendôme Landmark",
      "Bar Hemingway",
      "Subterranean Roman Pool",
      "Chanel au Ritz Spa",
      "Private Butler Service"
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=1200&q=85",
        caption: "Ritz Paris - Historic Neoclassical Place Vendôme Facade"
      },
      {
        url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85",
        caption: "Parisian Cityscape & Grand Boulevards"
      },
      {
        url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85",
        caption: "Coco Chanel Prestige Suite with Antique French Marquetry"
      },
      {
        url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85",
        caption: "Subterranean Roman Mosaic Heated Swimming Pool"
      },
      {
        url: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85",
        caption: "Salon Proust Afternoon Tea & French Gastronomy"
      }
    ],
    verifiedReviews: [
      {
        id: "rev-par-rtz-1",
        name: "Jean-Philippe Moreau",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        date: "September 2026",
        rating: 5,
        title: "Peerless Grand Luxe on Place Vendôme",
        comment: "No other hotel in Paris matches the Ritz. 35 minutes from CDG airport by chauffeur. The Roman pool and Bar Hemingway are unmatched.",
        photos: [
          "https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=600&q=85"
        ],
        verified: true
      }
    ],
    recommendationBadge: "Top Rated"
  },
  {
    id: "paris-shangrila",
    name: "Shangri-La Paris",
    stars: 5,
    pricePerNight: 890,
    rating: 4.9,
    reviewsCount: 3200,
    lat: 48.8637,
    lng: 2.2933,
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85",
    description: "The former palace of Prince Roland Bonaparte overlooking the Seine with direct private balcony views of the Eiffel Tower, Michelin-starred Shang Palace, and historic salons.",
    address: "10 Avenue d'Iéna, 75116 Paris, France",
    airportName: "Paris Charles de Gaulle Airport (CDG)",
    airportDistanceKm: 34,
    airportDistance: "34 km to Charles de Gaulle Airport (CDG)",
    amenities: [
      "Direct Eiffel Tower Views",
      "Historic Bonaparte Palace",
      "Michelin-Starred Shang Palace",
      "Indoor Pool with Natural Light",
      "Private Eiffel Terraces"
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85",
        caption: "Shangri-La Paris - Unobstructed Eiffel Tower View Terrace"
      },
      {
        url: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=1200&q=85",
        caption: "Prince Bonaparte Imperial Architecture & Grand Staircase"
      },
      {
        url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85",
        caption: "Duplex Eiffel View Suite with Private Balcony"
      },
      {
        url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=85",
        caption: "Private Sunset Champagne on Eiffel View Terrace"
      },
      {
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85",
        caption: "Shang Palace Michelin Cantonese Fine Dining"
      }
    ],
    verifiedReviews: [
      {
        id: "rev-par-shg-1",
        name: "Camille Dubois",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        date: "August 2026",
        rating: 5,
        title: "Watching Eiffel Tower Sparkle from Bed",
        comment: "The balcony view of the Eiffel Tower is breathtaking. Direct taxi from CDG took around 40 minutes. Breakfast on the private terrace is unforgettable.",
        photos: [
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=85"
        ],
        verified: true
      }
    ],
    recommendationBadge: "Popular"
  },
  {
    id: "paris-four-seasons-george-v",
    name: "Four Seasons Hotel George V, Paris",
    stars: 5,
    pricePerNight: 950,
    rating: 4.9,
    reviewsCount: 3450,
    lat: 48.8689,
    lng: 2.3011,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=85",
    description: "An art deco landmark off the Champs-Élysées renowned worldwide for its sensational floral displays by Jeff Leatham, three Michelin-starred restaurants totaling 5 stars, and royal spa.",
    address: "31 Avenue George V, 75008 Paris, France",
    airportName: "Paris Charles de Gaulle Airport (CDG)",
    airportDistanceKm: 32,
    airportDistance: "32 km to Charles de Gaulle Airport (CDG)",
    amenities: [
      "Steps to Champs-Élysées",
      "5 Michelin Stars Onsite",
      "World-Famous Floral Art",
      "Marble Courtyard Dining",
      "Haute Couture Spa"
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=85",
        caption: "Four Seasons George V - Iconic Grand Parisian Palace"
      },
      {
        url: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=1200&q=85",
        caption: "Jeff Leatham Haute Couture Floral Masterpieces in Lobby"
      },
      {
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85",
        caption: "Parisian Penthouse Suite with Golden Triangle Cityscape"
      },
      {
        url: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=85",
        caption: "Mosaic Swimming Pool & Hydrotherapy Spa"
      },
      {
        url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
        caption: "Le Cinq 3-Michelin-Star Gastronomic Dining"
      }
    ],
    verifiedReviews: [
      {
        id: "rev-par-gv-1",
        name: "Alexandre Bernard",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        date: "September 2026",
        rating: 5,
        title: "The Pinnacle of Parisian Hospitality",
        comment: "The floral arrangements alone are a museum exhibition. Located 30 km from CDG, minutes from Avenue Montaigne boutiques.",
        photos: [
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=85"
        ],
        verified: true
      }
    ],
    recommendationBadge: "Best Value"
  }
];

// 2. ROME HOTELS
const romeHotels = [
  {
    id: "rome-hassler",
    name: "Hotel Hassler Roma",
    stars: 5,
    pricePerNight: 620,
    rating: 4.9,
    reviewsCount: 3100,
    lat: 41.9058,
    lng: 12.4842,
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=85",
    description: "Perched gracefully at the top of the Spanish Steps, Hotel Hassler is Rome's premier historic residence of royalty and cinema legends, offering panoramic Roman skyline views.",
    address: "Piazza Trinità dei Monti 6, 00187 Rome, Italy",
    airportName: "Leonardo da Vinci–Fiumicino Airport (FCO)",
    airportDistanceKm: 31,
    airportDistance: "31 km to Rome Fiumicino Airport (FCO)",
    amenities: [
      "Top of Spanish Steps",
      "Panoramic Rooftop Imàgo",
      "Hassler Secret Garden",
      "Private Chauffeur Fleet",
      "Historic Royal Landmark"
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=85",
        caption: "Hotel Hassler Roma - Crown of the Spanish Steps"
      },
      {
        url: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1200&q=85",
        caption: "Historic Trinità dei Monti & Roman Domes Vista"
      },
      {
        url: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1200&q=85",
        caption: "Penthouse Suite with Terrace Gaze Over St. Peter's Dome"
      },
      {
        url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=85",
        caption: "Palm Court & Garden Terrace Dining"
      },
      {
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
        caption: "Imàgo Michelin Panoramic Rooftop Restaurant"
      }
    ],
    verifiedReviews: [
      {
        id: "rev-rom-has-1",
        name: "Marco Rossi",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        date: "August 2026",
        rating: 5,
        title: "Finest View of the Eternal City",
        comment: "Stepping out directly to the top of the Spanish Steps is majestic. FCO Airport was a straightforward 35-minute drive.",
        photos: [
          "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=85"
        ],
        verified: true
      }
    ],
    recommendationBadge: "Top Rated"
  },
  {
    id: "rome-hotel-de-russie",
    name: "Hotel de Russie, Rocco Forte",
    stars: 5,
    pricePerNight: 580,
    rating: 4.8,
    reviewsCount: 2950,
    lat: 41.9103,
    lng: 12.4777,
    image: "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1200&q=85",
    description: "Located between the Spanish Steps and Piazza del Popolo, Hotel de Russie features the famous terraced Secret Garden designed by Giuseppe Valadier and Stravinskij Bar.",
    address: "Via del Babuino 9, 00187 Rome, Italy",
    airportName: "Leonardo da Vinci–Fiumicino Airport (FCO)",
    airportDistanceKm: 30,
    airportDistance: "30 km to Rome Fiumicino Airport (FCO)",
    amenities: [
      "Valadier Secret Garden",
      "Stravinskij Garden Bar",
      "De Russie Wellness Spa",
      "Near Piazza del Popolo",
      "Italian Design Suites"
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1200&q=85",
        caption: "Hotel de Russie - Historic Roman Architecture & Courtyard"
      },
      {
        url: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85",
        caption: "Valadier Terraced Monumental Garden"
      },
      {
        url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85",
        caption: "Popolo Luxury Suite Overlooking Pincio Hill"
      },
      {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85",
        caption: "Saltwater Hydropool & Rocco Forte Spa"
      },
      {
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85",
        caption: "Le Jardin de Russie Al Fresco Dining"
      }
    ],
    verifiedReviews: [
      {
        id: "rev-rom-hdr-1",
        name: "Giulia Bianchi",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        date: "September 2026",
        rating: 5,
        title: "An Oasis of Green in the Heart of Rome",
        comment: "The secret terraced garden is a peaceful sanctuary after walking Rome all day. Only 30 km to Fiumicino.",
        photos: [
          "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=600&q=85"
        ],
        verified: true
      }
    ],
    recommendationBadge: "Popular"
  },
  {
    id: "rome-cavalieri-waldorf",
    name: "Rome Cavalieri, A Waldorf Astoria Hotel",
    stars: 5,
    pricePerNight: 450,
    rating: 4.8,
    reviewsCount: 3400,
    lat: 41.9189,
    lng: 12.4475,
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85",
    description: "Set atop Monte Mario on 15 acres of Mediterranean parkland with 3-Michelin-starred La Pergola by Heinz Beck, museum art collections, and 4 swimming pools.",
    address: "Via Alberto Cadlolo 101, 00136 Rome, Italy",
    airportName: "Leonardo da Vinci–Fiumicino Airport (FCO)",
    airportDistanceKm: 33,
    airportDistance: "33 km to Rome Fiumicino Airport (FCO)",
    amenities: [
      "La Pergola 3-Michelin Stars",
      "15-Acre Mediterranean Park",
      "4 Outdoor & Indoor Pools",
      "Grand Spa & Roman Baths",
      "Tiepolo Museum Artworks"
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85",
        caption: "Rome Cavalieri - Panoramic Hilltop Resort Gaze Across Rome"
      },
      {
        url: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=1200&q=85",
        caption: "Olympic Heated Pool in Private Pine Parkland"
      },
      {
        url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=85",
        caption: "Imperial Club Room with Private Sunset Balcony"
      },
      {
        url: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=85",
        caption: "Grand Spa Roman Bath Hydrotherapy Jacuzzis"
      },
      {
        url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
        caption: "La Pergola Heinz Beck 3-Michelin Star Dining"
      }
    ],
    verifiedReviews: [
      {
        id: "rev-rom-cav-1",
        name: "Matteo Fontana",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        date: "July 2026",
        rating: 5,
        title: "Resort Feel with Whole Rome Panorama",
        comment: "Swimming among pines overlooking St. Peter's is extraordinary. Easy highway connection to FCO Airport in 30 minutes.",
        photos: [
          "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=85"
        ],
        verified: true
      }
    ],
    recommendationBadge: "Best Value"
  }
];

// 3. TOKYO HOTELS
const tokyoHotels = [
  {
    id: "tokyo-aman",
    name: "Aman Tokyo",
    stars: 5,
    pricePerNight: 850,
    rating: 5.0,
    reviewsCount: 2800,
    lat: 35.6868,
    lng: 139.7654,
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=85",
    description: "An urban sanctuary perched atop the Otemachi Tower, blending traditional Japanese washi paper architecture, stone furo baths, and panoramic vistas of the Imperial Palace Gardens and Mount Fuji.",
    address: "The Otemachi Tower, 1-5-6 Otemachi, Chiyoda-ku, Tokyo 100-0004, Japan",
    airportName: "Tokyo Haneda Airport (HND)",
    airportDistanceKm: 19,
    airportDistance: "19 km to Tokyo Haneda Airport (HND)",
    amenities: [
      "Imperial Palace Garden Views",
      "Traditional Stone Onsen Spa",
      "30-Meter Sky Swimming Pool",
      "The Lounge by Aman",
      "Musashi Chef Sushi Omakase"
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=85",
        caption: "Aman Tokyo - Soaring 30-Meter High Washi Paper Sky Lobby"
      },
      {
        url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85",
        caption: "Serene Imperial Palace Gardens Panorama"
      },
      {
        url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85",
        caption: "Premier Room with Deep Soaking Basalt Stone Furo Tub"
      },
      {
        url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85",
        caption: "Black Granite 30m Sky Pool Overlooking Mount Fuji"
      },
      {
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85",
        caption: "Musashi by Aman Master Sushi Counter"
      }
    ],
    verifiedReviews: [
      {
        id: "rev-tyo-amn-1",
        name: "Kenji Sato",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        date: "September 2026",
        rating: 5,
        title: "Perfection in Minimalist Japanese Luxury",
        comment: "The quietude in the sky lobby after Tokyo's bustling streets is transcendental. Haneda airport was only 25 minutes by taxi.",
        photos: [
          "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=85"
        ],
        verified: true
      }
    ],
    recommendationBadge: "Top Rated"
  },
  {
    id: "tokyo-park-hyatt",
    name: "Park Hyatt Tokyo",
    stars: 5,
    pricePerNight: 560,
    rating: 4.9,
    reviewsCount: 3600,
    lat: 35.6854,
    lng: 139.6912,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=85",
    description: "Towering above vibrant Shinjuku, famously featured in cinema history, boasting the glass-roofed Club on the Park pool, New York Grill jazz bar on the 52nd floor, and sweeping Tokyo vistas.",
    address: "3-7-1-2 Nishi-Shinjuku, Shinjuku-ku, Tokyo 163-1055, Japan",
    airportName: "Tokyo Haneda Airport (HND)",
    airportDistanceKm: 23,
    airportDistance: "23 km to Tokyo Haneda Airport (HND)",
    amenities: [
      "New York Grill 52nd Floor",
      "Glass Atrium Sky Pool",
      "Club on the Park Spa",
      "Shinjuku Skyline Panorama",
      "24-Hour Dedicated Concierge"
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=85",
        caption: "Park Hyatt Tokyo - Shinjuku High-Rise Architecture"
      },
      {
        url: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=85",
        caption: "Tokyo Shinjuku Neon Nightscape"
      },
      {
        url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85",
        caption: "Diplomat Suite with Deep Hokkaido Green Marble Bath"
      },
      {
        url: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=85",
        caption: "47th Floor Sky Atrium Sunlight Swimming Pool"
      },
      {
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
        caption: "New York Bar Live Jazz & City Lights"
      }
    ],
    verifiedReviews: [
      {
        id: "rev-tyo-pkh-1",
        name: "Yuki Takahashi",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        date: "August 2026",
        rating: 5,
        title: "Iconic Shinjuku Nights and Jazz",
        comment: "Listening to live jazz at New York Grill with the entire neon Tokyo grid below is timeless. 30 minutes from Haneda.",
        photos: [
          "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=85"
        ],
        verified: true
      }
    ],
    recommendationBadge: "Popular"
  },
  {
    id: "tokyo-prince-park-tower",
    name: "The Prince Park Tower Tokyo",
    stars: 5,
    pricePerNight: 320,
    rating: 4.8,
    reviewsCount: 4100,
    lat: 35.6548,
    lng: 139.7494,
    image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1200&q=85",
    description: "Surrounded by the green tranquility of Shiba Park right next to Tokyo Tower, offering private balconies directly facing the illuminated red landmark, natural onsen spa, and sky bowling.",
    address: "4-8-1 Shibakoen, Minato-ku, Tokyo 105-8563, Japan",
    airportName: "Tokyo Haneda Airport (HND)",
    airportDistanceKm: 15,
    airportDistance: "15 km to Tokyo Haneda Airport (HND)",
    amenities: [
      "Front-Row Tokyo Tower Views",
      "Shiba Park Greenery",
      "Natural Hot Spring Onsen",
      "Sky Lounge Stellar Garden",
      "Spa & Fitness Center"
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1200&q=85",
        caption: "The Prince Park Tower - Front-Row Illuminated Tokyo Tower"
      },
      {
        url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=85",
        caption: "Historic Shiba Park & Zojoji Temple Grounds"
      },
      {
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85",
        caption: "Panoramic Corner King Room Facing the Tower"
      },
      {
        url: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=1200&q=85",
        caption: "Natural Hot Spring Mineral Bath & Spa Pool"
      },
      {
        url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
        caption: "Sky Lounge Stellar Garden Night View Cocktails"
      }
    ],
    verifiedReviews: [
      {
        id: "rev-tyo-ppt-1",
        name: "Hiroshi Nakamura",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        date: "September 2026",
        rating: 5,
        title: "Spectacular Tokyo Tower from your Bed",
        comment: "Only 15 km from Haneda Airport, 20 min highway drive. You can touch Tokyo Tower from your private balcony!",
        photos: [
          "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=600&q=85"
        ],
        verified: true
      }
    ],
    recommendationBadge: "Best Value"
  }
];

// 4. LONDON HOTELS
const londonHotels = [
  {
    id: "lon-the-savoy",
    name: "The Savoy",
    stars: 5,
    pricePerNight: 780,
    rating: 4.9,
    reviewsCount: 4200,
    lat: 51.5101,
    lng: -0.1205,
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85",
    description: "London's most historic luxury landmark on the River Thames, home of the legendary American Bar, Gordon Ramsay's Savoy Grill, and Edwardian & Art Deco riverside suites.",
    address: "Strand, London WC2R 0EZ, United Kingdom",
    airportName: "London Heathrow Airport (LHR)",
    airportDistanceKm: 27,
    airportDistance: "27 km to Heathrow Airport (LHR)",
    amenities: [
      "River Thames Frontage",
      "Legendary American Bar",
      "Savoy Grill by Gordon Ramsay",
      "Butler Service in Suites",
      "Historic Edwardian Ballroom"
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85",
        caption: "The Savoy - Grand Strand Courtyard Entrance"
      },
      {
        url: "https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=1200&q=85",
        caption: "River Thames Panorama Overlooking London Eye"
      },
      {
        url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85",
        caption: "Personality Suite in Pristine British Art Deco"
      },
      {
        url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85",
        caption: "Private Atrium Pool & Health Club"
      },
      {
        url: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85",
        caption: "Thames Foyer Traditional British Afternoon Tea"
      }
    ],
    verifiedReviews: [
      {
        id: "rev-lon-svy-1",
        name: "William Hastings",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        date: "September 2026",
        rating: 5,
        title: "Quintessential British Grandeur",
        comment: "Direct taxi from Heathrow in 45 minutes. Afternoon tea in the Thames Foyer with live piano is unrivaled.",
        photos: [
          "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=85"
        ],
        verified: true
      }
    ],
    recommendationBadge: "Top Rated"
  },
  {
    id: "lon-shangrila-shard",
    name: "Shangri-La The Shard, London",
    stars: 5,
    pricePerNight: 690,
    rating: 4.9,
    reviewsCount: 3700,
    lat: 51.5045,
    lng: -0.0865,
    image: "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?auto=format&fit=crop&w=1200&q=85",
    description: "Occupying levels 34 to 52 of Western Europe's tallest skyscraper, featuring floor-to-ceiling panoramic views of Tower Bridge and St. Paul's, and the highest sky pool in Western Europe.",
    address: "31 St Thomas Street, London SE1 9QU, United Kingdom",
    airportName: "London Heathrow Airport (LHR)",
    airportDistanceKm: 30,
    airportDistance: "30 km to Heathrow Airport (LHR)",
    amenities: [
      "Western Europe's Highest Pool",
      "GÖNG Sky Lounge Level 52",
      "Floor-to-Ceiling London Vistas",
      "Marble Bathtubs with Views",
      "Steps to Borough Market"
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?auto=format&fit=crop&w=1200&q=85",
        caption: "Shangri-La The Shard - Soaring Modern Architectural Masterpiece"
      },
      {
        url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85",
        caption: "London Bridge & Tower of London Aerial View"
      },
      {
        url: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1200&q=85",
        caption: "Iconic Suite with Freestanding Tub Facing Tower Bridge"
      },
      {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85",
        caption: "Level 52 Skypool Infinity Edge Heated Waters"
      },
      {
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
        caption: "GÖNG Cocktail Lounge Above the London Clouds"
      }
    ],
    verifiedReviews: [
      {
        id: "rev-lon-shd-1",
        name: "Charlotte Evans",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        date: "August 2026",
        rating: 5,
        title: "Swimming on the 52nd Floor Above London",
        comment: "Bathing in the sky with Tower Bridge illuminated below is unforgettable. 30 km from Heathrow, convenient via train or black cab.",
        photos: [
          "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?auto=format&fit=crop&w=600&q=85"
        ],
        verified: true
      }
    ],
    recommendationBadge: "Popular"
  },
  {
    id: "lon-claridges",
    name: "Claridge's",
    stars: 5,
    pricePerNight: 820,
    rating: 5.0,
    reviewsCount: 3100,
    lat: 51.5126,
    lng: -0.1492,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85",
    description: "The crown jewel of Mayfair since 1856, synonymous with British royal discretion, Art Deco glamour, The Fumoir bar, and world-class British hospitality.",
    address: "Brook Street, Mayfair, London W1K 4HR, United Kingdom",
    airportName: "London Heathrow Airport (LHR)",
    airportDistanceKm: 26,
    airportDistance: "26 km to Heathrow Airport (LHR)",
    amenities: [
      "Heart of Mayfair",
      "Art Deco Foyer & Fumoir",
      "Claridge's Royal Spa",
      "Bespoke Butler Service",
      "Designer Heritage Suites"
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85",
        caption: "Claridge's Mayfair - Historic Red Brick Victorian Elegance"
      },
      {
        url: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=1200&q=85",
        caption: "Lobby Black-and-White Marble Dale Chihuly Chandelier"
      },
      {
        url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85",
        caption: "Linley Signature Art Deco Royal Suite"
      },
      {
        url: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=1200&q=85",
        caption: "Subterranean Roman Bath Luxury Mayfair Spa"
      },
      {
        url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
        caption: "Claridge's Restaurant & The Fumoir Cocktails"
      }
    ],
    verifiedReviews: [
      {
        id: "rev-lon-cld-1",
        name: "Lord Richard Campbell",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        date: "September 2026",
        rating: 5,
        title: "Mayfair Perfection for Generations",
        comment: "Impeccable in every detail. 40 minutes from Heathrow Terminal 5. Staff anticipate your every preference.",
        photos: [
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=85"
        ],
        verified: true
      }
    ],
    recommendationBadge: "Best Value"
  }
];

// 5. BARCELONA HOTELS
const barcelonaHotels = [
  {
    id: "bcn-w-barcelona",
    name: "W Barcelona (Hotel Vela)",
    stars: 5,
    pricePerNight: 410,
    rating: 4.8,
    reviewsCount: 4800,
    lat: 41.3685,
    lng: 2.1901,
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=85",
    description: "Designed by world-renowned architect Ricardo Bofill, rising like a sail directly from Barceloneta Beach with panoramic Mediterranean views, WET deck infinity pool, and ECLIPSE rooftop bar.",
    address: "Plaça Rosa dels Vents 1, 08039 Barcelona, Spain",
    airportName: "Josep Tarradellas Barcelona–El Prat Airport (BCN)",
    airportDistanceKm: 16,
    airportDistance: "16 km to Barcelona-El Prat Airport (BCN)",
    amenities: [
      "Barceloneta Beachfront",
      "WET Deck Infinity Pool",
      "ECLIPSE Rooftop Bar",
      "Spa by Sisley Paris",
      "FIRE Grill Gastronomy"
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=85",
        caption: "W Barcelona - Iconic Sail Architecture on the Mediterranean"
      },
      {
        url: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=85",
        caption: "Golden Sands of Barceloneta Boardwalk"
      },
      {
        url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85",
        caption: "Wow Suite Floor-to-Ceiling Mediterranean Sea Panorama"
      },
      {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85",
        caption: "WET Deck Beachside Infinity Pool & Cabanas"
      },
      {
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
        caption: "26th Floor Sunset Cocktails Overlooking Barcelona Harbor"
      }
    ],
    verifiedReviews: [
      {
        id: "rev-bcn-w-1",
        name: "Carlos Gomez",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        date: "September 2026",
        rating: 5,
        title: "Unbeatable Beachfront Living in Barcelona",
        comment: "Directly on the beach and only 15 minutes by taxi from El Prat Airport (BCN). The infinity pool scene is unmatched.",
        photos: [
          "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=600&q=85"
        ],
        verified: true
      }
    ],
    recommendationBadge: "Top Rated"
  },
  {
    id: "bcn-hotel-arts",
    name: "Hotel Arts Barcelona",
    stars: 5,
    pricePerNight: 390,
    rating: 4.8,
    reviewsCount: 3900,
    lat: 41.3879,
    lng: 2.1966,
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=85",
    description: "A landmark blue-glass tower overlooking Port Olímpic, featuring Frank Gehry's iconic golden fish sculpture, 2-Michelin-starred Enoteca by Paco Pérez, and 43 The Spa on the top floors.",
    address: "Carrer de la Marina 19-21, 08005 Barcelona, Spain",
    airportName: "Josep Tarradellas Barcelona–El Prat Airport (BCN)",
    airportDistanceKm: 15,
    airportDistance: "15 km to Barcelona-El Prat Airport (BCN)",
    amenities: [
      "Frank Gehry Golden Fish Landmark",
      "2-Michelin Star Enoteca",
      "Port Olímpic Waterfront",
      "43 The Spa Duplex",
      "Outdoor Heated Sea Pools"
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=85",
        caption: "Hotel Arts Barcelona - Striking Modern Waterfront Tower"
      },
      {
        url: "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&w=1200&q=85",
        caption: "Frank Gehry's Golden Peix Sculpture & Gardens"
      },
      {
        url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=85",
        caption: "Club Level Sea View Suite Overlooking Port Olímpic"
      },
      {
        url: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=85",
        caption: "43 The Spa Panoramic Hydrotherapy Bathrooms"
      },
      {
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85",
        caption: "Enoteca Paco Pérez 2-Michelin-Starred Seafood"
      }
    ],
    verifiedReviews: [
      {
        id: "rev-bcn-art-1",
        name: "Montserrat Vidal",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
        date: "August 2026",
        rating: 5,
        title: "Art, Gastronomy, and Ocean Views",
        comment: "Enoteca was one of the finest meals in Spain. 15 km to BCN airport, very quick transfer through the coastal ring road.",
        photos: [
          "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=600&q=85"
        ],
        verified: true
      }
    ],
    recommendationBadge: "Popular"
  },
  {
    id: "bcn-mandarin-oriental",
    name: "Mandarin Oriental, Barcelona",
    stars: 5,
    pricePerNight: 550,
    rating: 4.9,
    reviewsCount: 3100,
    lat: 41.3916,
    lng: 2.1678,
    image: "https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=1200&q=85",
    description: "Located on prestigious Passeig de Gràcia in an avant-garde Patricia Urquiola interior, moments from Gaudí's Casa Batlló and Casa Milà, featuring Terrat rooftop dipping pool and Moments restaurant.",
    address: "Passeig de Gràcia 38-40, 08007 Barcelona, Spain",
    airportName: "Josep Tarradellas Barcelona–El Prat Airport (BCN)",
    airportDistanceKm: 17,
    airportDistance: "17 km to Barcelona-El Prat Airport (BCN)",
    amenities: [
      "Passeig de Gràcia Location",
      "Steps to Gaudí Landmarks",
      "Terrat Rooftop Pool & Bar",
      "Moments 2-Michelin Stars",
      "Patricia Urquiola Design"
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=1200&q=85",
        caption: "Mandarin Oriental Barcelona - Historic Passeig de Gràcia Facade"
      },
      {
        url: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=85",
        caption: "Gaudí's Passeig de Gràcia Promenade & Boutiques"
      },
      {
        url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85",
        caption: "Boulevard Suite Designed by Patricia Urquiola"
      },
      {
        url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85",
        caption: "Terrat 360-Degree Rooftop Pool Over Sagrada Família"
      },
      {
        url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
        caption: "Moments Restaurant by Carme Ruscalleda"
      }
    ],
    verifiedReviews: [
      {
        id: "rev-bcn-mo-1",
        name: "David Fernandez",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        date: "September 2026",
        rating: 5,
        title: "Best Address in Barcelona",
        comment: "Casa Batlló is literally 2 minutes away. Rooftop cocktail at sunset watching the Sagrada Família spires is unbeatable.",
        photos: [
          "https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=600&q=85"
        ],
        verified: true
      }
    ],
    recommendationBadge: "Best Value"
  }
];

// 6. BALI HOTELS
const baliHotels = [
  {
    id: "bali-four-seasons-sayan",
    name: "Four Seasons Resort Bali at Sayan",
    stars: 5,
    pricePerNight: 720,
    rating: 5.0,
    reviewsCount: 3600,
    lat: -8.5069,
    lng: 115.2458,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85",
    description: "Suspended above the sacred Ayung River valley in Ubud, entered via an iconic suspension bridge leading to a lotus pond in the sky, featuring river villas with private plunge pools and holistic wellness.",
    address: "Jl. Raya Sayan, Sayan, Ubud, Gianyar, Bali 80571, Indonesia",
    airportName: "Ngurah Rai International Airport (DPS)",
    airportDistanceKm: 37,
    airportDistance: "37 km to Ngurah Rai Airport (DPS)",
    amenities: [
      "Ayung Riverfront Suspension Bridge",
      "Lotus Pond Rooftop Pavilion",
      "Private Plunge Pool Villas",
      "Sacred River Spa & Yoga",
      "Ayung Terrace Balinese Dining"
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85",
        caption: "Four Seasons Sayan - Iconic Rooftop Lotus Pond in Ubud Valley"
      },
      {
        url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=85",
        caption: "Lush Ayung River Jungle & Terraced Rice Fields"
      },
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
        caption: "Riverfront Villa with Private Outdoor Plunge Pool"
      },
      {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85",
        caption: "Two-Tiered Valley Swimming Pool by the Ayung River"
      },
      {
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85",
        caption: "Ayung Terrace Traditional Balinese Feast"
      }
    ],
    verifiedReviews: [
      {
        id: "rev-bli-fss-1",
        name: "Wayan Artawan",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        date: "September 2026",
        rating: 5,
        title: "Pure Spiritual Sanctuary in the Jungle",
        comment: "Walking across the suspension bridge into the lotus pond is a transcendental moment. 60-70 mins scenic drive from DPS airport.",
        photos: [
          "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=85"
        ],
        verified: true
      }
    ],
    recommendationBadge: "Top Rated"
  },
  {
    id: "bali-bulgari-resort",
    name: "Bulgari Resort Bali",
    stars: 5,
    pricePerNight: 890,
    rating: 4.9,
    reviewsCount: 2900,
    lat: -8.8471,
    lng: 115.1432,
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=85",
    description: "Perched 150 meters above the Indian Ocean on the dramatic sea cliffs of Uluwatu, combining traditional Balinese craftsmanship with Italian design, private funicular beach access, and Il Ristorante.",
    address: "Jl. Goa Lempeh, Banjar Dinas Kangin, Uluwatu, Bali 80364, Indonesia",
    airportName: "Ngurah Rai International Airport (DPS)",
    airportDistanceKm: 20,
    airportDistance: "20 km to Ngurah Rai Airport (DPS)",
    amenities: [
      "150m Ocean Cliffside Setting",
      "Private Funicular to Beach",
      "All-Villa Resort with Pools",
      "Il Ristorante Luca Fantin",
      "Bulgari Spa by the Sea"
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=85",
        caption: "Bulgari Resort Bali - Dramatic Uluwatu 150-Meter Ocean Cliff"
      },
      {
        url: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=1200&q=85",
        caption: "Private White Sand Shoreline Under the Cliffs"
      },
      {
        url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=85",
        caption: "Ocean View Villa with Bangkirai Wood & Hand-Carved Volcanic Stone"
      },
      {
        url: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=85",
        caption: "Infinity Edge Clifftop Pool Merging with the Horizon"
      },
      {
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
        caption: "The Bulgari Bar Spectacular Uluwatu Cliff Sunset"
      }
    ],
    verifiedReviews: [
      {
        id: "rev-bli-blg-1",
        name: "Jessica Miller",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        date: "August 2026",
        rating: 5,
        title: "Drama of the Cliffs and Italian Elegance",
        comment: "Taking the private cliff funicular down to the isolated beach was incredible. Only 35 minutes drive from Denpasar DPS Airport.",
        photos: [
          "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=85"
        ],
        verified: true
      }
    ],
    recommendationBadge: "Popular"
  },
  {
    id: "bali-alila-uluwatu",
    name: "Alila Villas Uluwatu",
    stars: 5,
    pricePerNight: 650,
    rating: 4.9,
    reviewsCount: 3300,
    lat: -8.8475,
    lng: 115.1328,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85",
    description: "An eco-luxury architectural icon perched on elevated limestone cliffs, famous for its cantilevered sunset cabana hanging over the ocean, 50-meter cliff-edge infinity pool, and open-plan pool villas.",
    address: "Jl. Belimbing Sari, Tambiyak, Pecatu, Uluwatu, Bali 80364, Indonesia",
    airportName: "Ngurah Rai International Airport (DPS)",
    airportDistanceKm: 18,
    airportDistance: "18 km to Ngurah Rai Airport (DPS)",
    amenities: [
      "Overhanging Sunset Cabana",
      "50-Meter Cliff Infinity Pool",
      "All-Pool Private Eco Villas",
      "Warung Authentic Indonesian",
      "Clifftop Aerial Yoga"
    ],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85",
        caption: "Alila Villas Uluwatu - World-Famous Cantilevered Sunset Cabana"
      },
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
        caption: "Limestone Cliffs of Southern Bali Coast"
      },
      {
        url: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1200&q=85",
        caption: "One-Bedroom Pool Villa with Open Living Cabana"
      },
      {
        url: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=1200&q=85",
        caption: "50m Infinity Pool Stretching into the Indian Ocean"
      },
      {
        url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85",
        caption: "The Warung Traditional Indonesian Gourmet Tasting"
      }
    ],
    verifiedReviews: [
      {
        id: "rev-bli-alu-1",
        name: "Kadek Surya",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        date: "September 2026",
        rating: 5,
        title: "Architectural Wonder on the Uluwatu Cliffs",
        comment: "Watching sunset from the cliff cabana is unforgettable. Under 30 minutes from DPS Airport via the bypass.",
        photos: [
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=85"
        ],
        verified: true
      }
    ],
    recommendationBadge: "Best Value"
  }
];

// Apply updates to the destinations
const updates = [
  { id: 'paris', hotels: parisHotels },
  { id: 'rome', hotels: romeHotels },
  { id: 'tokyo', hotels: tokyoHotels },
  { id: 'london', hotels: londonHotels },
  { id: 'barcelona', hotels: barcelonaHotels },
  { id: 'bali', hotels: baliHotels }
];

updates.forEach(u => {
  const dest = data.destinations.find(d => d.id === u.id);
  if (dest) {
    dest.hotels = u.hotels;
    console.log(`Updated ${dest.name} (${u.id}) with ${u.hotels.length} verified hotels.`);
  } else {
    console.error(`Destination ${u.id} not found!`);
  }
});

// Output formatted file
const newContent = `window.WANDERLY_DATA = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(dataFile, newContent, 'utf8');

console.log("Successfully updated all international destinations with real verified hotels!");
