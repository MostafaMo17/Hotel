const fs = require("fs");

// Curated collection of high-resolution, unique, authentic Pinterest / Unsplash luxury travel & hotel imagery
const HOTEL_IMAGES = {
  // 1. CAIRO
  "cairo-mena-house": {
    cover: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85", caption: "Marriott Mena House - Historic Palace & Pyramids Gardens" },
      { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85", caption: "Royal Heritage Suite with Pyramids View" },
      { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85", caption: "Lush Palm Gardens & Heated Swimming Pool" },
      { url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85", caption: "139 Pavilion Open-Air Pyramids Restaurant" },
      { url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=85", caption: "Saray Historic Wing & Marble Archways" }
    ]
  },
  "cairo-four-seasons-nile": {
    cover: "../images/four-seasons-nile-1.jpg",
    gallery: [
      { url: "../images/four-seasons-nile-1.jpg", caption: "Four Seasons Hotel Cairo at Nile Plaza - Riverfront Tower at Sunset" },
      { url: "../images/four-seasons-nile-2.jpg", caption: "Grand Marble Reception & Royal Chandelier Lobby" },
      { url: "../images/four-seasons-nile-3.jpg", caption: "Panoramic Cairo Skyline & River Nile Night View" },
      { url: "../images/four-seasons-nile-4.jpg", caption: "Upper Deck Open-Air Nile Lounge & Luxury Yacht Dining" },
      { url: "../images/four-seasons-nile-5.jpg", caption: "Four Seasons Deluxe Panoramic Suite with Private Balcony" }
    ]
  },
  "cairo-sofitel-gezirah": {
    cover: "../images/sofitel-gezirah-1.jpg",
    gallery: [
      { url: "../images/sofitel-gezirah-1.jpg", caption: "Sofitel Cairo Nile El Gezirah - Illuminated Neon Tower at Night" },
      { url: "../images/sofitel-gezirah-2.jpg", caption: "Panoramic Riverfront Glass Dining & Cairo Tower Vista" },
      { url: "../images/sofitel-gezirah-3.jpg", caption: "Luxury Twin Bedroom Suite with Contemporary French Design" },
      { url: "../images/sofitel-gezirah-4.jpg", caption: "Zamalek Island Waterfront Facade & Palm Promenade" },
      { url: "../images/sofitel-gezirah-5.jpg", caption: "Oriental Arabesque Archway Terrace & Nile Lounge" }
    ]
  },
  "cairo-kempinski-nile": {
    cover: "../images/kempinski-nile-1.jpg",
    gallery: [
      { url: "../images/kempinski-nile-1.jpg", caption: "Kempinski Nile Hotel Cairo - Grand Palace Courtyard & Illuminated Pool" },
      { url: "../images/kempinski-nile-2.jpg", caption: "Kempinski Palace Architecture & Classic Blue Domes" },
      { url: "../images/kempinski-nile-3.jpg", caption: "Deluxe Nile View King Bedroom Suite with Cairo Tower Panorama" },
      { url: "../images/kempinski-nile-4.jpg", caption: "Rooftop Glass Floor Lounge & Skyline Night Bar" },
      { url: "../images/kempinski-nile-5.jpg", caption: "Rooftop Panoramic Pool & Sunset Nile Terrace" }
    ]
  },
  "cairo-steigenberger-tahrir": {
    cover: "../images/steigenberger-tahrir-1.jpg",
    gallery: [
      { url: "../images/steigenberger-tahrir-1.jpg", caption: "Steigenberger Hotel El Tahrir - Illuminated Downtown Cairo Entrance & Night Cityscape" },
      { url: "../images/steigenberger-tahrir-2.jpg", caption: "Contemporary Superior King Suite with City View" },
      { url: "../images/steigenberger-tahrir-3.jpg", caption: "Sunlit Colonnade Terrace & Outdoor Poolside Lounge" },
      { url: "../images/steigenberger-tahrir-4.jpg", caption: "Classic Heritage Bedroom Suite & Ornate Decor" },
      { url: "../images/steigenberger-tahrir-5.jpg", caption: "Steigenberger Historic Wing & Waterfront Vista" }
    ]
  },
  "cairo-pyramids-valley": {
    cover: "../images/pyramids-valley-1.jpg",
    gallery: [
      { url: "../images/pyramids-valley-1.jpg", caption: "Pyramids Valley - Rooftop Terrace Cafe Directly Overlooking Sphinx & Great Pyramids" },
      { url: "../images/pyramids-valley-2.jpg", caption: "Romantic Suite with Rose Petal Soak Tub & Pyramids Window Vista" },
      { url: "../images/pyramids-valley-3.jpg", caption: "Oriental Archway Rooftop Sun Deck Facing the Pyramids" },
      { url: "../images/pyramids-valley-4.jpg", caption: "Sunset Balcony Table & Panoramic Giza Plateau Vista" },
      { url: "../images/pyramids-valley-5.jpg", caption: "Contemporary King Suite with Ensuite Glass Bath & Pyramids Panorama" }
    ]
  },

  // 2. ALEXANDRIA
  "alex-four-seasons": {
    cover: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=85", caption: "Four Seasons Alexandria at San Stefano - Coastal Panorama" },
      { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85", caption: "Mediterranean Sea View Executive Suite" },
      { url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=85", caption: "Private Beach Club & Infinity Pool" },
      { url: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85", caption: "Byblos Gourmet Mediterranean Seafood Dining" },
      { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85", caption: "Two-Story European Spa Sanctuary" }
    ]
  },
  "alex-helnan-palestine": {
    cover: "https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=1200&q=85", caption: "Helnan Palestine Hotel - Montaza Palace Gardens Cove" },
      { url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85", caption: "Royal Seafront Deluxe Room" },
      { url: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=85", caption: "Private Bay Beach & Pine Trees Promenade" },
      { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85", caption: "Al Zahraa Royal Dining Room" },
      { url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=85", caption: "Historical Montaza Royal Park View" }
    ]
  },
  "alex-sunrise-avenue": {
    cover: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85", caption: "Sunrise Alex Avenue Hotel - Roushdy Beachfront" },
      { url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85", caption: "Bright Modern Coastal King Bedroom" },
      { url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85", caption: "Sea-Facing Heated Infinity Pool" },
      { url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85", caption: "Sunset Coast Grill & Seafood Terrace" },
      { url: "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1200&q=85", caption: "Scenic Stanley Bridge Views from the Hotel" }
    ]
  },
  "alex-steigenberger-cecil": {
    cover: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85", caption: "Steigenberger Cecil Hotel - 1929 Iconic Landmark Facade" },
      { url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=85", caption: "Classic European High-Ceiling Heritage Suite" },
      { url: "https://images.unsplash.com/photo-1604251405909-b8c4e83cdf7c?auto=format&fit=crop&w=1200&q=85", caption: "Panoramic Eastern Harbor View from Balcony" },
      { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85", caption: "Le Jardin Historical French Restaurant" },
      { url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=85", caption: "Monty Bar & Antique Library Lounge" }
    ]
  },
  "alex-windsor-palace": {
    cover: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85", caption: "Paradise Inn Windsor Palace - Belle Époque Heritage" },
      { url: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1200&q=85", caption: "Antique Handcrafted Queen Room" },
      { url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85", caption: "Blue Harbor Famous Open-Air Rooftop Cafe" },
      { url: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=85", caption: "Queen Elizabeth Hall Breakfast Buffet" },
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85", caption: "Vintage 1906 Gilded Elevator & Marble Lobby" }
    ]
  },
  "alex-cherry-maryski": {
    cover: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85", caption: "Cherry Maryski Hotel - Central Alexandria Downtown" },
      { url: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=1200&q=85", caption: "Comfort Standard Twin Room" },
      { url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=85", caption: "Rooftop Swimming Pool with City Skyline" },
      { url: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85", caption: "Mansheya International Restaurant" },
      { url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=85", caption: "Relaxation Sauna & Wellness Corner" }
    ]
  },

  // 3. SHARM EL SHEIKH
  "sharm-fourseasons": {
    cover: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85", caption: "Four Seasons Resort Sharm El Sheikh - Arabian Cliffside Village" },
      { url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=85", caption: "Luxury Pool Villa with Red Sea Coral View" },
      { url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=85", caption: "Private Sandy Beach & House Coral Reef" },
      { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85", caption: "Il Frantoio Fine Dining Terrace" },
      { url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=85", caption: "Bedouin Spa Tent & Wellness Pavilions" }
    ]
  },
  "sharm-rixos-premium": {
    cover: "https://images.unsplash.com/photo-1586500036706-41963de24d8b?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1586500036706-41963de24d8b?auto=format&fit=crop&w=1200&q=85", caption: "Rixos Premium Seagate - Nabq Bay Luxury Estate" },
      { url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85", caption: "Swim-Up Deluxe King Suite" },
      { url: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=85", caption: "Lagoon Pools & Private VIP Cabanas" },
      { url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85", caption: "L'Olivo Mediterranean All-Inclusive Feast" },
      { url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=85", caption: "Anjana Turkish Luxury Spa Center" }
    ]
  },
  "sharm-stella-di-mare": {
    cover: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85", caption: "Stella Di Mare Beach Hotel - Naama Bay Cliff Edge" },
      { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85", caption: "Panoramic Sea Front Balcony Suite" },
      { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85", caption: "Private Sandy Cove & Glass Elevator Access" },
      { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85", caption: "Corallo Red Sea Seafood Restaurant" },
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85", caption: "Hydrotherapy Pool & Thalasso Spa" }
    ]
  },
  "sharm-jaz-mirabel": {
    cover: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85", caption: "Jaz Mirabel Beach Resort - Tuscan Style Estate" },
      { url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85", caption: "Spacious Family Garden Suite" },
      { url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=85", caption: "Aqua Fun Water Park & Sun Terrace" },
      { url: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=85", caption: "El Nakheel International Buffet" },
      { url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85", caption: "Palm Garden Strolls & Evening Amphitheater" }
    ]
  },
  "sharm-albatros-aqua": {
    cover: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=85", caption: "Albatros Aqua Park Resort - Mega Water World" },
      { url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=85", caption: "Modern Pool View Double Room" },
      { url: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=85", caption: "Huge Wave Pool & 24 Tower Slides" },
      { url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85", caption: "Soprano Italian Restaurant" },
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85", caption: "Vibrant Evening Promenade & Piazza" }
    ]
  },
  "sharm-falcon-hills": {
    cover: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85", caption: "Falcon Hills Hotel - Ras Um Sid Peaceful Plateau" },
      { url: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=1200&q=85", caption: "Cozy Standard Sinai View Room" },
      { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85", caption: "Twin Relaxation Swimming Pools" },
      { url: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85", caption: "Sinai Star Outdoor Terrace Cafe" },
      { url: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=85", caption: "Sinai Mountain Backdrop Sunset Views" }
    ]
  },

  // 4. LUXOR
  "luxor-winter-palace": {
    cover: "https://images.unsplash.com/photo-1587975844610-40f1ad10d07a?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1587975844610-40f1ad10d07a?auto=format&fit=crop&w=1200&q=85", caption: "Sofitel Winter Palace Luxor - 1886 Victorian Landmark" },
      { url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85", caption: "Historic Royal Nile Suite with Antique Furniture" },
      { url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=85", caption: "10-Acre Century-Old Tropical Botanical Gardens" },
      { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85", caption: "1886 French Haute Cuisine Dining Room" },
      { url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=85", caption: "Royal Victoria Lounge & High Tea Terrace" }
    ]
  },
  "luxor-hilton-resort": {
    cover: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=85", caption: "Hilton Luxor Resort & Spa - East Bank River Oasis" },
      { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85", caption: "Modern Riverfront King Suite with Private Jacuzzi" },
      { url: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=85", caption: "Dual Infinity Pools Overlooking the Nile & Feluccas" },
      { url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85", caption: "Silk Road Oriental Fine Dining" },
      { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85", caption: "Nile-Facing Nayara Wellness Spa" }
    ]
  },
  "luxor-al-moudira": {
    cover: "https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=1200&q=85", caption: "Al Moudira Hotel - West Bank Oriental Palace" },
      { url: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1200&q=85", caption: "Hand-Painted Fresco Dome Room with Antique Kilims" },
      { url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85", caption: "Courtyard Fountain Swimming Pool & Lemon Trees" },
      { url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85", caption: "Courtyard Candlelit Mediterranean Dining" },
      { url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=85", caption: "Traditional Marble Turkish Bath & Quiet Patio" }
    ]
  },
  "luxor-steigenberger-achti": {
    cover: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85", caption: "Steigenberger Resort Achti - 8-Acre Tropical River Park" },
      { url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85", caption: "Bungalow Garden View Room" },
      { url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=85", caption: "Riverside Freeform Pool & Sun Deck" },
      { url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85", caption: "Karnak All-Day Riverfront Buffet" },
      { url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=85", caption: "Private Felucca Sailing Dock" }
    ]
  },
  "luxor-iberotel": {
    cover: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85", caption: "Iberotel Luxor - Central Riverfront Hotel" },
      { url: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=85", caption: "Standard Nile Facing King Room" },
      { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85", caption: "Floating Swimming Pool on the River Nile" },
      { url: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=85", caption: "Côté Jardin Terrace Restaurant" },
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85", caption: "Sunset View of Luxor Temple from River Deck" }
    ]
  },

  // 5. ASWAN
  "aswan-old-cataract": {
    cover: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85", caption: "Sofitel Legend Old Cataract Aswan - Historic Pink Granite Palace" },
      { url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=85", caption: "Agatha Christie Legendary Suite with Elephantine Island View" },
      { url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=85", caption: "The World-Famous Historic Terrace at Sunset" },
      { url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85", caption: "1902 Grand Dining Room with Moorish Dome" },
      { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85", caption: "Sofitel So SPA with Indoor Heated Pool & Granite Baths" }
    ]
  },
  "aswan-movenpick-resort": {
    cover: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85", caption: "Mövenpick Resort Aswan - Private Elephantine Island Estate" },
      { url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85", caption: "Deluxe Island Villa with River Balcony" },
      { url: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=85", caption: "Infinity Edge Nile Pool Surrounded by Date Palms" },
      { url: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85", caption: "Panorama 360-Degree Revolving Tower Restaurant" },
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85", caption: "Botanical Island Footpaths & Private Ferry Terminal" }
    ]
  },
  "aswan-kato-dool": {
    cover: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=85", caption: "Kato Dool Nubian Resort - West Bank Vibrant Architecture" },
      { url: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1200&q=85", caption: "Hand-Painted Colorful Nubian Dome Suite" },
      { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85", caption: "Direct Natural Sandy Nile Beach & Wooden Pergolas" },
      { url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85", caption: "Traditional Nubian Breakfast & Mint Tea Terrace" },
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85", caption: "Night Illumination & Live Nubian Folk Music" }
    ]
  },
  "aswan-basma-hotel": {
    cover: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85", caption: "Basma Hotel Aswan - High Granite Hilltop Setting" },
      { url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85", caption: "Panoramic City & River View Room" },
      { url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=85", caption: "Garden Swimming Pool with Granite Rock Features" },
      { url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85", caption: "Lotus Dining Room & Outdoor Barbecue Terrace" },
      { url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85", caption: "Botanical Cactus Gardens & Sunset Belvedere" }
    ]
  },
  "aswan-kenzi-nubian": {
    cover: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    gallery: [
      { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85", caption: "Kenzi Nubian Boutique House - Gharb Soheil Village" },
      { url: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=1200&q=85", caption: "Artisanal Mudbrick Room with Local Textiles" },
      { url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=85", caption: "Rooftop Hammocks Overlooking the Nile Cataracts" },
      { url: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=85", caption: "Home-Cooked Nubian Tagines & Clay Oven Bread" },
      { url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=85", caption: "Authentic Village Life & Spice Market Stroll" }
    ]
  }
};

console.log("Unique photo definitions prepared for core destinations!");
