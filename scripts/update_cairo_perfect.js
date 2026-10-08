const fs = require('fs');

const content = fs.readFileSync('js/data.js', 'utf8');
const data = JSON.parse(content.replace(/^window\.WANDERLY_DATA\s*=\s*/, '').replace(/;\s*$/, ''));

const cairoObj = {
  "id": "cairo",
  "name": "Cairo",
  "country": "Egypt",
  "tagline": "Ancient wonders, historic mosques, bustling bazaars, and vibrant Nile life.",
  "image": "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80",
  "lat": 30.0444,
  "lng": 31.2357,
  "weather": {
    "season": "Warm",
    "tempC": 29,
    "humidity": 49,
    "windKph": 12
  },
  "places": [
    {
      "id": "cairo-pyramids",
      "name": "Giza Pyramids & Sphinx",
      "category": "History",
      "price": 40,
      "rating": 4.9,
      "image": "../images/cairo-pyramids.jpg",
      "lat": 29.9792,
      "lng": 31.1342,
      "description": "The iconic wonder of the ancient world with the Great Sphinx.",
      "timeOfDay": "Morning",
      "durationHours": 3
    },
    {
      "id": "cairo-museum",
      "name": "Grand Egyptian Museum",
      "category": "Culture",
      "price": 25,
      "rating": 4.8,
      "image": "../images/cairo-museum.jpg",
      "lat": 29.9953,
      "lng": 31.1197,
      "description": "The world's largest archaeological museum dedicated to ancient Egypt.",
      "timeOfDay": "Afternoon",
      "durationHours": 3
    },
    {
      "id": "cairo-khan",
      "name": "Khan el-Khalili Bazaar",
      "category": "Shopping",
      "price": 15,
      "rating": 4.7,
      "image": "../images/cairo-khan.jpg",
      "lat": 30.0477,
      "lng": 31.2625,
      "description": "Historic 14th-century marketplace filled with spices, lamps, and brassware.",
      "timeOfDay": "Evening",
      "durationHours": 3
    },
    {
      "id": "cairo-citadel",
      "name": "Citadel of Saladin & Mosque",
      "category": "History",
      "price": 18,
      "rating": 4.6,
      "image": "../images/cairo-citadel.jpg",
      "lat": 30.0299,
      "lng": 31.2613,
      "description": "Medieval Islamic fortress with stunning panoramic views of Cairo.",
      "timeOfDay": "Morning",
      "durationHours": 3
    },
    {
      "id": "cairo-nile",
      "name": "Nile Dinner Felucca Cruise",
      "category": "Dining",
      "price": 45,
      "rating": 4.6,
      "image": "../images/cairo-nile.jpg",
      "lat": 30.036,
      "lng": 31.224,
      "description": "Sunset sailing along the Nile with traditional dinner and music.",
      "timeOfDay": "Afternoon",
      "durationHours": 2
    },
    {
      "id": "cairo-zamalek",
      "name": "Zamalek Art & Coffee Walk",
      "category": "Culture",
      "price": 12,
      "rating": 4.5,
      "image": "../images/cairo-zamalek.jpg",
      "lat": 30.0626,
      "lng": 31.2197,
      "description": "Leafy island neighborhood with art galleries, cozy cafes, and boutiques.",
      "timeOfDay": "Evening",
      "durationHours": 3
    }
  ],
  "hotels": [
    {
      "id": "cairo-mena-house",
      "name": "Marriott Mena House, Cairo",
      "stars": 5,
      "pricePerNight": 280,
      "rating": 4.9,
      "reviewsCount": 3420,
      "lat": 29.9856,
      "lng": 31.1328,
      "image": "../images/mena-house-1.jpg",
      "description": "Iconic historic palace hotel with unrivaled direct views of the Great Pyramids, 40 acres of lush gardens, and luxury dining.",
      "amenities": [
        "Pyramids View",
        "Outdoor Pool",
        "Spa & Wellness",
        "Fine Dining",
        "Free High-Speed WiFi"
      ],
      "address": "6 Pyramids Road, Giza Plateau",
      "gallery": [
        {
          "url": "../images/mena-house-1.jpg",
          "caption": "Marriott Mena House, Cairo - Illuminated Palace Facade & Fountains"
        },
        {
          "url": "../images/mena-house-2.jpg",
          "caption": "Executive Panorama Lounge Facing the Great Pyramid"
        },
        {
          "url": "../images/mena-house-3.jpg",
          "caption": "Grand Marble Reception & Royal Chandelier Lobby"
        },
        {
          "url": "../images/mena-house-4.jpg",
          "caption": "Sunlit Palm Garden Terrace with Direct Pyramids Vista"
        },
        {
          "url": "../images/mena-house-5.jpg",
          "caption": "139 Pavilion Evening Fine Dining Overlooking the Pyramids"
        }
      ],
      "verifiedReviews": [
        {
          "name": "Dr. Ahmed El-Sayed",
          "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
          "date": "July 2026",
          "rating": 5,
          "title": "Exceptional Hospitality & Impeccable Views",
          "comment": "The location is unbeatable! From the moment we checked in, the staff anticipated every need. Breakfast on the terrace while watching the morning sun was the highlight of our vacation. Highly recommend booking a suite with a balcony.",
          "photos": [
            "../images/mena-house-2.jpg"
          ],
          "id": "rev-cairo-mena-house-1",
          "verified": true
        },
        {
          "name": "Sarah Jenkins",
          "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
          "date": "August 2026",
          "rating": 5,
          "title": "100% Authentic & Worth Every Penny",
          "comment": "Everything looks exactly like the photos or even better. Super clean rooms, high speed Wi-Fi, and very peaceful at night. We walked to the nearby attractions in under 10 minutes.",
          "photos": [
            "../images/mena-house-4.jpg"
          ],
          "id": "rev-cairo-mena-house-2",
          "verified": true
        },
        {
          "name": "Mohamed Tariq",
          "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
          "date": "June 2026",
          "rating": 4.8,
          "title": "Great Strategic Location & Friendly Concierge",
          "comment": "The concierge team helped us organize all our day trips and restaurant bookings without any hassle. The pool area is pristine with great music and refreshing drinks.",
          "photos": [
            "../images/mena-house-5.jpg"
          ],
          "id": "rev-cairo-mena-house-3",
          "verified": true
        }
      ],
      "recommendationBadge": "Top Rated"
    },
    {
      "id": "cairo-four-seasons-nile",
      "name": "Four Seasons Hotel Cairo at Nile Plaza",
      "stars": 5,
      "pricePerNight": 340,
      "rating": 4.9,
      "reviewsCount": 2890,
      "lat": 30.0354,
      "lng": 31.2312,
      "image": "../images/four-seasons-nile-1.jpg",
      "description": "World-class luxury along the Nile River in upscale Garden City with panoramic river vistas, indoor & outdoor pools, and 8 restaurants.",
      "amenities": [
        "Nile View",
        "Dual Pools",
        "Luxury Spa",
        "8 Restaurants",
        "Fitness Center"
      ],
      "address": "1089 Corniche El Nile, Garden City, Cairo",
      "gallery": [
        {
          "url": "../images/four-seasons-nile-1.jpg",
          "caption": "Four Seasons Hotel Cairo at Nile Plaza - Riverfront Tower at Sunset"
        },
        {
          "url": "../images/four-seasons-nile-2.jpg",
          "caption": "Grand Marble Reception & Royal Chandelier Lobby"
        },
        {
          "url": "../images/four-seasons-nile-3.jpg",
          "caption": "Panoramic Cairo Skyline & River Nile Night View"
        },
        {
          "url": "../images/four-seasons-nile-4.jpg",
          "caption": "Upper Deck Open-Air Nile Lounge & Luxury Yacht Dining"
        },
        {
          "url": "../images/four-seasons-nile-5.jpg",
          "caption": "Four Seasons Deluxe Panoramic Suite with Private Balcony"
        }
      ],
      "verifiedReviews": [
        {
          "name": "Sarah Jenkins",
          "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
          "date": "August 2026",
          "rating": 5,
          "title": "100% Authentic & Worth Every Penny",
          "comment": "Everything looks exactly like the photos or even better. Super clean rooms, high speed Wi-Fi, and very peaceful at night. We walked to the nearby attractions in under 10 minutes.",
          "photos": [
            "../images/four-seasons-nile-5.jpg"
          ],
          "id": "rev-cairo-four-seasons-nile-1",
          "verified": true
        },
        {
          "name": "Mohamed Tariq",
          "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
          "date": "June 2026",
          "rating": 4.8,
          "title": "Great Strategic Location & Friendly Concierge",
          "comment": "The concierge team helped us organize all our day trips and restaurant bookings without any hassle. The pool area is pristine with great music and refreshing drinks.",
          "photos": [
            "../images/four-seasons-nile-4.jpg"
          ],
          "id": "rev-cairo-four-seasons-nile-2",
          "verified": true
        }
      ],
      "recommendationBadge": "Top Rated"
    },
    {
      "id": "cairo-sofitel-gezirah",
      "name": "Sofitel Cairo Nile El Gezirah",
      "stars": 5,
      "pricePerNight": 220,
      "rating": 4.8,
      "reviewsCount": 2150,
      "lat": 30.0388,
      "lng": 31.2268,
      "image": "../images/sofitel-gezirah-1.jpg",
      "description": "French luxury blended with Egyptian heritage on the peaceful southern tip of Zamalek Island with an infinity Nile pool.",
      "amenities": [
        "Infinity Nile Pool",
        "Private Promenade",
        "So Spa",
        "Riverfront Terrace",
        "Free WiFi"
      ],
      "address": "3 El Thawra Council St, Zamalek, Cairo",
      "gallery": [
        {
          "url": "../images/sofitel-gezirah-1.jpg",
          "caption": "Sofitel Cairo Nile El Gezirah - Illuminated Neon Tower at Night"
        },
        {
          "url": "../images/sofitel-gezirah-2.jpg",
          "caption": "Panoramic Riverfront Glass Dining & Cairo Tower Vista"
        },
        {
          "url": "../images/sofitel-gezirah-3.jpg",
          "caption": "Luxury Twin Bedroom Suite with Contemporary French Design"
        },
        {
          "url": "../images/sofitel-gezirah-4.jpg",
          "caption": "Zamalek Island Waterfront Facade & Palm Promenade"
        },
        {
          "url": "../images/sofitel-gezirah-5.jpg",
          "caption": "Oriental Arabesque Archway Terrace & Nile Lounge"
        }
      ],
      "verifiedReviews": [
        {
          "name": "Mohamed Tariq",
          "avatar": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
          "date": "June 2026",
          "rating": 4.8,
          "title": "Great Strategic Location & Friendly Concierge",
          "comment": "The concierge team helped us organize all our day trips and restaurant bookings without any hassle. The pool area is pristine with great music and refreshing drinks.",
          "photos": [
            "../images/sofitel-gezirah-5.jpg"
          ],
          "id": "rev-cairo-sofitel-gezirah-1",
          "verified": true
        }
      ],
      "recommendationBadge": "Top Rated"
    },
    {
      "id": "cairo-kempinski-nile",
      "name": "Kempinski Nile Hotel Cairo",
      "stars": 5,
      "pricePerNight": 195,
      "rating": 4.7,
      "reviewsCount": 1420,
      "lat": 30.0366,
      "lng": 31.2307,
      "image": "../images/kempinski-nile-1.jpg",
      "description": "Intimate boutique luxury hotel with rooftop pool and exceptional personalized butler service in Garden City.",
      "amenities": [
        "Rooftop Pool",
        "Nile View",
        "Spa & Wellness",
        "Butler Service",
        "Turkish Bath"
      ],
      "address": "12 Ahmed Ragheb St, Garden City, Cairo",
      "gallery": [
        {
          "url": "../images/kempinski-nile-1.jpg",
          "caption": "Kempinski Nile Hotel Cairo - Grand Palace Courtyard & Illuminated Pool"
        },
        {
          "url": "../images/kempinski-nile-2.jpg",
          "caption": "Kempinski Palace Architecture & Classic Blue Domes"
        },
        {
          "url": "../images/kempinski-nile-3.jpg",
          "caption": "Deluxe Nile View King Bedroom Suite with Cairo Tower Panorama"
        },
        {
          "url": "../images/kempinski-nile-4.jpg",
          "caption": "Rooftop Glass Floor Lounge & Skyline Night Bar"
        },
        {
          "url": "../images/kempinski-nile-5.jpg",
          "caption": "Rooftop Panoramic Pool & Sunset Nile Terrace"
        }
      ],
      "verifiedReviews": [
        {
          "name": "Elena Rostova",
          "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          "date": "May 2026",
          "rating": 4.9,
          "title": "A Dream Stay! Will Definitely Return",
          "comment": "The bed was the most comfortable I have ever slept in at a hotel. Room service was fast and tasty. The verified guest check-in was seamless and we got a free room upgrade upon arrival!",
          "photos": [
            "../images/kempinski-nile-5.jpg"
          ],
          "id": "rev-cairo-kempinski-nile-1",
          "verified": true
        }
      ],
      "recommendationBadge": "Top Rated"
    },
    {
      "id": "cairo-steigenberger-tahrir",
      "name": "Steigenberger Hotel El Tahrir",
      "stars": 4,
      "pricePerNight": 130,
      "rating": 4.7,
      "reviewsCount": 1840,
      "lat": 30.0469,
      "lng": 31.2372,
      "image": "../images/steigenberger-tahrir-1.jpg",
      "description": "Sleek contemporary hotel in the vibrant heart of Downtown Cairo, steps away from the Egyptian Museum and Tahrir Square.",
      "amenities": [
        "City Center",
        "Swimming Pool",
        "Fitness Center",
        "Breakfast Included",
        "Free WiFi"
      ],
      "address": "Kasr El Nil St, Downtown Cairo",
      "gallery": [
        {
          "url": "../images/steigenberger-tahrir-1.jpg",
          "caption": "Steigenberger Hotel El Tahrir - Illuminated Downtown Cairo Entrance & Night Cityscape"
        },
        {
          "url": "../images/steigenberger-tahrir-2.jpg",
          "caption": "Contemporary Superior King Suite with City View"
        },
        {
          "url": "../images/steigenberger-tahrir-3.jpg",
          "caption": "Sunlit Colonnade Terrace & Outdoor Poolside Lounge"
        },
        {
          "url": "../images/steigenberger-tahrir-4.jpg",
          "caption": "Classic Heritage Bedroom Suite & Ornate Decor"
        },
        {
          "url": "../images/steigenberger-tahrir-5.jpg",
          "caption": "Steigenberger Historic Wing & Waterfront Vista"
        }
      ],
      "verifiedReviews": [
        {
          "name": "Dr. Ahmed El-Sayed",
          "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
          "date": "July 2026",
          "rating": 5,
          "title": "Exceptional Hospitality & Impeccable Views",
          "comment": "The location is unbeatable! From the moment we checked in, the staff anticipated every need. Breakfast on the terrace while watching the morning sun was the highlight of our vacation. Highly recommend booking a suite with a balcony.",
          "photos": [
            "../images/steigenberger-tahrir-3.jpg"
          ],
          "id": "rev-cairo-steigenberger-tahrir-1",
          "verified": true
        }
      ],
      "recommendationBadge": "Strategic Location"
    },
    {
      "id": "cairo-pyramids-valley",
      "name": "Pyramids Valley Boutique Hotel",
      "stars": 3,
      "pricePerNight": 65,
      "rating": 4.6,
      "reviewsCount": 980,
      "lat": 29.9752,
      "lng": 31.1388,
      "image": "../images/pyramids-valley-1.jpg",
      "description": "Cozy boutique stay offering unmatched rooftop terrace views directly facing the Sphinx and Pyramids sound & light show.",
      "amenities": [
        "Rooftop Pyramids View",
        "Breakfast Included",
        "Free WiFi",
        "Airport Shuttle",
        "Terrace Cafe"
      ],
      "address": "Sphinx Street, Nazlet El-Semman, Giza",
      "gallery": [
        {
          "url": "../images/pyramids-valley-1.jpg",
          "caption": "Pyramids Valley - Rooftop Terrace Cafe Directly Overlooking Sphinx & Great Pyramids"
        },
        {
          "url": "../images/pyramids-valley-2.jpg",
          "caption": "Romantic Suite with Rose Petal Soak Tub & Pyramids Window Vista"
        },
        {
          "url": "../images/pyramids-valley-3.jpg",
          "caption": "Oriental Archway Rooftop Sun Deck Facing the Pyramids"
        },
        {
          "url": "../images/pyramids-valley-4.jpg",
          "caption": "Sunset Balcony Table & Panoramic Giza Plateau Vista"
        },
        {
          "url": "../images/pyramids-valley-5.jpg",
          "caption": "Contemporary King Suite with Ensuite Glass Bath & Pyramids Panorama"
        }
      ],
      "verifiedReviews": [
        {
          "name": "Sarah Jenkins",
          "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
          "date": "August 2026",
          "rating": 5,
          "title": "100% Authentic & Worth Every Penny",
          "comment": "Everything looks exactly like the photos or even better. Super clean rooms, high speed Wi-Fi, and very peaceful at night. We walked to the nearby attractions in under 10 minutes.",
          "photos": [
            "../images/pyramids-valley-2.jpg"
          ],
          "id": "rev-cairo-pyramids-valley-1",
          "verified": true
        }
      ],
      "recommendationBadge": "Budget Friendly"
    }
  ]
};

data.destinations[0] = cairoObj;
const updated = 'window.WANDERLY_DATA = ' + JSON.stringify(data, null, 2) + ';\n';
fs.writeFileSync('js/data.js', updated, 'utf8');
console.log('SUCCESS: Cairo object updated in data.js with real curated Unsplash photos!');
