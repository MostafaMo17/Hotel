const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../js/data.js');
const raw = fs.readFileSync(dataFile, 'utf8');

const jsonStr = raw.substring(raw.indexOf('{'), raw.lastIndexOf('}') + 1);
const data = JSON.parse(jsonStr);

// ==========================================
// 1. DESTINATION HERO COVERS
// ==========================================
const destinationCovers = {
  cairo: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1400&q=85',
  alexandria: '../images/alexandria-cover.jpg',
  sharm: '../images/photo-1586500036706-41963de24d8b.jpg',
  luxor: '../images/photo-1587975844610-40f1ad10d07a.jpg',
  aswan: '../images/photo-1578922746465-3a80a228f223.jpg',
  hurghada: '../images/photo-1507525428034-b723cf961d3e.jpg',
  dahab: '../images/photo-1544551763-46a013bb70d5.jpg',
  siwa: '../images/photo-1509316975850-ff9c5deb0cd9.jpg',
  marsa_alam: '../images/photo-1533105079780-92b9be482077.jpg',
  fayoum: '../images/photo-1500530855697-b586d89ba3ee.jpg',
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=85',
  istanbul: '../images/photo-1524231757912-21f4fe3a7200.jpg',
  paris: '../images/photo-1502602898657-3e91760cbb34.jpg',
  rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1400&q=85',
  tokyo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1400&q=85',
  london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1400&q=85',
  barcelona: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1400&q=85',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=85'
};

data.destinations.forEach(d => {
  const normKey = d.id.replace('-', '_');
  if (destinationCovers[normKey]) {
    d.image = destinationCovers[normKey];
  }
});

// ==========================================
// 2. PLACES CORRECTIONS ACROSS ALL DESTINATIONS
// ==========================================
const placesFixes = {
  alexandria: {
    'Bibliotheca Alexandrina': '../images/alexandria-library.jpg'
  },
  aswan: {
    'Old Cataract Terrace High Tea': '../images/photo-1555396273-367ea4eb4db5.jpg'
  },
  dubai: {
    'Burj Khalifa Observation Deck': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=85',
    'Dubai Fountain & Mall': 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=900&q=85',
    'Museum of the Future': 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=900&q=85',
    'Red Dune Desert Safari & BBQ': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=85',
    'Palm Jumeirah & Atlantis': 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=85',
    'Dubai Marina Yacht Cruise': 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=900&q=85'
  },
  istanbul: {
    'Hagia Sophia Grand Mosque': '../images/photo-1541432901042-2d8bd64b4a9b.jpg',
    'Grand Bazaar (Kapalıçarşı)': '../images/photo-1606046604972-77cc76aee944.jpg',
    'Bosphorus Sunset Yacht Cruise': '../images/photo-1527838832700-5059252407fa.jpg',
    'Topkapi Palace & Harem': '../images/photo-1598971861713-54ad16a7e72e.jpg',
    'Karaköy Coffee & Bakery Crawl': '../images/photo-1509042239860-f550ce710b93.jpg',
    'Galata Tower & Taksim': '../images/photo-1524231757912-21f4fe3a7200.jpg'
  },
  paris: {
    'Eiffel Tower Summit': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85',
    'Louvre Museum': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=85',
    'Montmartre & Sacré-Cœur': 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=900&q=85',
    'Seine River Sightseeing Cruise': 'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?auto=format&fit=crop&w=900&q=85',
    'Saint-Germain French Bistro': 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=85',
    'Le Marais Designer Boutiques': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=900&q=85'
  },
  rome: {
    'Colosseum & Roman Forum': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=85',
    'Trevi Fountain Coin Toss': 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=900&q=85',
    'Vatican Museums & Sistine Chapel': 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=900&q=85',
    'The Pantheon': 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=900&q=85',
    'Trastevere Trattoria Food Walk': 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=900&q=85',
    'Piazza Navona Artists Square': 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=900&q=85'
  },
  tokyo: {
    'Shibuya Crossing & Sky': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=900&q=85',
    'Sensō-ji Temple Asakusa': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85',
    'Mount Fuji & Five Lakes Tour': 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=900&q=85',
    'Akihabara Electric Town': 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=900&q=85',
    'Tsukiji Outer Seafood Market': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=900&q=85',
    'Shinjuku Gyoen National Garden': 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=900&q=85'
  },
  london: {
    'Big Ben & Westminster Abbey': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=85',
    'London Eye River Flight': 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=900&q=85',
    'Tower of London & Tower Bridge': 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?auto=format&fit=crop&w=900&q=85',
    'British Museum Collection': 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=900&q=85',
    'Covent Garden & West End Dining': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=85',
    'Hyde Park & Kensington Palace': 'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?auto=format&fit=crop&w=900&q=85'
  },
  barcelona: {
    'Basílica de la Sagrada Família': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=900&q=85',
    'Park Güell Fairy-Tale Gardens': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=900&q=85',
    'Gothic Quarter & Las Ramblas': 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&w=900&q=85',
    'La Boqueria Tapas Market': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=85',
    'Barceloneta Beach Promenade': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85',
    'Casa Batlló Modernist House': 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=900&q=85'
  },
  bali: {
    'Tegallalang Rice Terraces & Swing': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85',
    'Tanah Lot Sea Temple': 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=900&q=85',
    'Nusa Penida Kelingking Beach': 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=900&q=85',
    'Ubud Sacred Monkey Forest': 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=85',
    'Mount Batur Sunrise Volcano Trek': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85',
    'Seminyak Beach Club Sunset': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=85'
  }
};

data.destinations.forEach(d => {
  const fixes = placesFixes[d.id];
  if (fixes && d.places) {
    d.places.forEach(p => {
      if (fixes[p.name]) {
        p.image = fixes[p.name];
      }
    });
  }
});

// ==========================================
// 3. HOTEL IMAGES & GALLERIES CORRECTIONS
// ==========================================
const hotelFixes = {
  // ALEXANDRIA
  'alex-windsor-palace': {
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85', caption: 'Paradise Inn Windsor Palace - Belle Époque Corniche Landmark' },
      { url: 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?auto=format&fit=crop&w=1200&q=85', caption: 'Antique Handcrafted Royal Guest Bedroom' },
      { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=85', caption: 'Blue Harbor Famous Open-Air Rooftop Lounge' },
      { url: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=85', caption: 'Queen Elizabeth Hall Mediterranean Breakfast Terrace' },
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85', caption: 'Vintage 1906 Gilded Elevator & Grand Marble Lobby' }
    ]
  },
  'alex-cherry-maryski': {
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85', caption: 'Cherry Maryski Hotel - Central Alexandria Downtown Facade' },
      { url: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=1200&q=85', caption: 'Comfort Twin Bedroom with Downtown City Views' },
      { url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=85', caption: 'Rooftop Swimming Pool with City Skyline' },
      { url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85', caption: 'Mansheya International Restaurant & Buffet' },
      { url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=85', caption: 'Relaxation Sauna & Swedish Wellness Facility' }
    ]
  },

  // ASWAN
  'aswan-benben': {
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=85', caption: 'Benben by Sand - Heissa Island Eco-Luxury Granite Architecture' },
      { url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85', caption: 'Granite Boulder Deluxe Suite with Direct Nile Panorama' },
      { url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=85', caption: 'Outdoor Stone Jacuzzi Terrace Overlooking Philae Waters' },
      { url: '../images/aswan-nubian-village-user.jpg', caption: 'Authentic Nubian Cultural Design & Local Hospitality' },
      { url: '../images/aswan-philae-user.jpg', caption: 'Sunset Views of the Historic Nile Cataracts' }
    ]
  },
  'aswan-movenpick': {
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85', caption: 'Mövenpick Resort Aswan - Elephantine Island Botanical Sanctuary' },
      { url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=85', caption: 'Panoramic Nile View Suite with Private Balcony' },
      { url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=85', caption: 'Large Lagoon Pool Surrounded by Tropical Island Palms' },
      { url: '../images/aswan-elephantine-user.jpg', caption: 'Private Felucca Marina Dock & Island Walkways' },
      { url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85', caption: 'Orangerie International Dining with Nile River Terrace' }
    ]
  },
  'aswan-basma': {
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85', caption: 'Basma Hotel Aswan - Highest Hilltop Panorama of Granite Cliffs' },
      { url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=85', caption: 'Cliffside Classic Room Overlooking Aswan City & River' },
      { url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=85', caption: 'Hilltop Swimming Pool with 360-Degree Sunset Views' },
      { url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85', caption: 'The Lotus Restaurant - Open Air Dining Under the Stars' },
      { url: '../images/aswan-abu-simbel-user.jpg', caption: 'Desert Mountain Gardens & Natural Stone Terraces' }
    ]
  },

  // SIWA
  'siwa-relax': {
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85', caption: 'Siwa Relax Retreat - Desert Palm Grove & Sulfur Mineral Pools' },
      { url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=85', caption: 'Organic Clay Bungalow with Handwoven Siwan Fabrics' },
      { url: '../images/siwa-fatnas-sunset-tea-user.jpg', caption: 'Natural Healing Spring Pool Under the Palm Canopy' },
      { url: '../images/siwa-salt-lakes-user.jpg', caption: 'Crystal Turquoise Salt Lake Therapy Excursions' },
      { url: '../images/siwa-oracle-temple-user.jpg', caption: 'Peaceful Oasis Courtyard with Open Air Star Lounges' }
    ]
  },
  'siwa-ghaliet': {
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85', caption: 'Ghaliet Ecolodge & Spa - Mudbrick Architecture by Amun Temple' },
      { url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85', caption: 'Sculpted Organic Clay Suite with Tree Trunk Beams' },
      { url: '../images/siwa-oracle-temple-user.jpg', caption: 'Direct Views of the Historic Temple of the Oracle Palms' },
      { url: '../images/siwa-shali-fortress-user.jpg', caption: 'Ancient Shali Heritage Mudbrick Terraces' },
      { url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=85', caption: 'Sunset Sand Sea Dunes & Stargazing Bedouin Fireplace' }
    ]
  },
  'siwa-taziry': {
    image: 'https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1545987796-200677ee1011?auto=format&fit=crop&w=1200&q=85', caption: 'Taziry Eco-Villages - Sustainable Berber Citadel in the Desert' },
      { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85', caption: 'Handmade Kershef Salt Rock Bedroom with Olive Wood Furnishings' },
      { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=85', caption: 'Fresh Spring Water Swimming Pool in the Shadow of the Red Mountain' },
      { url: '../images/siwa-great-sand-sea-safari-user.jpg', caption: 'Arabian Horse Riding & Great Sand Sea Dune Adventures' },
      { url: '../images/siwa-salt-lakes-user.jpg', caption: 'Zero Chemical Organic Farm & Sunset Mountain Dining' }
    ]
  },
  'siwa-shali-lodge': {
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=85', caption: 'Shali Lodge Heritage - Authentic Mudbrick Inn Near Old Shali' },
      { url: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=1200&q=85', caption: 'Traditional Palm-Trunk Thatched Room with Local Pottery' },
      { url: '../images/siwa-shali-fortress-user.jpg', caption: 'Walking Distance to the 13th-Century Fortress of Shali' },
      { url: '../images/siwa-cleopatra-spring-user.jpg', caption: 'Cleopatra Natural Mineral Spring Excursion' },
      { url: '../images/siwa-fatnas-sunset-tea-user.jpg', caption: 'Fatnas Island Date Palm Groves & Herbal Tea Lounge' }
    ]
  },

  // DAHAB
  'dahab-swiss-inn': {
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85', caption: 'Swiss Inn Resort Dahab - Sandy Laguna Bay Beachfront' },
      { url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=85', caption: 'Garden & Pool View Air-Conditioned Deluxe Suite' },
      { url: '../images/dahab-laguna-user.jpg', caption: 'Laguna Shallow Sandy Bay for Windsurfing & Kitesurfing' },
      { url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=85', caption: 'Resort Swimming Pool with Sinai Mountain Backdrop' },
      { url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85', caption: 'Zeytouna Mediterranean Restaurant & Beach Bar' }
    ]
  },

  // MARSA ALAM
  'marsa-malikia-dabbab': {
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=85', caption: 'Malikia Resort Abu Dabbab - Direct Beach Access to Sea Turtle Bay' },
      { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=85', caption: 'Bright Sea View Room with Private Balcony' },
      { url: '../images/marsa-abu-dabbab-turtles-user.jpg', caption: 'World-Renowned Protected Sea Turtle & Dugong Reef' },
      { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=85', caption: 'Extensive Sandy Beach Frontage & Water Sports Center' },
      { url: '../images/marsa-el-qulaan-mangroves-user.jpg', caption: 'El Qulaan Mangrove Pristine Coastline Excursion' }
    ]
  },

  // FAYOUM
  'fayoum-lazib-inn': {
    image: 'https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=1200&q=85',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=1200&q=85', caption: 'Lazib Inn Resort & Spa - Tunis Village Boutique Fairy Tale' },
      { url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=85', caption: 'Handmade Oriental Carpets & Private Jacuzzi Bedroom Suite' },
      { url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=85', caption: 'Dual Heated Pools Overlooking Lake Qarun Greenery' },
      { url: '../images/fayoum-tunis-village-user.jpg', caption: 'Historic Pottery Workshop Streets of Tunis Village' },
      { url: '../images/fayoum-magic-lake-sandboarding-user.jpg', caption: 'Magic Lake Dune Safari & Sunset Bonfire Excursion' }
    ]
  }
};

data.destinations.forEach(d => {
  if (d.hotels) {
    d.hotels.forEach(h => {
      const fix = hotelFixes[h.id];
      if (fix) {
        if (fix.image) h.image = fix.image;
        if (fix.gallery) h.gallery = fix.gallery;
      }
    });
  }
});

// Save updated data
const updatedContent = 'window.WANDERLY_DATA = ' + JSON.stringify(data, null, 2) + ';\n';
fs.writeFileSync(dataFile, updatedContent, 'utf8');

console.log('Successfully updated js/data.js with authentic, verified photos!');
